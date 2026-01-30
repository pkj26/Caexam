import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Trash2, LogOut, 
  LayoutDashboard, Settings, ExternalLink, 
  Plus, Edit2, FileText, Library, 
  UploadCloud, Database, Eye, CheckCircle2, 
  ClipboardCheck, Calendar, GraduationCap, Gavel,
  Check, X, Save, Filter, AlertCircle, Info,
  Layers
} from 'lucide-react';
import { Button } from './Button';
import { PDFViewer } from './PDFViewer';

interface AdminPanelProps {
  plans: any[];
  onUpdatePlans: (plans: any[]) => void;
  onLogout: () => void;
  onBack: () => void;
}

type TabType = 'dashboard' | 'students' | 'teachers' | 'approvals' | 'tests' | 'library' | 'plans' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({ plans, onUpdatePlans, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- PERSISTENT DEMO STATE ---
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('ca_demo_students');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', course: 'CA Final', planStatus: 'Active', joinDate: '2024-01-15' },
      { id: '2', name: 'Priya Verma', email: 'priya@example.com', phone: '8877665544', course: 'CA Inter', planStatus: 'Expired', joinDate: '2023-11-10' },
      { id: '3', name: 'Amit Singh', email: 'amit@example.com', phone: '9988776655', course: 'CA Final', planStatus: 'Active', joinDate: '2024-01-20' },
    ];
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('ca_demo_teachers');
    return saved ? JSON.parse(saved) : [
      { id: 't1', name: 'CA Rohit Sethi', email: 'rohit@ca.com', subject: 'Audit', phone: '9998887776', joinDate: '2023-05-10' },
      { id: 't2', name: 'CA Neha Gupta', email: 'neha@ca.com', subject: 'Taxation', phone: '9991112223', joinDate: '2023-06-15' },
    ];
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('ca_demo_submissions');
    return saved ? JSON.parse(saved) : [
      { id: 'sub1', studentName: 'Rahul Sharma', testTitle: 'Audit Mock Test 1', status: 'Review', submittedAt: '2024-01-26', marks: '72/100', evaluatorName: 'CA Rohit Sethi', evaluatedSheetUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'sub2', studentName: 'Amit Singh', testTitle: 'Audit Mock Test 1', status: 'Pending', submittedAt: '2024-01-27', marks: null, evaluatorName: null },
    ];
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('ca_demo_materials');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', title: 'GST Revision Notes', type: 'Short Notes', subject: 'Taxation', pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', date: '2024-01-20' },
    ];
  });

  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem('ca_demo_tests');
    return saved ? JSON.parse(saved) : [
      { id: 'ts1', title: 'Audit Mock Test 1', subject: 'Audit', level: 'CA Final', status: 'Live', accessType: 'Premium', date: '2024-01-25', pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'ts2', title: 'Law Chapter-wise 1', subject: 'Law', level: 'CA Inter', status: 'Live', accessType: 'Free', date: '2024-01-28', pdfLink: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ];
  });

  // Sync states to LocalStorage
  useEffect(() => {
    localStorage.setItem('ca_demo_students', JSON.stringify(students));
    localStorage.setItem('ca_demo_teachers', JSON.stringify(teachers));
    localStorage.setItem('ca_demo_submissions', JSON.stringify(submissions));
    localStorage.setItem('ca_demo_materials', JSON.stringify(materials));
    localStorage.setItem('ca_demo_tests', JSON.stringify(tests));
  }, [students, teachers, submissions, materials, tests]);

  // --- MODAL & FORM STATES ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<any>({ 
    name: '', email: '', phone: '', course: 'CA Final', 
    subject: 'Audit', title: '', type: 'Short Notes', 
    level: 'CA Final', accessType: 'Premium', pdfLink: '' 
  });

  // --- HANDLERS ---
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString();
    const date = new Date().toISOString().split('T')[0];

    if (activeTab === 'students') {
      setStudents([{ ...newEntry, id, planStatus: 'Active', joinDate: date }, ...students]);
    } else if (activeTab === 'teachers') {
      setTeachers([{ ...newEntry, id, joinDate: date }, ...teachers]);
    } else if (activeTab === 'library') {
      setMaterials([{ ...newEntry, id, date, pdfLink: newEntry.pdfLink || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }, ...materials]);
    } else if (activeTab === 'tests') {
      setTests([{ ...newEntry, id, date, status: 'Live', pdfLink: newEntry.pdfLink || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }, ...tests]);
    }
    
    setShowAddModal(false);
    setNewEntry({ 
      name: '', email: '', phone: '', course: 'CA Final', 
      subject: 'Audit', title: '', type: 'Short Notes', 
      level: 'CA Final', accessType: 'Premium', pdfLink: '' 
    });
  };

  const handleApproveResult = (id: string) => {
    setSubmissions(submissions.map((s: any) => s.id === id ? { ...s, status: 'Evaluated' } : s));
    alert("Result approved and published to student dashboard!");
  };

  const handleDelete = (type: string, id: string) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    if (type === 'student') setStudents(students.filter((s: any) => s.id !== id));
    if (type === 'teacher') setTeachers(teachers.filter((t: any) => t.id !== id));
    if (type === 'material') setMaterials(materials.filter((m: any) => m.id !== id));
    if (type === 'test') setTests(tests.filter((t: any) => t.id !== id));
  };

  const handlePlanUpdate = (index: number, field: string, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    onUpdatePlans(updated);
  };

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setSearchTerm(''); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} /> {label}
      </div>
      {badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {viewingPdf && <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />}

      {/* Sidebar */}
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
          <SidebarItem id="plans" icon={Edit2} label="Manage Plans" />
          <SidebarItem id="tests" icon={FileText} label="Test Series" />
          <SidebarItem id="library" icon={Library} label="Library" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/50 text-sm font-bold hover:text-white transition-colors"><ExternalLink size={16} /> Live View</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"><LogOut size={16} /> Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                 <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab}</h2>
                 <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Database size={10} /> Local Demo Mode</span>
            </div>
            <p className="text-brand-dark/40 text-sm">Real-time management dashboard.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             {['students', 'teachers', 'library', 'tests'].includes(activeTab) && (
               <div className="relative flex-1 md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Quick search..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
             )}
             <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Calendar size={14} className="text-brand-primary" />
                <span className="text-xs font-bold text-brand-dark">{new Date().toDateString()}</span>
             </div>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-up">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Pending Approvals', value: submissions.filter((s:any) => s.status === 'Review').length, icon: Gavel, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Active Teachers', value: teachers.length, icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Test Repository', value: tests.length, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-4`}><stat.icon size={22} /></div>
                    <h3 className="text-3xl font-display font-black text-brand-dark">{stat.value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-brand-dark">Latest Submissions</h3>
                  <button onClick={() => setActiveTab('approvals')} className="text-xs font-bold text-brand-primary hover:underline">Manage All</button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <th className="px-6 py-4">Student</th>
                           <th className="px-6 py-4">Test Title</th>
                           <th className="px-6 py-4">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {submissions.slice(0, 5).map((sub: any) => (
                           <tr key={sub.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 text-sm font-bold text-brand-dark">{sub.studentName}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{sub.testTitle}</td>
                              <td className="px-6 py-4">
                                 <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${sub.status === 'Evaluated' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {sub.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {/* TESTS TAB - FULLY FUNCTIONAL */}
        {activeTab === 'tests' && (
           <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-brand-dark">Test Series Repository</h3>
                 <Button onClick={() => setShowAddModal(true)} variant="secondary" className="!py-2 !px-5 text-xs !bg-brand-primary">
                    <Plus size={16} className="mr-2" /> Create New Test
                 </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {tests.filter((t:any) => t.title.toLowerCase().includes(searchTerm.toLowerCase())).map((t: any) => (
                    <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-xl transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary"><FileText size={20} /></div>
                          <div className="flex flex-col items-end gap-1">
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${t.accessType === 'Free' ? 'bg-blue-100 text-blue-600' : 'bg-brand-primary text-white'}`}>{t.accessType}</span>
                             <span className="text-[10px] text-slate-400 font-bold">{t.date}</span>
                          </div>
                       </div>
                       <h4 className="font-bold text-brand-dark mb-1 flex-1">{t.title}</h4>
                       <div className="flex gap-2 mb-6">
                          <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded">{t.level}</span>
                          <span className="text-[9px] font-black uppercase px-2 py-1 bg-brand-primary/5 text-brand-primary rounded">{t.subject}</span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setViewingPdf({ url: t.pdfLink, title: t.title })} className="flex-1 py-2 bg-slate-50 text-brand-dark rounded-xl text-[10px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all">Preview Paper</button>
                          <button onClick={() => handleDelete('test', t.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </div>
                 ))}
              </div>
              {tests.length === 0 && <div className="p-20 text-center text-slate-400 font-bold">No tests added yet. Click 'Create New Test' to start.</div>}
           </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
           <div className="animate-fade-up">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-xl font-bold text-brand-dark">Review Queue</h3>
                    <p className="text-xs text-brand-dark/40 mt-1">Teachers have evaluated these. Approve to publish to student portal.</p>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50">
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <th className="px-8 py-5">Student & Paper</th>
                             <th className="px-8 py-5">Evaluator</th>
                             <th className="px-8 py-5 text-center">Marks</th>
                             <th className="px-8 py-5 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {submissions.filter((s:any) => s.status === 'Review').map((sub: any) => (
                             <tr key={sub.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-8 py-5">
                                   <p className="text-sm font-bold text-brand-dark">{sub.studentName}</p>
                                   <p className="text-[10px] text-brand-primary font-bold uppercase mt-0.5">{sub.testTitle}</p>
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-500 font-medium">{sub.evaluatorName}</td>
                                <td className="px-8 py-5 text-center">
                                   <span className="text-lg font-display font-black text-brand-dark">{sub.marks}</span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <div className="flex justify-end gap-2">
                                      <button onClick={() => setViewingPdf({ url: sub.evaluatedSheetUrl, title: 'Checked Copy' })} className="p-2 text-slate-400 hover:text-brand-primary"><Eye size={18} /></button>
                                      <button onClick={() => handleApproveResult(sub.id)} className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 flex items-center gap-2">
                                         <Check size={14} /> Approve
                                      </button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {/* PLANS TAB */}
        {activeTab === 'plans' && (
           <div className="animate-fade-up space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                 {plans.map((plan, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group">
                       <h4 className="text-xl font-display font-black text-brand-dark mb-6">{plan.name}</h4>
                       
                       <div className="space-y-4 mb-8">
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Base Price (₹)</label>
                             <input 
                               type="number" 
                               value={plan.priceBase}
                               onChange={(e) => handlePlanUpdate(idx, 'priceBase', parseInt(e.target.value))}
                               className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-lg font-black text-brand-primary outline-none"
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tagline</label>
                             <input 
                               type="text" 
                               value={plan.desc}
                               onChange={(e) => handlePlanUpdate(idx, 'desc', e.target.value)}
                               className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500 outline-none"
                             />
                          </div>
                       </div>
                       <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 px-3 py-2 rounded-xl">
                          <CheckCircle2 size={12} /> Syncing with Front Page
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
           <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-brand-dark">Student Directory</h3>
                 <Button onClick={() => setShowAddModal(true)} className="!py-2 !px-5 text-xs">
                    <UserPlus size={16} className="mr-2" /> Add Student
                 </Button>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50">
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {students.filter((s:any) => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((s: any) => (
                          <tr key={s.id} className="hover:bg-slate-50/50">
                             <td className="px-6 py-4">
                                <p className="text-sm font-bold text-brand-dark">{s.name}</p>
                                <p className="text-[10px] text-slate-400">{s.email}</p>
                             </td>
                             <td className="px-6 py-4 text-sm font-medium">{s.course}</td>
                             <td className="px-6 py-4">
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${s.planStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                   {s.planStatus}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDelete('student', s.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === 'library' && (
           <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-brand-dark">Material Library</h3>
                 <Button onClick={() => setShowAddModal(true)} variant="secondary" className="!py-2 !px-5 text-xs !bg-brand-dark">
                    <Plus size={16} className="mr-2" /> Upload PDF
                 </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {materials.filter((m:any) => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map((m: any) => (
                    <div key={m.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col group">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary"><Library size={20} /></div>
                          <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded">{m.type}</span>
                       </div>
                       <h4 className="font-bold text-brand-dark mb-1 flex-1">{m.title}</h4>
                       <p className="text-[10px] font-black text-brand-primary uppercase mb-6 tracking-wider">{m.subject}</p>
                       <div className="flex gap-2">
                          <button onClick={() => setViewingPdf({ url: m.pdfLink, title: m.title })} className="flex-1 py-2 bg-slate-50 text-brand-dark rounded-xl text-[10px] font-black uppercase hover:bg-brand-primary hover:text-white transition-all">Preview</button>
                          <button onClick={() => handleDelete('material', m.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>

      {/* MODAL - ADD ENTRY */}
      {showAddModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-up">
               <h3 className="text-2xl font-display font-bold text-brand-dark mb-6">Add New {activeTab === 'students' ? 'Student' : activeTab === 'teachers' ? 'Evaluator' : activeTab === 'tests' ? 'Mock Test' : 'Material'}</h3>
               
               <form onSubmit={handleAddEntry} className="space-y-4">
                  {activeTab === 'tests' ? (
                     <>
                        <input placeholder="Test Title (e.g. Audit Mock 1)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                        <div className="flex gap-2">
                          <select className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, level: e.target.value})}>
                             <option>CA Final</option><option>CA Inter</option><option>CA Foundation</option>
                          </select>
                          <select className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, subject: e.target.value})}>
                             <option>Audit</option><option>Taxation</option><option>Law</option><option>Accounts</option>
                          </select>
                        </div>
                        <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, accessType: e.target.value})}>
                           <option>Premium</option><option>Free</option>
                        </select>
                        <input placeholder="PDF URL (optional)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, pdfLink: e.target.value})} />
                        <Button type="submit" fullWidth>Launch Test Series</Button>
                     </>
                  ) : activeTab === 'library' ? (
                     <>
                        <input placeholder="Title" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, title: e.target.value})} />
                        <div className="flex gap-2">
                          <select className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, subject: e.target.value})}>
                             <option>Audit</option><option>Taxation</option><option>Law</option>
                          </select>
                          <select className="flex-1 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, type: e.target.value})}>
                             <option>Short Notes</option><option>Old Paper</option>
                          </select>
                        </div>
                        <input placeholder="PDF URL (optional)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, pdfLink: e.target.value})} />
                        <Button type="submit" fullWidth>Confirm Upload</Button>
                     </>
                  ) : (
                     <>
                        <input placeholder="Full Name" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, name: e.target.value})} />
                        <input placeholder="Email" type="email" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, email: e.target.value})} />
                        {activeTab === 'students' ? (
                           <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" onChange={e => setNewEntry({...newEntry, course: e.target.value})}>
                              <option>CA Final</option><option>CA Inter</option>
                           </select>
                        ) : (
                           <input placeholder="Subject (e.g. Audit)" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" required onChange={e => setNewEntry({...newEntry, subject: e.target.value})} />
                        )}
                        <Button type="submit" fullWidth>Add Record</Button>
                     </>
                  )}
               </form>
            </div>
         </div>
      )}
    </div>
  );
};