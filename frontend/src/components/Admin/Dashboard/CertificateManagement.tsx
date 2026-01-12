import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminCertificates, deleteCertificate, Certificate } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Badge } from '../Badge';
import { ExternalLink, Award } from 'lucide-react';

const CertificateManagement = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const MOCK_CERTIFICATES: Certificate[] = [
        {
            id: 1,
            title: "AWS Certified Machine Learning - Specialty",
            issuer: "Amazon Web Services",
            date_issued: "2023-05",
            is_professional: true,
            url: "https://aws.amazon.com"
        },
        {
            id: 2,
            title: "Deep Learning Specialization",
            issuer: "Coursera (DeepLearning.AI)",
            date_issued: "2022-11",
            is_professional: true,
            url: "https://coursera.org"
        }
    ];

    const fetchCertificates = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminCertificates();
            if (data && data.length > 0) {
                setCertificates(data);
            } else {
                setCertificates(MOCK_CERTIFICATES);
            }
        } catch (error) {
            console.error("API Error, using mock data:", error);
            setCertificates(MOCK_CERTIFICATES);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleAdd = () => {
        showToast("Add certificate modal would open here", "info");
    };

    const handleEdit = (cert: Certificate) => {
        showToast(`Editing certificate: ${cert.title}`, "info");
    };

    const handleDelete = async (cert: Certificate) => {
        if (window.confirm(`Are you sure you want to delete "${cert.title}"?`)) {
            try {
                await deleteCertificate(cert.id);
                showToast("Certificate deleted successfully", "success");
                fetchCertificates();
            } catch (error) {
                showToast("Failed to delete certificate", "error");
            }
        }
    };

    const columns = [
        {
            header: 'Certificate',
            accessor: (item: Certificate) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.issuer}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            accessor: (item: Certificate) => (
                item.is_professional ? (
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Professional</Badge>
                ) : (
                    <Badge variant="outline">Academic/Other</Badge>
                )
            )
        },
        {
            header: 'Date Issued',
            accessor: (item: Certificate) => (
                <span className="text-xs text-muted-foreground">{item.date_issued || 'N/A'}</span>
            )
        },
        {
            header: 'Link',
            accessor: (item: Certificate) => (
                item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                    </a>
                ) : (
                    <span className="text-xs text-muted-foreground">No link</span>
                )
            )
        }
    ];

    return (
        <ManagementTable
            title="Certificates"
            data={certificates}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default CertificateManagement;
