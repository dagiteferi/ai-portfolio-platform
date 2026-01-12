import React from 'react';
import { Button } from '../../Button';
import { Input } from '../../Input';
import { useToast } from '../../../../hooks/use-toast';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
    title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
        showToast("Logged out successfully", "success");
        navigate('/admin/login');
    };

    return (
        <header className="h-16 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <h1 className="text-lg font-semibold capitalize">{title.replace('-', ' ')}</h1>
                <div className="relative w-64 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 h-9 bg-background/50 border-none focus-visible:ring-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                </Button>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-medium">Admin User</span>
                        <span className="text-[10px] text-muted-foreground">Super Admin</span>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                        <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
