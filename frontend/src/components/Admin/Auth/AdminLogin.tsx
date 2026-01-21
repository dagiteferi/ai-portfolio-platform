import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Button';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Input } from '../Input';
import { useToast } from '../../../hooks/use-toast';
import { adminLogin } from '../../../services/api';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    }
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const data = await adminLogin(values);

      if (data.access_token) {
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('adminAuthenticated', 'true');
        showToast("Logged in successfully.", "success");
        navigate('/admin/dashboard');
      } else {
        showToast("Invalid response from server.", "error");
      }
    } catch (error: any) {
      // The error message is already extracted by the axios interceptor
      showToast(error.message || "An error occurred during login.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-card/80 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-inner">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <p className="text-sm text-muted-foreground">Secure access to your portfolio management</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <User className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                  errors.username ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
                )} />
                <Input
                  {...register('username')}
                  type="text"
                  placeholder="Username"
                  className={cn(
                    "pl-10 h-12 bg-background/50 border-muted-foreground/20 transition-all duration-200 focus:bg-background",
                    errors.username && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <div className="text-[11px] text-destructive flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.username.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                  errors.password ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
                )} />
                <Input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "pl-10 h-12 bg-background/50 border-muted-foreground/20 transition-all duration-200 focus:bg-background",
                    errors.password && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <div className="text-[11px] text-destructive flex items-center gap-1.5 px-1 animate-in slide-in-from-top-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 shadow-xl shadow-primary/20 mt-4 text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
