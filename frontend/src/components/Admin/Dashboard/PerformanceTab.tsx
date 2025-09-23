import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';

const PerformanceTab = () => {
  const [performanceData] = useState([
    { metric: 'Page Load Time', value: '1.2s', trend: '+5%', status: 'good' },
    { metric: 'Server Response', value: '180ms', trend: '-12%', status: 'excellent' },
    { metric: 'Database Queries', value: '45ms', trend: '+2%', status: 'good' },
    { metric: 'Cache Hit Rate', value: '94%', trend: '+8%', status: 'excellent' },
  ]);

  return (
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
  );
};

export default PerformanceTab;
