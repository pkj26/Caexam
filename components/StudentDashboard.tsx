import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, ClipboardCheck, GraduationCap, 
  Settings, LogOut, Bell, Search, TrendingUp,
  FileText, Download, Upload, Flame, Award, 
  Menu, X, Lock, Eye, Book, Library, Star, AlertCircle, CheckCircle2, Loader2,
  Database, Zap, ArrowUpRight, Target, BarChart3
} from 'lucide-react';
import { 
  db, auth, storage, onAuthStateChanged,
  collection, query, where, orderBy, doc, getDoc, addDoc, onSnapshot,
  ref, uploadBytes, getDownloadURL
} from '../firebaseConfig';
import { PDFViewer } from './PDFViewer';
import { Button } from './Button';

interface StudentDashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'tests' | 'results' | 'mentorship' | 'resources';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [libraryMaterials, setLibraryMaterials] = useState<any[]>([]); 
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        const docRef = doc(db, "students", user.uid);
        unsubProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setStudentProfile(docSnap.data());
          } else {
            onLogout();
          }
        });

        const testsRef = collection(db, "tests");
        const qTests = query(testsRef, orderBy("date", "desc"));
        unsubTests = onSnapshot(qTests, (snapshot) => {
          const allTests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const currentCourse = studentProfile?.course || 'CA Final'; 
          setAvailableTests(allTests.filter((t: any) => t.level === currentCourse));
        });

        const materialsRef = collection(db, "materials");
        const qMaterials = query(materialsRef, orderBy("date", "desc"));
        unsubMaterials = onSnapshot(qMaterials, (snapshot) => {
          setLibraryMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const subRef = collection(db, "submissions");
        const qSub = query(subRef, where("studentId", "==", user.uid), orderBy("submittedAt", "desc"));
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
  }, [onLogout, studentProfile?.course]); 

  // --- Analytics Processing ---
  const evaluatedSubmissions = submissions.filter(s => s.status === 'Evaluated' && s.marks);
  
  const parseMarks = (marksStr: string): { obtained: number, total: number, percent: number } => {
    try {
      const parts = marksStr.split('/');
      const obtained = parseFloat(parts[0]);
      const total = parseFloat(parts[1]) || 100;
      return { obtained, total, percent: (obtained / total) * 100 };
    } catch {
      return { obtained: 0, total: 100, percent: 0 };
    }
  };

  const getAnalytics = () => {
    if (evaluatedSubmissions.length === 0) return null;
    
    const statsBySubject: Record<string, { totalPercent: number, count: number }> = {};
    let totalPercentSum = 0;

    evaluatedSubmissions.forEach(sub => {
      const { percent } = parseMarks(sub.marks);
      const subject = sub.testTitle.split(':')[0] || 'General';
      if (!statsBySubject[subject]) statsBySubject[subject] = { totalPercent: 0, count: 0 };
      statsBySubject[subject].totalPercent += percent;
      statsBySubject[subject].count += 1;
      totalPercentSum += percent;
    });

    const averagePercent = totalPercentSum / evaluatedSubmissions.length;
    const subjectStats = Object.keys(statsBySubject).map(subj => ({
      name: subj,
      avg: statsBySubject[subj].totalPercent / statsBySubject[subj].count
    }));

    return {
      averagePercent,
      subjectStats,
      totalEvaluated: evaluatedSubmissions.length,
      recentScores: [...evaluatedSubmissions].reverse().slice(-5).map(s => parseMarks(s.marks).percent)
    };
  };

  const stats = getAnalytics();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, test: any) => {
    const file = event.target.files?.[0];
    if (!file || !studentProfile) return;
    setUploadingTestId(test.id);
    try {
      const storageRef = ref(storage, `answers/${auth.currentUser?.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      await addDoc(collection(db, "submissions"), {
        studentId: auth.currentUser?.uid,
        studentName: studentProfile.name,
        testId: test.id,
        testTitle: test.title,
        submittedAt: new Date().toISOString(),
        answerSheetUrl: url,
        status: 'Pending'
      });
      alert("Submission successful! Evaluation takes 24-48 hours.");
    } catch (e: any) {
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

  return (
    <div className="min-h-screen bg-brand-cream flex font-sans">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}
      
      {/* Sidebar logic remains same for desktop/mobile */}
      <aside className="hidden lg:flex w-72 bg-brand-dark p-6 flex-col gap-8 shrink-0 min-h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">CA</div>
          <div>
            <h1 className="text-white font-display font-bold leading-tight tracking-tighter">exam<span className="text-brand-primary">.online</span></h1>
            <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Student Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="tests" icon={BookOpen} label="My Test Series" />
          <SidebarItem id="results" icon={TrendingUp} label="Analytics & Results" />
          <SidebarItem id="resources" icon={Library} label="Material Library" />
          <SidebarItem id="mentorship" icon={GraduationCap} label="Mentorship" />
        </nav>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-4 lg:p-10 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-[60vh] text-brand-dark/50 font-bold gap-4">
               <Loader2 className="animate-spin" size={40} />
               <p>Syncing Performance Data...</p>
             </div>
          ) : (
            <>
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm"><Menu size={20}/></button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Performance Insights</p>
                      <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Database size={10} /> Real-time Analytics</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab === 'results' ? 'Progress Center' : activeTab}</h2>
                  </div>
                </div>
              </header>

              {activeTab === 'overview' && (
                <div className="space-y-8 animate-fade-up">
                  <div className="relative bg-brand-dark rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/3"></div>
                     <div className="relative z-10 max-w-2xl">
                       <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Focus, {userNameDisplay.split(' ')[0]}! 🎯</h2>
                       <p className="text-white/60 text-lg">You have <span className="text-brand-orange font-bold">{evaluatedSubmissions.length}</span> evaluated sheets. Average marks: <span className="text-brand-primary font-bold">{stats ? `${Math.round(stats.averagePercent)}%` : 'TBD'}</span>.</p>
                       <div className="flex gap-4 mt-8">
                        <Button variant="primary" onClick={() => setActiveTab('tests')}>Continue Practice</Button>
                        <Button variant="outline" className="text-white border-white/20" onClick={() => setActiveTab('results')}>View Insights</Button>
                       </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><h3 className="text-2xl font-bold text-brand-dark">{availableTests.length}</h3><p className="text-[10px] font-black uppercase text-slate-400">Target Tests</p></div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-brand-primary"><h3 className="text-2xl font-bold">{evaluatedSubmissions.length}</h3><p className="text-[10px] font-black uppercase text-slate-400">Checked Papers</p></div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-brand-orange"><h3 className="text-2xl font-bold">{stats ? `${Math.round(stats.averagePercent)}%` : '0%'}</h3><p className="text-[10px] font-black uppercase text-slate-400">Avg Efficiency</p></div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-green-600"><h3 className="text-2xl font-bold">{submissions.filter(s => s.status === 'Pending').length}</h3><p className="text-[10px] font-black uppercase text-slate-400">In Evaluation</p></div>
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-8 animate-fade-up">
                  {stats ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Score Trend Card */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
                         <div className="flex justify-between items-center mb-10">
                            <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2"><TrendingUp size={18} className="text-brand-primary"/> Score Progression</h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 5 Tests</span>
                         </div>
                         <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[200px]">
                            {stats.recentScores.map((score, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="w-full bg-slate-50 rounded-2xl relative overflow-hidden" style={{ height: '160px' }}>
                                  <div 
                                    className="absolute bottom-0 w-full bg-brand-primary rounded-xl transition-all duration-1000 ease-out shadow-lg" 
                                    style={{ height: `${score}%` }}
                                  >
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-white">
                                      {Math.round(score)}%
                                    </div>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">Test {i+1}</span>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Subject Performance Matrix */}
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2"><Target size={18} className="text-brand-orange"/> Subject Mastery</h3>
                            <div className="flex gap-2">
                               <div className="flex items-center gap-1 text-[8px] font-bold uppercase"><div className="w-2 h-2 rounded-full bg-green-500"></div> Exam Ready</div>
                               <div className="flex items-center gap-1 text-[8px] font-bold uppercase"><div className="w-2 h-2 rounded-full bg-red-400"></div> Needs Focus</div>
                            </div>
                         </div>
                         <div className="space-y-5">
                            {stats.subjectStats.map((subj, i) => (
                              <div key={i} className="space-y-2">
                                 <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-brand-dark">{subj.name}</span>
                                    <span className={subj.avg >= 50 ? 'text-green-500' : 'text-red-500'}>{Math.round(subj.avg)}%</span>
                                 </div>
                                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-1000 rounded-full ${subj.avg >= 60 ? 'bg-green-500' : subj.avg >= 40 ? 'bg-brand-primary' : 'bg-red-400'}`} 
                                      style={{ width: `${subj.avg}%` }}
                                    ></div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 text-center px-6">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6"><BarChart3 size={40} /></div>
                       <h3 className="text-xl font-bold text-brand-dark">Detailed Analytics Pending</h3>
                       <p className="text-slate-400 text-sm max-w-xs mt-2">Evaluation metrics appear here once your first test is checked by our AIR Rankers.</p>
                       <Button onClick={() => setActiveTab('tests')} className="mt-6">Start a Test</Button>
                    </div>
                  )}

                  {/* Enhanced Evaluation Table */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-brand-dark">Submission History</h3>
                        <div className="flex gap-4">
                           <div className="text-center px-4 border-r border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase">Submissions</p><p className="text-sm font-bold text-brand-dark">{submissions.length}</p></div>
                           <div className="text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Checked</p><p className="text-sm font-bold text-brand-primary">{evaluatedSubmissions.length}</p></div>
                        </div>
                     </div>
                     <table className="w-full text-left">
                        <thead className="bg-slate-50">
                           <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <th className="px-8 py-4">Test Description</th>
                              <th className="px-8 py-4">Status</th>
                              <th className="px-8 py-4">Score</th>
                              <th className="px-8 py-4 text-right">Documents</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {submissions.map((sub) => {
                             const isEvaluated = sub.status === 'Evaluated';
                             return (
                               <tr key={sub.id} className="hover:bg-slate-50/50 group">
                                  <td className="px-8 py-5">
                                     <p className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{sub.testTitle}</p>
                                     <p className="text-[10px] text-slate-400">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                  </td>
                                  <td className="px-8 py-5">
                                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isEvaluated ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{sub.status}</span>
                                  </td>
                                  <td className="px-8 py-5">
                                     <span className="text-sm font-black text-brand-primary">{sub.marks || '--'}</span>
                                  </td>
                                  <td className="px-8 py-5 text-right flex items-center justify-end gap-3">
                                     <button onClick={() => setViewingPdf({ url: sub.answerSheetUrl, title: `Sent: ${sub.testTitle}` })} className="p-2 bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"><FileText size={16} /></button>
                                     {isEvaluated && (
                                       <button onClick={() => setViewingPdf({ url: sub.evaluatedSheetUrl, title: `Checked: ${sub.testTitle}` })} className="px-3 py-1.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase hover:bg-brand-blue shadow-md transition-all">Results</button>
                                     )}
                                  </td>
                               </tr>
                             );
                           })}
                        </tbody>
                     </table>
                  </div>
                </div>
              )}

              {/* Other tabs follow similar clean visual structure */}
              {activeTab === 'tests' && (
                 <div className="space-y-8 animate-fade-up">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                       <h3 className="text-2xl font-display font-bold text-brand-dark mb-8">Test Repository</h3>
                       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {availableTests.map((test) => {
                             const submission = submissions.find(s => s.testId === test.id);
                             const isUnlocked = test.accessType === 'Free' || isPlanActive;
                             return (
                               <div key={test.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 relative group overflow-hidden">
                                  {!isUnlocked && <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center z-10"><Lock size={20} className="mb-2"/><p className="text-[9px] font-black uppercase">Premium Only</p></div>}
                                  <h4 className="font-bold text-brand-dark text-lg mb-1">{test.title}</h4>
                                  <p className="text-[10px] text-brand-primary font-bold mb-6">{test.subject}</p>
                                  <div className="flex flex-col gap-2">
                                     <button onClick={() => isUnlocked && setViewingPdf({url: test.pdfLink, title: test.title})} className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase shadow-lg">View Paper</button>
                                     <div className="relative">
                                        <input type="file" accept="application/pdf" disabled={!isUnlocked || !!submission} onChange={(e) => handleFileUpload(e, test)} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                                        <button className="w-full py-2.5 bg-white border border-slate-200 text-brand-dark rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                          {uploadingTestId === test.id ? <Loader2 className="animate-spin" size={12}/> : !!submission ? <CheckCircle2 size={12}/> : <Upload size={12}/>}
                                          {uploadingTestId === test.id ? 'Uploading...' : !!submission ? 'Submitted' : 'Upload Solution'}
                                        </button>
                                     </div>
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-8 animate-fade-up">
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                     <h3 className="text-2xl font-display font-bold text-brand-dark mb-8">Library Resources</h3>
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {libraryMaterials.map((mat) => (
                           <div key={mat.id} className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-brand-primary/30 shadow-sm flex flex-col h-full">
                              <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-4"><BookOpen size={20} /></div>
                              <h4 className="font-bold text-brand-dark text-lg mb-1 flex-1">{mat.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400 mb-6">{mat.subject} • {mat.type}</p>
                              <div className="flex gap-2">
                                <button onClick={() => setViewingPdf({url: mat.pdfLink, title: mat.title})} className="flex-1 py-3 bg-slate-50 text-brand-dark rounded-xl font-bold text-xs hover:bg-brand-primary hover:text-white transition-all">Preview</button>
                                <button onClick={() => window.open(mat.pdfLink, '_blank')} className="py-3 px-4 rounded-xl border border-slate-200 text-slate-400 hover:text-brand-primary transition-all"><Download size={14} /></button>
                              </div>
                           </div>
                       ))}
                     </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};