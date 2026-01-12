import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminSkills, deleteSkill, TechnicalSkill } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Badge } from '../Badge';

const SkillManagement = () => {
    const [skills, setSkills] = useState<TechnicalSkill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchSkills = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminSkills();
            setSkills(data);
        } catch (error) {
            showToast("Failed to fetch skills", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleAdd = () => {
        showToast("Add skill modal would open here", "info");
    };

    const handleEdit = (skill: TechnicalSkill) => {
        showToast(`Editing skill: ${skill.name}`, "info");
    };

    const handleDelete = async (skill: TechnicalSkill) => {
        if (window.confirm(`Are you sure you want to delete "${skill.name}"?`)) {
            try {
                await deleteSkill(skill.id);
                showToast("Skill deleted successfully", "success");
                fetchSkills();
            } catch (error) {
                showToast("Failed to delete skill", "error");
            }
        }
    };

    const columns = [
        {
            header: 'Skill',
            accessor: (item: TechnicalSkill) => (
                <div className="flex items-center gap-3">
                    {item.icon ? (
                        <img src={item.icon} alt={item.name} className="h-8 w-8 rounded-md object-contain p-1 bg-muted/50 border" />
                    ) : (
                        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center border">
                            <span className="text-[10px] font-bold text-muted-foreground">NA</span>
                        </div>
                    )}
                    <span className="font-medium">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Category',
            accessor: (item: TechnicalSkill) => (
                <Badge variant="outline" className="capitalize">{item.category || 'General'}</Badge>
            )
        },
        {
            header: 'Proficiency',
            accessor: (item: TechnicalSkill) => (
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: item.proficiency === 'Expert' ? '100%' : item.proficiency === 'Advanced' ? '75%' : item.proficiency === 'Intermediate' ? '50%' : '25%' }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.proficiency || 'Beginner'}</span>
                </div>
            )
        }
    ];

    return (
        <ManagementTable
            title="Technical Skills"
            data={skills}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default SkillManagement;
