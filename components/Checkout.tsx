import React, { useState } from 'react';
import { Trash2, ShieldCheck, ArrowRight, ArrowLeft, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  type: string;
}

interface CheckoutProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, onRemoveItem, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    coupon: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const totalOriginal = cart.reduce((acc, item) => acc + item.originalPrice, 0);
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // SIMULATION: Simulate Payment Processing delay
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      
      // Clear cart locally (In a real app, you'd empty the cart state)
      // For this demo, we just show the success screen
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-brand-cream flex flex-col items-center justify-center text-center animate-fade-up">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-2">Order Successful!</h2>
        <p className="text-brand-dark/60 mb-8 max-w-md">
          Thank you, <span className="font-bold text-brand-dark">{formData.name}</span>. Your test series access details have been sent to <span className="font-bold text-brand-dark">{formData.email}</span>.
        </p>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8 w-full max-w-md">
           <div className="flex justify-between text-sm mb-2">
             <span className="text-slate-500">Amount Paid:</span>
             <span className="font-bold text-brand-dark">₹{total}</span>
           </div>
           <div className="flex justify-between text-sm">
             <span className="text-slate-500">Transaction ID:</span>
             <span className="font-mono text-brand-dark">TXN-{Math.floor(Math.random() * 1000000)}</span>
           </div>
        </div>
        <Button variant="primary" onClick={() => window.location.reload()}>Return to Home</Button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-brand-cream flex flex-col items-center justify-center text-center animate-fade-up">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl">
          <ShoppingBag size={48} className="text-brand-dark/20" />
        </div>
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-2">Your Cart is Empty</h2>
        <p className="text-brand-dark/60 mb-8">Looks like you haven't added any test series yet.</p>
        <Button variant="primary" onClick={onBack}>Browse Test Series</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-dark/50 hover:text-brand-primary mb-8 font-bold text-sm">
          <ArrowLeft size={16} /> Continue Shopping
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Cart & Billing Form */}
          <div className="flex-1 space-y-6">
            
            {/* Cart Items */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-display font-bold text-brand-dark mb-4">Order Summary ({cart.length})</h3>
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-dark text-sm">{item.name}</h4>
                        <p className="text-[10px] font-medium text-brand-dark/40 uppercase tracking-wider">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3 justify-end">
                        <p className="font-black text-brand-dark">₹{item.price}</p>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs line-through text-brand-dark/30">₹{item.originalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Details Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-sm">1</div>
                 <h3 className="text-lg font-display font-bold text-brand-dark">Billing Details</h3>
              </div>
              
              <form id="billing-form" onSubmit={handlePayment} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-dark/40 pl-1">Full Name</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-brand-primary" placeholder="Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-dark/40 pl-1">Email Address</label>
                  <input required type="email" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-brand-primary" placeholder="rahul@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-dark/40 pl-1">Phone Number</label>
                  <input required type="tel" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-brand-primary" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-brand-dark/40 pl-1">City</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:border-brand-primary" placeholder="New Delhi" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Total */}
          <div className="lg:w-[380px]">
            <div className="bg-brand-dark text-white rounded-3xl p-6 sticky top-24 shadow-2xl shadow-brand-dark/20">
              <h3 className="text-xl font-display font-bold mb-6">Order Total</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-white/10 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-green-400 font-bold">
                  <span>Total Savings</span>
                  <span>- ₹{totalOriginal - subtotal}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="font-bold text-white/80">Total Payable</span>
                <span className="text-3xl font-display font-black text-white">₹{total}</span>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex gap-2">
                  <input type="text" placeholder="Have a coupon?" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:bg-white/20" value={formData.coupon} onChange={e => setFormData({...formData, coupon: e.target.value})} />
                  <button className="px-4 py-2 bg-brand-primary text-white font-bold rounded-xl text-xs hover:bg-brand-blue transition-colors">Apply</button>
                </div>
              </div>

              <Button 
                variant="primary" 
                fullWidth 
                disabled={loading}
                className="!py-4 !rounded-xl text-base shadow-none hover:bg-white hover:text-brand-dark"
                onClick={() => (document.getElementById('billing-form') as HTMLFormElement)?.requestSubmit()}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Processing...</span>
                ) : (
                  <span className="flex items-center gap-2">Place Order <ArrowRight size={18} /></span>
                )}
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <ShieldCheck size={12} /> Secure 128-bit SSL Payment
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};