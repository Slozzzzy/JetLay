"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

// --- Type Definitions ---

type CustomAlertProps = {
  message: string;
  onClose: () => void;
};

type HeaderProps = {
  title: string;
  onBack: () => void;
  showProfileIcon: boolean;
  showScreen: (id: string) => void;
  hideBackButton?: boolean;
  profilePictureUrl?: string; // <-- NEW: To show profile picture in header
};

// --- New Type Definitions for Features ---
type Document = {
  id: number;
  type: string;
  fileName: string;
  expiry: string;
};

type Review = {
  id: number;
  name: string;
  stars: number;
  text: string;
  avatarBg: string;
  img?: string;
  title: string;
  imagePreviewUrl?: string; 
};

type CalendarEvent = {
  id: number;
  text: string;
};

// --- Reusable Components ---

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-transparent z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
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

  // --- State Management for Features ---

  // Auth & Form State
  const [accountForm, setAccountForm] = useState({ fullName: '', email: '', password: '' });
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // <-- NEW: For profile pic

  // Visa State
  const [nationality, setNationality] = useState('Thailand');
  const [destination, setDestination] = useState('France');
  const [visaRequirements, setVisaRequirements] = useState<string[]>([]);

  // Document Upload State
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, type: 'Passport', fileName: 'Mickey_Mouse_Passport.pdf', expiry: '2025-11-10' },
    { id: 2, type: 'Visa (France)', fileName: 'France_Schengen_Visa.pdf', expiry: '2026-05-02' },
  ]);
  const [uploadFormState, setUploadFormState] = useState({ type: 'Passport', file: null as File | null, expiry: '' });
  
  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, name: 'Mmay M', stars: 5, text: 'Bangkok → Paris trip. Visa approved in 5 days. Uploading documents to JETLAY was super smooth!', avatarBg: '#581c87', img: 'Visa+Document+Preview', title: 'Great Visa Process!' },
    { id: 2, name: 'honny M', stars: 4, text: 'JETLAY alerted me about my passport expiry before booking my Singapore trip. Lifesaver!', avatarBg: '#eab308', img: 'Singapore+F1+Track+Preview', title: 'Passport Expiry Alert' },
  ]);
  const [reviewFormState, setReviewFormState] = useState({ title: '', text: '', stars: 5, imageFile: null as File | null, imagePreviewUrl: '' });


  // Calendar State
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({
    [`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`]: [{ id: 1, text: 'Submit visa application' }]
  });
  const [eventText, setEventText] = useState('');

  // --- Core App Logic ---

  const showScreen = useCallback((id: string) => setCurrentScreen(id), []);
  
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => showScreen('welcomeChoice'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, showScreen]);

  const showAlert = useCallback((message: string) => setAlertMessage(message), []);
  const closeAlert = useCallback(() => setAlertMessage(''), []);

  const showProfileIcon = !['splash', 'welcomeChoice', 'createAccount', 'welcomeBack', 'forgotPassword', 'verifyEmail', 'personalId'].includes(currentScreen);
  
  // --- Feature Handlers ---

  // Visa Handler
  const handleCheckVisa = () => {
    // --- UPDATED: Significantly expanded mock database ---
    const mockDb: Record<string, Record<string, string[]>> = {
      'Thailand': {
        'France': ['Schengen Visa Form', 'Passport with 2 blank pages', 'Proof of accommodation', 'Travel insurance (30,000 EUR coverage)', 'Flight itinerary'],
        'USA': ['DS-160 Confirmation Page', 'Valid Passport', 'Proof of funds', 'Appointment confirmation letter', 'Photo (2x2 inches)'],
        'Japan': ['Visa Application Form', 'Valid Passport', 'Schedule of Stay', 'Proof of relationship (if applicable)', 'Bank statement'],
        'United Kingdom': ['UK Visa Application', 'Proof of financial means', 'Accommodation details', 'Tuberculosis test results (if applicable)'],
        'Australia': ['eVisitor or Visitor visa (subclass 600)', 'Sufficient funds', 'Health and character checks'],
        'South Korea': ['K-ETA required for visa-free entry', 'Valid passport', 'Return ticket confirmation']
      },
      'USA': {
        'France': ['Passport valid for 3 months beyond stay', 'Proof of funds', 'Details of accommodation (Schengen Area visa-free)'],
        'Japan': ['Visa waiver program (up to 90 days)', 'Valid e-Passport'],
        'United Kingdom': ['Visa-free for tourism up to 6 months', 'Proof of onward travel may be requested'],
        'Australia': ['ETA (Electronic Travel Authority) required', 'Valid US Passport'],
        'Brazil': ['e-Visa required', 'Passport-sized photo', 'Proof of sufficient funds'],
        'South Africa': ['Visa-free for up to 90 days', 'Proof of yellow fever vaccination if coming from an infected area']
      },
      'United Kingdom': {
          'USA': ['ESTA required for visa waiver program', 'Valid e-Passport'],
          'Japan': ['Visa waiver for up to 90 days'],
          'Thailand': ['Tourist visa required', 'Proof of funds', 'Itinerary'],
          'Canada': ['Visa-free (eTA required for air travel)'],
          'New Zealand': ['NZeTA required for visa waiver'],
      },
      'India': {
          'USA': ['B1/B2 Visa required', 'Interview at US consulate', 'Proof of ties to home country'],
          'United Kingdom': ['Standard Visitor visa required', 'Biometrics appointment'],
          'Thailand': ['Visa on Arrival available (check terms)', 'e-Visa available'],
          'UAE': ['Pre-arranged visa required', 'Often sponsored by airline or hotel'],
      },
      'Australia': {
        'USA': ['ESTA required for visa waiver program'],
        'United Kingdom': ['Visa-free entry for up to 6 months'],
        'Indonesia': ['Visa on Arrival available for 30 days'],
        'Fiji': ['Visa-free for tourism'],
      }
    };
    const reqs = mockDb[nationality]?.[destination] ?? [`No specific data for ${nationality} to ${destination}. Please check the official embassy website.`];
    setVisaRequirements(reqs);
    showScreen('visaResult');
  };

  // Upload Handler
  const handleSaveDocument = () => {
    if (!uploadFormState.file || !uploadFormState.expiry) {
      showAlert('Please select a file and set an expiry date.');
      return;
    }
    const newDocument: Document = {
      id: Date.now(),
      type: uploadFormState.type,
      fileName: uploadFormState.file.name,
      expiry: uploadFormState.expiry,
    };
    setDocuments(prev => [...prev, newDocument]);
    showAlert('Document saved successfully!');
    setUploadFormState({ type: 'Passport', file: null, expiry: '' }); // Reset form
    showScreen('upload');
  };

  // Review Handler
  const handlePostReview = () => {
    if (!reviewFormState.title || !reviewFormState.text) {
      showAlert('Please fill in a title and your experience.');
      return;
    }
    const newReview: Review = {
      id: Date.now(),
      name: 'Mickey M.', // Mock user name
      stars: reviewFormState.stars,
      text: reviewFormState.text,
      title: reviewFormState.title,
      avatarBg: '#1e1b4b',
      imagePreviewUrl: reviewFormState.imagePreviewUrl,
    };
    setReviews(prev => [newReview, ...prev]);
    showAlert('Thank you for your review!');
    setReviewFormState({ title: '', text: '', stars: 5, imageFile: null, imagePreviewUrl: '' }); 
    showScreen('reviews');
  };
  
  // Calendar Handlers
  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setEventText(''); // Clear previous text
  };

  const handleAddEvent = () => {
    if (!selectedDate || !eventText.trim()) return;
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const newEvent: CalendarEvent = { id: Date.now(), text: eventText };
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] ?? []), newEvent]
    }));
    setEventText(''); // Clear input after adding
  };
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  const changeMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; } 
    else if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };
  
  const monthNames = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);
  
  const renderCalendar = useCallback(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weeks: React.ReactElement[] = [];
    let days: React.ReactElement[] = [];

    // Fill blank cells for the first week
    for (let i = 0; i < firstDay; i++) {
        days.push(<td key={`empty-start-${i}`} className="p-1 sm:p-3 border border-gray-200 bg-gray-50"></td>);
    }

    // Fill cells with dates
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${currentYear}-${currentMonth}-${day}`;
        const hasEvent = events[dateKey] && events[dateKey].length > 0;
        const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;

        days.push(
            <td 
                key={day} 
                className={`relative p-1 sm:p-3 border border-gray-200 hover:bg-yellow-100 cursor-pointer transition duration-150 text-center ${isSelected ? 'bg-purple-200 font-bold' : ''}`}
                onClick={() => handleDateClick(day)}
            >
                <span>{day}</span>
                {hasEvent && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-600 rounded-full"></div>}
            </td>
        );

        if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
            weeks.push(<tr key={`week-${day}`}>{days}</tr>);
            days = [];
        }
    }
    return weeks;
}, [currentMonth, currentYear, events, selectedDate]);


  // --- Screen Definitions (JSX) ---

  const renderScreen = () => {
    switch (currentScreen) {
      // --- AUTH & SETUP SCREENS ---
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
                <button className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition duration-150">
                  <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google G Logo" width={24} height={24} className="mr-3" />
                  Sign up with Google
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
                <button className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition duration-150">
                   <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google G Logo" width={24} height={24} className="mr-3" />
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
                <div className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-6xl overflow-hidden">
                  {profilePictureUrl ? (
                    <Image src={profilePictureUrl} alt="Profile Preview" layout="fill" objectFit="cover" />
                  ) : (
                    '👤'
                  )}
                </div>
              </div>
              <input type="text" placeholder="First Name" className="w-full p-4 mb-4 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Last Name" className="w-full p-4 mb-4 border border-gray-300 rounded-lg" />
              <input type="date" className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-gray-500" />
              <input type="tel" placeholder="Phone Number" className="w-full p-4 mb-6 border border-gray-300 rounded-lg" />
              <div className="flex items-center justify-between w-full p-4 mb-8 border border-gray-300 rounded-lg">
                <label className="text-gray-500">Profile Picture</label>
                <label htmlFor="profilePicture" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer">Choose File</label>
                <input type="file" id="profilePicture" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
              </div>
              <button className="w-full py-4 text-white font-bold text-lg rounded-full shadow-lg" style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)' }} onClick={() => { showAlert('Profile created! Welcome aboard.'); showScreen('dashboard'); }}>
                Get Started
              </button>
            </div>
          </div>
        );

      // --- MAIN FEATURE SCREENS ---
        
      case 'dashboard':
        const dashboardCards = [
          { id: 'visa', icon: '/visa.png', title: 'Visa Requirement', detail: 'Check country entry rules.' },
          { id: 'upload', icon: '/document.png', title: 'Document Upload', detail: 'Store and track your files.' },
          { id: 'calendar', icon: '/calendar.png', title: 'Calendar', detail: 'Plan your travel deadlines.' },
          { id: 'reviews', icon: '/review.png', title: 'Traveler Reviews', detail: 'Share and read experiences.' },
        ];

        return (
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 grainy-bg">
             <style jsx global>{`.grainy-bg::after { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('https://www.transparenttextures.com/patterns/gplay.png'); opacity: 0.05; pointer-events: none; animation: grain 8s steps(10) infinite; } @keyframes grain { 0%, 100% { transform: translate(0, 0); } 10% { transform: translate(-5%, -10%); } 20% { transform: translate(-15%, 5%); } 30% { transform: translate(7%, -25%); } 40% { transform: translate(-5%, 25%); } 50% { transform: translate(-15%, 10%); } 60% { transform: translate(15%, 0%); } 70% { transform: translate(0%, 15%); } 80% { transform: translate(3%, 35%); } 90% { transform: translate(-10%, 10%); } }`}</style>
            <Header 
              title="Hello, User" 
              onBack={() => {}}
              showProfileIcon={showProfileIcon} 
              showScreen={showScreen} 
              hideBackButton={true}
              profilePictureUrl={profilePictureUrl}
            />
            <div className="p-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
                {dashboardCards.map((card) => (
                  <div key={card.id} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 overflow-hidden" onClick={() => showScreen(card.id)}>
                    <div className="transition-transform duration-300 group-hover:scale-110">
                        <div className="mb-3 flex justify-center items-center h-14">
                          <Image src={card.icon} alt={card.title} width={56} height={56} className="object-contain" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{card.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm h-0 opacity-0 group-hover:h-auto group-hover:mt-2 group-hover:opacity-100 transition-all duration-300">{card.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // --- VISA --- (Updated)
      case 'visa':
        const nationalities = ['Thailand', 'USA', 'United Kingdom', 'India', 'Australia'];
        const destinations = ['France', 'USA', 'Japan', 'United Kingdom', 'Australia', 'South Korea', 'Brazil', 'South Africa', 'Canada', 'New Zealand', 'Indonesia', 'Fiji', 'UAE'];
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Visa Requirement" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl} />
            <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Your Nationality</label>
                  <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={nationality} onChange={(e) => setNationality(e.target.value)}>
                    {nationalities.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Your Destination</label>
                  <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={destination} onChange={(e) => setDestination(e.target.value)}>
                    {destinations.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500" onClick={handleCheckVisa}>
                  Check Requirements
              </button>
            </div>
          </div>
        );

      case 'visaResult':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title={`Requirements for ${destination}`} onBack={() => showScreen('visa')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl}/>
            <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
                <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
                    <h3 className="text-xl font-bold text-purple-700 mb-3">Visa Checklist ({nationality} citizen)</h3>
                    <div className="space-y-3">
                        {visaRequirements.map((item, index) => (
                          <label key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
                            <span className="font-medium text-gray-900">{item}</span>
                            <input type="checkbox" className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                          </label>
                        ))}
                    </div>
                </div>
              <div className="mt-6 space-y-3">
                <button className="w-full py-3 text-white font-bold rounded-xl shadow-md" style={{background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b'}} onClick={() => showAlert('Opening official embassy link (demo)...')}>
                  Open Official Source
                </button>
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md" onClick={() => showScreen('calendar')}>
                  Add deadlines to Calendar
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'upload':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Your Documents" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl}/>
            <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
              <div className="space-y-3">
                {documents.map(doc => {
                  const isExpiringSoon = new Date(doc.expiry) < new Date(new Date().setMonth(new Date().getMonth() + 6));
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border">
                      <div>
                        <strong className="text-gray-900">{doc.type}</strong>
                        <span className={`text-sm ml-2 ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`}>• Expires: {doc.expiry}</span>
                        <p className="text-xs text-gray-500">{doc.fileName}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isExpiringSoon ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {isExpiringSoon ? 'Expiring soon' : 'Valid'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md" onClick={() => showScreen('uploadForm')}>
                Upload New Document
              </button>
            </div>
          </div>
        );
        
      case 'uploadForm':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Upload Document" onBack={() => showScreen('upload')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl}/>
            <div className="p-6 flex-1 max-w-2xl mx-auto w-full">
                <label className="block text-sm font-medium text-gray-900">Document Type</label>
                <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg" value={uploadFormState.type} onChange={e => setUploadFormState(prev => ({ ...prev, type: e.target.value }))}>
                  <option>Passport</option><option>Visa</option><option>Travel Insurance</option><option>ID Card</option>
                </select>
                <label className="block text-sm font-medium text-gray-900 mt-4">Choose File</label>
                <div className="flex items-center space-x-3 mt-1 mb-4">
                    <label htmlFor="docUploadFile" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer">
                        Choose File
                    </label>
                    <input type="file" id="docUploadFile" className="hidden" onChange={e => setUploadFormState(prev => ({ ...prev, file: e.target.files ? e.target.files[0] : null }))}/>
                    <span className="text-sm text-gray-500">{uploadFormState.file?.name ?? 'No file chosen'}</span>
                </div>
                <label className="block text-sm font-medium text-gray-900">Expiry Date</label>
                <input type="date" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg mb-6" value={uploadFormState.expiry} onChange={e => setUploadFormState(prev => ({...prev, expiry: e.target.value}))}/>
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md" onClick={handleSaveDocument}>
                  Save
                </button>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Traveler Reviews" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl}/>
            <div className="p-6 flex-1 max-w-6xl mx-auto w-full text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-5 shadow-lg border flex flex-col gap-3 text-left">
                    <div className="flex items-center gap-3 font-semibold text-gray-900">
                      <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm" style={{ backgroundColor: review.avatarBg }}>{review.name[0]}</div>
                      <span>{review.name}</span>
                    </div>
                    <h4 className="font-bold text-gray-800">{review.title}</h4>
                    <div className="text-yellow-500 text-xl">{'★'.repeat(review.stars) + '☆'.repeat(5 - review.stars)}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
                    {review.imagePreviewUrl && ( <Image width={400} height={120} className="w-full h-32 object-cover rounded-lg mt-2" src={review.imagePreviewUrl} alt="User review image" />)}
                    {review.img && !review.imagePreviewUrl && ( <Image width={400} height={120} className="w-full h-32 object-cover rounded-lg mt-2" src={`https://placehold.co/400x120/f3f4f6/6b21a8?text=${review.img}`} alt="Review Visual" /> )}
                    <span className="text-xs text-gray-400 mt-auto pt-2">Posted recently</span>
                  </div>
                ))}
              </div>
              <button className="w-64 py-3 mt-8 text-white font-bold rounded-xl shadow-lg" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('addReview')}>
                Add Your Review
              </button>
            </div>
          </div>
        );

      case 'addReview':
        return (
          <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
            <Header title="Add Your Review" onBack={() => showScreen('reviews')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl}/>
            <div className="p-6 flex-1 max-w-md mx-auto w-full">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
                  <div className="flex text-3xl">{[1, 2, 3, 4, 5].map(star => (<span key={star} className="cursor-pointer" onClick={() => setReviewFormState(prev => ({ ...prev, stars: star }))}>{star <= reviewFormState.stars ? '★' : '☆'}</span>))}</div>
                </div>
                <div className="mb-4"><input type="text" placeholder="Title (e.g., Bangkok → Paris)" className="w-full p-3 border border-gray-300 rounded-lg" value={reviewFormState.title} onChange={e => setReviewFormState(prev => ({ ...prev, title: e.target.value }))} /></div>
                <div className="mb-4"><textarea placeholder="Your experience..." className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]" value={reviewFormState.text} onChange={e => setReviewFormState(prev => ({ ...prev, text: e.target.value }))}></textarea></div>
                <label className="block text-sm font-medium text-gray-900 mt-4">Add Photo</label>
                <div className="flex items-center space-x-3 mt-1 mb-4">
                    <label htmlFor="reviewPhotoUpload" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer">Choose File</label>
                    <input type="file" id="reviewPhotoUpload" className="hidden" accept="image/*" onChange={e => { const file = e.target.files ? e.target.files[0] : null; if (file) { setReviewFormState(prev => ({...prev, imageFile: file, imagePreviewUrl: URL.createObjectURL(file)}));}}}/>
                    <span className="text-sm text-gray-500 truncate">{reviewFormState.imageFile?.name ?? 'No file chosen'}</span>
                </div>
                {reviewFormState.imagePreviewUrl && (<div className="mb-4"><Image src={reviewFormState.imagePreviewUrl} alt="Review preview" width={400} height={200} className="w-full h-auto object-cover rounded-lg" /></div>)}
                <button className="w-full py-3 text-white font-bold rounded-xl shadow-lg" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={handlePostReview}>Post Review</button>
              </div>
            </div>
          </div>
        );
        
      case 'calendar':
        const selectedDateKey = selectedDate ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}` : '';
        const selectedDateEvents = events[selectedDateKey] || [];
        return (
            <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
                <Header title="Travel Calendar" onBack={() => showScreen('dashboard')} showProfileIcon={showProfileIcon} showScreen={showScreen} profilePictureUrl={profilePictureUrl}/>
                <div className="p-4 flex-1 max-w-6xl mx-auto w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-xl">
                             <div className="flex flex-wrap gap-3 items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800 w-full sm:w-auto">{`${monthNames[currentMonth]} ${currentYear}`}</h3>
                                <div className="flex-grow"></div>
                                <button className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md" onClick={() => changeMonth(-1)}>‹ Prev</button>
                                <button className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md" onClick={() => changeMonth(1)}>Next ›</button>
                            </div>
                            <table className="w-full border-collapse">
                                <thead><tr className="bg-yellow-400 text-gray-900">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <th key={day} className="p-2 sm:p-3 border font-bold">{day}</th>)}</tr></thead>
                                <tbody>{renderCalendar()}</tbody>
                            </table>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-xl">
                            <h3 className="text-xl font-bold text-purple-700 mb-4">{selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Select a date'}</h3>
                            {selectedDate && (
                                <div className="space-y-4">
                                    <div className="space-y-2 max-h-48 overflow-y-auto">{selectedDateEvents.length > 0 ? selectedDateEvents.map(event => (<div key={event.id} className="p-3 bg-purple-100 rounded-lg text-sm">{event.text}</div>)) : <p className="text-gray-500 text-sm">No events for this day.</p>}</div>
                                    <div>
                                        <textarea placeholder="Add new event..." className="w-full p-2 border rounded-lg" rows={3} value={eventText} onChange={e => setEventText(e.target.value)}/>
                                        <button className="w-full mt-2 py-2 bg-gray-900 text-white font-bold rounded-lg" onClick={handleAddEvent}>Add Event</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );

      case 'user':
        return (
           <div className="flex flex-col min-h-screen bg-purple-50 p-6 justify-center items-center">
            <div className="w-full max-w-md">
              <div className="relative mb-6 text-center">
                <button className="absolute top-1 left-0 text-gray-600 font-semibold flex items-center" onClick={() => showScreen('dashboard')}>&larr; Back</button>
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
              </div>
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-6xl overflow-hidden">
                  {profilePictureUrl ? (
                    <Image src={profilePictureUrl} alt="Profile Preview" layout="fill" objectFit="cover" />
                  ) : (
                    '👤'
                  )}
                </div>
              </div>
              <input type="text" placeholder="First Name" defaultValue="Mickey" className="w-full p-4 mb-4 border rounded-lg" />
              <input type="text" placeholder="Last Name" defaultValue="Mouse" className="w-full p-4 mb-4 border rounded-lg" />
              <input type="date" defaultValue="1982-11-18" className="w-full p-4 mb-4 border rounded-lg text-gray-500" />
              <input type="tel" placeholder="Phone Number" defaultValue="020-123-4567" className="w-full p-4 mb-6 border rounded-lg" />
              <div className="flex items-center justify-between w-full p-4 mb-8 border rounded-lg">
                <label className="text-gray-500">Profile Picture</label>
                <label htmlFor="profilePicture" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer">Choose File</label>
                <input type="file" id="profilePicture" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
              </div>
              <button className="w-full py-4 text-white font-bold text-lg rounded-full shadow-lg" style={{background: 'linear-gradient(90deg, #a78bfa, #f472b6)'}} onClick={() => { showAlert('Profile Saved!'); }}>
                Save Changes
              </button>
              <button className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-xl shadow-md" onClick={() => { showAlert('You have been logged out.'); setProfilePictureUrl(''); showScreen('welcomeChoice');}}>
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

const Header: React.FC<HeaderProps> = ({ title, onBack, showProfileIcon, showScreen, hideBackButton, profilePictureUrl }) => (
  <header className="relative flex items-center justify-between p-4 bg-white border-b shadow-md sticky top-0 z-10">
    <div className="flex items-center gap-3">
      {!hideBackButton && (<button className="text-xl font-bold text-gray-500" onClick={onBack}>&larr;</button>)}
      <Image width={40} height={40} className="rounded-lg" src="/raw-removebg-preview.png" alt="JETLAY Logo"/>
      <h2 className="text-2xl font-semibold text-gray-900 m-0">{title}</h2>
    </div>
    {showProfileIcon && (
      <div onClick={() => showScreen("user")} className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer overflow-hidden">
        {profilePictureUrl ? (
          <Image src={profilePictureUrl} alt="Profile" layout="fill" objectFit="cover" />
        ) : (
          <span className="text-xl">👤</span>
        )}
      </div>
    )}
  </header>
);

export default App;