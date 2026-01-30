import React, { useState } from 'react';
import { Mail, Lock, Loader2, User, Phone, BookOpen, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { Button } from './Button';
import { 
  db, 
  doc, setDoc, getDoc, 
  collection, query, where, getDocs 
} from '../firebaseConfig';

interface StudentLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

type AuthStep = 'DETAILS' | 'OTP';

export const StudentLogin: React.FC<StudentLoginProps> = ({ onBack, onLoginSuccess }) => {
  const [step, setStep] = useState<AuthStep>('DETAILS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: 'CA Final'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to send OTP via HiveMsg API
  const sendOtpViaApi = async (mobile: string, otp: string) => {
    const username = "u6040";
    const token = "0mpLw6";
    const senderId = "GGSVMS";
    const message = `Use ${otp} as your OTP to login. Regards- GGSVMS`;
    
    const url = `https://manage.hivemsg.com/api/send_transactional_sms.php?username=${username}&msg_token=${token}&sender_id=${senderId}&message=${encodeURIComponent(message)}&mobile=${mobile}`;
    
    try {
      // Using no-cors mode if the provider doesn't allow direct browser calls, 
      // but standard fetch is preferred if CORS is enabled on their side.
      await fetch(url, { mode: 'no-cors' });
      return true;
    } catch (err) {
      console.error("SMS API Error:", err);
      return false;
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError('');

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    const sent = await sendOtpViaApi(formData.phone, otp);
    
    if (sent) {
      setStep('OTP');
      setLoading(false);
    } else {
      setError("Failed to send OTP. Please try again later.");
      setLoading(false);
    }
  };

  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userOtp !== generatedOtp && userOtp !== '1234') { // '1234' as backup/master OTP for testing
      setError("Invalid OTP. Please try again.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use phone number as the unique identifier
      const phoneId = formData.phone;
      const studentRef = doc(db, "students", phoneId);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        // --- EXISTING USER LOGIN ---
        console.log("Existing student logged in");
      } else {
        // --- NEW USER REGISTRATION ---
        if (!formData.name) {
          setError("Name is required for new registration.");
          setStep('DETAILS');
          setLoading(false);
          return;
        }

        const profileData = {
          id: phoneId,
          name: formData.name,
          phone: formData.phone,
          course: formData.course,
          plan: 'Free Trial',
          planStatus: 'Active',
          joinDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
        };

        await setDoc(studentRef, profileData);
        console.log("New student registered");
      }

      // Save session locally
      localStorage.setItem('student_phone', phoneId);
      localStorage.setItem('student_name', formData.name || studentSnap.data()?.name);
      
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      setError("Authentication failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-brand-cream relative flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="w-full max-w-[440px] animate-fade-up px-4 py-8">
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-brand-dark/50 hover:text-brand-primary mb-6 transition-colors group text-sm font-bold"
        >
          <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl p-2 border border-brand-primary/5">
          <div className="bg-slate-50/30 rounded-[2.5rem] p-8 md:p-10">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-4">
                {step === 'DETAILS' ? <User size={32} /> : <ShieldCheck size={32} className="animate-pulse-soft" />}
              </div>
              <h2 className="text-2xl font-display font-bold text-brand-dark">
                {step === 'DETAILS' ? 'Student Portal' : 'Verify OTP'}
              </h2>
              <p className="text-brand-dark/40 text-[10px] mt-2 uppercase font-black tracking-[0.2em]">
                {step === 'DETAILS' ? 'Quick Login via Mobile' : `Sent to +91 ${formData.phone}`}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2 animate-shake">
                <span className="w-1 h-1 rounded-full bg-red-600" /> {error}
              </div>
            )}

            {step === 'DETAILS' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                    <input 
                      name="name" type="text" required
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-bold text-brand-dark"
                      placeholder="Enter your name"
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Target Course</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                    <select 
                      name="course" required
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 outline-none appearance-none font-bold text-brand-dark transition-all"
                      value={formData.course} onChange={handleChange}
                    >
                      <option value="CA Final">CA Final</option>
                      <option value="CA Inter">CA Inter</option>
                      <option value="CA Foundation">CA Foundation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                    <input 
                      name="phone" type="tel" required maxLength={10}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-bold text-brand-dark"
                      placeholder="9799479444"
                      value={formData.phone} onChange={handleChange}
                    />
                  </div>
                </div>

                <Button type="submit" variant="blue" fullWidth className="!py-4 !rounded-2xl !text-sm shadow-xl shadow-brand-blue/20" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Get OTP on WhatsApp'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndLogin} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest text-center block mb-4">Enter 4-Digit Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
                    <input 
                      type="text" required maxLength={4} autoFocus
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all text-brand-primary"
                      placeholder="0000"
                      value={userOtp} onChange={(e) => setUserOtp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button type="submit" variant="blue" fullWidth className="!py-4 !rounded-2xl !text-sm" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Verify & Enter Dashboard'}
                  </Button>
                  <button 
                    type="button"
                    onClick={() => setStep('DETAILS')}
                    className="w-full text-xs font-bold text-brand-dark/40 hover:text-brand-primary transition-colors"
                  >
                    Change Details / Resend OTP
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
               <p className="text-[10px] font-bold text-slate-400">Secure OTP Login powered by HiveMsg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};