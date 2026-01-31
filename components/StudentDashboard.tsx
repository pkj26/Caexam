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

        // 2. Tests Listener
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

        // 4. Submissions Listener
        const subRef = collection(db, "submissions");
        const qSub = query(subRef, where("studentId", "==", studentPhone));
        unsubSubmissions = onSnapshot(qSub, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
          setSubmissions(data);
          setLoading(false);
        });

        // 5. Bookings Listener
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
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "submissions"), {
        testId: test.id,
        testTitle: test.title,
        studentId: studentProfile.id,
        studentName: studentProfile.name,
        answerSheetUrl: downloadURL,
        submittedAt: new Date().toISOString(),
        status: "Pending",
        marks: "",
        feedback: ""
      });

      alert("Answer Sheet Uploaded Successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingTestId(null);
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileSidebarOpen(false); }}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all mb-1 ${activeTab === id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
      {badge ? <span className="bg-brand-orange text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none shrink-0
      `}>
         <div className="p-6">
           <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">CA</div>
             <div>
               <h1 className="text-white font-display font-bold leading-tight">exam<span className="text-brand-primary">.online</span></h1>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Student Portal</p>
             </div>
           </div>

           <div className="bg-slate-800/50 rounded-2xl p-4 mb-6 border border-white/5">
             <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold border border-brand-primary/20">
                 {studentProfile?.name?.[0] || 'S'}
               </div>
               <div className="overflow-hidden">
                 <p className="text-white font-bold text-sm truncate">{studentProfile?.name || 'Student'}</p>
                 <p className="text-slate-400 text-[10px] truncate">{studentProfile?.course || 'CA Course'}</p>
               </div>
             </div>
             <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase">Active Plan</span>
             </div>
           </div>

           <nav className="space-y-1">
             <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
             <SidebarItem id="tests" icon={FileText} label="My Tests" badge={availableTests.length} />
             <SidebarItem id="results" icon={Award} label="Results" badge={submissions.filter(s => s.status === 'Evaluated').length} />
             <SidebarItem id="mentorship" icon={UserCheck} label="Mentorship" />
             <SidebarItem id="resources" icon={Library} label="Resources" />
           </nav>
         </div>

         <div className="mt-auto p-4 border-t border-white/5">
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all">
               <LogOut size={16}/> Secure Logout
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-lg">CA</div>
             <span className="font-bold text-brand-dark">Student Panel</span>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100">
             <Menu size={24} />
          </button>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
           {/* Section Title */}
           <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab === 'overview' ? `Welcome back, ${studentProfile?.name?.split(' ')[0] || 'Student'}` : activeTab}</h2>
              <p className="text-slate-400 text-sm font-medium">Here is what's happening with your preparation today.</p>
           </div>

           {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <Loader2 size={40} className="animate-spin mb-4 text-brand-primary" />
               <p className="font-bold">Syncing your progress...</p>
             </div>
           ) : (
             <div className="animate-fade-up">
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                     {/* Stats Row */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3"><FileText size={20}/></div>
                           <h3 className="text-2xl font-black text-brand-dark">{availableTests.length}</h3>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tests Available</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                           <div className="w-10 h-10 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center mb-3"><Target size={20}/></div>
                           <h3 className="text-2xl font-black text-brand-dark">{submissions.length}</h3>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Attempted</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                           <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3"><Award size={20}/></div>
                           <h3 className="text-2xl font-black text-brand-dark">{stats?.averagePercent ? Math.round(stats.averagePercent) : 0}%</h3>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Avg. Score</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                           <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3"><Zap size={20}/></div>
                           <h3 className="text-2xl font-black text-brand-dark">{bookings.length}</h3>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mentorships</p>
                        </div>
                     </div>

                     {/* Progress Chart & Recent Activity */}
                     <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-brand-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={150} /></div>
                           <h3 className="font-bold text-lg mb-6 relative z-10">Recent Performance</h3>
                           <div className="flex items-end gap-2 h-40 relative z-10">
                              {stats?.recentScores.map((score, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                                   <span className="text-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">{Math.round(score)}%</span>
                                   <div 
                                      className="w-full bg-brand-primary rounded-t-xl hover:bg-brand-orange transition-colors relative group-hover:shadow-[0_0_20px_rgba(255,162,57,0.5)]" 
                                      style={{ height: `${score}%` }}
                                   ></div>
                                </div>
                              ))}
                              {(!stats || stats.recentScores.length === 0) && <p className="w-full text-center opacity-30 text-sm">Attempt tests to see analytics</p>}
                           </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                           <h3 className="font-bold text-brand-dark mb-6">Upcoming Schedule</h3>
                           <div className="space-y-4">
                              <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-xs font-bold text-slate-500">
                                    <span>FEB</span><span className="text-lg text-brand-dark font-black">28</span>
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-brand-dark text-sm">Full Syllabus Test</h4>
                                    <p className="text-xs text-slate-400">Advanced Auditing</p>
                                 </div>
                              </div>
                              <div className="flex gap-4 items-center">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-xs font-bold text-slate-500">
                                    <span>MAR</span><span className="text-lg text-brand-dark font-black">05</span>
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-brand-dark text-sm">Mock Test Series 2</h4>
                                    <p className="text-xs text-slate-400">Financial Reporting</p>
                                 </div>
                              </div>
                           </div>
                           <button onClick={() => setActiveTab('tests')} className="w-full mt-6 py-3 bg-brand-cream text-brand-dark font-bold rounded-xl text-xs hover:bg-brand-primary hover:text-white transition-all">View All Tests</button>
                        </div>
                     </div>
                  </div>
                )}

                {/* Tests Tab */}
                {activeTab === 'tests' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                           <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <tr>
                                 <th className="px-6 py-4">Test Title</th>
                                 <th className="px-6 py-4">Subject & Level</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {availableTests.map((test) => {
                                 const submission = submissions.find(s => s.testId === test.id);
                                 return (
                                    <tr key={test.id} className="hover:bg-slate-50/50">
                                       <td className="px-6 py-5">
                                          <p className="text-sm font-bold text-brand-dark">{test.title}</p>
                                          <p className="text-[10px] text-slate-400">Added: {test.date}</p>
                                       </td>
                                       <td className="px-6 py-5">
                                          <span className="px-2 py-1 bg-brand-primary/5 text-brand-primary rounded text-[10px] font-bold uppercase">{test.subject}</span>
                                       </td>
                                       <td className="px-6 py-5">
                                          {submission ? (
                                             <span className={`flex items-center gap-1.5 text-xs font-bold ${
                                                submission.status === 'Evaluated' ? 'text-green-600' : 
                                                submission.status === 'Rejected' ? 'text-red-500' : 'text-orange-500'
                                             }`}>
                                                {submission.status === 'Evaluated' ? <CheckCircle2 size={14}/> : <Clock size={14}/>}
                                                {submission.status}
                                             </span>
                                          ) : (
                                             <span className="text-xs font-bold text-slate-400">Not Attempted</span>
                                          )}
                                       </td>
                                       <td className="px-6 py-5 text-right flex justify-end gap-2">
                                          {test.pdfLink && (
                                             <button 
                                                onClick={() => setViewingPdf({ url: test.pdfLink, title: test.title })}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all"
                                             >
                                                <Download size={14} /> Paper
                                             </button>
                                          )}
                                          {!submission && (
                                             <div className="relative overflow-hidden">
                                                <input 
                                                   type="file" 
                                                   accept="application/pdf"
                                                   className="absolute inset-0 opacity-0 cursor-pointer"
                                                   onChange={(e) => handleFileUpload(e, test)}
                                                />
                                                <button className="flex items-center gap-1 px-3 py-1.5 bg-brand-dark hover:bg-brand-primary rounded-lg text-xs font-bold text-white transition-all">
                                                   {uploadingTestId === test.id ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14} />}
                                                   Upload
                                                </button>
                                             </div>
                                          )}
                                       </td>
                                    </tr>
                                 );
                              })}
                              {availableTests.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-slate-400">No tests assigned yet.</td></tr>}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                           <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <tr>
                                 <th className="px-6 py-4">Test Name</th>
                                 <th className="px-6 py-4">Submitted On</th>
                                 <th className="px-6 py-4">Marks</th>
                                 <th className="px-6 py-4 text-right">Feedback Sheet</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {submissions.map((sub) => (
                                 <tr key={sub.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-5">
                                       <p className="text-sm font-bold text-brand-dark">{sub.testTitle}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                       <p className="text-xs font-medium text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                       {sub.status === 'Evaluated' ? (
                                          <span className="text-sm font-black text-brand-dark">{sub.marks}</span>
                                       ) : (
                                          <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded font-bold uppercase">{sub.status}</span>
                                       )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                       {sub.evaluatedSheetUrl ? (
                                          <button 
                                             onClick={() => setViewingPdf({ url: sub.evaluatedSheetUrl, title: `Checked Copy: ${sub.testTitle}` })}
                                             className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                                          >
                                             <Eye size={14} /> View Checked Copy
                                          </button>
                                       ) : (
                                          <span className="text-xs text-slate-300 italic">Processing...</span>
                                       )}
                                    </td>
                                 </tr>
                              ))}
                              {submissions.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-slate-400">No submissions found.</td></tr>}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}

                {/* Mentorship Tab */}
                {activeTab === 'mentorship' && (
                  <div className="grid lg:grid-cols-2 gap-8">
                     <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-brand-dark mb-6 text-lg">Book a 1-on-1 Session</h3>
                        <div className="space-y-4">
                           <div>
                              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Select Mentor</label>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                 {mentors.map(m => (
                                    <div 
                                       key={m.id} 
                                       onClick={() => setSelectedMentor(m)}
                                       className={`p-3 rounded-2xl border cursor-pointer transition-all ${selectedMentor?.id === m.id ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-100 hover:border-brand-primary/30'}`}
                                    >
                                       <div className="flex items-center gap-3">
                                          <img src={m.img} alt={m.name} className="w-10 h-10 rounded-full" />
                                          <div>
                                             <p className="text-xs font-bold text-brand-dark">{m.name}</p>
                                             <p className="text-[9px] text-brand-primary font-bold">{m.rank}</p>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Date</label>
                                 <input type="date" className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                              </div>
                              <div>
                                 <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Slot</label>
                                 <select className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none" value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
                                    <option value="">Select Time</option>
                                    <option>10:00 AM</option><option>02:00 PM</option><option>06:00 PM</option>
                                 </select>
                              </div>
                           </div>

                           <div>
                              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Topic to Discuss</label>
                              <textarea 
                                 className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold outline-none h-24 resize-none" 
                                 placeholder="e.g. How to improve presentation in Audit..."
                                 value={bookingReason} onChange={e => setBookingReason(e.target.value)}
                              />
                           </div>

                           <Button fullWidth onClick={handleBookSession} disabled={isBooking}>
                              {isBooking ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                           </Button>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="bg-brand-dark text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                           <h3 className="font-bold text-lg mb-4 relative z-10">Your Upcoming Sessions</h3>
                           <div className="space-y-3 relative z-10">
                              {bookings.map(b => (
                                 <div key={b.id} className="bg-white/10 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-bold text-xs">
                                          {b.mentorName[0]}
                                       </div>
                                       <div>
                                          <p className="font-bold text-sm">{b.mentorName}</p>
                                          <p className="text-[10px] opacity-70">{b.date} • {b.slot}</p>
                                       </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${b.status === 'Confirmed' ? 'bg-green-500' : 'bg-orange-500'}`}>{b.status}</span>
                                 </div>
                              ))}
                              {bookings.length === 0 && <p className="text-white/40 text-sm italic">No active bookings.</p>}
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           )}
        </main>
      </div>
    </div>
  );
};