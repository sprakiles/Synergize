import React, { useState } from 'react';
import useApi from '../../hooks/useApi.js';

const SettingsView = ({ currentUser, setCurrentUser }) => {
    const [activeTab, setActiveTab] = useState('Profile');
    const [message, setMessage] = useState({ type: '', text: '' });
    const api = useApi();

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const { fullName, email, avatarUrl } = e.target.elements;
        setMessage({ type: '', text: '' });
        
        try {
            const updatedUser = await api('/api/users/profile', 'PUT', {
                fullName: fullName.value,
                email: email.value,
                avatarUrl: avatarUrl.value
            });
            setCurrentUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
        }
    };
    
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = e.target.elements;
        setMessage({ type: '', text: '' });

        if (newPassword.value !== confirmPassword.value) {
            return setMessage({ type: 'error', text: 'New passwords do not match.' });
        }

        try {
            const result = await api('/api/users/password', 'PUT', {
                currentPassword: currentPassword.value,
                newPassword: newPassword.value
            });
            setMessage({ type: 'success', text: result.msg });
            e.target.reset();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to change password.' });
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-8">Settings</h1>
            
            {message.text && (
              <div className={`p-4 mb-4 text-sm rounded-xl ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                {message.text}
              </div>
            )}

            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8">
                {['Profile', 'Password', 'Notifications'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`px-6 py-3 text-sm font-semibold ${activeTab === tab ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="max-w-2xl">
                {activeTab === 'Profile' && (
                    <form onSubmit={handleProfileUpdate} className="space-y-6 animate-contentFadeIn">
                        <div>
                            <label className="block text-sm font-medium" htmlFor="fullName">Full Name</label>
                            <input id="fullName" name="fullName" type="text" defaultValue={currentUser.fullName} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium" htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" defaultValue={currentUser.email} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium" htmlFor="avatarUrl">Avatar URL</label>
                            <input id="avatarUrl" name="avatarUrl" type="text" defaultValue={currentUser.avatarUrl || ''} placeholder="https://..." className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                        </div>
                        <button type="submit" className="mt-8 text-sm font-semibold text-white bg-indigo-600 rounded-xl px-5 py-2.5">Save Changes</button>
                    </form>
                )}
                 {activeTab === 'Password' && (
                    <form onSubmit={handlePasswordChange} className="space-y-6 animate-contentFadeIn">
                        <div>
                            <label className="block text-sm font-medium" htmlFor="currentPassword">Current Password</label>
                            <input id="currentPassword" name="currentPassword" type="password" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium" htmlFor="newPassword">New Password</label>
                            <input id="newPassword" name="newPassword" type="password" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium" htmlFor="confirmPassword">Confirm New Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                        </div>
                        <button type="submit" className="mt-8 text-sm font-semibold text-white bg-indigo-600 rounded-xl px-5 py-2.5">Change Password</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SettingsView;