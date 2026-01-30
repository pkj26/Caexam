import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Trash2, LogOut, 
  LayoutDashboard, Settings, ExternalLink, 
  Plus, Edit2, FileText, Library, 
  Database, Eye, CheckCircle2, 
  Calendar, GraduationCap, Gavel,
  Check, X, Tag, Loader2, Upload, BookOpen,
  TrendingUp, BarChart3, ChevronRight, XCircle, Target
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

type TabType = 'dashboard' | 'students' | 'teachers' | 'approvals' | 'tests' | 'library' | 'plans' | 'settings';

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

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

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

    return () => {
      unsubStudents(); unsubTeachers(); unsubTests(); unsubMaterials(); unsubSubmissions();
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

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setSearchTerm(''); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <div className="flex items-center gap-3"><Icon size={18} /> {label}</div>
      {badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
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
          <SidebarItem id="students" icon={Users} label="Students" />
          <SidebarItem id="teachers" icon={GraduationCap} label="Evaluators" />
          <SidebarItem id="tests" icon={FileText} label="Test Series" />
          <SidebarItem id="library" icon={Library} label="Library" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />
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
          {['students', 'teachers', 'library', 'tests'].includes(activeTab) && (
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

            {/* Default Dashboard Stats */}
            {activeTab === 'dashboard' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Registered Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Evaluation Queue', value: submissions.filter((s:any) => s.status === 'Review').length, icon: Gavel, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Verified Teachers', value: teachers.length, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Tests Available', value: tests.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4`}><stat.icon size={22} /></div>
                      <h3 className="text-3xl font-display font-black text-brand-dark">{stat.value}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
              </div>
            )}
            
            {/* Library View */}
            {activeTab === 'library' && (
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materials.map((m: any) => (
                     <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group h-full">
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><BookOpen size={20} /></div>
                           <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{m.type}</span>
                        </div>
                        <h4 className="font-bold text-brand-dark mb-1 flex-1">{m.title}</h4>
                        <p className="text-[10px] text-brand-primary font-bold mb-4">{m.subject}</p>
                        <div className="flex gap-2">
                           <button onClick={() => setViewingPdf({ url: m.pdfLink, title: m.title })} className="flex-1 py-2 bg-slate-50 text-brand-dark rounded-xl text-[10px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all">Preview</button>
                           <button onClick={() => handleDelete('materials', m.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
          </div>
        )}

        {/* Global Action Button */}
        {['library', 'tests', 'students'].includes(activeTab) && (
           <button onClick={() => setShowAddModal(true)} className="fixed bottom-10 right-10 w-16 h-16 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[40]"><Plus size={32}/></button>
        )}
      </main>

      {/* Student Performance Insight Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-brand-dark">{selectedStudent.name}</h3>
                <p className="text-xs text-brand-primary font-bold uppercase tracking-widest">{selectedStudent.course} • Active Profile</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle size={24} className="text-slate-400"/></button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Exams</p>
                 <p className="text-xl font-bold text-brand-dark">{selectedStudent.evaluatedSubmissions.length}</p>
              </div>
              <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                 <p className="text-[10px] font-black text-brand-primary uppercase mb-1">Avg Accuracy</p>
                 <p className="text-xl font-bold text-brand-primary">
                    {selectedStudent.evaluatedSubmissions.length > 0 
                      ? `${Math.round(selectedStudent.evaluatedSubmissions.reduce((acc: number, curr: any) => {
                          const obtained = parseFloat(curr.marks.split('/')[0]) || 0;
                          const total = parseFloat(curr.marks.split('/')[1]) || 100;
                          return acc + (obtained / total * 100);
                        }, 0) / selectedStudent.evaluatedSubmissions.length)}%`
                      : 'N/A'}
                 </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                 <p className="text-sm font-bold text-brand-dark capitalize">{selectedStudent.planStatus}</p>
              </div>
            </div>

            <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2 px-2"><Target size={16} className="text-brand-orange"/> Checked Sheets History</h4>
            <div className="space-y-3 px-2">
              {selectedStudent.evaluatedSubmissions.map((sub: any) => (
                 <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm border border-slate-100"><FileText size={18}/></div>
                       <div>
                          <p className="text-sm font-bold text-brand-dark">{sub.testTitle}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Evaluated by CA Ranker</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-brand-primary">{sub.marks}</p>
                       <button onClick={() => setViewingPdf({url: sub.evaluatedSheetUrl, title: sub.testTitle})} className="text-[9px] font-black uppercase text-brand-primary/60 hover:text-brand-primary mt-1">Check Feedback</button>
                    </div>
                 </div>
              ))}
              {selectedStudent.evaluatedSubmissions.length === 0 && <div className="text-center py-10 text-slate-300 italic text-sm">No evaluation records found.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Add Entry Modal Logic remains same but styled for consistency */}
      {showAddModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-fade-up">
               <h3 className="text-2xl font-display font-bold text-brand-dark mb-6">Create New Record</h3>
               <form onSubmit={handleAddEntry} className="space-y-4">
                  {['tests', 'library'].includes(activeTab) ? (
                     <>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Level</label>
                              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" value={newEntry.level} onChange={e => handleLevelChange(e.target.value)}>
                                 <option>CA Final</option><option>CA Inter</option><option>CA Foundation</option>
                              </select>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Access</label>
                              <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" value={newEntry.accessType} onChange={e => setNewEntry({...newEntry, accessType: e.target.value})}>
                                 <option value="Premium">Premium</option><option value="Free">Free (Trial)</option>
                              </select>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                           <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold" value={newEntry.subject} onChange={e => setNewEntry({...newEntry, subject: e.target.value})}>
                              {LEVEL_SUBJECTS[newEntry.level].map((subj, i) => <option key={i} value={subj}>{subj}</option>)}
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Title</label>
                           <input placeholder="e.g. Audit Full Syllabus" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required value={newEntry.title} onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">PDF Document</label>
                           <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-brand-primary transition-colors cursor-pointer group">
                              <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                              <Upload className="text-slate-300 group-hover:text-brand-primary" size={32} />
                              <span className="text-xs font-bold text-slate-500">{selectedFile ? selectedFile.name : 'Select or Drop PDF'}</span>
                           </div>
                        </div>
                        <Button type="submit" fullWidth disabled={isProcessing}>{isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm & Save'}</Button>
                     </>
                  ) : (
                     <>
                        <input placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, name: e.target.value})} />
                        <input placeholder="Email" type="email" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, email: e.target.value})} />
                        <Button type="submit" fullWidth disabled={isProcessing}>Enroll Student</Button>
                     </>
                  )}
               </form>
            </div>
         </div>
      )}
    </div>
  );
};