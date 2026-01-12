import React from 'react';
import {
  Users,
  Briefcase,
  Wrench,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAdminProjects, getAdminSkills, getAdminExperience } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Admin/Card';

const OverviewTab = () => {
  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: getAdminProjects,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: getAdminSkills,
  });

  const { data: experience = [] } = useQuery({
    queryKey: ['admin-experience'],
    queryFn: getAdminExperience,
  });

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      change: "+12%",
      isPositive: true,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-500/10"
    },
    {
      title: "Technical Skills",
      value: skills.length,
      change: "+3",
      isPositive: true,
      icon: Wrench,
      color: "text-purple-600",
      bg: "bg-purple-500/10"
    },
    {
      title: "Experience Years",
      value: "5+",
      change: "Stable",
      isPositive: true,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500/10"
    },
    {
      title: "Active Chats",
      value: "24",
      change: "-5%",
      isPositive: false,
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-500/10"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                  {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Portfolio Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-xl border border-dashed">
              <p className="text-sm text-muted-foreground italic">Traffic chart visualization would go here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Potential Client {i}</p>
                    <p className="text-xs text-muted-foreground truncate">Interested in AI Development services...</p>
                  </div>
                  <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {i * 2}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
