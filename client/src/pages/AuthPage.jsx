import React, { useState } from 'react';
import { Logo } from '../components/Icons';

const AuthPage = ({ onLoginSuccess, initialMode }) => {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const isSignUp = mode === 'signUp';
  
  // --- THE FIX IS HERE ---
  // 1. اقرأ الرابط الأساسي للخادم من متغيرات البيئة.
  // في بيئة الإنتاج (Vercel)، ستكون هذه قيمة رابط Railway.
  // في البيئة المحلية، ستكون هذه قيمة فارغة، مما يجعل الطلبات نسبية (وهو ما يحتاجه الـ proxy).
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  const API_URL = '/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const fullName = isSignUp ? form.fullname.value : undefined;

    // 2. قم ببناء الرابط الكامل للطلب بدمج الرابط الأساسي مع مسار الـ API.
    const endpoint = isSignUp 
        ? `${API_BASE_URL}${API_URL}/register` 
        : `${API_BASE_URL}${API_URL}/login`;

    const body = JSON.stringify({
        fullName,
        email,
        password,
        rememberMe: !isSignUp ? rememberMe : undefined,
    });

    try {
        // 3. استخدم الرابط الكامل في طلب fetch.
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Something went wrong');
        }
        onLoginSuccess(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isSignUp ? 'signIn' : 'signUp');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
            <Logo className="mx-auto" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">Synergize</h1>
        </div>
        
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-2xl font-bold text-center mb-1 text-slate-900 dark:text-white">
            {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6 text-sm">
            {isSignUp ? 'Start your journey with us.' : 'Sign in to continue.'}
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 text-center">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" placeholder="John Doe" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="you@example.com" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center">
                      <button
                          type="button"
                          role="checkbox"
                          aria-checked={rememberMe}
                          onClick={() => setRememberMe(!rememberMe)}
                          className={`
                              w-5 h-5 flex-shrink-0 inline-flex items-center justify-center 
                              rounded-md border-2 
                              transition-colors duration-200 ease-in-out
                              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                              dark:focus:ring-offset-slate-800
                              ${rememberMe 
                                  ? 'bg-indigo-600 border-indigo-600' 
                                  : 'bg-transparent border-gray-300 dark:border-gray-600'
                              }
                          `}
                      >
                          {rememberMe && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                          )}
                      </button>
                      <label 
                          htmlFor="remember-me" 
                          onClick={() => setRememberMe(!rememberMe)}
                          className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer"
                      >
                          Remember me
                      </label>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl px-4 py-2.5 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>
          
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button onClick={toggleMode} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline ml-1">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
