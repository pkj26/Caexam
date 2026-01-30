import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, LogOut, ExternalLink, 
  UploadCloud, Loader2, Database, Eye, CheckCircle2, FileText
} from 'lucide-react';
import { Button } from './Button';
import { db, auth, storage, onAuthStateChanged } from '../firebaseConfig';
import { collection, updateDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PDFViewer } from './PDFViewer';

interface TeacherPanelProps {
  onLogout: () => void;
  onBack: () => void;
}

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ onLogout, onBack }) => {
  const [submissions, setSubmissions] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  const [evaluatingSubmissionId, setEvaluatingSubmissionId] = useState<string | null>(null);
  const [marksInput, setMarksInput] = useState<string>('');
  
  // Fetch Pending Submissions
  useEffect(() => {
    let unsubSubmissions: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setLoading(true);
        // Teacher only sees 'Pending' submissions or ones they have 'Reviewed' but not yet Approved
        const qSubmissions = query(
            collection(db, "submissions"), 
            where("status", "==", "Pending"),
            orderBy("submittedAt", "desc")
        );

        unsubSubmissions = onSnapshot(qSubmissions, (snapshot) => {
             const subList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setSubmissions(subList);
             setLoading(false);
        }, (error) => {
            console.error("Error fetching submissions:", error);
            setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubSubmissions) unsubSubmissions();
    };
  }, []);

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `evaluated/${Date.now()}_${file.name}`);
      const metadata = {
        contentType: file.type,
        contentDisposition: `attachment; filename="${file.name}"`
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      return await getDownloadURL(snapshot.ref);
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const handleSubmitEvaluation = async (e: React.FormEvent, submissionId: string, file: File) => {
      e.preventDefault();
      if (!marksInput) {
          alert("Please enter marks.");
          return;
      }

      setEvaluatingSubmissionId(submissionId);
      
      try {
          const url = await handleFileUpload(file);
          
          const updateData = {
              status: 'Review', // Changed to Review so Admin can approve later
              evaluatedSheetUrl: url,
              marks: marksInput,
              evaluatedAt: new Date().toISOString(),
              evaluatorId: auth.currentUser?.uid,
              evaluatorName: auth.currentUser?.displayName || 'Teacher'
          };

          await updateDoc(doc(db, "submissions", submissionId), updateData);
          alert("Evaluation Submitted! Sent for Admin Approval.");
          setMarksInput('');
      } catch (err: any) {
          alert(`Error: ${err.message}`);
      } finally {
          setEvaluatingSubmissionId(null);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {viewingPdf && (
        <PDFViewer 
          url={viewingPdf.url} 
          title={viewingPdf.title} 
          onClose={() => setViewingPdf(null)} 
        />
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-brand-dark p-6 flex-col shrink-0 min-h-screen sticky top-0 overflow-y-auto z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-orange/20">TE</div>
          <div>
            <h1 className="text-white font-display font-bold leading-tight tracking-tighter">exam<span className="text-brand-orange">.online</span></h1>
            <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest">Teacher Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
           <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-brand-orange text-white shadow-lg">
              <ClipboardCheck size={18} /> Evaluation Desk
           </div>
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 text-white/50 text-sm font-bold hover:text-white transition-colors"><ExternalLink size={16} /> Visit Website</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
                 <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">Evaluation Desk</h2>
                 <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Database size={10} /> Live Mode</span>
            </div>
            <p className="text-brand-dark/40 text-sm">Review, Grade and Submit for Approval.</p>
          </div>
        </header>

        <div className="animate-fade-up">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-brand-dark">Pending Student Submissions</h3>
                        <p className="text-xs text-brand-dark/40">These copies need checking.</p>
                    </div>
                    <div className="text-xs font-bold bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full">
                        {submissions.length} Pending
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Student Name</th>
                            <th className="px-6 py-4">Test Title</th>
                            <th className="px-6 py-4">Submitted At</th>
                            <th className="px-6 py-4">Answer Sheet</th>
                            <th className="px-6 py-4 min-w-[300px]">Evaluation Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-brand-dark">{sub.studentName}</p>
                                </td>
                                <td className="px-6 py-4 text-sm">{sub.testTitle}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">
                                    {new Date(sub.submittedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                    onClick={() => setViewingPdf({ url: sub.answerSheetUrl, title: `Unchecked: ${sub.studentName}` })}
                                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1.5 rounded-lg border border-blue-100"
                                    >
                                    <Eye size={12} /> View Paper
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <form 
                                        onSubmit={(e) => {
                                            // Handle file inside the form
                                            const fileInput = (e.target as any).querySelector('input[type="file"]');
                                            if(fileInput?.files?.[0]) {
                                                handleSubmitEvaluation(e, sub.id, fileInput.files[0]);
                                            }
                                        }}
                                        className="flex flex-col gap-2"
                                    >
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Marks (e.g. 45/100)"
                                                className="w-1/2 p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-brand-orange"
                                                value={marksInput}
                                                onChange={e => setMarksInput(e.target.value)}
                                            />
                                            <div className="relative flex-1">
                                                <input 
                                                    type="file" 
                                                    accept="application/pdf"
                                                    required
                                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20"
                                                />
                                            </div>
                                        </div>
                                        <Button 
                                            type="submit" 
                                            disabled={evaluatingSubmissionId === sub.id}
                                            variant="secondary"
                                            className="!py-2 !text-xs !w-full"
                                        >
                                            {evaluatingSubmissionId === sub.id ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                                            {evaluatingSubmissionId === sub.id ? 'Uploading...' : 'Submit Review'}
                                        </Button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {submissions.length === 0 && (
                    <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
                        <CheckCircle2 size={48} className="text-green-200 mb-4" />
                        <h4 className="text-lg font-bold text-brand-dark">All Caught Up!</h4>
                        <p>No pending submissions to evaluate.</p>
                    </div>
                )}
            </div>
        </div>

      </main>
    </div>
  );
};