import React, { useState } from 'react';
import { ManagementTable } from '../../Shared';
import { getAdminSkills, deleteSkill, createSkill, updateSkill, TechnicalSkill } from '../../../../../services/api';
import { useToast } from '../../../../../hooks/use-toast';
import { Badge } from '../../../Badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../Modal';
import SkillForm from './SkillForm';

const SkillManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<TechnicalSkill | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: skills, isLoading } = useQuery({
        queryKey: ['admin-skills'],
        queryFn: getAdminSkills,
        staleTime: 1000 * 60 * 5,
    });

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
        onSuccess: (newSkill) => {
            queryClient.setQueryData(['admin-skills'], (old: TechnicalSkill[] | undefined) => {
                return old ? [newSkill, ...old] : [newSkill];
            });
            // Invalidate public skills cache
            queryClient.invalidateQueries({ queryKey: ['skills'] });
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
        onSuccess: (updatedSkill) => {
            queryClient.setQueryData(['admin-skills'], (old: TechnicalSkill[] | undefined) => {
                return old ? old.map(s => s.id === updatedSkill.id ? updatedSkill : s) : [updatedSkill];
            });
            // Invalidate public skills cache
            queryClient.invalidateQueries({ queryKey: ['skills'] });
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
        onMutate: async (skillId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-skills'] });
            const previousSkills = queryClient.getQueryData(['admin-skills']);
            queryClient.setQueryData(['admin-skills'], (old: TechnicalSkill[] | undefined) => {
                return old ? old.filter(s => s.id !== skillId) : [];
            });
            return { previousSkills };
        },
        onError: (err, skillId, context) => {
            if (context?.previousSkills) {
                queryClient.setQueryData(['admin-skills'], context.previousSkills);
            }
            showToast("Failed to delete skill", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
            queryClient.invalidateQueries({ queryKey: ['skills'] });
        },
        onSuccess: () => {
            showToast("Skill deleted successfully", "success");
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
            accessor: (item: TechnicalSkill) => {
                const getWidth = (p?: string) => {
                    if (!p) return '0%';
                    if (p === 'Expert') return '100%';
                    if (p === 'Advanced') return '75%';
                    if (p === 'Intermediate') return '50%';
                    if (p === 'Beginner') return '25%';
                    const num = parseInt(p);
                    return isNaN(num) ? '0%' : `${num}%`;
                };

                const getLabel = (p?: string) => {
                    if (!p) return '0%';
                    if (['Expert', 'Advanced', 'Intermediate', 'Beginner'].includes(p)) return p;
                    const num = parseInt(p);
                    return isNaN(num) ? '0%' : `${num}%`;
                };

                return (
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: getWidth(item.proficiency) }}
                            />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{getLabel(item.proficiency)}</span>
                    </div>
                );
            }
        }
    ];

    return (
        <>
            <ManagementTable
                title="Technical Skills"
                data={skills || []}
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
