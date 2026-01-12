import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminCVs, deleteCV, CV } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { Button } from '../Button';

const CVManagement = () => {
    const [cvs, setCvs] = useState<CV[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const MOCK_CVS: CV[] = [
        {
            id: 1,
            url: "https://example.com/cv.pdf",
            uploaded_at: new Date().toISOString()
        }
    ];

    const fetchCVs = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminCVs();
            if (data && data.length > 0) {
                setCvs(data);
            } else {
                setCvs(MOCK_CVS);
            }
        } catch (error) {
            console.error("API Error, using mock data:", error);
            setCvs(MOCK_CVS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCVs();
    }, []);

    const handleAdd = () => {
        showToast("Upload CV modal would open here", "info");
    };

    const handleEdit = (cv: CV) => {
        showToast(`Viewing CV uploaded at ${cv.uploaded_at}`, "info");
    };

    const handleDelete = async (cv: CV) => {
        if (window.confirm(`Are you sure you want to delete this CV?`)) {
            try {
                await deleteCV(cv.id);
                showToast("CV deleted successfully", "success");
                fetchCVs();
            } catch (error) {
                showToast("Failed to delete CV", "error");
            }
        }
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
        <ManagementTable
            title="CV Management"
            data={cvs}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default CVManagement;
