import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { Input } from '../Input';
import { useToast } from '../../../hooks/use-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Check if an access_token is returned and store it
        if (data.access_token) {
          localStorage.setItem('adminToken', data.access_token);
        }
        showToast("Logged in successfully.", "success");
        navigate('/admin/dashboard');
      } else {
        showToast("Invalid credentials.", "error");
      }
    } catch (error) {
      showToast("An error occurred during login.", "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} className="w-full">Login</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
