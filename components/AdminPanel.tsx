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
  CheckCircle, AlertCircle, FileCheck, Menu, Download, UploadCloud
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

type TabType = 'dashboard' | 'students' | 'teachers' | 'approvals' | 'tests' | 'library' | 'bookings';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Rejection handling
  const [rejectionId, setRejectionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [newEntry, setNewEntry] = useState<any>({ 
    name: '', email: '', phone: '', course: 'CA Final', 
    subject: LEVEL_SUBJECTS['CA Final'][0], title: '', type: 'Short Notes', 
    level: 'CA Final', accessType: 'Premium', pdfLink: '', topic: '' 
  });

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
    });
    const unsubBookings = onSnapshot(query(collection(db, "bookings"), orderBy("requestedAt", "desc")), (snap) => {
      setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubStudents(); unsubTeachers(); unsubTests(); unsubMaterials(); unsubSubmissions(); unsubBookings();
    };
  }, []);

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
      // Reset form
      setNewEntry({ name: '', email: '', phone: '', course: 'CA Final', subject: LEVEL_SUBJECTS['CA Final'][0], title: '', type: 'Short Notes', level: 'CA Final', accessType: 'Premium', pdfLink: '', topic: '' });
    } catch (err) {
      alert("Action failed. Check console.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm(`Delete this record?`)) return;
    try { await deleteDoc(doc(db, collectionName, id)); } catch (err) { alert("Delete failed."); }
  };

  const handleApprovalAction = async (id: string, action: 'Approve' | 'Reject') => {
    try {
      if (action === 'Approve') {
        await updateDoc(doc(db, "submissions", id), { status: 'Evaluated' });
      } else {
        if (!rejectionReason) return alert("Please provide a reason for rejection.");
        await updateDoc(doc(db, "submissions", id), { 
          status: 'Rejected',
          feedback: rejectionReason 
        });
        setRejectionId(null);
        setRejectionReason("");
      }
    } catch (e) {
      alert("Update failed.");
    }
  };

  const handleBookingStatus = async (id: string, status: string) => {
    try { await updateDoc(doc(db, "bookings", id), { status }); } catch (e) { alert("Update failed."); }
  };

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
      {badge ? <span className="bg-brand-orange text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none shrink-0
      `}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
           <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">AD</div>
           <div>
             <h1 className="text-white font-display font-bold leading-tight">exam<span className="text-brand-primary">.online</span></h1>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Admin Console</p>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400"><X size={24} /></button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
           <div className="text-[10px] font-black uppercase text-slate-600 px-4 py-2 mt-2">Main Menu</div>
           <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
           <SidebarItem id="approvals" icon={CheckCircle} label="Approvals" badge={submissions.filter(s => s.status === 'Review').length} />
           <SidebarItem id="bookings" icon={Calendar} label="Mentorship" badge={bookings.filter(b => b.status === 'Pending').length} />
           
           <div className="text-[10px] font-black uppercase text-slate-600 px-4 py-2 mt-4">Management</div>
           <SidebarItem id="students" icon={Users} label="Students" />
           <SidebarItem id="teachers" icon={GraduationCap} label="Evaluators" />
           <SidebarItem id="tests" icon={FileText} label="Test Series" />
           <SidebarItem id="library" icon={Library} label="Resources" />
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
           <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 text-sm font-bold hover:text-white transition-colors"><ExternalLink size={16}/> Visit Site</button>
           <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"><LogOut size={16}/> Secure Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Mobile Header */}
         <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-lg">AD</div>
               <span className="font-bold text-brand-dark">Admin Panel</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Menu size={24} /></button>
         </header>

         {/* Content Scroll Area */}
         <main className="flex-1 overflow-y-auto p-4 lg:p-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
               <div>
                  <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab}</h2>
                  <p className="text-slate-400 text-sm font-medium">Manage your platform efficiently.</p>
               </div>
               {['students', 'teachers', 'tests', 'library'].includes(activeTab) && (
                 <Button variant="primary" onClick={() => setShowAddModal(true)} className="shadow-lg">
                    <Plus size={18} className="mr-2" /> Add New
                 </Button>
               )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Loader2 size={40} className="animate-spin mb-4 text-brand-primary" />
                <p className="font-bold">Syncing Database...</p>
              </div>
            ) : (
              <div className="animate-fade-up">
                 {/* Dashboard Tab */}
                 {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {[
                         { label: 'Total Students', val: students.length, icon: Users, col: 'text-blue-600', bg: 'bg-blue-50' },
                         { label: 'Evaluators', val: teachers.length, icon: GraduationCap, col: 'text-purple-600', bg: 'bg-purple-50' },
                         { label: 'Pending Approvals', val: submissions.filter(s => s.status === 'Review').length, icon: CheckCircle2, col: 'text-orange-600', bg: 'bg-orange-50' },
                         { label: 'Total Revenue', val: '₹12.4L', icon: TrendingUp, col: 'text-green-600', bg: 'bg-green-50' },
                       ].map((stat, i) => (
                         <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.col} rounded-2xl flex items-center justify-center`}>
                               <stat.icon size={28} />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-brand-dark">{stat.val}</h3>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 )}

                 {/* Approvals Tab */}
                 {activeTab === 'approvals' && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                       <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="font-bold text-brand-dark">Evaluation Quality Check</h3>
                          <p className="text-xs text-slate-400">Approve or reject evaluations submitted by teachers.</p>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left min-w-[800px]">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                   <th className="px-6 py-4">Submission</th>
                                   <th className="px-6 py-4">Evaluator</th>
                                   <th className="px-6 py-4">Marks Given</th>
                                   <th className="px-6 py-4">Preview</th>
                                   <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {submissions.filter(s => s.status === 'Review').map(sub => (
                                   <tr key={sub.id} className="hover:bg-slate-50/50">
                                      <td className="px-6 py-4">
                                         <p className="text-sm font-bold text-brand-dark">{sub.studentName}</p>
                                         <p className="text-[10px] text-slate-400 uppercase">{sub.testTitle}</p>
                                      </td>
                                      <td className="px-6 py-4">
                                         <p className="text-xs font-bold text-brand-primary">{sub.evaluatorName}</p>
                                      </td>
                                      <td className="px-6 py-4 font-black text-brand-dark">{sub.marks}</td>
                                      <td className="px-6 py-4">
                                         <button onClick={() => setViewingPdf({ url: sub.evaluatedSheetUrl, title: "Evaluated Sheet" })} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold hover:bg-brand-primary hover:text-white transition-all">
                                            <Eye size={14} /> View Copy
                                         </button>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleApprovalAction(sub.id, 'Approve')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Check size={16} /></button>
                                            <button onClick={() => setRejectionId(sub.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><X size={16} /></button>
                                         </div>
                                         {rejectionId === sub.id && (
                                            <div className="mt-2 flex gap-2">
                                               <input type="text" placeholder="Reason..." className="px-2 py-1 text-xs border rounded bg-white" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                                               <button onClick={() => handleApprovalAction(sub.id, 'Reject')} className="text-[10px] bg-red-600 text-white px-2 rounded">Confirm</button>
                                            </div>
                                         )}
                                      </td>
                                   </tr>
                                ))}
                                {submissions.filter(s => s.status === 'Review').length === 0 && (
                                   <tr><td colSpan={5} className="text-center py-10 text-slate-400 italic">No pending approvals.</td></tr>
                                )}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {/* Students / Teachers / Tests Tables */}
                 {['students', 'teachers', 'tests', 'library', 'bookings'].includes(activeTab) && (
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                       <div className="overflow-x-auto">
                          <table className="w-full text-left min-w-[700px]">
                             <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                   <th className="px-6 py-4">Name / Title</th>
                                   <th className="px-6 py-4">Details</th>
                                   {activeTab === 'bookings' ? <th className="px-6 py-4">Status</th> : <th className="px-6 py-4">Date Added</th>}
                                   <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                                {(activeTab === 'students' ? students : activeTab === 'teachers' ? teachers : activeTab === 'tests' ? tests : activeTab === 'library' ? materials : bookings).map((item) => (
                                   <tr key={item.id} className="hover:bg-slate-50/50">
                                      <td className="px-6 py-4">
                                         <p className="text-sm font-bold text-brand-dark">{item.name || item.title || item.studentName}</p>
                                         <p className="text-[10px] text-slate-400 uppercase">{item.email || item.subject || item.type || item.mentorName}</p>
                                      </td>
                                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                                         {item.phone || item.level || (item.date + ' ' + item.slot) || '-'}
                                      </td>
                                      <td className="px-6 py-4">
                                         {activeTab === 'bookings' ? (
                                            <select 
                                              value={item.status} 
                                              onChange={(e) => handleBookingStatus(item.id, e.target.value)}
                                              className={`text-xs font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${item.status === 'Confirmed' ? 'text-green-600 bg-green-50' : item.status === 'Pending' ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'}`}
                                            >
                                               <option value="Pending">Pending</option>
                                               <option value="Confirmed">Confirm</option>
                                               <option value="Cancelled">Cancel</option>
                                            </select>
                                         ) : (
                                            <span className="text-xs text-slate-400">{item.joinDate || item.date || 'N/A'}</span>
                                         )}
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         <div className="flex items-center justify-end gap-2">
                                            {item.pdfLink && <button onClick={() => setViewingPdf({ url: item.pdfLink, title: item.title })} className="p-2 text-slate-400 hover:text-brand-primary"><Eye size={16}/></button>}
                                            <button onClick={() => handleDelete(activeTab === 'library' ? 'materials' : activeTab, item.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                         </div>
                                      </td>
                                   </tr>
                                ))}
                                {((activeTab === 'students' && students.length === 0) || (activeTab === 'teachers' && teachers.length === 0)) && (
                                   <tr><td colSpan={4} className="text-center py-10 text-slate-400 italic">No records found.</td></tr>
                                )}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}
              </div>
            )}
         </main>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-display font-bold text-brand-dark mb-6">Add New {activeTab.slice(0, -1)}</h3>
              <form onSubmit={handleAddEntry} className="space-y-4">
                 {/* Dynamic Form Fields based on activeTab */}
                 {(activeTab === 'students' || activeTab === 'teachers') && (
                   <>
                     <input required type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100 focus:border-brand-primary" value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})} />
                     <input required type="email" placeholder="Email Address" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100 focus:border-brand-primary" value={newEntry.email} onChange={e => setNewEntry({...newEntry, email: e.target.value})} />
                     <input required type="tel" placeholder="Phone Number" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100 focus:border-brand-primary" value={newEntry.phone} onChange={e => setNewEntry({...newEntry, phone: e.target.value})} />
                     <select className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100" value={newEntry.course} onChange={e => setNewEntry({...newEntry, course: e.target.value})}>
                        <option>CA Final</option><option>CA Inter</option><option>CA Foundation</option>
                     </select>
                   </>
                 )}

                 {(activeTab === 'tests' || activeTab === 'library') && (
                   <>
                     <input required type="text" placeholder="Title (e.g. Ind AS 115 Test)" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100 focus:border-brand-primary" value={newEntry.title} onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                     <div className="grid grid-cols-2 gap-4">
                        <select className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100" value={newEntry.level} onChange={e => setNewEntry({...newEntry, level: e.target.value, subject: LEVEL_SUBJECTS[e.target.value][0]})}>
                           {Object.keys(LEVEL_SUBJECTS).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-slate-100" value={newEntry.subject} onChange={e => setNewEntry({...newEntry, subject: e.target.value})}>
                           {LEVEL_SUBJECTS[newEntry.level].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                     <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="application/pdf" onChange={e => setSelectedFile(e.target.files?.[0] || null)} required />
                        <UploadCloud size={32} className="mx-auto text-brand-primary mb-2" />
                        <p className="text-xs font-bold text-slate-400">{selectedFile ? selectedFile.name : 'Click to Upload PDF'}</p>
                     </div>
                   </>
                 )}

                 <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button type="submit" variant="primary" fullWidth disabled={isProcessing}>
                       {isProcessing ? <Loader2 className="animate-spin" /> : 'Save Entry'}
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};