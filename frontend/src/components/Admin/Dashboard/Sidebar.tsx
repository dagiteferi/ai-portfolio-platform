import React from 'react';
import { cn } from '../../../lib/utils';
import {
    LayoutDashboard,
    Briefcase,
    Wrench,
    GraduationCap,
    Award,
    Camera,
    FileText,
    Terminal,
    Settings,
    ChevronRight
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
    getAdminProjects,
    getAdminSkills,
    getAdminExperience,
    getAdminCertificates,
    getAdminMoments
} from '../../../services/api';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Briefcase, prefetch: getAdminProjects, queryKey: 'admin-projects' },
    { id: 'skills', label: 'Skills', icon: Wrench, prefetch: getAdminSkills, queryKey: 'admin-skills' },
    { id: 'experience', label: 'Experience', icon: Briefcase, prefetch: getAdminExperience, queryKey: 'admin-experience' },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certificates', label: 'Certificates', icon: Award, prefetch: getAdminCertificates, queryKey: 'admin-certificates' },
    { id: 'moments', label: 'Moments', icon: Camera, prefetch: getAdminMoments, queryKey: 'admin-moments' },
    { id: 'cvs', label: 'CVs', icon: FileText },
    { id: 'logs', label: 'System Logs', icon: Terminal },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const queryClient = useQueryClient();

    const handlePrefetch = (item: any) => {
        if (item.prefetch && item.queryKey) {
            queryClient.prefetchQuery({
                queryKey: [item.queryKey],
                queryFn: item.prefetch,
                staleTime: 1000 * 60 * 5,
            });
        }
    };

    return (
        <aside className="w-64 bg-card border-r flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Admin Panel
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Portfolio Management</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            onMouseEnter={() => handlePrefetch(item)}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="h-4 w-4" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-medium">Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

