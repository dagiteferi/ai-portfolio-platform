import React, { useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminSkills, deleteSkill, createSkill, updateSkill, TechnicalSkill } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Badge } from '../Badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../Modal';
import SkillForm from './SkillForm';

const SkillManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<TechnicalSkill | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const MOCK_SKILLS: TechnicalSkill[] = [
        { id: 1, name: "React", category: "Frontend", proficiency: "Expert" },
        { id: 2, name: "Python", category: "Backend", proficiency: "Expert" },
        { id: 3, name: "TensorFlow", category: "AI/ML", proficiency: "Advanced" },
        { id: 4, name: "PostgreSQL", category: "Database", proficiency: "Advanced" },
        { id: 5, name: "Docker", category: "DevOps", proficiency: "Intermediate" }
    ];

    const { data: apiSkills, isLoading } = useQuery({
        queryKey: ['admin-skills'],
        queryFn: getAdminSkills,
        staleTime: 1000 * 60 * 5,
    });

    const skills = apiSkills && apiSkills.length > 0 ? apiSkills : MOCK_SKILLS;

    const createMutation = useMutation({
        mutationFn: (data: FormData | Partial<TechnicalSkill>) => {
            if (data instanceof FormData) {
                return createSkill(data);
            }
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, String(value));
            });
            return createSkill(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            showToast("Skill created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create skill", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: FormData | Partial<TechnicalSkill> }) => {
            return updateSkill(id, data as Partial<TechnicalSkill>);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            showToast("Skill updated successfully", "success");
            setIsModalOpen(false);
            setEditingSkill(undefined);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update skill", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSkill,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            showToast("Skill deleted successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to delete skill", "error");
        }
    });

    const handleAdd = () => {
        setEditingSkill(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (skill: TechnicalSkill) => {
        setEditingSkill(skill);
        setIsModalOpen(true);
    };

    const handleDelete = async (skill: TechnicalSkill) => {
        if (window.confirm(`Are you sure you want to delete "${skill.name}"?`)) {
            deleteMutation.mutate(skill.id);
        }
    };

    const handleSubmit = async (data: FormData | Partial<TechnicalSkill>) => {
        if (editingSkill) {
            updateMutation.mutate({ id: editingSkill.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const columns = [
        {
            header: 'Skill',
            accessor: (item: TechnicalSkill) => (
                <div className="flex items-center gap-3">
                    {item.icon ? (
                        <img src={item.icon} alt={item.name} className="h-8 w-8 rounded-md object-contain p-1 bg-muted/50 border shadow-sm" />
                    ) : (
                        <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center border">
                            <span className="text-[10px] font-bold text-muted-foreground">NA</span>
                        </div>
                    )}
                    <span className="font-medium text-sm">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Category',
            accessor: (item: TechnicalSkill) => (
                <Badge variant="outline" className="capitalize text-[10px] px-2 py-0 h-5 font-medium">
                    {item.category || 'General'}
                </Badge>
            )
        },
        {
            header: 'Proficiency',
            accessor: (item: TechnicalSkill) => (
                <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary"
                            style={{ width: item.proficiency === 'Expert' ? '100%' : item.proficiency === 'Advanced' ? '75%' : item.proficiency === 'Intermediate' ? '50%' : '25%' }}
                        />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{item.proficiency || 'Beginner'}</span>
                </div>
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="Technical Skills"
                data={skills}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
            >
                <SkillForm
                    skill={editingSkill}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default SkillManagement;

