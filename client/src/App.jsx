import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import MainApp from './pages/MainApp';
import LandingPage from './pages/LandingPage';

function App() {
  const [page, setPage] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [initialAuthMode, setInitialAuthMode] = useState('signIn');
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) setTheme(storedTheme);
    else {
       const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
       setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
        if (token) {
            try {
                const response = await fetch('/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setCurrentUser(userData);
                    setPage('main');
                } else {
                    handleLogout(); 
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
                handleLogout();
            }
        }
        setIsAuthLoading(false);
    };
    fetchUser();
  }, [token]);

  const handleLoginSuccess = (data) => {
    localStorage.setItem('token', data.token);
    setToken(data.token); 
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setPage('landing');
  };
  
  const navigate = (targetPage, mode = 'signIn') => {
    setInitialAuthMode(mode);
    setPage(targetPage);
  };

  const renderPage = () => {
    if (isAuthLoading && token) {
        return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">Loading...</div>;
    }

    switch (page) {
      case 'landing':
        return <LandingPage navigate={navigate} theme={theme} setTheme={setTheme} />;
      case 'auth':
        return <AuthPage onLoginSuccess={handleLoginSuccess} initialMode={initialAuthMode} />;
      case 'main':
        // This is my protected route.
        return currentUser ? <MainApp onLogout={handleLogout} theme={theme} setTheme={setTheme} user={currentUser} setUser={setCurrentUser} /> : <AuthPage onLoginSuccess={handleLoginSuccess} initialMode='signIn'/>;
      default:
        return <LandingPage navigate={navigate} theme={theme} setTheme={setTheme} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
        {renderPage()}
    </div>
  );
}

export default App;