"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'


// --- Type Definitions for Component Props ---

type CustomAlertProps = {
  message: string;
  onClose: () => void;
};

type HeaderProps = {
  title: string;
  onBack: () => void;
  showProfileIcon: boolean;
  showScreen: (id: string) => void;
};


// --- Reusable Components and Hooks ---

// Custom Alert component with blur effect and no black background
const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-transparent z-[100] flex items-center justify-center p-4 backdrop-blur-sm"> {/* Changed bg-black bg-opacity-30 to bg-transparent */}
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
        <p className="mb-4 text-lg font-semibold text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-150 shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [alertMessage, setAlertMessage] = useState('');

  // Form State for Create Account
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  
  // Visa State (reverted to local state tracking for mock purpose)
  const [nationality, setNationality] = useState('Thailand');
  const [destination, setDestination] = useState('France');

  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarNote, setCalendarNote] = useState(''); // State for simple note saving

  // Navigation Logic
  const showScreen = useCallback((id: string) => { // Added type for 'id'
    setCurrentScreen(id);
  }, []);

  // Check Supabase Session Automatically
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        console.log('Already logged in:', data.session.user);
        setCurrentScreen('dashboard'); // Automatically go to dashboard
      }
    };

    checkSession();

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log('Auth state: logged in');
        setCurrentScreen('dashboard');
      } else {
        console.log('Auth state: logged out');
        setCurrentScreen('splash');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);
  
  
  // Auto-navigate from splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        showScreen('welcomeChoice');
      }, 2500); // Wait 2.5 seconds on the splash screen
      return () => clearTimeout(timer);
    }
  }, [currentScreen, showScreen]);


  const showAlert = useCallback((message: string) => { // Added type for 'message'
    setAlertMessage(message);
  }, []);

  const closeAlert = useCallback(() => {
    setAlertMessage('');
  }, []);

  // Check if header should show profile icon (only on dashboard and related pages, not auth/splash)
  const showProfileIcon = ['dashboard', 'visa', 'visaResult', 'upload', 'uploadForm', 'reviews', 'addReview', 'calendar'].includes(currentScreen);

  // --- Calendar Functions ---
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = useCallback((month: number, year: number) => { // Added types
    const firstDay = (new Date(year, month, 1)).getDay();
    const daysInMonth = (new Date(year, month + 1, 0)).getDate();
    let date = 1;
    const weeks = [];

    for (let i = 0; i < 6; i++) {
      const days = [];
      let rowHasDate = false;
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          days.push(<td key={`empty-${i}-${j}`} className="bg-gray-50 p-3 border border-gray-200"></td>);
        } else if (date > daysInMonth) {
          days.push(<td key={`empty-${i}-${j}`} className="bg-gray-50 p-3 border border-gray-200"></td>);
        } else {
          days.push(
            <td key={`date-${date}`} className="p-3 border border-gray-200 hover:bg-yellow-100 cursor-pointer transition duration-150">
              {date}
            </td>
          );
          date++;
          rowHasDate = true;
        }
      }
      if (rowHasDate) {
        weeks.push(<tr key={`week-${i}`}>{days}</tr>);
      }
    }
    return weeks;
  }, []);

  const changeMonth = (direction: number) => { // Added type
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    
    newYear = Math.max(today.getFullYear(), Math.min(2099, newYear));

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // --- Google OAuth Login Function ---
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // after login redirect
        },
      })
      if (error) {
        console.error('Google login error:', error.message)
        showAlert('Google sign-in failed. Please try again.')
      } else {
        console.log('Redirecting to Google login...', data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      showAlert('Unexpected error occurred. Please try again.')
    }
  }

interface Profile {
  id: string
  avatar_url?: string | null
  phone?: string | null
  birth_date?: string | null // Supabase returns date as ISO string
  created_at: string
  updated_at: string
  first_name?: string | null
  last_name?: string | null
}
// --- User Profile State (for header icon) ---
const [profile, setProfile] = useState<Profile | null>(null)

// Fetch user profile after login
useEffect(() => {
  const fetchProfile = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(profileData)
    }
  }

  fetchProfile()
}, [currentScreen]) // re-run when screen changes


  
  // --- Screen Definitions (JSX) ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <div className="relative min-h-screen flex flex-col justify-center items-center p-6 bg-purple-50">
            <style jsx global>{`
              @keyframes fadeInScaleUp {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fade-in-scale-up {
                animation: fadeInScaleUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
              }
            `}</style>
            <div className="flex flex-col items-center justify-center animate-fade-in-scale-up">
              <Image
                src="/raw-removebg-preview.png"
                alt="JETLAY Logo"
                width={256}
                height={256}
                className="rounded-xl"
              />
            </div>
          </div>
        );
        
      case 'welcomeChoice':
        return (
          <div className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 grainy-bg">
             <style jsx global>{`
              .grainy-bg::after {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-image: url('https://www.transparenttextures.com/patterns/gplay.png');
                opacity: 0.05;
                pointer-events: none;
                animation: grain 8s steps(10) infinite;
              }
              @keyframes grain {
                0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-5%, -10%); } 20% { transform: translate(-15%, 5%); } 30% { transform: translate(7%, -25%); } 40% { transform: translate(-5%, 25%); } 50% { transform: translate(-15%, 10%); } 60% { transform: translate(15%, 0%); } 70% { transform: translate(0%, 15%); } 80% { transform: translate(3%, 35%); } 90% { transform: translate(-10%, 10%); }
              }
            `}</style>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">WELCOME =)</h1>
            <div className="text-gray-800 space-y-1 mb-10">
              <p>Hi there!</p>
              <p>We&apos;re here to make it easier to explore new places.</p>
              <p>The choice is yours : Login or Create an account.</p>
            </div>
            
             <div className="relative w-28 h-28 mb-10">
              <div className="absolute w-20 h-24 bg-white/70 rounded-lg shadow-lg transform rotate-[-12deg] top-3 left-4 p-4 space-y-2">
                <div className="w-10 h-1 bg-gray-200 rounded-full"></div><div className="w-14 h-1 bg-gray-200 rounded-full"></div>
              </div>
              <div className="absolute w-20 h-24 bg-white/80 rounded-lg shadow-lg transform rotate-[8deg] top-2 left-8 p-4 space-y-2">
                 <div className="w-12 h-1 bg-gray-200 rounded-full"></div><div className="w-10 h-1 bg-gray-200 rounded-full"></div>
              </div>
              <div className="absolute w-20 h-24 bg-white rounded-lg shadow-xl top-5 left-6 p-4 space-y-2">
                <div className="w-14 h-1 bg-gray-300 rounded-full"></div><div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-14 h-1 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                className="w-full py-3 bg-white text-gray-900 font-bold text-lg rounded-full shadow-xl hover:scale-[1.03] transition duration-200"
                onClick={() => showScreen('createAccount')}
              >
                Create Account
              </button>
              <button
                className="w-full py-3 bg-white/30 text-white font-bold text-lg rounded-full border border-white/50 backdrop-blur-sm hover:bg-white/40 transition duration-200"
                onClick={() => showScreen('welcomeBack')}
              >
                Log In
              </button>
            </div>
          </div>
        );

      case 'createAccount':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50">
            <Header title={'Create Your Account'} onBack={() => showScreen('welcomeChoice')} showProfileIcon={false} showScreen={showScreen} />
            <div className="flex-1 p-6 flex justify-center items-start pt-12">
              <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                <p className="text-gray-500 mb-6">Fill in your details below to get started.</p>
                <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" value={accountForm.fullName} onChange={(e) => setAccountForm({...accountForm, fullName: e.target.value})} />
                <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" value={accountForm.email} onChange={(e) => setAccountForm({...accountForm, email: e.target.value})} />
                <input type="password" placeholder="Password" className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" value={accountForm.password} onChange={(e) => setAccountForm({...accountForm, password: e.target.value})} />
                <button className="w-full py-3 mb-4 text-white font-bold text-lg rounded-xl shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('verifyEmail')}>
                  Sign Up
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition duration-150"
                >
                  <Image
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="Google G Logo"
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                  Sign in with Google
                </button>

                <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showScreen('welcomeBack')}>
                  Already have an account? Sign in.
                </span>
              </div>
            </div>
          </div>
        );

      case 'welcomeBack':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50">
            <Header title={'Welcome Back'} onBack={() => showScreen('welcomeChoice')} showProfileIcon={false} showScreen={showScreen} />
            <div className="flex-1 p-6 flex justify-center items-start pt-12">
              <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500 mb-6">Sign in to continue your journey.</p>
                <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" value={accountForm.email} onChange={(e) => setAccountForm({...accountForm, email: e.target.value})} />
                <input type="password" placeholder="Password" className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" value={accountForm.password} onChange={(e) => setAccountForm({...accountForm, password: e.target.value})} />
                <div className="flex justify-end w-full mb-4">
                  <span className="text-purple-700 cursor-pointer font-semibold text-sm hover:text-purple-500" onClick={() => showScreen('forgotPassword')}>
                    Forgot Password?
                  </span>
                </div>
                <button className="w-full py-3 mb-4 text-white font-bold text-lg rounded-xl shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => { showAlert('Logged in (demo)'); showScreen('dashboard'); }}>
                  Sign In
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition duration-150"
                >
                  <Image
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    alt="Google G Logo"
                    width={24}
                    height={24}
                    className="mr-3"
                  />
                  Sign in with Google
                </button>

                <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showScreen('createAccount')}>
                  Need an account? Sign up.
                </span>
              </div>
            </div>
          </div>
        );

      case 'forgotPassword':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50">
            <Header title={'Forgot Password'} onBack={() => showScreen('welcomeBack')} showProfileIcon={false} showScreen={showScreen} />
            <div className="flex-1 p-6 flex justify-center items-start pt-12">
              <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset</h2>
                <p className="text-gray-500 mb-6">Enter your email address to receive a password reset link.</p>
                <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" value={accountForm.email} onChange={(e) => setAccountForm({...accountForm, email: e.target.value})} />
                <button className="w-full py-3 mb-4 text-white font-bold text-lg rounded-xl shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => { showAlert('Password reset link sent to your email (demo)'); showScreen('welcomeBack'); }}>
                  Send Reset Link
                </button>
                <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showScreen('welcomeBack')}>
                  Back to Sign In
                </span>
              </div>
            </div>
          </div>
        );

      case 'verifyEmail':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50">
            <Header title={'Verify Email'} onBack={() => showScreen('createAccount')} showProfileIcon={false} showScreen={showScreen} />
            <div className="flex-1 p-6 flex justify-center items-start pt-12">
              <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                <p className="text-gray-500 mb-6">Please check your inbox at **{accountForm.email || 'your email'}** for a 6-digit verification code.</p>
                <input type="text" placeholder="6-Digit Code" maxLength={6} className="w-full p-4 mb-4 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
                <button className="w-full py-3 mb-4 text-white font-bold text-lg rounded-xl shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => { showAlert('Email Verified! Setting up your profile...'); showScreen('personalId'); }}>
                  Verify
                </button>
                <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showAlert('Resending code (demo)')}>
                  Resend Code
                </span>
              </div>
            </div>
          </div>
        );

      case 'personalId':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 p-6 justify-center items-center">
            <div className="w-full max-w-md">
              <div className="relative mb-6 text-center">
                <button className="absolute top-1 left-0 text-gray-600 font-semibold flex items-center" onClick={() => showScreen('verifyEmail')}>&larr; Back</button>
                <h1 className="text-3xl font-bold text-gray-900">Personal ID</h1>
              </div>
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-6xl">👤</div>
              </div>
              <input type="text" placeholder="First Name" className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
              <input type="text" placeholder="Last Name" className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
              <input type="date" placeholder="Date of Birth" className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-500" />
              <input type="tel" placeholder="Phone Number" className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" />
              <div className="flex items-center justify-between w-full p-4 mb-8 border border-gray-300 rounded-lg">
                <label className="text-gray-500">Profile Picture</label>
                <label htmlFor="profilePicture" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 transition duration-150">Choose File</label>
                <input type="file" id="profilePicture" accept=".jpg,.jpeg,.png" className="hidden" />
              </div>
              <button className="w-full py-4 text-white font-bold text-lg rounded-full shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)' }} onClick={() => { showAlert('Profile created! Welcome aboard.'); showScreen('dashboard'); }}>
                Get Started
              </button>
            </div>
          </div>
        );
        
      case 'dashboard':
        const dashboardCards = [
          { id: 'visa', icon: '/visa.png', title: 'Visa Requirement', detail: 'Check country entry rules.' },
          { id: 'upload', icon: '/document.png', title: 'Document Upload', detail: 'Store and track your files.' },
          { id: 'calendar', icon: '/calendar.png', title: 'Calendar', detail: 'Plan your travel deadlines.' },
          { id: 'reviews', icon: '/review.png', title: 'Traveler Reviews', detail: 'Share and read experiences.' },
        ];

        return (
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 grainy-bg">
             <style jsx global>{`
              .grainy-bg::after {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-image: url('https://www.transparenttextures.com/patterns/gplay.png');
                opacity: 0.05;
                pointer-events: none;
                animation: grain 8s steps(10) infinite;
              }
              @keyframes grain {
                0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-5%, -10%); } 20% { transform: translate(-15%, 5%); } 30% { transform: translate(7%, -25%); } 40% { transform: translate(-5%, 25%); } 50% { transform: translate(-15%, 10%); } 60% { transform: translate(15%, 0%); } 70% { transform: translate(0%, 15%); } 80% { transform: translate(3%, 35%); } 90% { transform: translate(-10%, 10%); }
              }
            `}</style>
            <Header title="Hello, User" onBack={() => showScreen('welcomeChoice')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
                {dashboardCards.map((card) => (
                  <div 
                    key={card.id}
                    className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 overflow-hidden"
                    onClick={() => showScreen(card.id)}
                  >
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <div className="mb-3 flex justify-center items-center h-14">
                          <Image src={card.icon} alt={card.title} width={56} height={56} className="object-contain" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{card.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm h-0 opacity-0 group-hover:h-auto group-hover:mt-2 group-hover:opacity-100 transition-all duration-300">
                        {card.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'visa':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Visa Requirement" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Nationality</label>
                  <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                    <option>Thailand</option><option>Japan</option><option>France</option><option>USA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Destination</label>
                  <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option>France</option><option>USA</option><option>Japan</option><option>Thailand</option>
                  </select>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 transition duration-150 flex items-center justify-center" onClick={() => showScreen('visaResult')}>
                  Check Requirements
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">Mock result based on selected countries.</p>
            </div>
          </div>
        );

      case 'visaResult':
        const mockRequirements = [ 'Passport valid for 6 months beyond intended stay', 'Completed Visa Application Form', 'Two recent passport-sized photos (35mm x 45mm)', 'Proof of accommodation (Hotel booking or host invitation)', 'Proof of Funds (Bank statements for last 3 months)', 'Travel Insurance covering entire stay', 'Round-trip flight ticket reservations' ];
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title={`Requirements & Checklist for ${destination}`} onBack={() => showScreen('visa')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
                    <h3 className="text-xl font-bold text-purple-700 mb-3">Visa Checklist</h3>
                    <div className="space-y-3">
                        {mockRequirements.map((item, index) => (
                          <label key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <span className="font-medium text-gray-900">{item}</span>
                            <input type="checkbox" defaultChecked={index < 3} className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                          </label>
                        ))}
                    </div>
                </div>
              <div className="mt-6 space-y-3">
                <button className="w-full py-3 text-white font-bold rounded-xl shadow-md" style={{background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b'}} onClick={() => showAlert('Open official embassy link (demo)')}>
                  Open Official Source
                </button>
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-700 transition duration-150" onClick={() => showScreen('calendar')}>
                  Add deadlines to Calendar
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'upload':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Your Documents" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-200">
                  <div><strong className="text-gray-900">Passport</strong> <span className="text-sm text-red-600">• Expires: 2025-11-10</span></div>
                  <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Expiring soon</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-200">
                  <div><strong className="text-gray-900">Visa (France)</strong> <span className="text-sm text-green-600">• Expires: 2026-05-02</span></div>
                  <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Valid</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 transition duration-150" onClick={() => showScreen('uploadForm')}>
                Upload New Document
              </button>
            </div>
          </div>
        );
        
      case 'uploadForm':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Upload Document" onBack={() => showScreen('upload')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-2xl mx-auto w-full">
                <label className="block text-sm font-medium text-gray-900">Document Type</label>
                <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4">
                  <option>Passport</option><option>Visa</option><option>Travel Insurance</option><option>Photo</option>
                </select>
                <label className="block text-sm font-medium text-gray-900">Choose File</label>
                <div className="flex items-center space-x-3 mt-1 mb-4">
                    <label htmlFor="docUploadFile" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 transition duration-150">
                        Choose File
                    </label>
                    <input type="file" id="docUploadFile" className="hidden" />
                    <span className="text-sm text-gray-500">No file chosen</span>
                </div>
                <label className="block text-sm font-medium text-gray-900">Expiry Date</label>
                <input type="date" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-6" />
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-700 transition duration-150" onClick={() => showScreen('upload')}>
                  Save
                </button>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Reviews" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-6xl mx-auto w-full text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  { name: 'Mmay M', stars: 5, text: 'Bangkok → Paris trip. Visa approved in 5 days. Uploading documents to JETLAY was super smooth!', avatarBg: '#581c87', img: 'Visa+Document+Preview' },
                  { name: 'honny M', stars: 4, text: 'JETLAY alerted me about my passport expiry before booking my Singapore trip. Lifesaver!', avatarBg: '#eab308', img: 'Singapore+F1+Track+Preview' },
                  { name: 'Fern B.', stars: 4, text: 'Docs synced to Google Calendar perfectly! Reminder saved me.', avatarBg: '#6b21a8', img: null },
                  { name: 'Bank G.', stars: 3, text: 'Visa took 10 days. Make sure to book flights early!', avatarBg: '#1e1b4b', img: null },
                ].map((review, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 flex flex-col gap-3">
                    <div className="flex items-center gap-3 font-semibold text-gray-900">
                      <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm" style={{ backgroundColor: review.avatarBg }}>{review.name[0]}</div>
                      <span>{review.name}</span>
                    </div>
                    <div className="text-yellow-500 text-xl">{'★'.repeat(review.stars) + '☆'.repeat(5 - review.stars)}</div>
                    <p className="text-gray-600 text-sm text-left leading-relaxed">{review.text}</p>
                    {review.img && ( <Image width={400} height={120} className="w-full h-32 object-cover rounded-lg mt-2 bg-gray-100" src={`https://placehold.co/400x120/f3f4f6/6b21a8?text=${review.img}`} alt="Review Visual" /> )}
                    <span className="text-xs text-gray-400 mt-auto pt-2 text-left">2 weeks ago (demo)</span>
                  </div>
                ))}
              </div>
              <button className="w-64 py-3 mt-8 text-white font-bold rounded-xl shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('addReview')}>
                Add your reviews
              </button>
            </div>
          </div>
        );

      case 'addReview':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Add Review" onBack={() => showScreen('reviews')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-md mx-auto w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="mb-5"><input type="text" placeholder="Title (e.g., Bangkok → Paris)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" style={{height: 50}} /></div>
                <div className="mb-5"><textarea placeholder="Your experience...." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" style={{minHeight: 150}}></textarea></div>
                <div className="mb-5"><input type="url" placeholder="Google Map place link (optional)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" style={{height: 50}} /></div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Attach photos</label>
                  <div className="flex items-center space-x-3">
                    <label htmlFor="reviewFile" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 transition duration-150">Choose File</label>
                    <input type="file" multiple id="reviewFile" className="hidden" />
                    <span className="text-sm text-gray-500">No file chosen</span>
                  </div>
                </div>
                <button className="w-full py-3 text-white font-bold rounded-xl shadow-lg transition duration-200" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('reviews')}>
                  Post Review
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'calendar':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Travel Calendar" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} />
            <div className="p-6 flex-1 max-w-5xl mx-auto w-full">
              <div className="flex flex-wrap gap-3 items-center mb-4">
                <select className="p-3 border border-gray-300 rounded-lg shadow-sm" value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))}>
                  {monthNames.map((name, index) => <option key={name} value={index}>{name}</option>)}
                </select>
                <select className="p-3 border border-gray-300 rounded-lg shadow-sm" value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value))}>
                  {Array.from({ length: 2099 - today.getFullYear() + 1 }, (_, i) => today.getFullYear() + i).map(y => ( <option key={y} value={y}>{y}</option> ))}
                </select>
                <button className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150" onClick={() => changeMonth(-1)}>&#9664;</button>
                <button className="px-4 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150" onClick={() => changeMonth(1)}>&#9654;</button>
              </div>
              <table className="w-full border-collapse bg-white rounded-xl shadow-xl overflow-hidden">
                <thead>
                  <tr className="bg-yellow-400 text-gray-900">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <th key={day} className="p-3 border border-gray-300 font-bold">{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {renderCalendar(currentMonth, currentYear)}
                </tbody>
              </table>
              <div className="mt-5 space-y-3">
                <textarea placeholder="Add notes for your trip... e.g., 'Day 1: Arrive in Paris, check in to hotel. Evening: Eiffel Tower. Day 2: Louvre museum, then walk along the Seine.'" className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500" rows={4} value={calendarNote} onChange={(e) => setCalendarNote(e.target.value)}></textarea>
                <button className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 transition duration-150" onClick={() => showAlert('Note saved (demo)')}>Save Note</button>
              </div>
            </div>
          </div>
        );

      case 'user':
        return (
           <div className="flex flex-col min-h-screen bg-purple-50 p-6 justify-center items-center">
            <div className="w-full max-w-md">
              <div className="relative mb-6 text-center">
                <button className="absolute top-1 left-0 text-gray-600 font-semibold flex items-center" onClick={() => showScreen('dashboard')}>
                  &larr; Back
                </button>
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              </div>

              
              <div className="flex justify-center mb-6">
                {profile?.avatar_url ? (
                  <img
                    src = {profile.avatar_url}
                    alt = "Profile"
                    className = "w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-6xl">
                  👤
                </div>
                )}
              </div>

              <input
                type="text"
                placeholder="First Name"
                value={profile?.first_name || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
              
              <input
                type="text"
                placeholder="Last Name"
                value={profile?.last_name || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />

              <input
                type="date"
                placeholder="Birth Date"
                value={profile?.birth_date || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, birth_date: e.target.value } : null)}
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={profile?.phone || ''}
                onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />

              <div className="flex items-center justify-between w-full p-4 mb-8 border border-gray-300 rounded-lg">
                <label className="text-gray-500">Profile Picture</label>
                <label
                  htmlFor="profilePicture"
                  className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 transition duration-150"
                >
                Choose File
              </label>
              <input
                type="file"
                id="profilePicture"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file || !profile?.id) return

                try {
                  const fileExt = file.name.split('.').pop()
                  const fileName = `${profile.id}.${fileExt}`
                  const filePath = `avatars/${fileName}`

                // Upload the file to Supabase Storage
                  const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, file, { upsert: true })

                  if (uploadError) throw uploadError

                // Get public URL for the uploaded file
                  const { data: publicURLData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath)

                  const publicURL = publicURLData.publicUrl

                // Update profile in the database
                  const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ avatar_url: publicURL })
                    .eq('id', profile.id)

                  if (updateError) throw updateError

                // Update state and show alert
                  setProfile({ ...profile, avatar_url: publicURL })
                  showAlert('Profile picture updated successfully!')
                } catch (error) {
                  console.error('Error uploading image:', error)
                  showAlert('Failed to upload image.')
                }
              }}
            />
          </div>

                <button
                className="w-full py-4 text-white font-bold text-lg rounded-full shadow-lg transition duration-200"
                style={{
                  background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                }}
                onClick={async () => {
                  if (!profile) {
                  showAlert("Profile not loaded yet!");
                  return;
                  }

                  const { error } = await supabase
                  .from("profiles")
                  .update({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone: profile.phone,
                    birth_date: profile.birth_date,
                    avatar_url: profile.avatar_url,
                  })
                  .eq("id", profile.id);

                  if (error) {
                  console.error("Error updating profile:", error);
                  showAlert("Failed to update profile!");
                  } else {
                  showAlert("Profile Saved!");
                  }
                }}
                >
                Save Changes
                </button>
              
              <button 
                  className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition duration-150" 
                  onClick={async () => {
                    await supabase.auth.signOut()
                    showAlert('You have been logged out.')
                    showScreen('welcomeChoice')
                  }}
                >
                  Log Out
                </button>
            </div>
          </div>
        );

      default:
        return <div className="p-10 text-center">Screen Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <CustomAlert message={alertMessage} onClose={closeAlert} />
      {renderScreen()}
    </div>
  );
};

// --- Sub-Components ---

const Header: React.FC<HeaderProps> = ({ title, onBack, showProfileIcon, showScreen }) => (
  <header className="relative flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-10">
    <div className="flex items-center gap-3">
      <button
        className="text-xl font-bold text-gray-500 hover:text-gray-700 transition"
        onClick={onBack}
      >
        &larr;
      </button>
      <Image
        width={40}
        height={40}
        className="rounded-lg"
        src="/raw-removebg-preview.png"
        alt="JETLAY Logo"
      />
      <h2 className="text-2xl font-semibold text-gray-900 m-0">{title}</h2>
    </div>

    {/* Profile button in the top right */}
    {showProfileIcon && (
      <div
        onClick={() => showScreen("user")}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition"
      >
        <span className="text-xl">👤</span>
      </div>
    )}
  </header>
);

export default App;