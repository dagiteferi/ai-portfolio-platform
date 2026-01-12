import React, { useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminCertificates, deleteCertificate, createCertificate, updateCertificate, Certificate } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Badge } from '../Badge';
import { ExternalLink, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../Modal';
import CertificateForm from './CertificateForm';

const CertificateManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: certificates = [], isLoading } = useQuery({
        queryKey: ['admin-certificates'],
        queryFn: getAdminCertificates,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: createCertificate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
            showToast("Certificate created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create certificate", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number, formData: FormData }) => updateCertificate(id, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-certificates'] });
            showToast("Certificate deleted successfully", "success");
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to delete certificate", "error");
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

    const handleSubmit = async (formData: FormData) => {
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
                    <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center shadow-sm">
                        <Award className="h-4 w-4 text-amber-600" />
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
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">Academic</Badge>
                )
            )
        },
        {
            header: 'Date Issued',
            accessor: (item: Certificate) => (
                <span className="text-[11px] text-muted-foreground">{item.date_issued || 'N/A'}</span>
            )
        },
        {
            header: 'Link',
            accessor: (item: Certificate) => (
                item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                ) : (
                    <span className="text-[11px] text-muted-foreground">No link</span>
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

