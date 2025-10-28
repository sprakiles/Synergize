import React, { useState, useRef } from 'react';
import useApi from '../../hooks/useApi';
import ElegantDatePicker from '../ui/DatePicker';
import { useFloating, offset, flip, shift } from '@floating-ui/react';
import { format } from 'date-fns';

const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = new Date(endDate).getTime() - new Date().getTime();
    if (diff < 0) return "Overdue";
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return `${days} days left`;
};

const Dashboard = ({ projects, navigateToProject, fetchData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");
    
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    
    // Setup for the floating UI positioning
    const { refs: startRefs, floatingStyles: startStyles } = useFloating({
        open: showStartPicker,
        onOpenChange: setShowStartPicker,
        placement: 'bottom-start',
        middleware: [offset(8), flip(), shift()]
    });
    const { refs: endRefs, floatingStyles: endStyles } = useFloating({
        open: showEndPicker,
        onOpenChange: setShowEndPicker,
        placement: 'bottom-start',
        middleware: [offset(8), flip(), shift()]
    });
    
    // Provide startAttributes/endAttributes so the JSX spreads don't break (useFloating doesn't return popper-style attributes)
    const startAttributes = {};
    const endAttributes = {};
    
    const api = useApi();
    
    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectTitle || isCreating) return;
        
        setIsCreating(true);
        setError(""); // Clear previous errors
        try {
            await api('/api/projects', 'POST', { 
                title: newProjectTitle, 
                startDate, 
                endDate 
            });
            await fetchData(false);
            
            setNewProjectTitle("");
            setStartDate(null);
            setEndDate(null);
            setIsModalOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsCreating(false);
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setError("");
        setNewProjectTitle("");
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-md animate-cardFadeIn">
                        <h3 className="text-xl font-bold mb-4">Create a New Project</h3>
                        
                        {error && (
                            <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl relative mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <input
                                type="text"
                                value={newProjectTitle}
                                onChange={(e) => setNewProjectTitle(e.target.value)}
                                placeholder="Project name..."
                                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl"
                            />
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <button
                                        ref={startRefs.setReference}
                                        type="button"
                                        onClick={() => setShowStartPicker(!showStartPicker)}
                                        className="w-full text-left px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700/50 rounded-xl"
                                    >
                                        {startDate ? format(startDate, 'PPP') : <span className="text-slate-400">Start Date</span>}
                                    </button>
                                    {showStartPicker && (
                                        <div ref={startRefs.setFloating} style={{ ...startStyles, zIndex: 100 }} {...startAttributes} className="z-10">
                                            <ElegantDatePicker
                                                selected={startDate}
                                                onSelect={(date) => { setStartDate(date); setShowStartPicker(false); }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="w-full">
                                    <button
                                        ref={endRefs.setReference}
                                        type="button"
                                        onClick={() => setShowEndPicker(!showEndPicker)}
                                        className="w-full text-left px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700/50 rounded-xl"
                                    >
                                        {endDate ? format(endDate, 'PPP') : <span className="text-slate-400">End Date</span>}
                                    </button>
                                    {showEndPicker && (
                                        <div ref={endRefs.setFloating} style={{ ...endStyles, zIndex: 100 }} {...endAttributes} className="z-10">
                                            <ElegantDatePicker
                                                selected={endDate}
                                                onSelect={(date) => { setEndDate(date); setShowEndPicker(false); }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold">Cancel</button>
                                <button type="submit" disabled={isCreating} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50">
                                    {isCreating ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">Dashboard</h1>
                <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl px-4 py-2.5 shadow-lg shadow-indigo-500/30">Create Project</button>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-6">Active Projects</h2>
            {projects.length === 0 ? (
                <p className="text-slate-500">No projects found. Create one to get started!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            onClick={() => navigateToProject(project)}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="animate-cardFadeIn will-change-transform bg-white dark:bg-slate-800/60 p-6 rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-slate-900/50 transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50 cursor-pointer group"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate pr-2">{project.title}</h3>
                                {calculateDaysLeft(project.endDate) && (
                                    <span className="text-xs flex-shrink-0 font-semibold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">
                                        {calculateDaysLeft(project.endDate)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Progress</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full group-hover:bg-purple-500 transition-colors duration-300"
                                    style={{ width: `${project.tasks.length > 0 ? (project.tasks.filter(t => t.status === 'DONE').length / project.tasks.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;