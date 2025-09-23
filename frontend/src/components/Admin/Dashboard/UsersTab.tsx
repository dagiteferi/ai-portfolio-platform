import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';

const UsersTab = () => {
  const [analyticsData] = useState([
    { name: 'Jan', visitors: 4000, pageViews: 2400, revenue: 2400 },
    { name: 'Feb', visitors: 3000, pageViews: 1398, revenue: 2210 },
    { name: 'Mar', visitors: 2000, pageViews: 9800, revenue: 2290 },
    { name: 'Apr', visitors: 2780, pageViews: 3908, revenue: 2000 },
    { name: 'May', visitors: 1890, pageViews: 4800, revenue: 2181 },
    { name: 'Jun', visitors: 2390, pageViews: 3800, revenue: 2500 },
  ]);

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default UsersTab;
