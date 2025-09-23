import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';

const AnalyticsTab = () => {
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
    </div>
  );
};

export default AnalyticsTab;
