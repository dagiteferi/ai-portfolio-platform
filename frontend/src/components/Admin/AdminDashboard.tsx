import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { LogOut, BarChart3, Users, Globe, Activity, TrendingUp, Eye, Clock, Shield, Server, Zap, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for charts and analytics
  const [analyticsData] = useState([
    { name: 'Jan', visitors: 4000, pageViews: 2400, revenue: 2400 },
    { name: 'Feb', visitors: 3000, pageViews: 1398, revenue: 2210 },
    { name: 'Mar', visitors: 2000, pageViews: 9800, revenue: 2290 },
    { name: 'Apr', visitors: 2780, pageViews: 3908, revenue: 2000 },
    { name: 'May', visitors: 1890, pageViews: 4800, revenue: 2181 },
    { name: 'Jun', visitors: 2390, pageViews: 3800, revenue: 2500 },
  ]);

  const [deviceData] = useState([
    { name: 'Desktop', value: 65, color: 'hsl(var(--primary))' },
    { name: 'Mobile', value: 28, color: 'hsl(var(--secondary))' },
    { name: 'Tablet', value: 7, color: 'hsl(var(--accent))' },
  ]);

  const [performanceData] = useState([
    { metric: 'Page Load Time', value: '1.2s', trend: '+5%', status: 'good' },
    { metric: 'Server Response', value: '180ms', trend: '-12%', status: 'excellent' },
    { metric: 'Database Queries', value: '45ms', trend: '+2%', status: 'good' },
    { metric: 'Cache Hit Rate', value: '94%', trend: '+8%', status: 'excellent' },
  ]);

  const [logs] = useState([
    { time: '10:30:15', level: 'INFO', message: 'Application started successfully', type: 'system' },
    { time: '10:31:02', level: 'INFO', message: 'User accessed homepage', type: 'user' },
    { time: '10:32:45', level: 'INFO', message: 'Contact form submitted', type: 'user' },
    { time: '10:33:12', level: 'ERROR', message: 'Failed to send email notification', type: 'error' },
    { time: '10:34:01', level: 'INFO', message: 'Portfolio project viewed', type: 'user' },
    { time: '10:35:22', level: 'WARN', message: 'High memory usage detected', type: 'system' },
    { time: '10:36:45', level: 'INFO', message: 'User downloaded resume', type: 'user' },
  ]);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600';
      case 'WARN': return 'text-yellow-600';
      case 'INFO': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <Badge variant="secondary" className="text-xs">Live</Badge>
          </div>
          <Button variant="outline" onClick={handleLogout} className="hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              System Logs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Visitors</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">24,567</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">+12% from last month</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Page Views</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">89,234</p>
                      <p className="text-xs text-green-700 dark:text-green-300">+8% from last month</p>
                    </div>
                    <Globe className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Session</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">4m 32s</p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">+15% from last month</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Server Health</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">99.9%</p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">Uptime this month</p>
                    </div>
                    <Server className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Traffic Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    visitors: { label: "Visitors", color: "hsl(var(--primary))" },
                    pageViews: { label: "Page Views", color: "hsl(var(--secondary))" }
                  }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="fill-muted-foreground" />
                        <YAxis className="fill-muted-foreground" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area type="monotone" dataKey="visitors" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="pageViews" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    desktop: { label: "Desktop", color: "hsl(var(--primary))" },
                    mobile: { label: "Mobile", color: "hsl(var(--secondary))" },
                    tablet: { label: "Tablet", color: "hsl(var(--accent))" }
                  }} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Conversion Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  revenue: { label: "Revenue", color: "hsl(var(--primary))" }
                }} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="fill-muted-foreground" />
                      <YAxis className="fill-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-4">
              {performanceData.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${item.status === 'excellent' ? 'bg-green-500' : item.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                        <div>
                          <h3 className="font-semibold">{item.metric}</h3>
                          <p className="text-sm text-muted-foreground">System performance metric</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{item.value}</p>
                        <p className={`text-sm ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {item.trend} vs last week
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  visitors: { label: "Visitors", color: "hsl(var(--primary))" }
                }} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="fill-muted-foreground" />
                      <YAxis className="fill-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  System Activity Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full">
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xs text-muted-foreground font-mono">{log.time}</span>
                          <Badge 
                            variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'outline' : 'secondary'}
                            className="text-xs"
                          >
                            {log.level}
                          </Badge>
                          <span className="text-sm truncate">{log.message}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {log.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {log.type === 'system' && <Server className="h-4 w-4 text-blue-500" />}
                          {log.type === 'user' && <Users className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;