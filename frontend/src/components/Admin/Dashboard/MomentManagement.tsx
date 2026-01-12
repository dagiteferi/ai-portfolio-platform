import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminMoments, deleteMoment, MemorableMoment } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Camera } from 'lucide-react';

const MomentManagement = () => {
    const [moments, setMoments] = useState<MemorableMoment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const MOCK_MOMENTS: MemorableMoment[] = [
        {
            id: 1,
            title: "First AI Model Deployment",
            description: "Successfully deployed my first production-grade computer vision model.",
            date: "2021-03-15",
            image_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=100&h=100&fit=crop"
        },
        {
            id: 2,
            title: "Hackathon Winner",
            description: "Won first place at the National AI Innovation Hackathon.",
            date: "2022-08-20",
            image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop"
        }
    ];

    const fetchMoments = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminMoments();
            if (data && data.length > 0) {
                setMoments(data);
            } else {
                setMoments(MOCK_MOMENTS);
            }
        } catch (error) {
            console.error("API Error, using mock data:", error);
            setMoments(MOCK_MOMENTS);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMoments();
    }, []);

    const handleAdd = () => {
        showToast("Add moment modal would open here", "info");
    };

    const handleEdit = (moment: MemorableMoment) => {
        showToast(`Editing moment: ${moment.title}`, "info");
    };

    const handleDelete = async (moment: MemorableMoment) => {
        if (window.confirm(`Are you sure you want to delete "${moment.title}"?`)) {
            try {
                await deleteMoment(moment.id);
                showToast("Moment deleted successfully", "success");
                fetchMoments();
            } catch (error) {
                showToast("Failed to delete moment", "error");
            }
        }
    };

    const columns = [
        {
            header: 'Moment',
            accessor: (item: MemorableMoment) => (
                <div className="flex items-center gap-3">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="h-12 w-12 rounded-md object-cover border" />
                    ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border">
                            <Camera className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{item.description}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Date',
            accessor: (item: MemorableMoment) => (
                <span className="text-xs text-muted-foreground">{item.date || 'N/A'}</span>
            )
        }
    ];

    return (
        <ManagementTable
            title="Memorable Moments"
            data={moments}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default MomentManagement;
