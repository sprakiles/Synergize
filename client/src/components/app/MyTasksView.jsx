import React, { useState } from 'react';

const MyTasksView = ({ tasks, projects, currentUser }) => {
    // I'm filtering all tasks to find only the ones assigned to the current user.
    const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
    const [filter, setFilter] = useState('All');
    
    // THE FIX: The bug was here. I need to convert the filter to uppercase
    // to match the enum values from the database (e.g., "TO_DO", "DONE").
    const filteredTasks = myTasks.filter(task => 
        filter === 'All' || task.status === filter.replace(' ', '_').toUpperCase()
    );
    
    const filters = ['All', 'To Do', 'In Progress', 'Done'];

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-8">My Tasks</h1>
            
            <div className="flex items-center gap-2 mb-6 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl w-fit">
                {filters.map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)} 
                        className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${filter === f ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task, index) => {
                        const project = projects.find(p => p.id === task.projectId);
                        return (
                            <div key={task.id} style={{ animationDelay: `${index * 50}ms`}} className="animate-cardFadeIn flex items-center justify-between bg-white dark:bg-slate-800/60 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700/50">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">{task.title}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{project?.title}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                                    </p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'DONE' ? 'bg-green-100 dark:bg-green-900/50 text-green-700' : task.status === 'IN_PROGRESS' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-slate-500">You have no tasks assigned to you in this category.</p>
                )}
            </div>
        </div>
    );
};

export default MyTasksView;