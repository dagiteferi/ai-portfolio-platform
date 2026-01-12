import React, { useState } from 'react';
import { ManagementTable } from '@/components/Admin/Dashboard/Shared';
import { getAdminEducation, deleteEducation, createEducation, updateEducation, Education } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Admin/Modal';
import EducationForm from './EducationForm';

const EducationManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const MOCK_EDUCATION: Education[] = [
        {
            id: 1,
            institution: "Stanford University",
            degree: "Master of Science",
            field_of_study: "Artificial Intelligence",
            start_date: "2018-09",
            end_date: "2020-06",
            description: "Specialized in Deep Learning and Computer Vision."
        },
        {
            id: 2,
            institution: "MIT",
            degree: "Bachelor of Science",
            field_of_study: "Computer Science",
            start_date: "2014-09",
            end_date: "2018-06",
            description: "GPA: 4.0/4.0. Minor in Mathematics."
        }
    ];

    const { data: apiEducation, isLoading } = useQuery({
        queryKey: ['admin-education'],
        queryFn: getAdminEducation,
        staleTime: 1000 * 60 * 5,
    });

    const education = apiEducation && apiEducation.length > 0 ? apiEducation : MOCK_EDUCATION;

    const createMutation = useMutation({
        mutationFn: createEducation,
        onSuccess: (newEdu) => {
            queryClient.setQueryData(['admin-education'], (old: Education[] | undefined) => {
                return old ? [newEdu, ...old] : [newEdu];
            });
            showToast("Education created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create education", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<Education> }) => updateEducation(id, data),
        onSuccess: (updatedEdu) => {
            queryClient.setQueryData(['admin-education'], (old: Education[] | undefined) => {
                return old ? old.map(e => e.id === updatedEdu.id ? updatedEdu : e) : [updatedEdu];
            });
            showToast("Education updated successfully", "success");
            setIsModalOpen(false);
            setEditingEducation(undefined);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update education", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteEducation,
        onMutate: async (eduId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-education'] });
            const previousEdu = queryClient.getQueryData(['admin-education']);
            queryClient.setQueryData(['admin-education'], (old: Education[] | undefined) => {
                return old ? old.filter(edu => edu.id !== eduId) : [];
            });
            return { previousEdu };
        },
        onError: (err, eduId, context) => {
            if (context?.previousEdu) {
                queryClient.setQueryData(['admin-education'], context.previousEdu);
            }
            showToast("Failed to delete education entry", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-education'] });
        },
        onSuccess: () => {
            showToast("Education entry deleted successfully", "success");
        }
    });

    const handleAdd = () => {
        setEditingEducation(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (edu: Education) => {
        setEditingEducation(edu);
        setIsModalOpen(true);
    };

    const handleDelete = async (edu: Education) => {
        if (window.confirm(`Are you sure you want to delete education at "${edu.institution}"?`)) {
            deleteMutation.mutate(edu.id);
        }
    };

    const handleSubmit = async (data: Partial<Education>) => {
        if (editingEducation) {
            updateMutation.mutate({ id: editingEducation.id, data });
        } else {
            createMutation.mutate(data as Education);
        }
    };

    const columns = [
        {
            header: 'Institution',
            accessor: (item: Education) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{item.institution}</p>
                        <p className="text-[11px] text-muted-foreground">{item.degree} in {item.field_of_study}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Duration',
            accessor: (item: Education) => (
                <span className="text-xs text-muted-foreground">{item.start_date} - {item.end_date || 'Present'}</span>
            )
        },
        {
            header: 'Description',
            accessor: (item: Education) => (
                <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[300px]">{item.description || 'No description'}</p>
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="Education"
                data={education}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEducation ? 'Edit Education' : 'Add New Education'}
            >
                <EducationForm
                    education={editingEducation}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default EducationManagement;
