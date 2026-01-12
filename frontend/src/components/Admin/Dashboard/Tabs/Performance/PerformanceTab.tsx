import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Card';
import { Chart } from '../../../Chart';

const PerformanceTab = () => {
  return (
    <div className="space-y-8">
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <Chart type="area" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceTab;
