import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Card';
import { Chart } from '../../../Chart';
import { getAdminProjects, getAdminSkills } from '../../../../../services/api';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Wrench, Users, Activity, TrendingUp } from 'lucide-react';

const OverviewTab = () => {
  const { data: projects } = useQuery({ queryKey: ['admin-projects'], queryFn: getAdminProjects });
  const { data: skills } = useQuery({ queryKey: ['admin-skills'], queryFn: getAdminSkills });

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Technical Skills', value: skills?.length || 0, icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Visitors', value: '1,284', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-lg bg-card/50 backdrop-blur-sm hover:translate-y-[-4px] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-500 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Visitor Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart type="area" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Project Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Chart type="bar" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
