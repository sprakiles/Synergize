import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

import Sidebar from '../components/app/Sidebar';
import Dashboard from '../components/app/Dashboard';
import ProjectView from '../components/app/ProjectView';
import MyTasksView from '../components/app/MyTasksView';
import SettingsView from '../components/app/SettingsView';

const MainApp = ({ onLogout, theme, setTheme, user, setUser }) => {
  const [view, setView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const api = useApi();

  const navigateToProject = (project) => {
    setSelectedProject(project);
    setView('projectView');
  };

  // This function is the single source of truth for refreshing data across the app.
  const fetchData = async (showLoader = true) => {
    try {
        if (showLoader) setIsLoading(true);
        const projectData = await api('/api/projects');
        setProjects(projectData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        const allTasks = projectData.flatMap(p => p.tasks);
        setTasks(allTasks);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  // The main router for the app.
  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center p-10">Loading your workspace...</div>;
    }
    
    // Gracefully handle the case where a project is deleted.
    if (view === 'projectView' && !projects.find(p => p.id === selectedProject?.id)) {
        setView('dashboard');
        return <Dashboard projects={projects} navigateToProject={navigateToProject} fetchData={fetchData} />;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard projects={projects} navigateToProject={navigateToProject} fetchData={fetchData} />;
      case 'projectView':
        return <ProjectView project={selectedProject} allTasks={tasks} setTasks={setTasks} fetchData={fetchData} />;
      case 'myTasks':
        return <MyTasksView tasks={tasks} projects={projects} currentUser={user} />;
      case 'settings':
        return <SettingsView currentUser={user} setCurrentUser={setUser} />;
      default:
        return <Dashboard projects={projects} navigateToProject={navigateToProject} fetchData={fetchData} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={onLogout}
        theme={theme}
        setTheme={setTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={user}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-[96px]' : 'ml-[288px]'}`}>
        <div className="animate-contentFadeIn p-6 md:p-8 lg:p-12">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default MainApp;