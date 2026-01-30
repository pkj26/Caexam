import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, ClipboardCheck, GraduationCap, 
  Settings, LogOut, Bell, Search, TrendingUp,
  FileText, Download, Upload, Flame, Award, 
  Menu, X, Lock, Eye, Book, Library, Star, AlertCircle, CheckCircle2, Loader2,
  Database
} from 'lucide-react';
import { db, auth, storage, onAuthStateChanged } from '../firebaseConfig';
import { collection, query, where, orderBy, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PDFViewer } from './PDFViewer';
import { Button } from './Button';

interface StudentDashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'tests' | 'results' | 'mentorship' | 'resources';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout }) => {
  const activeTabState = useState<TabType>('overview');
  const [activeTab, setActiveTab] = activeTabState;
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  
  // Dynamic Data States
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [libraryMaterials, setLibraryMaterials] = useState<any[]>([]); 
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  // Upload States
  const [uploadingTestId, setUploadingTestId] = useState<string | null>(null);

  useEffect(() => {
    let unsubTests: () => void;
    let unsubMaterials: () => void;
    let unsubSubmissions: () => void;
    let unsubProfile: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user: any) => {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Real-time Profile Listener (Security Check)
        // If Admin deletes the doc, this snapshot updates, we see it's missing, and log them out.
        const docRef = doc(db, "students", user.uid);
        
        unsubProfile = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setStudentProfile(docSnap.data());
            } else {
                // SECURITY: Admin deleted the user data. Force Logout.
                console.warn("User data not found (Account Deleted). Logging out.");
                onLogout();
            }
        });

        // 2. Real-time Tests
        const testsRef = collection(db, "tests");
        const qTests = query(testsRef, orderBy("date", "desc"));
        
        unsubTests = onSnapshot(qTests, (snapshot) => {
            const allTests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // We use optional chaining here because profile might load slightly after tests
            const currentCourse = studentProfile?.course || 'CA Final'; 
            const relevantTests = allTests.filter((t: any) => t.level === currentCourse);
            setAvailableTests(relevantTests);
        });

        // 3. Real-time Materials
        const materialsRef = collection(db, "materials");
        const qMaterials = query(materialsRef, orderBy("date", "desc"));
        unsubMaterials = onSnapshot(qMaterials, (snapshot) => {
             setLibraryMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 4. Real-time Submissions
        const subRef = collection(db, "submissions");
        const qSub = query(subRef, where("studentId", "==", user.uid));
        unsubSubmissions = onSnapshot(qSub, (snapshot) => {
             setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
             setLoading(false);
        });

      } catch (error: any) {
        console.error("Dashboard error:", error);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubTests) unsubTests();
      if (unsubMaterials) unsubMaterials();
      if (unsubSubmissions) unsubSubmissions();
      if (unsubProfile) unsubProfile();
    };
  }, [onLogout]); // Added onLogout to dependency to satisfy linter if needed

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `answers/${auth.currentUser?.uid}/${Date.now()}_${file.name}`);
      const metadata = {
        contentType: file.type,
        contentDisposition: `attachment; filename="${file.name}"`
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e: any) {
      throw new Error("Failed to save file: " + e.message);
    }
  };

  const handleDirectDownload = async (url: string, filename: string, id: string) => {
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const link = document.createElement('a');
      link.href = url;
      link.target = "_blank";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, test: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!studentProfile) {
        alert("Session invalid. Please refresh.");
        return;
    }

    setUploadingTestId(test.id);
    
    try {
        const url = await uploadFile(file);
        const submissionData = {
            studentId: auth.currentUser?.uid,
            studentName: studentProfile.name,
            testId: test.id,
            testTitle: test.title,
            submittedAt: new Date().toISOString(),
            answerSheetUrl: url,
            status: 'Pending',
            evaluatedSheetUrl: null,
            marks: null
        };

        await addDoc(collection(db, "submissions"), submissionData);
        alert("Answer Sheet Uploaded Successfully!");

    } catch (e: any) {
        console.error(e);
        alert(`Upload Failed: ${e.message}`);
    } finally {
        setUploadingTestId(null);
    }
  };

  const isPlanActive = studentProfile?.planStatus === 'Active' && new Date(studentProfile?.expiryDate || '2099-01-01') > new Date();
  const userNameDisplay = studentProfile?.name || "Student";

  const SidebarItem = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  const SidebarContent = () => (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">CA</div>
        <div>
          <h1 className="text-white font-display font-bold leading-tight tracking-tighter">exam<span className="text-brand-primary">.online</span></h1>
          <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
        <SidebarItem id="tests" icon={BookOpen} label="My Test Series" />
        <SidebarItem id="resources" icon={Library} label="Material Library" />
        <SidebarItem id="results" icon={ClipboardCheck} label="Analytics & Results" />
        <SidebarItem id="mentorship" icon={GraduationCap} label="Mentorship" />
      </nav>

      {studentProfile && (
        <div className="space-y-4 pt-8 border-t border-white/10">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold">
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream flex font-sans">
      
      {viewingPdf && (
        <PDFViewer 
          url={viewingPdf.url} 
          title={viewingPdf.title} 
          onClose={() => setViewingPdf(null)} 
        />
      )}

      {/* Mobile Drawer */}
      <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center z-[60] hover:scale-110 transition-transform"><Menu size={24} /></button>
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className="relative w-72 h-full bg-brand-dark p-6 animate-slide-in"><SidebarContent /></div>
        </div>
      )}
      <aside className="hidden lg:flex w-72 bg-brand-dark p-6 flex-col gap-8 shrink-0 min-h-screen sticky top-0 overflow-y-auto"><SidebarContent /></aside>

      <main className="flex-1 p-4 lg:p-10 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-brand-dark/50 font-bold gap-4">
               <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
               <p>Loading Dashboard...</p>
             </div>
          ) : (
            <>
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                      <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Student Portal</p>
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Database size={10} /> Live Mode</span>
                  </div>
                  <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab}</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold uppercase">{userNameDisplay.charAt(0)}</div>
                    <div className="hidden xs:block"><p className="text-xs font-bold text-brand-dark leading-none">{userNameDisplay}</p></div>
                  </div>
                  {/* LOGOUT BUTTON */}
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
                    title="Logout"
                  >
                    <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </header>

              {/* ... (Rest of dashboard remains same) ... */}
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-up">
                  <div className="relative bg-brand-dark rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                     <div className="relative z-10 max-w-2xl">
                       <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Hello, {userNameDisplay.split(' ')[0]}! 👋</h2>
                       <p className="text-white/60 text-lg">You have {availableTests.length} tests available for <span className="text-brand-primary font-bold">{studentProfile?.course || 'CA Final'}</span>.</p>
                       <button onClick={() => setActiveTab('tests')} className="mt-8 px-8 py-3 bg-white text-brand-dark rounded-xl font-bold text-sm hover:bg-brand-primary hover:text-white transition-all shadow-lg">
                         Start Practice
                       </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4"><BookOpen size={24} /></div>
                      <h3 className="text-3xl font-bold text-brand-dark">{availableTests.length}</h3>
                      <p className="text-xs font-bold text-slate-400">Tests Assigned</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-4"><ClipboardCheck size={24} /></div>
                      <h3 className="text-3xl font-bold text-brand-dark">{submissions.filter(s => s.status === 'Evaluated').length}</h3>
                      <p className="text-xs font-bold text-slate-400">Papers Evaluated</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-4"><Library size={24} /></div>
                      <h3 className="text-3xl font-bold text-brand-dark">{libraryMaterials.length}</h3>
                      <p className="text-xs font-bold text-slate-400">Resources Available</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tests' && (
                <div className="space-y-8 animate-fade-up">
                   <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-8">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-display font-bold text-brand-dark">Test Repository</h3>
                        {!isPlanActive && <div className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100"><Lock size={14} /> Plan Expired</div>}
                     </div>

                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableTests.map((test) => {
                           const isFree = test.accessType === 'Free';
                           const isUnlocked = isFree || isPlanActive;
                           const hasPdf = test.pdfLink && test.pdfLink !== '#' && test.pdfLink.trim() !== '';
                           
                           // Check submission status
                           const submission = submissions.find(s => s.testId === test.id);
                           const isSubmitted = !!submission;
                           const isEvaluated = submission?.status === 'Evaluated';

                           return (
                             <div key={test.id} className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${isUnlocked ? 'bg-slate-50 border-slate-100 hover:border-brand-primary/30' : 'bg-slate-100 border-slate-200 opacity-90'}`}>
                                {!isUnlocked && (
                                   <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Lock className="text-brand-dark mb-2" size={32} />
                                      <p className="text-xs font-bold text-brand-dark">Locked (Premium)</p>
                                   </div>
                                )}
                                {isFree && (
                                   <div className="absolute top-4 right-4 px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-lg">Free</div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                   <span className="text-[9px] font-black uppercase bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">{test.subject}</span>
                                   <span className="text-[10px] font-mono text-slate-400">{test.date}</span>
                                </div>
                                <h4 className="font-bold text-brand-dark text-lg mb-1 leading-tight">{test.title}</h4>
                                <div className="flex justify-between items-end mb-6">
                                    <p className="text-xs text-slate-400">{hasPdf ? 'PDF Available' : 'PDF Pending'}</p>
                                    {isSubmitted && (
                                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${isEvaluated ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {isEvaluated ? 'Evaluated' : 'Submitted'}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => isUnlocked && hasPdf && setViewingPdf({url: test.pdfLink, title: test.title})}
                                            disabled={!isUnlocked || !hasPdf}
                                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors ${
                                                !hasPdf ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                                isUnlocked ? 'bg-brand-primary text-white hover:bg-brand-blue' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {hasPdf ? <Eye size={12} /> : <AlertCircle size={12} />} 
                                            {hasPdf ? (isUnlocked ? 'View Paper' : 'Locked') : 'No PDF'}
                                        </button>

                                        {isEvaluated ? (
                                             <button 
                                                onClick={() => setViewingPdf({ url: submission.evaluatedSheetUrl, title: `Checked: ${test.title}`})}
                                                className="flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors bg-green-500 text-white hover:bg-green-600"
                                            >
                                                <CheckCircle2 size={12} /> View Result
                                            </button>
                                        ) : (
                                            <div className="flex-1 relative">
                                                <input 
                                                    type="file" 
                                                    accept="application/pdf"
                                                    disabled={!isUnlocked || isSubmitted || uploadingTestId === test.id}
                                                    onChange={(e) => handleFileUpload(e, test)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                                />
                                                <button 
                                                    disabled={!isUnlocked || isSubmitted || uploadingTestId === test.id}
                                                    className={`w-full h-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 transition-colors ${
                                                        isSubmitted ? 'bg-orange-100 text-orange-600 cursor-default' :
                                                        uploadingTestId === test.id ? 'bg-slate-100 text-slate-400' :
                                                        isUnlocked ? 'bg-white border border-slate-200 hover:bg-slate-50 text-brand-dark' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {uploadingTestId === test.id ? <Loader2 size={12} className="animate-spin" /> : 
                                                     isSubmitted ? <ClipboardCheck size={12} /> : <Upload size={12} />} 
                                                    {uploadingTestId === test.id ? 'Uploading...' : isSubmitted ? 'Pending Check' : 'Upload Sheet'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                             </div>
                           );
                        })}
                     </div>
                     {availableTests.length === 0 && <div className="p-10 text-center text-slate-400">No active tests found for your level.</div>}
                   </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-8 animate-fade-up">
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 sm:p-8">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-2xl font-display font-bold text-brand-dark">Material Library</h3>
                          <p className="text-sm text-brand-dark/40">Short Notes, Old Papers & Summaries (Free Access)</p>
                        </div>
                     </div>

                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {libraryMaterials.map((mat) => {
                         const hasPdf = mat.pdfLink && mat.pdfLink !== '#' && mat.pdfLink.trim() !== '';
                         const isThisDownloading = downloadingId === mat.id;

                         return (
                           <div key={mat.id} className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-brand-primary/30 transition-all shadow-sm hover:shadow-md group flex flex-col h-full">
                              <div className="flex items-start justify-between mb-4">
                                 <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                   <FileText size={20} />
                                 </div>
                                 <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">{mat.type}</span>
                              </div>
                              
                              <h4 className="font-bold text-brand-dark text-lg mb-1 leading-tight flex-1">{mat.title}</h4>
                              <p className="text-xs font-bold text-brand-primary mb-4">{mat.subject}</p>
                              
                              <div className="flex gap-2">
                                <button 
                                   onClick={() => hasPdf && setViewingPdf({url: mat.pdfLink, title: mat.title})}
                                   disabled={!hasPdf}
                                   className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${hasPdf ? 'bg-slate-50 text-brand-dark hover:bg-brand-primary hover:text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                >
                                   {hasPdf ? <Eye size={14} /> : <AlertCircle size={14} />} {hasPdf ? 'View' : 'No PDF'}
                                </button>
                                {hasPdf && (
                                  <button
                                    onClick={() => handleDirectDownload(mat.pdfLink, `${mat.title}.pdf`, mat.id)}
                                    disabled={isThisDownloading}
                                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-brand-dark transition-all disabled:opacity-50"
                                    title="Download PDF"
                                  >
                                    {isThisDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                  </button>
                                )}
                              </div>
                           </div>
                         );
                       })}
                     </div>
                  </div>
                </div>
              )}

              {['results', 'mentorship'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-up">
                  <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mb-4">
                    {activeTab === 'results' ? <ClipboardCheck size={40} className="text-brand-dark/20" /> : <GraduationCap size={40} className="text-brand-dark/20" />}
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-2 capitalize">No {activeTab} Yet</h3>
                  <p className="text-brand-dark/50 max-w-sm">
                    {activeTab === 'results' 
                      ? "Submit your first test to see detailed analytics and AI-based performance insights here." 
                      : "Schedule your first mentorship call after your first evaluation."}
                  </p>
                  <button onClick={() => setActiveTab('tests')} className="mt-6 px-6 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-blue transition-colors">
                    Go to Tests
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};