import React, { useState } from 'react';
import useApi from '../../hooks/useApi';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ElegantDatePicker from '../ui/DatePicker';
import { useFloating, offset, flip, shift } from '@floating-ui/react';
import { format } from 'date-fns';

// --- Child Components ---
const TaskCard = ({ task }) => {
    const priorityColors = { HIGH: 'bg-red-500', MEDIUM: 'bg-yellow-500', LOW: 'bg-green-500' };
    return (
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 dark:border-slate-700/50 cursor-grab active:cursor-grabbing">
            <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`} title={`Priority: ${task.priority}`}></div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                {task.assignee && (
                    <img
                        src={task.assignee.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${task.assignee.fullName}`}
                        alt={task.assignee.fullName}
                        title={task.assignee.fullName}
                        className="w-6 h-6 rounded-full"
                    />
                )}
            </div>
        </div>
    );
};

const DraggableTaskCard = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} />
        </div>
    );
};

const Column = ({ id, title, tasks }) => {
    const { setNodeRef } = useSortable({ id });
    return (
        <div ref={setNodeRef} className="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 min-h-[200px]">
            <h2 className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-4 px-2">{title}</h2>
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                    {tasks.map((task) => (<DraggableTaskCard key={task.id} task={task} />))}
                </div>
            </SortableContext>
        </div>
    );
};

// --- Main Component ---
const ProjectView = ({ project, allTasks, setTasks, fetchData }) => {
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [activeTask, setActiveTask] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [editTitle, setEditTitle] = useState(project.title);
    const [editStartDate, setEditStartDate] = useState(project.startDate ? new Date(project.startDate) : null);
    const [editEndDate, setEditEndDate] = useState(project.endDate ? new Date(project.endDate) : null);

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // --- New Logic for Floating UI (replaces react-popper refs from old) ---
    const { refs: startRefs, floatingStyles: startStyles } = useFloating({
        open: showStartPicker,
        onOpenChange: setShowStartPicker,
        placement: 'bottom-start',
        middleware: [offset(8), flip(), shift()],
    });
    const { refs: endRefs, floatingStyles: endStyles } = useFloating({
        open: showEndPicker,
        onOpenChange: setShowEndPicker,
        placement: 'bottom-start',
        middleware: [offset(8), flip(), shift()],
    });

    const api = useApi();
    const projectTasks = allTasks.filter(t => t.projectId === project.id);
    const columns = ['TO_DO', 'IN_PROGRESS', 'DONE'];

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        await api('/api/tasks', 'POST', { title: newTaskTitle, projectId: project.id });
        fetchData(false);
        setNewTaskTitle("");
        setAddTaskModalOpen(false);
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveTask(allTasks.find(task => task.id === active.id));
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveTask(null);
        if (!over) return;
        if (active.id !== over.id && columns.includes(over.id)) {
            const newStatus = over.id;
            const taskId = active.id;
            setTasks((currentTasks) => currentTasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
            api(`/api/tasks/${taskId}`, 'PUT', { status: newStatus })
                .then(() => fetchData(false))
                .catch(err => { console.error("Failed to update task status:", err); fetchData(true); });
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        if (isUpdating) return;
        setIsUpdating(true);
        try {
            await api(`/api/projects/${project.id}`, 'PUT', { title: editTitle, startDate: editStartDate, endDate: editEndDate });
            fetchData(false);
            setEditModalOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteProject = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await api(`/api/projects/${project.id}`, 'DELETE');
            fetchData(true);
        } catch (error) {
            console.error("Delete failed:", error);
            setIsDeleting(false);
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {isAddTaskModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-md animate-cardFadeIn">
                        <h3 className="text-xl font-bold mb-4">Add a New Task</h3>
                        <form onSubmit={handleAddTask}>
                            <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Task title..." className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setAddTaskModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold">Cancel</button>
                                <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold">Add Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-md animate-cardFadeIn">
                        <h3 className="text-xl font-bold mb-4">Edit Project</h3>
                        <form onSubmit={handleUpdateProject} className="space-y-4">
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <button
                                        ref={startRefs.setReference}
                                        type="button"
                                        onClick={() => setShowStartPicker(!showStartPicker)}
                                        className="w-full text-left px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700/50 rounded-xl"
                                    >
                                        {editStartDate ? format(editStartDate, 'PPP') : <span className="text-slate-400">Start Date</span>}
                                    </button>
                                    {showStartPicker && (
                                        <div ref={startRefs.setFloating} style={{ ...startStyles, zIndex: 100 }} className="z-10">
                                            <ElegantDatePicker selected={editStartDate} onSelect={(date) => { setEditStartDate(date); setShowStartPicker(false); }} />
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
                                        {editEndDate ? format(editEndDate, 'PPP') : <span className="text-slate-400">End Date</span>}
                                    </button>
                                    {showEndPicker && (
                                        <div ref={endRefs.setFloating} style={{ ...endStyles, zIndex: 100 }} className="z-10">
                                            <ElegantDatePicker selected={editEndDate} onSelect={(date) => { setEditEndDate(date); setShowEndPicker(false); }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold">Cancel</button>
                                <button type="submit" disabled={isUpdating} className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50">{isUpdating ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-md text-center animate-cardFadeIn">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">Delete Project</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Are you sure you want to delete <strong className="dark:text-slate-300">{project.title}</strong>? All of its tasks will be permanently removed.</p>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setDeleteModalOpen(false)} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold">Cancel</button>
                            <button onClick={handleDeleteProject} disabled={isDeleting} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold shadow-lg shadow-red-500/30 disabled:opacity-50">{isDeleting ? 'Deleting...' : 'Delete Project'}</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold">{project.title}</h1>
                <div className="flex gap-2">
                    <button onClick={() => setAddTaskModalOpen(true)} className="text-sm font-semibold text-white bg-indigo-600 rounded-xl px-4 py-2">Add Task</button>
                    <button onClick={() => setEditModalOpen(true)} className="text-sm font-semibold bg-slate-200 dark:bg-slate-700 rounded-xl px-4 py-2">Edit</button>
                    <button onClick={() => setDeleteModalOpen(true)} className="text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-xl px-4 py-2">Delete</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map(status => (
                    <Column key={status} id={status} title={status.replace('_', ' ')} tasks={projectTasks.filter(t => t.status === status)} />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default ProjectView;