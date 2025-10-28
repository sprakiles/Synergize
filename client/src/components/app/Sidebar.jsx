import React from 'react';
import { Logo, ThemeSwitcher, DashboardIconSvg, MyTasksIcon, SettingsIcon, CollapseLeftIcon, CollapseRightIcon } from '../Icons';

const Sidebar = ({ currentView, setView, onLogout, theme, setTheme, isCollapsed, setCollapsed, user }) => {
    const navItems = [
        { id: 'dashboard', icon: <DashboardIconSvg className="w-6 h-6"/>, label: 'Dashboard' },
        { id: 'myTasks', icon: <MyTasksIcon className="w-6 h-6"/>, label: 'My Tasks' },
        { id: 'settings', icon: <SettingsIcon className="w-6 h-6"/>, label: 'Settings' },
    ];
    const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.fullName}`;
    
    return (
        <aside className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out m-4 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
                <Logo />
                {!isCollapsed && <span className="font-bold text-xl text-slate-800 dark:text-white">Synergize</span>}
            </div>
            <nav className="flex-grow p-4">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button onClick={() => setView(item.id)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ease-in-out transform ${isCollapsed ? 'justify-center' : ''} ${currentView === item.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 font-bold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                                {item.icon}
                                {!isCollapsed && <span>{item.label}</span>}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={`border-t border-slate-200 dark:border-slate-800 ${isCollapsed ? 'p-2' : 'p-4'}`}>
                <div className={`flex items-center gap-3 mb-4 p-2 rounded-xl ${isCollapsed ? 'justify-center' : ''}`}>
                    {user && <img src={avatarUrl} alt="User" className="w-8 h-8 rounded-full bg-slate-200" />}
                    {!isCollapsed && user && (
                        <div className="overflow-hidden">
                            <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{user.fullName}</p>
                            <button onClick={onLogout} className="text-xs text-slate-500 hover:text-indigo-500">Log Out</button>
                        </div>
                    )}
                </div>
                <div className={`mb-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
                    <ThemeSwitcher theme={theme} setTheme={setTheme} />
                </div>
                <button onClick={() => setCollapsed(!isCollapsed)} className="w-full flex items-center gap-4 p-3 mt-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors duration-200 relative justify-center">
                    {isCollapsed ? <CollapseRightIcon /> : <CollapseLeftIcon />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;