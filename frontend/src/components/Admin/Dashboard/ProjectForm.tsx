import React, { useState, useEffect } from 'react';
import { Project } from '../../../services/api';
import { Button } from '../Button';
import { Input } from '../Input';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ProjectFormProps {
    project?: Project;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        category: project?.category || '',
        description: project?.description || '',
        technologies: project?.technologies || '',
        project_url: project?.project_url || '',
        github_url: project?.github_url || '',
        is_featured: project?.is_featured || false,
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(project?.image_url || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, String(value));
        });
        if (file) {
            data.append('file', file);
        }
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Project Title</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. AI Portfolio Platform"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Category</label>
                        <Input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Web Development"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Technologies (comma separated)</label>
                        <Input
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="e.g. React, FastAPI, PostgreSQL"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium mb-1.5 block">Project Image</label>
                    <div className="relative group aspect-video rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-colors bg-muted/5">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <label className="cursor-pointer bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors">
                                        <Upload className="h-5 w-5 text-white" />
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => { setFile(null); setPreviewUrl(null); }}
                                        className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-white" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <ImageIcon className="h-10 w-10 stroke-1" />
                                <span className="text-xs font-medium">Click to upload image</span>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your project..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Project URL</label>
                    <Input
                        name="project_url"
                        value={formData.project_url}
                        onChange={handleChange}
                        placeholder="https://example.com"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">GitHub URL</label>
                    <Input
                        name="github_url"
                        value={formData.github_url}
                        onChange={handleChange}
                        placeholder="https://github.com/username/repo"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                    Feature this project on the homepage
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                        </div>
                    ) : (
                        project ? 'Update Project' : 'Create Project'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ProjectForm;
