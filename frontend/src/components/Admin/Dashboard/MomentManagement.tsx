import React, { useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminMoments, deleteMoment, createMoment, updateMoment, MemorableMoment } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Camera } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../Modal';
import MomentForm from './MomentForm';

const MomentManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMoment, setEditingMoment] = useState<MemorableMoment | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: moments = [], isLoading } = useQuery({
        queryKey: ['admin-moments'],
        queryFn: getAdminMoments,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: createMoment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-moments'] });
            showToast("Moment created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create moment", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number, formData: FormData }) => updateMoment(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-moments'] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-moments'] });
            showToast("Moment deleted successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to delete moment", "error");
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
                        <img src={item.image_url} alt={item.title} className="h-12 w-12 rounded-md object-cover border shadow-sm" />
                    ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border">
                            <Camera className="h-5 w-5 text-muted-foreground" />
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
                <span className="text-[11px] text-muted-foreground">{item.date || 'N/A'}</span>
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
