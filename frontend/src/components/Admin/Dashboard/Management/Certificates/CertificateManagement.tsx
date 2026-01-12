import React, { useState } from 'react';
import { ManagementTable } from '@/components/Admin/Dashboard/Shared';
import { getAdminCertificates, deleteCertificate, createCertificate, updateCertificate, Certificate } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/Admin/Badge';
import { ExternalLink, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Admin/Modal';
import CertificateForm from './CertificateForm';

const CertificateManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const MOCK_CERTIFICATES: Certificate[] = [
        {
            id: 1,
            title: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date_issued: "2023-05-15",
            is_professional: true,
            url: "https://aws.amazon.com"
        },
        {
            id: 2,
            title: "Deep Learning Specialization",
            issuer: "Coursera",
            date_issued: "2022-11-20",
            is_professional: false,
            url: "https://coursera.org"
        }
    ];

    const { data: apiCertificates, isLoading } = useQuery({
        queryKey: ['admin-certificates'],
        queryFn: getAdminCertificates,
        staleTime: 1000 * 60 * 5,
    });

    const certificates = apiCertificates && apiCertificates.length > 0 ? apiCertificates : MOCK_CERTIFICATES;

    const createMutation = useMutation({
        mutationFn: (data: any) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            return createCertificate(formData);
        },
        onSuccess: (newCert) => {
            queryClient.setQueryData(['admin-certificates'], (old: Certificate[] | undefined) => {
                return old ? [newCert, ...old] : [newCert];
            });
            showToast("Certificate created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create certificate", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            return updateCertificate(id, formData);
        },
        onSuccess: (updatedCert) => {
            queryClient.setQueryData(['admin-certificates'], (old: Certificate[] | undefined) => {
                return old ? old.map(c => c.id === updatedCert.id ? updatedCert : c) : [updatedCert];
            });
            showToast("Certificate updated successfully", "success");
            setIsModalOpen(false);
            setEditingCertificate(undefined);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update certificate", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCertificate,
        onMutate: async (certId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-certificates'] });
            const previousCerts = queryClient.getQueryData(['admin-certificates']);
            queryClient.setQueryData(['admin-certificates'], (old: Certificate[] | undefined) => {
                return old ? old.filter(c => c.id !== certId) : [];
            });
            return { previousCerts };
        },
        onError: (err, certId, context) => {
            if (context?.previousCerts) {
                queryClient.setQueryData(['admin-certificates'], context.previousCerts);
            }
            showToast("Failed to delete certificate", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
        },
        onSuccess: () => {
            showToast("Certificate deleted successfully", "success");
        }
    });

    const handleAdd = () => {
        setEditingCertificate(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (cert: Certificate) => {
        setEditingCertificate(cert);
        setIsModalOpen(true);
    };

    const handleDelete = async (cert: Certificate) => {
        if (window.confirm(`Are you sure you want to delete "${cert.title}"?`)) {
            deleteMutation.mutate(cert.id);
        }
    };

    const handleSubmit = async (data: any) => {
        if (editingCertificate) {
            updateMutation.mutate({ id: editingCertificate.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const columns = [
        {
            header: 'Certificate',
            accessor: (item: Certificate) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">{item.issuer}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            accessor: (item: Certificate) => (
                item.is_professional ? (
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 text-[10px] px-2 py-0 h-5">Professional</Badge>
                ) : (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">Course</Badge>
                )
            )
        },
        {
            header: 'Issued',
            accessor: (item: Certificate) => (
                <span className="text-xs text-muted-foreground">{item.date_issued}</span>
            )
        },
        {
            header: 'Link',
            accessor: (item: Certificate) => (
                item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="Certificates"
                data={certificates}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
            >
                <CertificateForm
                    certificate={editingCertificate}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default CertificateManagement;
