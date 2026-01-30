import React, { useState } from 'react';
import { Mail, Lock, Loader2, User, Phone, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { auth, db, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface StudentLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onBack, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    course: 'CA Final'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        // --- SIGN UP ---
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: formData.name });

        const profileData = {
          id: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: formData.course,
          plan: 'Free Trial',
          planStatus: 'Active',
          joinDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0] 
        };

        await setDoc(doc(db, "students", user.uid), profileData);
        
        setSuccessMsg("Account created successfully! Redirecting...");
      } else {
        // --- LOGIN ---
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Security Check: Ensure User Exists in 'students' collection
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await auth.signOut();
            // Customize error based on context
            setError("Access Denied: Account not found in Student records. If you are a Teacher/Admin, please use the correct portal.");
            setLoading(false);
            return;
        }

        setSuccessMsg("Login successful!");
      }

      localStorage.setItem('student_email', formData.email);
      
      setTimeout(() => {
        onLoginSuccess();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Authentication failed.";
      
      if (err.code === 'auth/email-already-in-use') msg = "Email already registered. Please Login.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "No account found. Please Sign Up.";
      if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      if (err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-brand-cream relative flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[480px] animate-fade-up px-4 py-8">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-dark/50 hover:text-brand-primary mb-6 transition-colors group text-sm font-bold"
        >
          <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl p-2 border border-brand-primary/5">
          <div className="bg-slate-50/30 rounded-[2.5rem] p-8 md:p-10">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-brand-dark">
                {isSignUp ? 'Create Account' : 'Student Login'}
              </h2>
              <p className="text-brand-dark/40 text-xs mt-2 uppercase font-black tracking-widest">
                {isSignUp ? 'Start your journey to AIR' : 'Access your Student Portal'}
              </p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}
            {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-600 text-xs font-bold rounded-xl border border-green-100">{successMsg}</div>}

            <form onSubmit={handleAuth} className="space-y-4">
              
              {isSignUp && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                      <input 
                        name="name" type="text" required={isSignUp}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-brand-dark"
                        placeholder="John Doe"
                        value={formData.name} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                      <input 
                        name="phone" type="tel" required={isSignUp}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-brand-dark"
                        placeholder="+91 98765 43210"
                        value={formData.phone} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Course</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                      <select 
                        name="course" required={isSignUp}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none font-bold text-brand-dark transition-all"
                        value={formData.course} onChange={handleChange}
                      >
                        <option value="CA Final">CA Final</option>
                        <option value="CA Inter">CA Inter</option>
                        <option value="CA Foundation">CA Foundation</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                  <input 
                    name="email" type="email" required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-brand-dark"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                  <input 
                    name="password" type="password" required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all font-bold text-brand-dark"
                    placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="blue" fullWidth className="!py-4 !rounded-2xl !text-sm" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Login Securely')}
                </Button>
              </div>

              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
                  className="text-xs font-bold text-brand-dark/60 hover:text-brand-primary transition-colors underline decoration-2 underline-offset-4"
                >
                  {isSignUp ? 'Already have an account? Login' : 'New here? Create Free Account'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};