import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, TopBar } from './Layout';
import { OverviewTab } from './Tabs/Overview';
import { ProjectManagement } from './Management/Projects';
import { SkillManagement } from './Management/Skills';
import { ExperienceManagement } from './Management/Experience';
import { EducationManagement } from './Management/Education';
import { CertificateManagement } from './Management/Certificates';
import { MomentManagement } from './Management/Moments';
import { CVManagement } from './Management/CV';
import { LogsTab } from './Tabs/Logs';
import { AnalyticsTab } from './Tabs/Analytics';
import { UsersTab } from './Tabs/Users';
import { PerformanceTab } from './Tabs/Performance';
import { useToast } from '../../../hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'projects':
        return <ProjectManagement />;
      case 'skills':
        return <SkillManagement />;
      case 'experience':
        return <ExperienceManagement />;
      case 'education':
        return <EducationManagement />;
      case 'certificates':
        return <CertificateManagement />;
      case 'moments':
        return <MomentManagement />;
      case 'cvs':
        return <CVManagement />;
      case 'logs':
        return <LogsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'users':
        return <UsersTab />;
      case 'performance':
        return <PerformanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={activeTab} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;