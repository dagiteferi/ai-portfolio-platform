import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { Briefcase, Cpu, Database, Award, LucideIcon } from 'lucide-react';
import { getStats, Stats } from '../../services/api';

const Counter = ({ value, label, icon: Icon, color }: { value: number; label: string; icon: LucideIcon; color: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 2,
            onUpdate: (latest) => setCount(Math.floor(latest)),
        });
        return () => controls.stop();
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors group"
        >
            <div className={`p-4 rounded-xl bg-gradient-to-br ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-1">
                {count}+
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
};

const StatsCounter = () => {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return null;

    const statItems = [
        {
            label: 'Total Projects',
            value: stats.totalProjects,
            icon: Briefcase,
            color: 'from-primary to-primary-glow'
        },
        {
            label: 'Technical Skills',
            value: stats.totalSkills,
            icon: Cpu,
            color: 'from-accent to-info'
        },
        {
            label: 'AI/ML Projects',
            value: stats.aiMlProjects,
            icon: Award,
            color: 'from-success to-secondary'
        },
        {
            label: 'Data Solutions',
            value: stats.dataSolutions,
            icon: Database,
            color: 'from-warning to-beige'
        }
    ];

    return (
        <section className="py-12 bg-muted/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statItems.map((item, index) => (
                        <Counter key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
