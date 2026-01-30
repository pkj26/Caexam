import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Process } from './components/Process';
import { AboutUs } from './components/AboutUs';
import { TestSeriesExplorer } from './components/TestSeriesExplorer';
import { Pricing } from './components/Pricing';
import { Mentors } from './components/Mentors';
import { SEOImpact } from './components/SEOImpact';
import { WhyChooseUs } from './components/WhyChooseUs';
import { GuaranteeSection } from './components/GuaranteeSection';
import { Results } from './components/Results';
import { StudentTestimonials } from './components/StudentTestimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { DetailedPages } from './components/DetailedPages';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { StudentLogin } from './components/StudentLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherLogin } from './components/TeacherLogin';
import { TeacherPanel } from './components/TeacherPanel';
import { Checkout } from './components/Checkout';
import { Blog } from './components/Blog';
import { BlogPost } from './components/BlogPost';
import { auth, signOut } from './firebaseConfig';

export type ViewType = 'home' | 'about-detail' | 'test-detail' | 'process-detail' | 'mentors-detail' | 'pricing-detail' | 'topic-detail' | 'admin-panel' | 'admin-login' | 'teacher-login' | 'teacher-panel' | 'test-series-detail' | 'student-login' | 'student-dashboard' | 'checkout' | 'blog' | 'blog-post';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  type: string;
}

const INITIAL_PLANS = [
  {
    id: 'plan-1',
    name: "Detailed Test Series",
    priceBase: 1999,
    discount: 65,
    seriesCount: "12 Series",
    studentCount: "450+ Students",
    desc: "Scheduled tests for disciplined study",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    features: ["12 Mock Tests", "Detailed Evaluation", "ICAI Pattern Based Questions"]
  },
  {
    id: 'plan-2',
    name: "Unscheduled Series",
    priceBase: 2499,
    discount: 65,
    seriesCount: "Unlimited",
    studentCount: "1.2k+ Students",
    desc: "Flexible - Write anytime till exams",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    features: ["Valid till Exam Date", "Priority Evaluation", "Unlimited Doubt Solving"]
  },
  {
    id: 'plan-3',
    name: "Fast Track Series",
    priceBase: 999,
    discount: 65,
    seriesCount: "5 Series",
    studentCount: "800+ Students",
    desc: "Quick revision for last month",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    features: ["2 Full Syllabus Tests", "Standard Evaluation", "Suggested Answers"]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [dynamicPlans, setDynamicPlans] = useState(INITIAL_PLANS);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth === 'true') setIsAdminLoggedIn(true);
    const teacherAuth = localStorage.getItem('teacher_auth');
    if (teacherAuth === 'true') setIsTeacherLoggedIn(true);
    const studentPhone = localStorage.getItem('student_phone');
    if (studentPhone) setIsStudentLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin-login') {
        isAdminLoggedIn ? setView('admin-panel') : setView('admin-login');
        return;
      }
      if (hash === 'teacher-login') {
        isTeacherLoggedIn ? setView('teacher-panel') : setView('teacher-login');
        return;
      }
      if (hash.startsWith('blog-post-')) {
        setSelectedPostId(hash.replace('blog-post-', ''));
        setView('blog-post');
        return;
      }
      if (hash.startsWith('topic-')) {
        const topicName = hash.replace('topic-', '').replace(/-/g, ' ');
        setSelectedTopic(topicName);
        setView('topic-detail');
      } else if (['home', 'about-detail', 'test-detail', 'process-detail', 'mentors-detail', 'pricing-detail', 'admin-panel', 'teacher-panel', 'test-series-detail', 'student-login', 'student-dashboard', 'checkout', 'blog'].includes(hash)) {
        if (hash === 'admin-panel' && !isAdminLoggedIn) { setView('admin-login'); return; }
        if (hash === 'teacher-panel' && !isTeacherLoggedIn) { setView('teacher-login'); return; }
        setView(hash as ViewType || 'home');
        setSelectedTopic(null);
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminLoggedIn, isTeacherLoggedIn]);

  const navigate = (newView: ViewType, id?: string) => {
    if (newView === 'topic-detail' && id) {
      window.location.hash = `topic-${id.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (newView === 'blog-post' && id) {
      window.location.hash = `blog-post-${id}`;
    } else {
      window.location.hash = newView;
    }
    window.scrollTo(0, 0);
  };

  const handleStudentLogout = () => {
    setIsStudentLoggedIn(false);
    localStorage.removeItem('student_phone');
    localStorage.removeItem('student_name');
    navigate('home');
  };

  const isDashboardView = ['admin-panel', 'admin-login', 'teacher-panel', 'teacher-login', 'student-dashboard'].includes(view);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark overflow-x-hidden">
      {!isDashboardView && <Navbar onNavigate={navigate} currentView={view} cartCount={cart.length} />}
      <main>
        {view === 'home' ? (
          <>
            <Hero />
            <Pricing plans={dynamicPlans} onDetail={() => navigate('pricing-detail')} onAddToCart={(item) => setCart([...cart, item])} />
            <TrustBar />
            <GuaranteeSection />
            <Process onDetail={() => navigate('process-detail')} />
            <AboutUs onDetail={() => navigate('about-detail')} />
            <TestSeriesExplorer onDetail={() => navigate('test-series-detail')} />
            <SEOImpact onTopicClick={(topic) => navigate('topic-detail', topic)} />
            <WhyChooseUs />
            <Mentors onDetail={() => navigate('mentors-detail')} />
            <Results />
            <StudentTestimonials />
            <FAQ />
          </>
        ) : view === 'checkout' ? (
          <Checkout cart={cart} onRemoveItem={(id) => setCart(cart.filter(i => i.id !== id))} onBack={() => navigate('home')} />
        ) : view === 'admin-panel' ? (
          <AdminPanel plans={dynamicPlans} onUpdatePlans={setDynamicPlans} onLogout={() => { setIsAdminLoggedIn(false); localStorage.removeItem('admin_auth'); navigate('home'); }} onBack={() => navigate('home')} />
        ) : view === 'admin-login' ? (
          <AdminLogin onLoginSuccess={() => { setIsAdminLoggedIn(true); localStorage.setItem('admin_auth', 'true'); navigate('admin-panel'); }} onBack={() => navigate('home')} />
        ) : view === 'student-login' ? (
          <StudentLogin onLoginSuccess={() => { setIsStudentLoggedIn(true); navigate('student-dashboard'); }} onBack={() => navigate('home')} />
        ) : view === 'student-dashboard' ? (
          <StudentDashboard onLogout={handleStudentLogout} />
        ) : view === 'blog' ? (
          <Blog onNavigate={navigate} />
        ) : view === 'blog-post' ? (
          <BlogPost id={selectedPostId} onBack={() => navigate('blog')} onNavigate={navigate} />
        ) : (
          <DetailedPages view={view} topic={selectedTopic} onBack={() => navigate('home')} onNavigate={navigate} onAddToCart={(item) => setCart([...cart, item])} />
        )}
      </main>
      {!isDashboardView && <Footer onNavigate={navigate} />}
    </div>
  );
};

export default App;