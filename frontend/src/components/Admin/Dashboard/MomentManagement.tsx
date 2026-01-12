import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminMoments, deleteMoment, MemorableMoment } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Camera } from 'lucide-react';

const MomentManagement = () => {
    const [moments, setMoments] = useState<MemorableMoment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchMoments = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminMoments();
            setMoments(data);
        } catch (error) {
            showToast("Failed to fetch moments", "error");
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
