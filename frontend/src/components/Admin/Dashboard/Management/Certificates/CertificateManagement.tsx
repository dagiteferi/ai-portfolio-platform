import React, { useState } from 'react';
import { ManagementTable } from '../../Shared';
import { getAdminCertificates, deleteCertificate, createCertificate, updateCertificate, Certificate } from '../../../../../services/api';
import { useToast } from '../../../../../hooks/use-toast';
import { Badge } from '../../../Badge';
import { ExternalLink, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../Modal';
import CertificateForm from './CertificateForm';

const CertificateManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const requireAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            localStorage.removeItem('adminAuthenticated');
            showToast('Your admin session expired. Please log in again.', 'error');
            window.location.assign('/admin/login');
            return false;
        }
        return true;
    };

    const { data: certificates, isLoading } = useQuery({
        queryKey: ['admin-certificates'],
        queryFn: getAdminCertificates,
        staleTime: 1000 * 60 * 5,
    });

    const syncPublicCertificates = (updater: (old: Certificate[] | undefined) => Certificate[]) => {
        queryClient.setQueryData(['certificates'], updater);
        queryClient.invalidateQueries({ queryKey: ['certificates'] });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCertificate(undefined);
    };

    const createMutation = useMutation({
        mutationFn: (formData: FormData) => createCertificate(formData),
        onSuccess: (newCert) => {
            queryClient.setQueryData(['admin-certificates'], (old: Certificate[] | undefined) => {
                return old ? [newCert, ...old] : [newCert];
            });
            syncPublicCertificates((old) => (old ? [newCert, ...old] : [newCert]));
            showToast('Certificate created successfully', 'success');
            closeModal();
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to create certificate', 'error');
            if (/invalid or expired token|not authenticated|unauthorized/i.test(error.message || '')) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminAuthenticated');
                window.location.assign('/admin/login');
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
            updateCertificate(id, formData),
        onSuccess: (updatedCert) => {
            queryClient.setQueryData(['admin-certificates'], (old: Certificate[] | undefined) => {
                return old
                    ? old.map((c) => (c.id === updatedCert.id ? updatedCert : c))
                    : [updatedCert];
            });
            syncPublicCertificates((old) =>
                old
                    ? old.map((c) => (c.id === updatedCert.id ? updatedCert : c))
                    : [updatedCert]
            );
            showToast('Certificate updated successfully', 'success');
            closeModal();
        },
        onError: (error: Error) => {
            showToast(error.message || 'Failed to update certificate', 'error');
            if (/invalid or expired token|not authenticated|unauthorized/i.test(error.message || '')) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminAuthenticated');
                window.location.assign('/admin/login');
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCertificate,
        onMutate: async (certId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-certificates'] });
            const previousCerts = queryClient.getQueryData(['admin-certificates']);
            queryClient.setQueryData(['admin-certificates'], (old: Certificate[] | undefined) => {
                return old ? old.filter((c) => c.id !== certId) : [];
            });
            return { previousCerts };
        },
        onError: (err: Error, _certId, context) => {
            if (context?.previousCerts) {
                queryClient.setQueryData(['admin-certificates'], context.previousCerts);
            }
            showToast(err.message || 'Failed to delete certificate', 'error');
            if (/invalid or expired token|not authenticated|unauthorized/i.test(err.message || '')) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminAuthenticated');
                window.location.assign('/admin/login');
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
        },
        onSuccess: (_data, certId) => {
            syncPublicCertificates((old) => (old ? old.filter((c) => c.id !== certId) : []));
            showToast('Certificate deleted successfully', 'success');
        },
    });

    const handleAdd = () => {
        setEditingCertificate(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (cert: Certificate) => {
        if (!requireAuth()) return;
        setEditingCertificate(cert);
        setIsModalOpen(true);
    };

    const handleDelete = (cert: Certificate) => {
        if (!requireAuth()) return;
        if (window.confirm(`Are you sure you want to delete "${cert.title}"?`)) {
            deleteMutation.mutate(cert.id);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (!requireAuth()) return;
        if (editingCertificate) {
            updateMutation.mutate({ id: editingCertificate.id, formData });
        } else {
            createMutation.mutate(formData);
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
            ),
        },
        {
            header: 'Type',
            accessor: (item: Certificate) =>
                item.is_professional ? (
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 text-[10px] px-2 py-0 h-5">
                        Professional
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">
                        Course
                    </Badge>
                ),
        },
        {
            header: 'Issued',
            accessor: (item: Certificate) => (
                <span className="text-xs text-muted-foreground">
                    {item.date_issued ? item.date_issued.slice(0, 10) : '—'}
                </span>
            ),
        },
        {
            header: 'Preview',
            accessor: (item: Certificate) => {
                if (!item.url) return <span className="text-xs text-muted-foreground">—</span>;

                const isImage = item.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);

                if (isImage) {
                    return (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block h-8 w-12 rounded overflow-hidden border hover:opacity-80 transition-opacity"
                        >
                            <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                        </a>
                    );
                }

                return (
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                    </a>
                );
            },
        },
    ];

    return (
        <>
            <ManagementTable
                title="Certificates"
                data={certificates || []}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
            >
                <CertificateForm
                    key={editingCertificate?.id ?? 'new-certificate'}
                    certificate={editingCertificate}
                    onSubmit={handleSubmit}
                    onCancel={closeModal}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default CertificateManagement;
