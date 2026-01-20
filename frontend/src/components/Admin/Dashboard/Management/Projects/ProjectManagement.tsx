import React, { useState } from 'react';
import { ManagementTable } from '../../Shared';
import { getAdminProjects, deleteProject, createProject, updateProject, Project } from '../../../../../services/api';
import { useToast } from '../../../../../hooks/use-toast';
import { Badge } from '../../../Badge';
import { ExternalLink, Github } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../../../Modal';
import ProjectForm from './ProjectForm';

const ProjectManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: projects, isLoading } = useQuery({
        queryKey: ['admin-projects'],
        queryFn: getAdminProjects,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: createProject,
        onSuccess: (newProject) => {
            queryClient.setQueryData(['admin-projects'], (old: Project[] | undefined) => {
                return old ? [newProject, ...old] : [newProject];
            });
            // Invalidate public projects cache
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            showToast("Project created successfully", "success");
            setIsModalOpen(false);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to create project", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number, formData: FormData }) => updateProject(id, formData),
        onSuccess: (updatedProject) => {
            queryClient.setQueryData(['admin-projects'], (old: Project[] | undefined) => {
                return old ? old.map(p => p.id === updatedProject.id ? updatedProject : p) : [updatedProject];
            });
            // Invalidate public projects cache
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            showToast("Project updated successfully", "success");
            setIsModalOpen(false);
            setEditingProject(undefined);
        },
        onError: (error: any) => {
            showToast(error.message || "Failed to update project", "error");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProject,
        onMutate: async (projectId) => {
            await queryClient.cancelQueries({ queryKey: ['admin-projects'] });
            const previousProjects = queryClient.getQueryData(['admin-projects']);
            queryClient.setQueryData(['admin-projects'], (old: Project[] | undefined) => {
                return old ? old.filter(p => p.id !== projectId) : [];
            });
            return { previousProjects };
        },
        onError: (err, projectId, context) => {
            if (context?.previousProjects) {
                queryClient.setQueryData(['admin-projects'], context.previousProjects);
            }
            showToast("Failed to delete project", "error");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        },
        onSuccess: () => {
            // Invalidate public projects cache
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            showToast("Project deleted successfully", "success");
        }
    });

    const handleAdd = () => {
        setEditingProject(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = async (project: Project) => {
        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
            deleteMutation.mutate(project.id);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const columns = [
        {
            header: 'Project',
            accessor: (item: Project) => (
                <div className="flex items-center gap-3">
                    {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="h-10 w-10 rounded-md object-cover border shadow-sm" />
                    ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border">
                            <span className="text-[10px] font-bold text-muted-foreground">AI</span>
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[200px]">{item.description}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Category',
            accessor: (item: Project) => (
                <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0 h-5">
                    {item.category || 'Uncategorized'}
                </Badge>
            )
        },
        {
            header: 'Featured',
            accessor: (item: Project) => (
                item.is_featured ? (
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] px-2 py-0 h-5">Featured</Badge>
                ) : (
                    <span className="text-muted-foreground text-[11px]">No</span>
                )
            )
        },
        {
            header: 'Links',
            accessor: (item: Project) => (
                <div className="flex gap-2">
                    {item.project_url && (
                        <a href={item.project_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    )}
                    {item.github_url && (
                        <a href={item.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Github className="h-3.5 w-3.5" />
                        </a>
                    )}
                </div>
            )
        }
    ];

    return (
        <>
            <ManagementTable
                title="Projects"
                data={projects || []}
                columns={columns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProject ? 'Edit Project' : 'Add New Project'}
            >
                <ProjectForm
                    project={editingProject}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            </Modal>
        </>
    );
};

export default ProjectManagement;
