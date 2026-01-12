import React, { useState } from 'react';
import { ManagementTable } from '../../Shared';
import { getAdminMoments, deleteMoment, createMoment, updateMoment, MemorableMoment } from '../../../../../services/api';
import { useToast } from '../../../../../hooks/use-toast';
import { Camera } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../Modal';
import MomentForm from './MomentForm';

const MomentManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMoment, setEditingMoment] = useState<MemorableMoment | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const MOCK_MOMENTS: MemorableMoment[] = [
        {
            id: 1,
            title: "Speaking at AI Summit",
            description: "Presented our research on generative models.",
            date: "2023-08-10",
            image_url: "https://example.com/summit.jpg"
        },
        {
            id: 2,
            title: "Hackathon Winner",
            description: "Won first place in the Global AI Hackathon.",
            date: "2022-12-05",
            image_url: "https://example.com/hackathon.jpg"
        }
    ];

    const { data: apiMoments, isLoading } = useQuery({
        queryKey: ['admin-moments'],
        queryFn: getAdminMoments,
        staleTime: 1000 * 60 * 5,
    });

    const moments = apiMoments && apiMoments.length > 0 ? apiMoments : MOCK_MOMENTS;

    const createMutation = useMutation({
        mutationFn: createMoment,
        onSuccess: (newMoment) => {
            queryClient.setQueryData(['admin-moments'], (old: MemorableMoment[] | undefined) => {
                return old ? [newMoment, ...old] : [newMoment];
            });
            showToast("Moment created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create moment", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number, formData: FormData }) => updateMoment(id, formData),
        onSuccess: (updatedMoment) => {
            queryClient.setQueryData(['admin-moments'], (old: MemorableMoment[] | undefined) => {
                return old ? old.map(m => m.id === updatedMoment.id ? updatedMoment : m) : [updatedMoment];
            });
            showToast("Moment updated successfully", "success");
            setIsModalOpen(false);
            setEditingMoment(undefined);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update moment", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMoment,
        onMutate: async (momentId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-moments'] });
            const previousMoments = queryClient.getQueryData(['admin-moments']);
            queryClient.setQueryData(['admin-moments'], (old: MemorableMoment[] | undefined) => {
                return old ? old.filter(m => m.id !== momentId) : [];
            });
            return { previousMoments };
        },
        onError: (err, momentId, context) => {
            if (context?.previousMoments) {
                queryClient.setQueryData(['admin-moments'], context.previousMoments);
            }
            showToast("Failed to delete moment", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-moments'] });
        },
        onSuccess: () => {
            showToast("Moment deleted successfully", "success");
        }
    });

    const handleAdd = () => {
        setEditingMoment(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (moment: MemorableMoment) => {
        setEditingMoment(moment);
        setIsModalOpen(true);
    };

    const handleDelete = async (moment: MemorableMoment) => {
        if (window.confirm(`Are you sure you want to delete "${moment.title}"?`)) {
            deleteMutation.mutate(moment.id);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (editingMoment) {
            updateMutation.mutate({ id: editingMoment.id, formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const columns = [
        {
            header: 'Moment',
            accessor: (item: MemorableMoment) => (
                <div className="flex items-center gap-3">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="h-10 w-10 rounded-md object-cover border shadow-sm" />
                    ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">{item.description}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Date',
            accessor: (item: MemorableMoment) => (
                <span className="text-xs text-muted-foreground">{item.date}</span>
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="Memorable Moments"
                data={moments}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMoment ? 'Edit Moment' : 'Add New Moment'}
            >
                <MomentForm
                    moment={editingMoment}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default MomentManagement;
