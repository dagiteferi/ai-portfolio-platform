import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminEducation, deleteEducation, Education } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { GraduationCap } from 'lucide-react';

const EducationManagement = () => {
    const [education, setEducation] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchEducation = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminEducation();
            setEducation(data);
        } catch (error) {
            showToast("Failed to fetch education entries", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEducation();
    }, []);

    const handleAdd = () => {
        showToast("Add education modal would open here", "info");
    };

    const handleEdit = (edu: Education) => {
        showToast(`Editing education at ${edu.institution}`, "info");
    };

    const handleDelete = async (edu: Education) => {
        if (window.confirm(`Are you sure you want to delete education at "${edu.institution}"?`)) {
            try {
                await deleteEducation(edu.id);
                showToast("Education entry deleted successfully", "success");
                fetchEducation();
            } catch (error) {
                showToast("Failed to delete education entry", "error");
            }
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
                        <p className="font-medium">{item.institution}</p>
                        <p className="text-xs text-muted-foreground">{item.degree} in {item.field_of_study}</p>
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
                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">{item.description || 'No description'}</p>
            )
        }
    ];

    return (
        <ManagementTable
            title="Education"
            data={education}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default EducationManagement;
