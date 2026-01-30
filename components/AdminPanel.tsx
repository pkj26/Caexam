import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Trash2, LogOut, 
  LayoutDashboard, Settings, ExternalLink, 
  Plus, Edit2, FileText, Library, 
  Database, Eye, CheckCircle2, 
  Calendar, GraduationCap, Gavel,
  Check, X, Tag, Loader2, Upload, BookOpen,
  TrendingUp, BarChart3, ChevronRight, XCircle, Target, Phone, MessageSquare,
  Clock, Award, ShieldCheck, History as HistoryIcon,
  CheckCircle, AlertCircle, FileCheck
} from 'lucide-react';
import { Button } from './Button';
import { PDFViewer } from './PDFViewer';
import { 
  db, storage,
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc,
  serverTimestamp,
  ref, 
  uploadBytes, 
  getDownloadURL 
} from '../firebaseConfig';

interface AdminPanelProps {
  plans: any[];
  onUpdatePlans: (plans: any[]) => void;
  onLogout: () => void;
  onBack: () => void;
}

type TabType = 'dashboard' | 'students' | 'teachers' | 'approvals' | 'history' | 'tests' | 'library' | 'bookings' | 'settings';

const LEVEL_SUBJECTS: Record<string, string[]> = {
  'CA Final': ['P1: Financial Reporting', 'P2: AFM', 'P3: Adv. Auditing', 'P4: Direct Tax', 'P5: Indirect Tax', 'P6: IBS'],
  'CA Inter': ['P1: Adv. Accounting', 'P2: Corp. Laws', 'P3: Taxation', 'P4: Costing', 'P5: Auditing', 'P6: FM & SM'],
  'CA Foundation': ['P1: Accounting', 'P2: Business Laws', 'P3: Quant. Aptitude', 'P4: Economics']
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ plans, onUpdatePlans, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsubStudents = onSnapshot(query(collection(db, "students"), orderBy("joinDate", "desc")), (snap) => {
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubTeachers = onSnapshot(query(collection(db, "teachers"), orderBy("joinDate", "desc")), (snap) => {
      setTeachers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubTests = onSnapshot(query(collection(db, "tests"), orderBy("date", "desc")), (snap) => {
      setTests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubMaterials = onSnapshot(query(collection(db, "materials"), orderBy("date", "desc")), (snap) => {
      setMaterials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubSubmissions = onSnapshot(query(collection(db, "submissions"), orderBy("submittedAt", "desc")), (snap) => {
      setSubmissions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    const unsubBookings = onSnapshot(query(collection(db, "bookings"), orderBy("requestedAt", "desc")), (snap) => {
      setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubStudents(); unsubTeachers(); unsubTests(); unsubMaterials(); unsubSubmissions(); unsubBookings();
    };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newEntry, setNewEntry] = useState<any>({ 
    name: '', email: '', phone: '', course: 'CA Final', 
    subject: LEVEL_SUBJECTS['CA Final'][0], title: '', type: 'Short Notes', 
    level: 'CA Final', accessType: 'Premium', pdfLink: '', topic: '' 
  });

  const handleLevelChange = (lvl: string) => {
    setNewEntry({ ...newEntry, level: lvl, subject: LEVEL_SUBJECTS[lvl][0] });
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `admin_uploads/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const date = new Date().toISOString().split('T')[0];

    try {
      let finalPdfLink = newEntry.pdfLink;
      if (selectedFile) finalPdfLink = await handleFileUpload(selectedFile);

      const baseData = { ...newEntry, pdfLink: finalPdfLink, createdAt: serverTimestamp() };

      if (activeTab === 'students') {
        await addDoc(collection(db, "students"), { ...baseData, planStatus: 'Active', joinDate: date });
      } else if (activeTab === 'teachers') {
        await addDoc(collection(db, "teachers"), { ...baseData, joinDate: date });
      } else if (activeTab === 'library') {
        await addDoc(collection(db, "materials"), { ...baseData, date });
      } else if (activeTab === 'tests') {
        await addDoc(collection(db, "tests"), { ...baseData, date, status: 'Live' });
      }
      
      setShowAddModal(false);
      setSelectedFile(null);
      setNewEntry({ name: '', email: '', phone: '', course: 'CA Final', subject: LEVEL_SUBJECTS['CA Final'][0], title: '', type: 'Short Notes', level: 'CA Final', accessType: 'Premium', pdfLink: '', topic: '' });
    } catch (err) {
      alert("Action failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm(`Delete this record?`)) return;
    try { await deleteDoc(doc(db, collectionName, id)); } catch (err) { alert("Delete failed."); }
  };

  const handleBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
    } catch (e) {
      alert("Status update failed.");
    }
  };

  const handleApprovalAction = async (id: string, action: 'Approve' | 'Reject') => {
    try {
      const status = action === 'Approve' ? 'Evaluated' : 'Rejected';
      const updateData: any = { status };
      if (action === 'Reject' && rejectionFeedback) {
        updateData.feedback = rejectionFeedback;
      }
      await updateDoc(doc(db, "submissions", id), updateData);
      setRejectionFeedback('');
      alert(`Submission ${action}d Successfully.`);
    } catch (e) {
      alert("Action failed.");
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setSearchTerm(''); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
      {badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-brand-dark">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}

      <aside className="hidden lg:flex w-64 bg-brand-dark p-6 flex-col shrink-0 min-h-screen sticky top-0 z-20">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">CA</div>
          <div>
            <h1 className="text-white font-display font-bold leading-tight tracking-tighter">exam<span className="text-brand-primary">.online</span></h1>
            <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Admin Control</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="approvals" icon={Gavel} label="Approvals" badge={submissions.filter((s:any) => s.status === 'Review').length} />
          <SidebarItem id="history" icon={HistoryIcon} label="Full History" />
          <SidebarItem id="bookings" icon={Calendar} label="Mentorships" badge={bookings.filter((b:any) => b.status === 'Pending').length} />
          <SidebarItem id="students" icon={Users} label="Students" />
          <SidebarItem id="teachers" icon={GraduationCap} label="Evaluators" />
          <SidebarItem id="tests" icon={FileText} label="Test Series" />
          <SidebarItem id="library" icon={Library} label="Library" />
        </nav>
        <div className="pt-6 border-t border-white/10 space-y-2">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 text-sm font-bold hover:text-white transition-colors"><ExternalLink size={16} /> Live View</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
             <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab}</h2>
             <p className="text-xs text-slate-400 mt-1 font-bold">Platform Management System.</p>
          </div>
          {['students', 'teachers', 'library', 'tests', 'history'].includes(activeTab) && (
             <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
          )}
        </header>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
            <Loader2 className="animate-spin" size={40} /><p className="font-bold">Fetching latest data...</p>
          </div>
        ) : (
          <div className="animate-fade-up">
            {activeTab === 'teachers' && (
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50">
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Evaluator Name</th>
                          <th className="px-6 py-4">Specialization</th>
                          <th className="px-6 py-4">Checking Load</th>
                          <th className="px-6 py-4 text-right">Performance</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {teachers.filter((t:any) => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((t: any) => {
                          const teacherSubs = submissions.filter(sub => sub.evaluatorId === t.id);
                          return (
                            <tr key={t.id} className="hover:bg-slate-50/50">
                               <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-brand-dark">{t.name}</p>
                                  <p className="text-[10px] text-slate-400">{t.email}</p>
                               </td>
                               <td className="px-6 py-4">
                                 <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">{t.subject?.split(':')[0] || 'General'}</span>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     <span className="text-xs font-bold text-brand-dark">{teacherSubs.length}</span>
                                     <span className="text-[9px] font-black text-slate-300 uppercase">Copies</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => setSelectedTeacher({ ...t, history: teacherSubs })} 
                                    className="px-3 py-1.5 text-brand-orange bg-brand-orange/5 hover:bg-brand-orange hover:text-white transition-all rounded-xl flex items-center gap-1 text-[10px] font-black uppercase"
                                  >
                                    <TrendingUp size={14} /> Performance Insight
                                  </button>
                                  <button onClick={() => handleDelete('teachers', t.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                               </td>
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
               </div>
            )}

            {activeTab === 'approvals' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-brand-dark">Evaluation Approval Queue</h3>
                    <p className="text-xs text-slate-400">Review teacher evaluations before releasing to students.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-4">Student & Paper</th>
                            <th className="px-8 py-4">Evaluator</th>
                            <th className="px-8 py-4">Marks Given</th>
                            <th className="px-8 py-4 text-right">Approval Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {submissions.filter(s => s.status === 'Review').map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50/50">
                                <td className="px-8 py-5">
                                    <p className="text-sm font-bold text-brand-dark">{sub.studentName}</p>
                                    <p className="text-[10px] text-brand-primary font-bold">{sub.testTitle}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-medium text-slate-500">{sub.evaluatorName}</span>
                                </td>
                                <td className="px-8 py-5 font-black text-brand-dark">{sub.marks}</td>
                                <td className="px-8 py-5 text-right flex justify-end gap-2">
                                    <button onClick={() => handleApprovalAction(sub.id, 'Approve')} className="px-3 py-1.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-green-600 shadow-lg shadow-green-500/20">Finalize</button>
                                    <button onClick={() => {
                                        const feedback = prompt("Enter Rejection Feedback for Teacher:");
                                        if(feedback) { setRejectionFeedback(feedback); handleApprovalAction(sub.id, 'Reject'); }
                                    }} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Reject</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {submissions.filter(s => s.status === 'Review').length === 0 && (
                  <div className="py-24 text-center text-slate-300 font-bold italic">No submissions pending approval.</div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h3 className="font-bold text-brand-dark">Master Evaluation Log</h3>
                      <p className="text-xs text-slate-400">Live monitoring of all checked papers across the platform.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Live Sync:</span>
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-4">Student</th>
                            <th className="px-8 py-4">Paper</th>
                            <th className="px-8 py-4">Evaluator</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-right">Preview Results</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {submissions.filter(s => 
                            s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (s.evaluatorName && s.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()))
                        ).map((h: any) => (
                           <tr key={h.id} className="hover:bg-slate-50/50 group">
                              <td className="px-8 py-5">
                                 <p className="text-sm font-bold text-brand-dark">{h.studentName}</p>
                              </td>
                              <td className="px-8 py-5">
                                 <p className="text-[10px] text-brand-primary font-bold">{h.testTitle}</p>
                              </td>
                              <td className="px-8 py-5">
                                 <span className="text-xs font-medium text-slate-500">{h.evaluatorName || '--'}</span>
                              </td>
                              <td className="px-8 py-5">
                                 <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                   h.status === 'Evaluated' ? 'bg-green-100 text-green-600' : 
                                   h.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                                   h.status === 'Review' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'
                                 }`}>
                                   {h.status}
                                 </span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 {h.evaluatedSheetUrl && (
                                   <button onClick={() => setViewingPdf({url: h.evaluatedSheetUrl, title: `Final: ${h.studentName}`})} className="p-2 bg-slate-50 text-slate-300 hover:text-brand-primary rounded-xl transition-all"><FileText size={16}/></button>
                                 )}
                              </td>
                           </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            )}

            {activeTab === 'students' && (
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50">
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Plan Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {students.filter((s:any) => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((s: any) => {
                          const studentSubs = submissions.filter(sub => sub.studentId === s.id && sub.status === 'Evaluated');
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/50">
                               <td className="px-6 py-4">
                                  <p className="text-sm font-bold text-brand-dark">{s.name}</p>
                                  <p className="text-[10px] text-slate-400">{s.email}</p>
                               </td>
                               <td className="px-6 py-4 text-sm font-medium">{s.course}</td>
                               <td className="px-6 py-4">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.planStatus === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{s.planStatus}</span>
                               </td>
                               <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => setSelectedStudent({ ...s, evaluatedSubmissions: studentSubs })} 
                                    className="px-3 py-1.5 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white transition-all rounded-xl flex items-center gap-1 text-[10px] font-black uppercase"
                                  >
                                    <TrendingUp size={14} /> Insight
                                  </button>
                                  <button onClick={() => handleDelete('students', s.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                               </td>
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
               </div>
            )}

            {activeTab === 'bookings' && (
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((book) => (
                  <div key={book.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary"><Calendar size={24}/></div>
                      <div>
                        <h4 className="font-bold text-brand-dark">{book.studentName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Requested Mentor: {book.mentorName}</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                       <p className="text-sm font-bold text-brand-dark flex items-center justify-center md:justify-start gap-2"><Clock size={14}/> {book.slot} • {book.date}</p>
                       <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-1">Reason: {book.reason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <a href={`tel:${book.studentPhone}`} className="p-3 bg-slate-50 text-brand-dark rounded-xl hover:bg-brand-primary hover:text-white transition-all"><Phone size={18}/></a>
                       <div className="flex flex-col gap-1">
                          <button onClick={() => handleBookingStatus(book.id, 'Confirmed')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${book.status === 'Confirmed' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white'}`}>Confirm</button>
                          <button onClick={() => handleBookingStatus(book.id, 'Completed')} className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all">Done</button>
                       </div>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && <div className="text-center py-20 text-slate-300 italic">No mentorship requests available.</div>}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Registered Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending Bookings', value: bookings.filter((b:any) => b.status === 'Pending').length, icon: Calendar, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
                    { label: 'Evaluation Queue', value: submissions.filter((s:any) => s.status === 'Review').length, icon: Gavel, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Verified Teachers', value: teachers.length, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4`}><stat.icon size={22} /></div>
                      <h3 className="text-3xl font-display font-black text-brand-dark">{stat.value}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {['library', 'tests', 'students', 'teachers'].includes(activeTab) && (
           <button onClick={() => setShowAddModal(true)} className="fixed bottom-10 right-10 w-16 h-16 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[40]"><Plus size={32}/></button>
        )}
      </main>

      {selectedTeacher && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={() => setSelectedTeacher(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[3rem] p-8 md:p-10 shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center"><GraduationCap size={32}/></div>
                <div>
                   <h3 className="text-3xl font-display font-bold text-brand-dark">{selectedTeacher.name}</h3>
                   <p className="text-xs text-brand-orange font-bold uppercase tracking-widest">{selectedTeacher.email} • Lifetime Performance</p>
                </div>
              </div>
              <button onClick={() => setSelectedTeacher(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-400"/></button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Checked</p>
                  <p className="text-2xl font-black text-brand-dark">{selectedTeacher.history.length}</p>
               </div>
               <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">Admin Approved</p>
                  <p className="text-2xl font-black text-green-600">{selectedTeacher.history.filter((h:any) => h.status === 'Evaluated').length}</p>
               </div>
               <div className="p-5 bg-brand-orange/5 rounded-2xl border border-brand-orange/10">
                  <p className="text-[9px] font-black text-brand-orange uppercase tracking-widest mb-1">Pending Review</p>
                  <p className="text-2xl font-black text-brand-orange">{selectedTeacher.history.filter((h:any) => h.status === 'Review').length}</p>
               </div>
               <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">Rejected/Corrections</p>
                  <p className="text-2xl font-black text-red-600">{selectedTeacher.history.filter((h:any) => h.status === 'Rejected').length}</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-brand-dark p-8 rounded-[2rem] text-white">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold flex items-center gap-2 text-sm"><BarChart3 size={16} className="text-brand-orange"/> Output Velocity</h3>
                        <span className="text-[9px] font-black opacity-40 uppercase">Daily Record</span>
                    </div>
                    <div className="space-y-4">
                        {(() => {
                           const dateMap: Record<string, number> = {};
                           selectedTeacher.history.forEach((s: any) => {
                             if(s.evaluatedAt) {
                               const date = new Date(s.evaluatedAt).toLocaleDateString();
                               dateMap[date] = (dateMap[date] || 0) + 1;
                             }
                           });
                           const sortedDays = Object.entries(dateMap).sort((a,b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).slice(0, 5);
                           if(sortedDays.length === 0) return <p className="text-center py-6 opacity-30 italic text-xs">No activity record found.</p>;
                           return sortedDays.map(([date, count], i) => (
                             <div key={i} className="space-y-1.5">
                               <div className="flex justify-between text-[10px] font-bold">
                                 <span>{date}</span>
                                 <span className="text-brand-orange">{count} Copies</span>
                               </div>
                               <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-brand-orange rounded-full" style={{ width: `${Math.min(100, (count/20)*100)}%` }}></div>
                               </div>
                             </div>
                           ));
                        })()}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                           <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
                           <circle cx="18" cy="18" r="16" fill="none" className="stroke-brand-orange" strokeWidth="3" strokeDasharray={`${selectedTeacher.history.length > 0 ? (selectedTeacher.history.filter((h:any)=>h.status==='Evaluated').length / selectedTeacher.history.length) * 100 : 0}, 100`} strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-sm font-black text-brand-dark">{selectedTeacher.history.length > 0 ? Math.round((selectedTeacher.history.filter((h:any)=>h.status==='Evaluated').length / selectedTeacher.history.length) * 100) : 0}%</span>
                    </div>
                    <h4 className="font-bold text-sm text-brand-dark">Quality Score</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Based on Admin approvals</p>
                </div>
            </div>

            <div className="space-y-4">
               <h4 className="font-bold text-brand-dark flex items-center gap-2 px-2"><HistoryIcon className="text-brand-orange" size={18}/> Detailed Evaluation Archive</h4>
               <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50">
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="px-6 py-4">Student & Paper</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Marks</th>
                           <th className="px-6 py-4 text-right">Preview</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {selectedTeacher.history.map((h:any) => (
                           <tr key={h.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4">
                                 <p className="text-sm font-bold text-brand-dark">{h.studentName}</p>
                                 <p className="text-[10px] text-slate-400 font-bold">{h.testTitle}</p>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${h.status === 'Evaluated' ? 'bg-green-100 text-green-600' : h.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-brand-orange'}`}>{h.status}</span>
                              </td>
                              <td className="px-6 py-4 font-black text-brand-dark text-sm">{h.marks}</td>
                              <td className="px-6 py-4 text-right">
                                 <button onClick={() => setViewingPdf({ url: h.evaluatedSheetUrl, title: `Evaluated: ${h.studentName}` })} className="p-2 text-slate-300 hover:text-brand-orange transition-colors"><FileText size={16}/></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-lg" onClick={() => !isProcessing && setShowAddModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-fade-up">
            <h3 className="text-2xl font-display font-bold text-brand-dark mb-6">Create New {activeTab.slice(0, -1)}</h3>
            <form onSubmit={handleAddEntry} className="space-y-4">
               <div className="flex gap-4 mt-8">
                 <Button variant="outline" type="button" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
                 <Button variant="primary" type="submit" fullWidth disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm & Add'}
                 </Button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
