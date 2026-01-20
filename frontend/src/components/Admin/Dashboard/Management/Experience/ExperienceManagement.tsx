import React, { useState } from 'react';
import { ManagementTable } from '../../Shared';
import { getAdminExperience, deleteExperience, createExperience, updateExperience, WorkExperience } from '../../../../../services/api';
import { useToast } from '../../../../../hooks/use-toast';
import { Badge } from '../../../Badge';
import { Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../Modal';
import ExperienceForm from './ExperienceForm';

const ExperienceManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<WorkExperience | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: experience, isLoading } = useQuery({
        queryKey: ['admin-experience'],
        queryFn: getAdminExperience,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: createExperience,
        onSuccess: (newExp) => {
            queryClient.setQueryData(['admin-experience'], (old: WorkExperience[] | undefined) => {
                return old ? [newExp, ...old] : [newExp];
            });
            // Invalidate public experience cache
            queryClient.invalidateQueries({ queryKey: ['experience'] });
            showToast("Experience created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create experience", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<WorkExperience> }) => updateExperience(id, data),
        onSuccess: (updatedExp) => {
            queryClient.setQueryData(['admin-experience'], (old: WorkExperience[] | undefined) => {
                return old ? old.map(e => e.id === updatedExp.id ? updatedExp : e) : [updatedExp];
            });
            // Invalidate public experience cache
            queryClient.invalidateQueries({ queryKey: ['experience'] });
            showToast("Experience updated successfully", "success");
            setIsModalOpen(false);
            setEditingExperience(undefined);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update experience", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteExperience,
        onMutate: async (expId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-experience'] });
            const previousExp = queryClient.getQueryData(['admin-experience']);
            queryClient.setQueryData(['admin-experience'], (old: WorkExperience[] | undefined) => {
                return old ? old.filter(e => e.id !== expId) : [];
            });
            return { previousExp };
        },
        onError: (err, expId, context) => {
            if (context?.previousExp) {
                queryClient.setQueryData(['admin-experience'], context.previousExp);
            }
            showToast("Failed to delete experience", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-experience'] });
            queryClient.invalidateQueries({ queryKey: ['experience'] });
        },
        onSuccess: () => {
            showToast("Experience deleted successfully", "success");
        }
    });

    const handleAdd = () => {
        setEditingExperience(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (exp: WorkExperience) => {
        setEditingExperience(exp);
        setIsModalOpen(true);
    };

    const handleDelete = async (exp: WorkExperience) => {
        if (window.confirm(`Are you sure you want to delete experience at "${exp.company}"?`)) {
            deleteMutation.mutate(exp.id);
        }
    };

    const handleSubmit = async (data: Partial<WorkExperience>) => {
        if (editingExperience) {
            updateMutation.mutate({ id: editingExperience.id, data });
        } else {
            createMutation.mutate(data as WorkExperience);
        }
    };

    const columns = [
        {
            header: 'Role',
            accessor: (item: WorkExperience) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{item.position}</p>
                        <p className="text-[11px] text-muted-foreground">{item.company}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            accessor: (item: WorkExperience) => (
                <span className="text-xs text-muted-foreground">{item.location || 'Remote'}</span>
            )
        },
        {
            header: 'Status',
            accessor: (item: WorkExperience) => (
                item.is_current ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-200 text-[10px] px-2 py-0 h-5">Current</Badge>
                ) : (
                    <span className="text-muted-foreground text-[11px]">Past</span>
                )
            )
        },
        {
            header: 'Duration',
            accessor: (item: WorkExperience) => (
                <span className="text-[11px] text-muted-foreground">
                    {item.start_date} - {item.is_current ? 'Present' : item.end_date}
                </span>
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="Work Experience"
                data={experience || []}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingExperience ? 'Edit Experience' : 'Add New Experience'}
            >
                <ExperienceForm
                    experience={editingExperience}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default ExperienceManagement;
