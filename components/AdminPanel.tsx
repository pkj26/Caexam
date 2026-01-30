import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Trash2, LogOut, 
  LayoutDashboard, CreditCard, Settings, 
  ExternalLink, Plus, Edit2, Lock, Unlock,
  FileText, RefreshCw, Library, 
  UploadCloud, Star, Loader2, Database, Link as LinkIcon,
  Eye, CheckCircle2, ClipboardCheck, Calendar, GraduationCap, Gavel
} from 'lucide-react';
import { Button } from './Button';
import { db, auth, storage, onAuthStateChanged, firebaseConfig } from '../firebaseConfig'; // Import Config
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, deleteApp } from 'firebase/app'; // For secondary app
import { getAuth, createUserWithEmailAndPassword, signOut as signOutSecondary } from 'firebase/auth'; // Specific auth imports
import { PDFViewer } from './PDFViewer';

interface AdminPanelProps {
  plans: any[];
  onUpdatePlans: (plans: any[]) => void;
  onLogout: () => void;
  onBack: () => void;
}

type TabType = 'dashboard' | 'students' | 'teachers' | 'approvals' | 'tests' | 'library' | 'evaluations' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({ plans, onUpdatePlans, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Data States
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]); 
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{url: string, title: string} | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Evaluation Upload State (Direct Admin Evaluation)
  const [evaluatingSubmissionId, setEvaluatingSubmissionId] = useState<string | null>(null);
  
  // Form States
  const [newStudent, setNewStudent] = useState({ 
    name: '', email: '', phone: '', course: 'CA Final', 
    plan: 'Detailed Test Series', planStatus: 'Active', password: '' 
  });

  const [newTeacher, setNewTeacher] = useState({
      name: '', email: '', subject: 'Audit', phone: '', password: ''
  });
  
  const [currentTest, setCurrentTest] = useState({ 
    id: '', subject: '', title: '', level: 'CA Final', status: 'Live', accessType: 'Premium', pdfLink: '' 
  });
  const [isEditingTest, setIsEditingTest] = useState(false);

  const [currentMaterial, setCurrentMaterial] = useState({
    id: '', title: '', type: 'Short Notes', subject: '', pdfLink: '', 
    rating: 4.8, ratingCount: '1.2k'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- FIREBASE DATA LISTENER ---
  useEffect(() => {
    let unsubStudents: (() => void) | undefined;
    let unsubTeachers: (() => void) | undefined;
    let unsubTests: (() => void) | undefined;
    let unsubMaterials: (() => void) | undefined;
    let unsubSubmissions: (() => void) | undefined;
    let unsubApprovals: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setLoading(true);

        const errorHandler = (error: any) => {
            console.error("Firestore Error:", error);
            setLoading(false);
        };

        try {
          unsubStudents = onSnapshot(collection(db, "students"), (snapshot) => {
            const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentList);
          }, errorHandler);

          unsubTeachers = onSnapshot(collection(db, "teachers"), (snapshot) => {
            const teacherList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeachers(teacherList);
          }, errorHandler);

          const qTests = query(collection(db, "tests"), orderBy("date", "desc"));
          unsubTests = onSnapshot(qTests, (snapshot) => {
            const testList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTests(testList);
          }, errorHandler);

          const qMaterials = query(collection(db, "materials"), orderBy("date", "desc"));
          unsubMaterials = onSnapshot(qMaterials, (snapshot) => {
            const matList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMaterials(matList);
          }, errorHandler);

          const qSubmissions = query(collection(db, "submissions"), orderBy("submittedAt", "desc"));
          unsubSubmissions = onSnapshot(qSubmissions, (snapshot) => {
             const subList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setSubmissions(subList);
             setLoading(false);
          }, errorHandler);

          // Approval Queue (Status == 'Review')
          const qApprovals = query(collection(db, "submissions"), where("status", "==", "Review"));
          unsubApprovals = onSnapshot(qApprovals, (snapshot) => {
              const approvalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setApprovals(approvalList);
          });

        } catch (e: any) {
          errorHandler(e);
        }

      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubStudents) unsubStudents();
      if (unsubTeachers) unsubTeachers();
      if (unsubTests) unsubTests();
      if (unsubMaterials) unsubMaterials();
      if (unsubSubmissions) unsubSubmissions();
      if (unsubApprovals) unsubApprovals();
    };
  }, []);

  // --- HELPER: CREATE USER WITHOUT LOGGING OUT ADMIN ---
  const createLiveAuthUser = async (email: string, pass: string) => {
    // 1. Initialize a secondary app instance
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    try {
        // 2. Create user on secondary app (doesn't affect current Admin session)
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
        // 3. Sign out the new user immediately from the secondary app to be safe
        await signOutSecondary(secondaryAuth);
        // 4. Delete the secondary app instance to clean up
        await deleteApp(secondaryApp);
        
        return userCredential.user.uid;
    } catch (e: any) {
        await deleteApp(secondaryApp); // Clean up even on error
        throw e;
    }
  };

  // --- ACTIONS ---

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus("Creating Live Account...");
    setUploading(true);

    try {
      // 1. Create Auth User
      const uid = await createLiveAuthUser(newStudent.email, newStudent.password || 'student123'); // Default pass if empty

      const date = new Date();
      date.setMonth(date.getMonth() + 6);
      const expiryDate = date.toISOString().split('T')[0];
      const joinDate = new Date().toISOString().split('T')[0];
      
      const studentData = { 
          ...newStudent, 
          id: uid, // Use real UID
          expiryDate, 
          joinDate, 
          progress: 0 
      };
      
      // Remove password from db object
      delete (studentData as any).password;

      // 2. Create Firestore Doc with same UID
      await setDoc(doc(db, "students", uid), studentData);
      
      alert('Student Account Created! Login active.');
      setShowAddStudentModal(false);
      setNewStudent({ name: '', email: '', phone: '', course: 'CA Final', plan: 'Detailed Test Series', planStatus: 'Active', password: '' });
    } catch (e: any) {
       alert("Error creating student: " + e.message);
    }
    setUploading(false);
    setUploadStatus('');
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
      e.preventDefault();
      setUploadStatus("Creating Live Account...");
      setUploading(true);

      try {
          // 1. Create Auth User
          const uid = await createLiveAuthUser(newTeacher.email, newTeacher.password || 'teacher123');

          const teacherData = { 
              ...newTeacher, 
              id: uid, // Use real UID
              role: 'teacher', 
              joinDate: new Date().toISOString().split('T')[0] 
          };

          // Remove password from db object
          delete (teacherData as any).password;

          // 2. Create Firestore Doc with same UID
          await setDoc(doc(db, "teachers", uid), teacherData);

          alert("Teacher Added! They can login now.");
          setShowAddTeacherModal(false);
          setNewTeacher({ name: '', email: '', subject: 'Audit', phone: '', password: '' });
      } catch (e: any) {
          alert("Error adding teacher: " + e.message);
      }
      setUploading(false);
      setUploadStatus('');
  };

  const handleDeleteTeacher = async (id: string) => {
      if(window.confirm('Delete this teacher? They will lose access immediately.')) {
          try {
            await deleteDoc(doc(db, "teachers", id));
            alert("Teacher data deleted. Access revoked.");
          } catch(e: any) {
            alert(e.message);
          }
      }
  };

  const handleApproveSubmission = async (submissionId: string) => {
      try {
          await updateDoc(doc(db, "submissions", submissionId), {
              status: 'Evaluated', // Visible to student
              approvedAt: new Date().toISOString()
          });
          alert("Result Approved! Student can now see it.");
      } catch (e: any) {
          alert("Error approving: " + e.message);
      }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student? Access will be revoked.')) {
      try {
        await deleteDoc(doc(db, "students", id));
        alert("Student data deleted. Access revoked.");
      } catch (e: any) {
        alert("Error deleting student: " + e.message);
      }
    }
  };

  const handleRenewPlan = async (studentId: string) => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    const newExpiry = date.toISOString().split('T')[0];
    try {
      const studentRef = doc(db, "students", studentId);
      await updateDoc(studentRef, { planStatus: 'Active', expiryDate: newExpiry });
      alert("Plan Renewed!");
    } catch (e: any) {
      alert("Error renewing plan: " + e.message);
    }
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus("Uploading PDF...");

    let downloadUrl = currentTest.pdfLink;

    if (selectedFile) {
        try {
            downloadUrl = await handleFileUpload(selectedFile);
        } catch (err: any) {
            setUploadStatus("Error uploading file");
            setUploading(false);
            return;
        }
    }

    const testPayload = {
      title: currentTest.title, 
      subject: currentTest.subject, 
      level: currentTest.level, 
      status: currentTest.status, 
      accessType: currentTest.accessType,
      date: new Date().toISOString().split('T')[0],
      pdfLink: downloadUrl || '#'
    };

    try {
      if (isEditingTest && currentTest.id) {
          await updateDoc(doc(db, "tests", currentTest.id), testPayload);
      } else {
          await addDoc(collection(db, "tests"), testPayload);
      }
      setShowTestModal(false);
      setCurrentTest({ id: '', subject: '', title: '', level: 'CA Final', status: 'Live', accessType: 'Premium', pdfLink: '' });
      setIsEditingTest(false);
      setSelectedFile(null);
      setUploadStatus('');
    } catch (e: any) {
      alert("Error saving test: " + e.message);
    }
    setUploading(false);
  };

  const handleDeleteTest = async (id: string) => {
    if (window.confirm('Delete this test series?')) {
      try {
        await deleteDoc(doc(db, "tests", id));
      } catch (e: any) {
         alert("Error deleting test: " + e.message);
      }
    }
  };

  // --- REAL FIREBASE UPLOAD ---
  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const metadata = {
        contentType: file.type,
        contentDisposition: `attachment; filename="${file.name}"`
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error("Upload failed", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  // Direct Admin Evaluation (Bypasses Teacher Flow)
  const handleUploadEvaluatedCopy = async (e: React.ChangeEvent<HTMLInputElement>, submissionId: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setEvaluatingSubmissionId(submissionId);
      try {
          const url = await handleFileUpload(file);
          const updateData = {
              status: 'Evaluated',
              evaluatedSheetUrl: url,
              evaluatedAt: new Date().toISOString()
          };
          await updateDoc(doc(db, "submissions", submissionId), updateData);
          alert("Checked Copy Uploaded Successfully!");
      } catch (err: any) {
          alert(`Error uploading evaluation: ${err.message}`);
      } finally {
          setEvaluatingSubmissionId(null);
      }
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus("Starting upload...");

    let downloadUrl = currentMaterial.pdfLink;
    if (selectedFile) {
       try {
         setUploadStatus("Uploading to Server...");
         downloadUrl = await handleFileUpload(selectedFile);
       } catch (err: any) {
         setUploadStatus(`Error: ${err.message}`);
         setUploading(false);
         return;
       }
    } else if (!downloadUrl) {
        alert("Please upload a PDF file or provide a Manual Link.");
        setUploading(false);
        return;
    }

    const materialPayload = {
      title: currentMaterial.title,
      type: currentMaterial.type,
      subject: currentMaterial.subject,
      pdfLink: downloadUrl,
      rating: currentMaterial.rating || 4.5,
      ratingCount: currentMaterial.ratingCount || '500+',
      date: new Date().toISOString().split('T')[0]
    };

    try {
       await addDoc(collection(db, "materials"), materialPayload);
       setShowMaterialModal(false);
       setCurrentMaterial({ id: '', title: '', type: 'Short Notes', subject: '', pdfLink: '', rating: 4.8, ratingCount: '1.2k' });
       setSelectedFile(null);
       setUploadStatus("");
    } catch (e: any) {
       setUploadStatus(`DB Error: ${e.message}`);
    }
    setUploading(false);
  };

  const handleDeleteMaterial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await deleteDoc(doc(db, "materials", id));
      } catch (e: any) {
         alert("Error deleting material: " + e.message);
      }
    }
  };

  const SidebarItem = ({ id, icon: Icon, label, badge }: { id: TabType, icon: any, label: string, badge?: number }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-brand-primary text-white shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} /> {label}
      </div>
      {badge ? <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span> : null}
    </button>
  );

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
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-primary/20">CA</div>
          <div>
            <h1 className="text-white font-display font-bold leading-tight tracking-tighter">exam<span className="text-brand-primary">.online</span></h1>
            <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="approvals" icon={Gavel} label="Result Approvals" badge={approvals.length} />
          <SidebarItem id="students" icon={Users} label="Students" />
          <SidebarItem id="teachers" icon={GraduationCap} label="Teachers" />
          <SidebarItem id="tests" icon={FileText} label="Test Repository" />
          <SidebarItem id="evaluations" icon={ClipboardCheck} label="All Submissions" />
          <SidebarItem id="library" icon={Library} label="Material Library" />
          <SidebarItem id="settings" icon={Settings} label="Settings" />
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
                 <h2 className="text-3xl font-display font-bold text-brand-dark capitalize">{activeTab}</h2>
                 <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Database size={10} /> Live Mode</span>
            </div>
            <p className="text-brand-dark/40 text-sm">Welcome back, Admin.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-2 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold shadow-sm flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full inline-block ${loading ? 'animate-pulse bg-slate-400' : 'bg-green-500'}`}></span> 
                {loading ? 'Connecting...' : 'Firebase Connected'}
             </div>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up">
              {[
                { label: 'Active Students', value: students.filter(s => s.planStatus === 'Active').length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Pending Approvals', value: approvals.length, icon: Gavel, color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'Total Submissions', value: submissions.length, icon: ClipboardCheck, color: 'text-orange-500', bg: 'bg-orange-50' },
                { label: 'Teachers', value: teachers.length, icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} w-fit mb-4`}><stat.icon size={20} /></div>
                  <h3 className="text-3xl font-display font-bold text-brand-dark">{stat.value}</h3>
                  <p className="text-xs font-bold text-slate-400">{stat.label}</p>
                </div>
              ))}
          </div>
        )}

        {/* APPROVALS TAB (New) */}
        {activeTab === 'approvals' && (
           <div className="animate-fade-up">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-brand-dark">Teacher Graded Submissions</h3>
                    <p className="text-xs text-brand-dark/40">Review grades and approve to release results to students.</p>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Test</th>
                            <th className="px-6 py-4">Marks</th>
                            <th className="px-6 py-4">Evaluator</th>
                            <th className="px-6 py-4">Checked Copy</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {approvals.map(appr => (
                            <tr key={appr.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 font-bold text-sm text-brand-dark">{appr.studentName}</td>
                                <td className="px-6 py-4 text-sm">{appr.testTitle}</td>
                                <td className="px-6 py-4 font-bold text-brand-primary">{appr.marks}</td>
                                <td className="px-6 py-4 text-xs">{appr.evaluatorName || 'Teacher'}</td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => setViewingPdf({ url: appr.evaluatedSheetUrl, title: `Checked: ${appr.studentName}` })}
                                        className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                                     >
                                        <Eye size={12} /> View
                                     </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleApproveSubmission(appr.id)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                                    >
                                        Approve & Release
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {approvals.length === 0 && <div className="p-8 text-center text-slate-400">No pending approvals.</div>}
              </div>
           </div>
        )}

        {/* TEACHERS TAB (New) */}
        {activeTab === 'teachers' && (
           <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-brand-dark">Authorized Evaluators</h3>
               <Button onClick={() => setShowAddTeacherModal(true)} className="!py-2 !px-4 text-xs">
                 <UserPlus size={16} className="mr-2" /> Add Teacher
               </Button>
             </div>
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-slate-50">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="px-6 py-4">Name</th>
                         <th className="px-6 py-4">Subject</th>
                         <th className="px-6 py-4">Email</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {teachers.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 text-sm font-bold text-brand-dark">{t.name}</td>
                              <td className="px-6 py-4 text-xs font-bold bg-brand-primary/10 text-brand-primary px-2 py-1 rounded w-fit">{t.subject}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{t.email}</td>
                              <td className="px-6 py-4 text-right">
                                  <button onClick={() => handleDeleteTeacher(t.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                      <Trash2 size={16} />
                                  </button>
                              </td>
                          </tr>
                      ))}
                   </tbody>
                </table>
                {teachers.length === 0 && <div className="p-8 text-center text-slate-400">No teachers found.</div>}
             </div>
           </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
           <div className="animate-fade-up">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-brand-dark">Enrolled Students</h3>
               <Button onClick={() => setShowAddStudentModal(true)} className="!py-2 !px-4 text-xs">
                 <UserPlus size={16} className="mr-2" /> Add Student
               </Button>
             </div>
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-slate-50">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="px-6 py-4">Name</th>
                         <th className="px-6 py-4">Course</th>
                         <th className="px-6 py-4">Plan Status</th>
                         <th className="px-6 py-4">Join Date</th>
                         <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {students.map((student) => (
                         <tr key={student.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                               <p className="text-sm font-bold text-brand-dark">{student.name}</p>
                               <p className="text-xs text-slate-400">{student.email}</p>
                            </td>
                            <td className="px-6 py-4 text-sm">{student.course}</td>
                            <td className="px-6 py-4">
                               <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${student.planStatus === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {student.planStatus}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{student.joinDate}</td>
                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                               {student.planStatus === 'Expired' && (
                                  <button onClick={() => handleRenewPlan(student.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg" title="Renew Plan">
                                     <RefreshCw size={16} />
                                  </button>
                               )}
                               <button onClick={() => handleDeleteStudent(student.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                  <Trash2 size={16} />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
                {students.length === 0 && <div className="p-8 text-center text-slate-400">No students found.</div>}
             </div>
           </div>
        )}

        {/* TESTS TAB */}
        {activeTab === 'tests' && (
           <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-brand-dark">Test Repository</h3>
                <Button onClick={() => setShowTestModal(true)} className="!py-2 !px-4 text-xs">
                  <Plus size={16} className="mr-2" /> Add Test
                </Button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {tests.map(test => (
                    <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group">
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black uppercase bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">{test.subject}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${test.accessType === 'Free' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{test.accessType}</span>
                       </div>
                       <h4 className="font-bold text-brand-dark mb-1">{test.title}</h4>
                       <p className="text-xs text-slate-400 mb-4">{test.level} • {test.date}</p>
                       <div className="flex gap-2">
                          <button 
                             onClick={() => test.pdfLink && setViewingPdf({ url: test.pdfLink, title: test.title })}
                             disabled={!test.pdfLink || test.pdfLink === '#'}
                             className="flex-1 py-2 bg-slate-50 text-brand-dark text-xs font-bold rounded-lg hover:bg-slate-100 flex items-center justify-center gap-2"
                          >
                             <Eye size={14} /> View
                          </button>
                          <button onClick={() => handleDeleteTest(test.id)} className="p-2 text-red-400 bg-red-50 hover:bg-red-100 rounded-lg">
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
              {tests.length === 0 && <div className="p-10 text-center text-slate-400">No tests created yet.</div>}
           </div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === 'library' && (
           <div className="animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-brand-dark">Material Library</h3>
                <Button onClick={() => setShowMaterialModal(true)} className="!py-2 !px-4 text-xs">
                  <Plus size={16} className="mr-2" /> Add Material
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                 {materials.map(mat => (
                    <div key={mat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
                       
                       {/* Absolute Delete Button - High Z-Index to ensure clickability */}
                       <button 
                          onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMaterial(mat.id);
                          }}
                          className="absolute top-4 right-4 p-2 bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full border border-slate-100 hover:border-red-100 shadow-sm transition-all z-20"
                          title="Delete Material"
                       >
                          <Trash2 size={16} />
                       </button>

                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                             <FileText size={20} />
                          </div>
                       </div>
                       <h4 className="font-bold text-brand-dark mb-1 pr-8">{mat.title}</h4>
                       <p className="text-xs text-slate-400 mb-4">{mat.subject} • {mat.type}</p>
                       <button 
                          onClick={() => mat.pdfLink && setViewingPdf({ url: mat.pdfLink, title: mat.title })}
                          className="w-full py-2 bg-slate-50 text-brand-dark text-xs font-bold rounded-lg hover:bg-slate-100 flex items-center justify-center gap-2"
                       >
                          <Eye size={14} /> View PDF
                       </button>
                    </div>
                 ))}
              </div>
              {materials.length === 0 && <div className="p-10 text-center text-slate-400">No materials uploaded.</div>}
           </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl animate-fade-up space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                     <UploadCloud className="text-brand-primary" /> Storage Configuration
                   </h3>
                   <p className="text-xs text-slate-500 mb-4">You are currently using <strong>Firebase Storage</strong>. All files are stored securely on Google Servers.</p>
                   <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100">
                      System is Live. Files uploaded here will be visible to students immediately.
                   </div>
                </div>
            </div>
          </div>
        )}

        {/* EVALUATIONS TAB (All Submissions) */}
        {activeTab === 'evaluations' && (
             <div className="animate-fade-up">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-brand-dark">All Student Submissions</h3>
                      <p className="text-xs text-brand-dark/40">Master list of all submissions (Pending, Review, Evaluated).</p>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-slate-50">
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               <th className="px-6 py-4">Student</th>
                               <th className="px-6 py-4">Test Title</th>
                               <th className="px-6 py-4">Status</th>
                               <th className="px-6 py-4">Answer Sheet</th>
                               <th className="px-6 py-4 text-right">Direct Evaluate</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {submissions.map((sub) => (
                               <tr key={sub.id} className="hover:bg-slate-50/50">
                                  <td className="px-6 py-4">
                                     <p className="text-sm font-bold text-brand-dark">{sub.studentName}</p>
                                  </td>
                                  <td className="px-6 py-4 text-sm">{sub.testTitle}</td>
                                  <td className="px-6 py-4">
                                     <span className={`text-[10px] font-black uppercase px-2 py-1 rounded 
                                        ${sub.status === 'Evaluated' ? 'bg-green-100 text-green-700' : 
                                          sub.status === 'Review' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {sub.status}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4">
                                     <button 
                                        onClick={() => setViewingPdf({ url: sub.answerSheetUrl, title: `Answer Sheet: ${sub.studentName}` })}
                                        className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                                     >
                                        <Eye size={12} /> View/Download
                                     </button>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     {sub.status === 'Evaluated' ? (
                                        <div className="flex items-center justify-end gap-2 text-green-600 text-xs font-bold">
                                            <CheckCircle2 size={16} /> Completed
                                        </div>
                                     ) : (
                                        <div className="relative inline-block">
                                            <input 
                                                type="file" 
                                                accept="application/pdf"
                                                disabled={evaluatingSubmissionId === sub.id}
                                                onChange={(e) => handleUploadEvaluatedCopy(e, sub.id)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <button 
                                                disabled={evaluatingSubmissionId === sub.id}
                                                className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-blue flex items-center gap-2"
                                            >
                                                {evaluatingSubmissionId === sub.id ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                                                {evaluatingSubmissionId === sub.id ? 'Uploading...' : 'Direct Check'}
                                            </button>
                                        </div>
                                     )}
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                   {submissions.length === 0 && <div className="p-10 text-center text-slate-400">No submissions found.</div>}
                </div>
             </div>
        )}
      </main>

      {/* MODALS */}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setShowAddStudentModal(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-up">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Add New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input 
                placeholder="Full Name" required 
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})}
              />
              <input 
                placeholder="Email Address" required type="email"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})}
              />
              <input 
                placeholder="Password" required type="password" minLength={6}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})}
              />
              <input 
                placeholder="Phone Number" required 
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={newStudent.course} onChange={e => setNewStudent({...newStudent, course: e.target.value})}
                >
                   <option value="CA Final">CA Final</option>
                   <option value="CA Inter">CA Inter</option>
                   <option value="CA Foundation">CA Foundation</option>
                </select>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={newStudent.planStatus} onChange={e => setNewStudent({...newStudent, planStatus: e.target.value})}
                >
                   <option value="Active">Active Plan</option>
                   <option value="Expired">Expired</option>
                </select>
              </div>
              <Button type="submit" fullWidth disabled={uploading}>
                  {uploading ? <Loader2 className="animate-spin" /> : 'Create Student'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher Modal (New) */}
      {showAddTeacherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setShowAddTeacherModal(false)}></div>
              <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-up">
                  <h3 className="text-xl font-bold text-brand-dark mb-4">Add Teacher</h3>
                  <p className="text-xs text-slate-500 mb-4">The teacher can Sign Up using this email.</p>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                      <input 
                        placeholder="Teacher Name" required 
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                        value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                      />
                      <input 
                        placeholder="Email (for login)" required type="email"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                        value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                      />
                      <input 
                        placeholder="Password" required type="password" minLength={6}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                        value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})}
                      />
                      <input 
                        placeholder="Specialization (e.g. Audit)" required 
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                        value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
                      />
                      <Button type="submit" fullWidth disabled={uploading}>
                          {uploading ? <Loader2 className="animate-spin" /> : 'Create Teacher'}
                      </Button>
                  </form>
              </div>
          </div>
      )}

      {/* Add Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setShowTestModal(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-up">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Upload Test Series</h3>
            <form onSubmit={handleSaveTest} className="space-y-4">
              <input 
                placeholder="Test Title (e.g., Audit Mock Test 1)" required 
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                value={currentTest.title} onChange={e => setCurrentTest({...currentTest, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                 <input 
                  placeholder="Subject (e.g., Audit)" required 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={currentTest.subject} onChange={e => setCurrentTest({...currentTest, subject: e.target.value})}
                 />
                 <select 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={currentTest.level} onChange={e => setCurrentTest({...currentTest, level: e.target.value})}
                 >
                    <option value="CA Final">CA Final</option>
                    <option value="CA Inter">CA Inter</option>
                    <option value="CA Foundation">CA Foundation</option>
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <select 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                    value={currentTest.accessType} onChange={e => setCurrentTest({...currentTest, accessType: e.target.value})}
                 >
                    <option value="Premium">Premium</option>
                    <option value="Free">Free</option>
                 </select>
              </div>

              {/* PDF Upload */}
              <div className="relative group">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full p-4 bg-slate-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${selectedFile ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 group-hover:border-brand-primary'}`}>
                  {selectedFile ? (
                    <div className="flex items-center gap-2 text-brand-primary">
                       <FileText size={20} /> <span className="text-xs font-bold truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                       <UploadCloud size={20} /> <span className="text-xs font-bold">Upload Question Paper PDF</span>
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" fullWidth disabled={uploading}>
                  {uploading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> {uploadStatus}</span> : 'Save Test'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm" onClick={() => setShowMaterialModal(false)}></div>
          <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-up max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Add Library Material</h3>
            
            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <input 
                placeholder="Title (e.g., GST Revision Notes)" required 
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                value={currentMaterial.title} onChange={e => setCurrentMaterial({...currentMaterial, title: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Subject" required 
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                  value={currentMaterial.subject} onChange={e => setCurrentMaterial({...currentMaterial, subject: e.target.value})}
                />
                 <select 
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                    value={currentMaterial.type} onChange={e => setCurrentMaterial({...currentMaterial, type: e.target.value})}
                 >
                    <option value="Short Notes">Short Notes</option>
                    <option value="Question Bank">Question Bank</option>
                    <option value="Suggested Answers">Suggested Answers</option>
                 </select>
              </div>

              <div className="relative group">
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full p-6 bg-slate-50 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors ${selectedFile ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 group-hover:border-brand-primary'}`}>
                  {selectedFile ? (
                    <>
                      <FileText className="text-brand-primary mb-2" size={32} />
                      <p className="text-sm font-bold text-brand-dark truncate w-full text-center">{selectedFile.name}</p>
                      <p className="text-xs text-brand-primary font-bold mt-1">Ready to Upload</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="text-slate-400 mb-2" size={32} />
                      <p className="text-sm font-bold text-brand-dark">Click to Upload PDF</p>
                      <p className="text-xs text-slate-400">PDF Files only (Stored on Firebase)</p>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                 <Button type="submit" fullWidth disabled={uploading}>
                   {uploading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Uploading...</span> : 'Save Material'}
                 </Button>
                 {uploadStatus && (
                    <p className={`text-center text-xs font-bold ${uploadStatus.includes('Error') ? 'text-red-500' : 'text-blue-500'}`}>{uploadStatus}</p>
                 )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};