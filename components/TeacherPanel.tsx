import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, LogOut, ExternalLink, 
  UploadCloud, Loader2, Database, Eye, CheckCircle2, 
  FileText, LayoutDashboard, History, CheckCircle, 
  XCircle, Clock, TrendingUp, Calendar, AlertCircle,
  BarChart3, UserCheck, MessageSquare
} from 'lucide-react';
import { Button } from './Button';
import { 
  db, auth, storage, onAuthStateChanged,
  collection, updateDoc, doc, onSnapshot, query, where, orderBy,
  ref, uploadBytes, getDownloadURL
} from '../firebaseConfig';
import { PDFViewer } from './PDFViewer';

interface TeacherPanelProps {
  onLogout: () => void;
  onBack: () => void;
}

type TabType = 'dashboard' | 'evaluation' | 'history' | 'settings';

export const TeacherPanel: React.FC<TeacherPanelProps> = ({ onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [submissions, setSubmissions] = useState<any[]>([]); // Current Pending
  const [myHistory, setMyHistory] = useState<any[]>([]); // All my past work
  const [loading, setLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  const [evaluatingSubmissionId, setEvaluatingSubmissionId] = useState<string | null>(null);
  const [marksInput, setMarksInput] = useState<string>('');
  
  // Fetch Pending & My History Submissions
  useEffect(() => {
    let unsubPending: (() => void) | undefined;
    let unsubHistory: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setLoading(true);
        
        // 1. Pending Submissions (Queue for all teachers) - Sorting on client side
        const qPending = query(
            collection(db, "submissions"), 
            where("status", "==", "Pending")
        );
        unsubPending = onSnapshot(qPending, (snapshot) => {
             const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             data.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
             setSubmissions(data);
             setLoading(false);
        });

        // 2. My History (Checked by this specific teacher) - Sorting on client side
        const qHistory = query(
            collection(db, "submissions"), 
            where("evaluatorId", "==", user.uid)
        );
        unsubHistory = onSnapshot(qHistory, (snapshot) => {
             const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             data.sort((a, b) => new Date(b.evaluatedAt || 0).getTime() - new Date(a.evaluatedAt || 0).getTime());
             setMyHistory(data);
        });

      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubPending) unsubPending();
      if (unsubHistory) unsubHistory();
    };
  }, []);

  // --- Analytics Logic ---
  const getStats = () => {
    const total = myHistory.length;
    const approved = myHistory.filter(s => s.status === 'Evaluated').length;
    const inReview = myHistory.filter(s => s.status === 'Review').length;
    const rejected = myHistory.filter(s => s.status === 'Rejected').length;
    
    // Group by Date for Chart simulation
    const dateMap: Record<string, number> = {};
    myHistory.forEach(s => {
      if(s.evaluatedAt) {
        const date = new Date(s.evaluatedAt).toLocaleDateString();
        dateMap[date] = (dateMap[date] || 0) + 1;
      }
    });

    const recentActivity = Object.entries(dateMap)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 5);

    return { total, approved, inReview, rejected, recentActivity };
  };

  const stats = getStats();

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
              status: 'Review',
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

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
      {badge ? <span className="bg-brand-orange text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-brand-dark p-6 flex-col shrink-0 min-h-screen sticky top-0 overflow-y-auto z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">TE</div>
          <div>
            <h1 className="text-white font-display font-bold leading-tight tracking-tighter">exam<span className="text-brand-orange">.online</span></h1>
            <p className="text-brand-orange text-[10px] font-black uppercase tracking-widest">Teacher Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
           <SidebarItem id="dashboard" icon={LayoutDashboard} label="My Analytics" />
           <SidebarItem id="evaluation" icon={ClipboardCheck} label="Evaluation Desk" badge={submissions.length} />
           <SidebarItem id="history" icon={History} label="Checking History" />
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 text-white/50 text-sm font-bold hover:text-white transition-colors"><ExternalLink size={16} /> Visit Website</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <header className="mb-10">
           <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">
                {activeTab === 'dashboard' ? 'Performance Insights' : activeTab === 'history' ? 'Evaluation History' : 'Pending Tasks'}
              </h2>
              <span className="bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Database size={10} /> Live Data Sync</span>
           </div>
           <p className="text-brand-dark/40 text-sm font-medium">Evaluator: {auth.currentUser?.displayName || 'Authorized CA Ranker'}</p>
        </header>

        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="animate-spin" size={40} /><p className="font-bold">Generating Report...</p>
          </div>
        ) : (
          <div className="animate-fade-up">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><FileText size={20}/></div>
                    <h3 className="text-2xl font-black text-brand-dark">{stats.total}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Checked</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"><CheckCircle size={20}/></div>
                    <h3 className="text-2xl font-black text-green-600">{stats.approved}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Approved</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center mb-4"><Clock size={20}/></div>
                    <h3 className="text-2xl font-black text-brand-orange">{stats.inReview}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Approval Queue</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4"><AlertCircle size={20}/></div>
                    <h3 className="text-2xl font-black text-red-600">{stats.rejected}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Returned/Redo</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Daily Output Card */}
                  <div className="bg-brand-dark p-8 rounded-[2.5rem] text-white">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-bold flex items-center gap-2"><BarChart3 size={18} className="text-brand-orange"/> Output Velocity</h3>
                      <span className="text-[10px] font-black opacity-40 uppercase">Copies per Day</span>
                    </div>
                    <div className="space-y-4">
                       {stats.recentActivity.map(([date, count], i) => (
                         <div key={i} className="space-y-2">
                           <div className="flex justify-between text-[11px] font-bold">
                             <span>{date}</span>
                             <span>{count} Copies</span>
                           </div>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-brand-orange rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(100, (count/20)*100)}%` }}
                             ></div>
                           </div>
                         </div>
                       ))}
                       {stats.recentActivity.length === 0 && <p className="text-center py-10 opacity-30 italic text-sm">Start evaluating to see progress charts.</p>}
                    </div>
                  </div>

                  {/* Quality Score Card */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="relative w-32 h-32 mb-6">
                       <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path className="text-slate-100" strokeDasharray="100, 100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"/>
                          <path className="text-brand-orange" strokeDasharray={`${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}, 100`} strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor"/>
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-black text-brand-dark">{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>
                       </div>
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">Evaluation Quality</h3>
                    <p className="text-xs text-slate-400 px-6">Approval rate from admin based on accuracy and feedback quality.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'evaluation' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-brand-dark">Priority Evaluation Queue</h3>
                        <p className="text-xs text-brand-dark/40">Sorted by submission date (Oldest first for priority).</p>
                    </div>
                    <div className="px-3 py-1 bg-brand-orange text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-orange/20 animate-pulse">
                        {submissions.length} Pending
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-4">Submission Details</th>
                            <th className="px-8 py-4">Waiting Since</th>
                            <th className="px-8 py-4">Current Sheet</th>
                            <th className="px-8 py-4">Evaluation Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50 group">
                                <td className="px-8 py-5">
                                    <p className="text-sm font-bold text-brand-dark">{sub.studentName}</p>
                                    <p className="text-[10px] text-brand-orange font-bold uppercase">{sub.testTitle}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                       <Clock size={12} className="text-slate-300"/>
                                       <span className="text-xs font-medium text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <button 
                                      onClick={() => setViewingPdf({ url: sub.answerSheetUrl, title: sub.studentName })}
                                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all"
                                    >
                                      <Eye size={14} /> Open Paper
                                    </button>
                                </td>
                                <td className="px-8 py-5">
                                    <form 
                                        onSubmit={(e) => {
                                            const fileInput = (e.target as any).querySelector('input[type="file"]');
                                            if(fileInput?.files?.[0]) handleSubmitEvaluation(e, sub.id, fileInput.files[0]);
                                            else alert("Please attach the evaluated PDF.");
                                        }}
                                        className="flex flex-col gap-2 max-w-sm"
                                    >
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" required placeholder="Marks (e.g. 64/100)"
                                                className="w-1/3 p-2.5 text-[11px] font-bold border border-slate-200 rounded-xl bg-slate-50 outline-none focus:bg-white focus:border-brand-orange"
                                                value={marksInput}
                                                onChange={e => setMarksInput(e.target.value)}
                                            />
                                            <div className="relative flex-1 overflow-hidden">
                                                <input 
                                                    type="file" accept="application/pdf" required
                                                    className="w-full text-[10px] text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-brand-orange/10 file:text-brand-orange hover:file:bg-brand-orange/20 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={evaluatingSubmissionId === sub.id}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase shadow-xl shadow-brand-dark/10 hover:bg-brand-orange transition-all disabled:opacity-50"
                                        >
                                            {evaluatingSubmissionId === sub.id ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                            {evaluatingSubmissionId === sub.id ? 'Processing...' : 'Submit Evaluation'}
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {submissions.length === 0 && (
                    <div className="py-24 text-center flex flex-col items-center justify-center text-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={32} /></div>
                        <h4 className="text-xl font-bold text-brand-dark">Evaluation Queue Empty</h4>
                        <p className="text-sm mt-1 font-medium">Enjoy your break! No copies are waiting for you.</p>
                    </div>
                )}
            </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-brand-dark">Lifetime Evaluation History</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Total {myHistory.length} papers processed</p>
                 </div>
                 <table className="w-full text-left">
                    <thead className="bg-slate-50">
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-4">Student & Paper</th>
                          <th className="px-8 py-4">Evaluated Date</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4">Marks Given</th>
                          <th className="px-8 py-4 text-right">View Sheets</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {myHistory.map((h) => (
                          <tr key={h.id} className="hover:bg-slate-50/50 group transition-colors">
                             <td className="px-8 py-5">
                                <p className="text-sm font-bold text-brand-dark">{h.studentName}</p>
                                <p className="text-[10px] text-brand-orange font-bold uppercase">{h.testTitle}</p>
                             </td>
                             <td className="px-8 py-5">
                                <span className="text-xs text-slate-500 font-medium">{new Date(h.evaluatedAt).toLocaleDateString()}</span>
                             </td>
                             <td className="px-8 py-5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  h.status === 'Evaluated' ? 'bg-green-100 text-green-600' : 
                                  h.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                                  h.status === 'Review' ? 'bg-orange-100 text-brand-orange' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {h.status === 'Evaluated' ? 'Approved' : h.status}
                                </span>
                             </td>
                             <td className="px-8 py-5">
                                <span className="text-sm font-black text-brand-dark">{h.marks}</span>
                             </td>
                             <td className="px-8 py-5 text-right flex justify-end gap-2">
                                <button onClick={() => setViewingPdf({ url: h.answerSheetUrl, title: `Sent: ${h.studentName}` })} className="p-2 bg-slate-50 text-slate-300 hover:text-brand-orange hover:bg-white rounded-xl transition-all"><FileText size={16}/></button>
                                <button onClick={() => setViewingPdf({ url: h.evaluatedSheetUrl, title: `Checked: ${h.studentName}` })} className="p-2 bg-slate-50 text-slate-300 hover:text-green-600 hover:bg-white rounded-xl transition-all"><UserCheck size={16}/></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {myHistory.length === 0 && (
                   <div className="py-20 text-center text-slate-300 font-bold italic text-sm">No evaluation history found.</div>
                 )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
