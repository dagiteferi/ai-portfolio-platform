import React, { useState } from 'react';
import { ManagementTable } from '../../Shared';
import { getAdminCVs, deleteCV, uploadCV, CV } from '../../../../../services/api';
import { useToast } from '../../../../../hooks/use-toast';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { Button } from '../../../Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../Modal';
import CVUploadForm from './CVUploadForm';

const CVManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const MOCK_CVS: CV[] = [
        {
            id: 1,
            url: "https://example.com/cv.pdf",
            uploaded_at: new Date().toISOString()
        }
    ];

    const { data: apiCVs, isLoading } = useQuery({
        queryKey: ['admin-cvs'],
        queryFn: getAdminCVs,
        staleTime: 1000 * 60 * 5,
    });

    const cvs = apiCVs && apiCVs.length > 0 ? apiCVs : MOCK_CVS;

    const uploadMutation = useMutation({
        mutationFn: uploadCV,
        onSuccess: (newCV) => {
            queryClient.setQueryData(['admin-cvs'], (old: CV[] | undefined) => {
                return old ? [newCV, ...old] : [newCV];
            });
            showToast("CV uploaded successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to upload CV", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCV,
        onMutate: async (cvId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-cvs'] });
            const previousCVs = queryClient.getQueryData(['admin-cvs']);
            queryClient.setQueryData(['admin-cvs'], (old: CV[] | undefined) => {
                return old ? old.filter(cv => cv.id !== cvId) : [];
            });
            return { previousCVs };
        },
        onError: (err, cvId, context) => {
            if (context?.previousCVs) {
                queryClient.setQueryData(['admin-cvs'], context.previousCVs);
            }
            showToast("Failed to delete CV", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-cvs'] });
        },
        onSuccess: () => {
            showToast("CV deleted successfully", "success");
        }
    });

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleEdit = (cv: CV) => {
        window.open(cv.url, '_blank');
    };

    const handleDelete = async (cv: CV) => {
        if (window.confirm(`Are you sure you want to delete this CV?`)) {
            deleteMutation.mutate(cv.id);
        }
    };

    const handleUpload = async (formData: FormData) => {
        uploadMutation.mutate(formData);
    };

    const columns = [
        {
            header: 'CV File',
            accessor: (item: CV) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <p className="font-medium">Curriculum Vitae</p>
                        <p className="text-xs text-muted-foreground">Uploaded on {new Date(item.uploaded_at).toLocaleDateString()}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: (item: CV) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" /> View
                        </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href={item.url} download>
                            <Download className="h-4 w-4 mr-2" /> Download
                        </a>
                    </Button>
                </div>
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="CV Management"
                data={cvs}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Upload New CV"
            >
                <CVUploadForm
                    onSubmit={handleUpload}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={uploadMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default CVManagement;
