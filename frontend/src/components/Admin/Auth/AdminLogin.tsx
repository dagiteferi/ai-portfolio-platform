import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Input } from '../Input';
import { useToast } from '../../../hooks/use-toast';
import { adminLogin } from '../../../services/api';
import { Lock, User, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Please enter both username and password.", "error");
      return;
    }

    try {
      setIsLoading(true);
      const data = await adminLogin({ username, password });

      if (data.access_token) {
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminAuthenticated', 'true');
        showToast("Logged in successfully.", "success");
        navigate('/admin/dashboard');
      } else {
        showToast("Invalid credentials.", "error");
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || "An error occurred during login.";
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 -z-10" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="pl-10 h-11 bg-background/50"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-background/50"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 shadow-lg shadow-primary/20 mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
