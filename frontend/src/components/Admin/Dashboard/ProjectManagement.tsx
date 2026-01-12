import React, { useEffect, useState } from 'react';
import ManagementTable from './ManagementTable';
import { getAdminProjects, deleteProject, Project } from '../../../services/api';
import { useToast } from '../../../hooks/use-toast';
import { Badge } from '../Badge';
import { ExternalLink, Github } from 'lucide-react';

const ProjectManagement = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const data = await getAdminProjects();
            setProjects(data);
        } catch (error) {
            showToast("Failed to fetch projects", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleAdd = () => {
        showToast("Add project modal would open here", "info");
    };

    const handleEdit = (project: Project) => {
        showToast(`Editing project: ${project.title}`, "info");
    };

    const handleDelete = async (project: Project) => {
        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            try {
                await deleteProject(project.id);
                showToast("Project deleted successfully", "success");
                fetchProjects();
            } catch (error) {
                showToast("Failed to delete project", "error");
            }
        }
    };

    const columns = [
        {
            header: 'Project',
            accessor: (item: Project) => (
                <div className="flex items-center gap-3">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="h-10 w-10 rounded-md object-cover border" />
                    ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border">
                            <span className="text-xs font-bold text-muted-foreground">NA</span>
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
            header: 'Category',
            accessor: (item: Project) => (
                <Badge variant="secondary">{item.category || 'Uncategorized'}</Badge>
            )
        },
        {
            header: 'Featured',
            accessor: (item: Project) => (
                item.is_featured ? (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Featured</Badge>
                ) : (
                    <span className="text-muted-foreground text-xs">No</span>
                )
            )
        },
        {
            header: 'Links',
            accessor: (item: Project) => (
                <div className="flex gap-2">
                    {item.project_url && (
                        <a href={item.project_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                    {item.github_url && (
                        <a href={item.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Github className="h-4 w-4" />
                        </a>
                    )}
                </div>
            )
        }
    ];

    return (
        <ManagementTable
            title="Projects"
            data={projects}
            columns={columns}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
        />
    );
};

export default ProjectManagement;
