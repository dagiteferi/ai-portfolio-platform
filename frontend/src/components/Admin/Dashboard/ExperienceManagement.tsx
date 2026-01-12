import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminExperience, deleteExperience, WorkExperience } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Badge } from '../Badge';
import { Calendar } from 'lucide-react';

const ExperienceManagement = () => {
    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchExperiences = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminExperience();
            setExperiences(data);
        } catch (error) {
            showToast("Failed to fetch experiences", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleAdd = () => {
        showToast("Add experience modal would open here", "info");
    };

    const handleEdit = (exp: WorkExperience) => {
        showToast(`Editing experience at ${exp.company}`, "info");
    };

    const handleDelete = async (exp: WorkExperience) => {
        if (window.confirm(`Are you sure you want to delete experience at "${exp.company}"?`)) {
            try {
                await deleteExperience(exp.id);
                showToast("Experience deleted successfully", "success");
                fetchExperiences();
            } catch (error) {
                showToast("Failed to delete experience", "error");
            }
        }
    };

    const columns = [
        {
            header: 'Role & Company',
            accessor: (item: WorkExperience) => (
                <div>
                    <p className="font-medium">{item.position}</p>
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                </div>
            )
        },
        {
            header: 'Duration',
            accessor: (item: WorkExperience) => (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{item.start_date} - {item.is_current ? 'Present' : item.end_date}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (item: WorkExperience) => (
                item.is_current ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-200">Current</Badge>
                ) : (
                    <Badge variant="outline">Past</Badge>
                )
            )
        },
        {
            header: 'Location',
            accessor: (item: WorkExperience) => (
                <span className="text-xs">{item.location || 'Remote'}</span>
            )
        }
    ];

    return (
        <ManagementTable
            title="Work Experience"
            data={experiences}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default ExperienceManagement;
