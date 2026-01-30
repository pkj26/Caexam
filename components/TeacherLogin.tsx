import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2, GraduationCap } from 'lucide-react';
import { Button } from './Button';
import { auth, signInWithEmailAndPassword, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface TeacherLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      
      // 2. Verify if this user is actually a teacher in our 'teachers' collection
      // We check if the email exists in the 'teachers' collection
      const q = query(collection(db, "teachers"), where("email", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
          // Success: User is in the teachers collection
          onLoginSuccess();
      } else {
          // Failed: User exists in Auth but is NOT a teacher (could be a student)
          setError("Access Denied: This account is not authorized as a Teacher.");
          await auth.signOut();
      }
      
    } catch (err: any) {
      console.log("Login attempt failed:", err.code);
      let msg = 'Invalid Credentials';
      if (err.code === 'auth/too-many-requests') msg = "Too many failed attempts. Try again later.";
      if (err.code === 'auth/user-not-found') msg = "Teacher account not found.";
      
      setError(msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group text-sm font-bold"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Website
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="bg-brand-orange h-2 w-full"></div>
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-2xl mb-4">
                <GraduationCap size={32} />
              </div>
              <h1 className="text-2xl font-display font-bold text-brand-dark">Teacher Portal</h1>
              <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Evaluator Access Only</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                    placeholder="teacher@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" fullWidth disabled={loading} variant="orange" className="!py-4 mt-2">
                {loading ? <Loader2 className="animate-spin" /> : 'Secure Login'}
              </Button>
            </form>
          </div>
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
             <p className="text-[10px] text-slate-400">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};