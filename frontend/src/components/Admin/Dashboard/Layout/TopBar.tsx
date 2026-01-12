import React from 'react';
import { Button } from '@/components/Admin/Button';
import { LogOut, User, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TopBarProps {
    title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
        showToast("Logged out successfully", "success");
        navigate('/admin/login');
    };

    return (
        <header className="h-16 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
            <h1 className="text-lg font-semibold capitalize">{title}</h1>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleLogout} className="ml-2">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </header>
    );
};

export default TopBar;
