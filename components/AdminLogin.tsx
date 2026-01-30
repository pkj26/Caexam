import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebaseConfig';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Default 'admin' username to the requested email
    const email = username === 'admin' ? 'admin@admin.com' : username;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.log("Login attempt failed:", err.code);
      
      // AUTO-CREATE ADMIN LOGIC:
      // If credentials match our default setup but user doesn't exist, create it.
      // Note: Firebase now returns 'auth/invalid-credential' for both wrong password and user not found.
      if (
        email === 'admin@admin.com' && 
        password === 'admin112233'
      ) {
         try {
             await createUserWithEmailAndPassword(auth, email, password);
             onLoginSuccess();
             return;
         } catch (createErr: any) {
             // If creation fails (e.g. user exists but password was wrong initially), fall through to error
             console.error("Auto-creation skipped:", createErr.code);
         }
      }

      let msg = 'Access Denied: Invalid Credentials';
      if (err.code === 'auth/too-many-requests') msg = "Too many failed attempts. Try again later.";
      
      setError(msg);
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
          <div className="bg-brand-primary h-2 w-full"></div>
          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-brand-primary rounded-2xl mb-4">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-2xl font-display font-bold text-brand-dark">Restricted Access</h1>
              <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Admin Authorization Required</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Username / Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    placeholder="admin@admin.com"
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" fullWidth disabled={loading} className="!py-4 mt-2">
                {loading ? <Loader2 className="animate-spin" /> : 'Authenticate'}
              </Button>
            </form>
          </div>
          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
             <p className="text-[10px] text-slate-400">Secure Firebase Authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};