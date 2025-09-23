import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Eye, Globe, Clock, Server, Activity } from 'lucide-react';

const OverviewTab = () => {
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

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default OverviewTab;
