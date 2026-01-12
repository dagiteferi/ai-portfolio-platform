import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Card';
import { Chart } from '../../../Chart';

const UsersTab = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Chart type="line" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Chart type="bar" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersTab;
