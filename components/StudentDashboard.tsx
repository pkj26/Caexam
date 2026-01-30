import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, ClipboardCheck, GraduationCap, 
  Settings, LogOut, Bell, Search, TrendingUp,
  FileText, Download, Upload, Flame, Award, 
  Menu, X, Lock, Eye, Book, Library, Star, AlertCircle, CheckCircle2, Loader2,
  Database, Zap, ArrowUpRight, Target, BarChart3, Calendar, Clock, UserCheck, MessageSquare
} from 'lucide-react';
import { 
  db, storage,
  collection, query, where, orderBy, doc, getDoc, addDoc, onSnapshot,
  ref, uploadBytes, getDownloadURL, serverTimestamp
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
  const [bookings, setBookings] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingTestId, setUploadingTestId] = useState<string | null>(null);

  // Mentorship Booking State
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingReason, setBookingReason] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const studentPhone = localStorage.getItem('student_phone');
    if (!studentPhone) {
      onLogout();
      return;
    }

    let unsubTests: (() => void) | undefined;
    let unsubMaterials: (() => void) | undefined;
    let unsubSubmissions: (() => void) | undefined;
    let unsubProfile: (() => void) | undefined;
    let unsubBookings: (() => void) | undefined;

    // 1. Profile Listener
    const docRef = doc(db, "students", studentPhone);
    unsubProfile = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const profile = docSnap.data();
        setStudentProfile({ ...profile, id: studentPhone });
        
        const currentCourse = profile.course || 'CA Final';

        // 2. Tests Listener - Sorting on client side to avoid Index requirement
        const testsRef = collection(db, "tests");
        const qTests = query(testsRef, where("level", "==", currentCourse));
        unsubTests = onSnapshot(qTests, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          setAvailableTests(data);
        });

        // 3. Materials Listener
        const materialsRef = collection(db, "materials");
        const qMaterials = query(materialsRef, orderBy("date", "desc"));
        unsubMaterials = onSnapshot(qMaterials, (snapshot) => {
          setLibraryMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 4. Submissions Listener - Sorting on client side to avoid Index requirement
        const subRef = collection(db, "submissions");
        const qSub = query(subRef, where("studentId", "==", studentPhone));
        unsubSubmissions = onSnapshot(qSub, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
          setSubmissions(data);
          setLoading(false);
        });

        // 5. Bookings Listener - Sorting on client side to avoid Index requirement
        const bookRef = collection(db, "bookings");
        const qBook = query(bookRef, where("studentId", "==", studentPhone));
        unsubBookings = onSnapshot(qBook, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => new Date(b.requestedAt || 0).getTime() - new Date(a.requestedAt || 0).getTime());
          setBookings(data);
        });
      } else {
        onLogout();
      }
    }, (error) => {
      console.error("Profile Snapshot error:", error);
      setLoading(false);
    });

    return () => {
      if (unsubTests) unsubTests();
      if (unsubMaterials) unsubMaterials();
      if (unsubSubmissions) unsubSubmissions();
      if (unsubProfile) unsubProfile();
      if (unsubBookings) unsubBookings();
    };
  }, [onLogout]); 

  const mentors = [
    { id: 'm1', name: "CA Rohit Sethi", rank: "AIR 14", spec: "Audit & Law", img: "https://i.pravatar.cc/150?img=11" },
    { id: 'm2', name: "CA Neha Gupta", rank: "AIR 08", spec: "Taxation", img: "https://i.pravatar.cc/150?img=26" },
    { id: 'm3', name: "CA Ishan Vyas", rank: "AIR 21", spec: "Costing & FM", img: "https://i.pravatar.cc/150?img=12" },
  ];

  const handleBookSession = async () => {
    if (!studentProfile) {
      alert("Please wait while we sync your profile...");
      return;
    }

    if (!selectedMentor || !selectedDate || !selectedSlot) {
      alert("Please select mentor, date and time slot.");
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        studentId: studentProfile.id,
        studentName: studentProfile.name || "Anonymous Student",
        studentPhone: studentProfile.phone || "N/A",
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        date: selectedDate,
        slot: selectedSlot,
        reason: bookingReason || "General doubt solving",
        status: 'Pending',
        requestedAt: new Date().toISOString()
      };

      await addDoc(collection(db, "bookings"), bookingData);
      alert("Booking Request Sent Successfully! A mentor will confirm shortly.");
      
      setSelectedMentor(null);
      setSelectedDate('');
      setSelectedSlot('');
      setBookingReason('');
    } catch (e: any) {
      alert("Booking failed: " + e.message);
    } finally {
      setIsBooking(false);
    }
  };

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
      const storageRef = ref(storage, `answers/${studentProfile.id}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      await addDoc(collection(db, "submissions"), {
        studentId: studentProfile.id,
        studentName: studentProfile.name,
        testId: test.id,
        testTitle: test.title,
        submittedAt: new Date().toISOString(),
        answerSheetUrl: url,
        status: 'Pending'
      });
      alert("Paper Uploaded! Expect evaluation in 24-48 hours.");
    } catch (e: any) {
      alert(`Upload Failed: ${e.message}`);
    } finally {
      setUploadingTestId(null);
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: TabType, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-slate-50 hover:text-brand-primary'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-brand-primary" size={40} />
      <p className="font-bold text-slate-400">Loading Student Portal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-brand-dark">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 p-8 flex-col shrink-0 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">CA</div>
          <h1 className="font-display font-bold text-xl tracking-tighter">exam<span className="text-brand-primary">.online</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="tests" icon={ClipboardCheck} label="Test Series" />
          <NavItem id="results" icon={TrendingUp} label="Evaluation Results" />
          <NavItem id="mentorship" icon={GraduationCap} label="Mentorship Call" />
          <NavItem id="resources" icon={Library} label="Study Resources" />
        </nav>

        <div className="pt-8 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Course</p>
            <p className="text-xs font-bold text-brand-dark">{studentProfile?.course || 'Not Set'}</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={18} /> Logout Portal
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-lg">CA</div>
           <span className="font-display font-bold text-brand-dark">exam.online</span>
        </div>
        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 text-slate-400"><Menu size={24} /></button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 flex flex-col animate-slide-in">
             <div className="flex justify-end mb-8"><button onClick={() => setIsMobileSidebarOpen(false)}><X size={24}/></button></div>
             <nav className="flex-1 space-y-1">
                <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
                <NavItem id="tests" icon={ClipboardCheck} label="Tests" />
                <NavItem id="results" icon={TrendingUp} label="Results" />
                <NavItem id="mentorship" icon={GraduationCap} label="Mentorship" />
                <NavItem id="resources" icon={Library} label="Resources" />
             </nav>
             <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm mt-auto"><LogOut size={18} /> Logout</button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
             <h2 className="text-2xl lg:text-3xl font-display font-bold text-brand-dark">Hello, {studentProfile?.name?.split(' ')[0] || 'Aspirant'} 👋</h2>
             <p className="text-slate-400 text-sm font-bold mt-1">Goal: <span className="text-brand-primary uppercase">Chartered Accountant</span> • AIR Focus</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Plan: <span className="text-brand-dark">{studentProfile?.plan || 'Free'}</span></span>
             </div>
             <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-brand-primary transition-all shadow-sm"><Bell size={20}/></button>
          </div>
        </div>

        <div className="animate-fade-up">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Analytics Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-brand-primary p-6 rounded-[2rem] text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden group">
                    <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform"><Target size={120} /></div>
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-4">Overall Performance</p>
                    <h3 className="text-4xl font-display font-black mb-2">{stats ? Math.round(stats.averagePercent) : 0}%</h3>
                    <p className="text-xs opacity-80 flex items-center gap-1"><Zap size={12} className="fill-white"/> {stats?.totalEvaluated || 0} Papers Evaluated</p>
                 </div>
                 
                 <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy Graph</span>
                       <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-end gap-2 h-20">
                       {stats?.recentScores.map((score, i) => (
                         <div key={i} className="flex-1 bg-brand-primary/10 rounded-t-lg transition-all hover:bg-brand-primary group relative" style={{ height: `${score}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{Math.round(score)}%</div>
                         </div>
                       ))}
                       {(!stats || stats.recentScores.length === 0) && <p className="text-[10px] text-slate-300 italic w-full text-center pb-4">No data yet.</p>}
                    </div>
                 </div>

                 <div className="bg-brand-dark p-6 rounded-[2rem] text-white flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div>
                          <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Next Target</p>
                          <h4 className="font-bold text-sm mt-1">Review Audit Notes</h4>
                       </div>
                       <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-brand-orange"><Flame size={18}/></div>
                    </div>
                    <div className="pt-4">
                       <div className="flex justify-between text-[10px] font-bold mb-1.5 opacity-60"><span>Attempt Streak</span><span>12 Days</span></div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-orange rounded-full w-2/3"></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={18} className="text-brand-primary"/> Recent Activity</h4>
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                       {submissions.slice(0, 3).map((sub, i) => (
                         <div key={i} className="p-5 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sub.status === 'Evaluated' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}><FileText size={20}/></div>
                               <div>
                                  <p className="text-sm font-bold text-brand-dark">{sub.testTitle}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${sub.status === 'Evaluated' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>{sub.status}</span>
                         </div>
                       ))}
                       {submissions.length === 0 && <div className="p-10 text-center text-slate-300 italic">No recent activity.</div>}
                       <button onClick={() => setActiveTab('results')} className="w-full py-4 text-[10px] font-black text-brand-primary uppercase tracking-widest hover:bg-slate-50 transition-colors">View All Submissions <ArrowUpRight size={12} className="inline ml-1"/></button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Zap size={18} className="text-brand-orange"/> Weak Area Analysis</h4>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-full">
                       {stats ? (
                         <div className="space-y-6">
                            {stats.subjectStats.map((s, i) => (
                              <div key={i}>
                                <div className="flex justify-between text-xs font-bold mb-2">
                                   <span className="text-brand-dark">{s.name}</span>
                                   <span className={s.avg < 50 ? 'text-red-500' : 'text-green-500'}>{Math.round(s.avg)}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                   <div className={`h-full rounded-full ${s.avg < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${s.avg}%` }}></div>
                                </div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div className="h-full flex flex-col items-center justify-center text-center py-10">
                            <BarChart3 size={40} className="text-slate-100 mb-4" />
                            <p className="text-slate-400 text-sm font-bold">Evaluation required for analytics.</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {availableTests.map((test) => (
                 <div key={test.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 bg-brand-primary/5 text-brand-primary rounded-2xl flex items-center justify-center"><Book size={24}/></div>
                       <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded uppercase">Live Test</span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">{test.title}</h3>
                    <p className="text-xs text-slate-400 font-bold mb-6 flex items-center gap-2"><Calendar size={14}/> {test.date}</p>
                    <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => setViewingPdf({ url: test.pdfLink, title: test.title })}
                         className="w-full py-3 bg-slate-50 text-slate-500 font-black text-[10px] uppercase rounded-xl hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
                       >
                         <Download size={14}/> Download Question Paper
                       </button>
                       <label className={`w-full py-3 bg-brand-dark text-white font-black text-[10px] uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-brand-primary transition-all ${uploadingTestId === test.id ? 'opacity-50 cursor-wait' : ''}`}>
                          <Upload size={14}/> {uploadingTestId === test.id ? 'Uploading...' : 'Upload Answer Sheet'}
                          <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, test)} disabled={uploadingTestId !== null} />
                       </label>
                    </div>
                 </div>
               ))}
               {availableTests.length === 0 && (
                 <div className="col-span-full py-32 text-center">
                    <AlertCircle size={48} className="mx-auto text-slate-200 mb-4" />
                    <h4 className="text-xl font-bold text-slate-300">No scheduled tests for your course.</h4>
                    <p className="text-sm text-slate-400 mt-1">Check back soon for upcoming CA series.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                     <h3 className="font-bold text-brand-dark">Evaluation Archive</h3>
                     <p className="text-xs text-slate-400">Review your past performance and evaluator feedback.</p>
                  </div>
                  <table className="w-full text-left">
                     <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="px-6 py-4">Test Description</th>
                           <th className="px-6 py-4">Submission</th>
                           <th className="px-6 py-4">Result</th>
                           <th className="px-6 py-4 text-right">Preview Result</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {submissions.map((sub, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 group">
                              <td className="px-6 py-5">
                                 <p className="text-sm font-bold text-brand-dark">{sub.testTitle}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                              </td>
                              <td className="px-6 py-5">
                                 <button onClick={() => setViewingPdf({ url: sub.answerSheetUrl, title: "Your Submission" })} className="p-2 text-slate-300 hover:text-brand-dark rounded-lg transition-all"><Eye size={16}/></button>
                              </td>
                              <td className="px-6 py-5">
                                 {sub.status === 'Evaluated' ? (
                                   <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-black text-[10px]">{sub.marks}</div>
                                      <span className="text-[9px] font-black text-green-600 uppercase">Checked</span>
                                   </div>
                                 ) : sub.status === 'Review' ? (
                                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">In Final Review</span>
                                 ) : (
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Pending Evaluation</span>
                                 )}
                              </td>
                              <td className="px-6 py-5 text-right">
                                 {sub.evaluatedSheetUrl ? (
                                    <button onClick={() => setViewingPdf({ url: sub.evaluatedSheetUrl, title: "Checked Copy" })} className="p-2 bg-brand-primary/5 text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all"><FileText size={18}/></button>
                                 ) : (
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto"><Lock size={14}/></div>
                                 )}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  {submissions.length === 0 && <div className="py-24 text-center text-slate-300 italic">No submissions found.</div>}
               </div>
            </div>
          )}

          {activeTab === 'mentorship' && (
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="bg-brand-dark rounded-[3rem] p-10 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><GraduationCap size={200}/></div>
                  <h3 className="text-3xl font-display font-bold mb-4 relative z-10">Mentorship Desk</h3>
                  <p className="opacity-60 text-sm max-w-xl relative z-10">Clear your doubts 1-on-1 with All India Rankers. Choose your mentor and book a preferred slot.</p>
                  <div className="flex gap-4 mt-8 relative z-10">
                     <div className="flex -space-x-3">
                        {mentors.map(m => (
                           <img key={m.id} src={m.img} className="w-10 h-10 rounded-full border-2 border-brand-dark" alt={m.name}/>
                        ))}
                     </div>
                     <div className="text-xs font-bold text-white/40"><span className="text-white">Active Mentors</span><br/>Available Today</div>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <h4 className="font-bold text-brand-dark pl-2">Select Your Mentor</h4>
                     <div className="space-y-3">
                        {mentors.map((m) => (
                           <button 
                              key={m.id} 
                              onClick={() => setSelectedMentor(m)}
                              className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${selectedMentor?.id === m.id ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'bg-white border-slate-100 hover:border-brand-primary/30'}`}
                           >
                              <img src={m.img} className="w-12 h-12 rounded-2xl object-cover" alt={m.name}/>
                              <div className="text-left">
                                 <p className="font-bold text-sm">{m.name}</p>
                                 <p className={`text-[10px] font-bold ${selectedMentor?.id === m.id ? 'text-white/60' : 'text-brand-primary'}`}>{m.rank} • {m.spec}</p>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Date</label>
                        <div className="relative">
                           <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                           <input type="date" className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}/>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Choose Slot</label>
                        <div className="relative">
                           <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                           <select className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none appearance-none" value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
                              <option value="">Select Time Slot</option>
                              <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                              <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                              <option value="06:00 PM - 06:30 PM">06:00 PM - 06:30 PM</option>
                              <option value="09:00 PM - 09:30 PM">09:00 PM - 09:30 PM</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Query/Reason</label>
                        <div className="relative">
                           <MessageSquare className="absolute left-4 top-4 text-slate-400" size={16}/>
                           <textarea className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none h-24" placeholder="Briefly explain your doubts..." value={bookingReason} onChange={e => setBookingReason(e.target.value)}></textarea>
                        </div>
                     </div>
                     <Button 
                        variant="primary" fullWidth className="!py-4 shadow-xl" 
                        onClick={handleBookSession}
                        disabled={isBooking || !selectedMentor || !selectedDate || !selectedSlot}
                     >
                        {isBooking ? <Loader2 className="animate-spin" /> : 'Confirm Booking Request'}
                     </Button>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                       <h3 className="font-bold text-brand-dark">Session History</h3>
                       <div className="flex gap-2">
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400"></div><span className="text-[9px] font-black uppercase text-slate-400">Pending</span></div>
                           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[9px] font-black uppercase text-slate-400">Confirmed</span></div>
                       </div>
                   </div>
                   <div className="p-6">
                      {bookings.map((b, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Calendar size={18}/></div>
                              <div>
                                 <p className="text-sm font-bold text-brand-dark">{b.mentorName}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{b.date} • {b.slot}</p>
                              </div>
                           </div>
                           <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{b.status}</span>
                        </div>
                      ))}
                      {bookings.length === 0 && <div className="text-center py-10 text-slate-300 italic text-sm">No session requests yet.</div>}
                   </div>
               </div>
            </div>
          )}

          {activeTab === 'resources' && (
             <div className="space-y-8">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex-1">
                         <h3 className="text-xl font-display font-bold text-brand-dark mb-2">Subject Wise Resources</h3>
                         <p className="text-xs text-slate-400">Exclusive notes, question banks, and topper copies for your course.</p>
                      </div>
                      <div className="relative w-full md:w-64">
                         <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                         <input type="text" placeholder="Search resources..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"/>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {libraryMaterials.map((m) => (
                      <div key={m.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-lg transition-all">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center"><Library size={24}/></div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${m.accessType === 'Premium' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-green-50 text-green-600'}`}>{m.accessType}</span>
                         </div>
                         <h4 className="font-bold text-brand-dark mb-1">{m.title}</h4>
                         <p className="text-[10px] text-brand-primary font-bold uppercase mb-4">{m.subject}</p>
                         <button 
                            onClick={() => setViewingPdf({ url: m.pdfLink, title: m.title })}
                            className="w-full py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
                         >
                            <Eye size={14}/> Preview Resource
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
