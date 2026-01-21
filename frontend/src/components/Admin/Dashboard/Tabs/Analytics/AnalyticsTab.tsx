import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Card';
import { Chart } from '../../../Chart';

const AnalyticsTab = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Chart type="area" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Chart type="pie" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
