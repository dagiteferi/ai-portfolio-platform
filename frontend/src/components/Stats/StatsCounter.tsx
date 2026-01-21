import React, { useEffect, useState, useRef } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import { Briefcase, Cpu, Database, Award, Code2, BrainCircuit, LucideIcon } from 'lucide-react';
import { getStats, Stats } from '../../services/api';

const Counter = ({ value, label, icon: Icon, color }: { value: number; label: string; icon: LucideIcon; color: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 0.5,
                ease: "easeOut",
                onUpdate: (latest) => setCount(Math.floor(latest)),
            });
            return () => controls.stop();
        }
    }, [value, isInView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center p-8 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group cursor-default"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-5xl font-extrabold text-foreground mb-2 tracking-tight">
                {count}<span className="text-primary">+</span>
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] text-center">
                {label}
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
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
            icon: Code2,
            color: 'from-accent to-info'
        },
        {
            label: 'AI/ML Projects',
            value: stats.aiMlProjects,
            icon: BrainCircuit,
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
        <section className="py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statItems.map((item, index) => (
                        <Counter key={index} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
