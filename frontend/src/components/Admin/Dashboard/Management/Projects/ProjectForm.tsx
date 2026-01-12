import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Project } from '../../../../../services/api';
import { Button } from '../../../Button';
import { Input } from '../../../Input';
import { Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import { cn } from '../../../../../lib/utils';

const projectSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
    category: z.string().min(2, { message: 'Category must be at least 2 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    technologies: z.string().min(2, { message: 'Technologies are required' }),
    project_url: z.string().optional().refine((val) => !val || val === "" || /^(https?:\/\/)/.test(val), {
        message: 'Must be a valid URL',
    }),
    github_url: z.string().optional().refine((val) => !val || val === "" || /^(https?:\/\/)/.test(val), {
        message: 'Must be a valid URL',
    }),
    is_featured: z.boolean(),
});

type ProjectFormValues = {
    title: string;
    category: string;
    description: string;
    technologies: string;
    project_url?: string;
    github_url?: string;
    is_featured: boolean;
};

interface ProjectFormProps {
    project?: Project;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel, isSubmitting }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(project?.image_url || null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title || '',
            category: project?.category || '',
            description: project?.description || '',
            technologies: project?.technologies || '',
            project_url: project?.project_url || '',
            github_url: project?.github_url || '',
            is_featured: project?.is_featured || false,
        }
    });

    const isFeatured = watch('is_featured');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const onFormSubmit = async (values: ProjectFormValues) => {
        const data = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                data.append(key, String(value));
            }
        });
        if (file) {
            data.append('file', file);
        }
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium block">Project Title</label>
                        <Input
                            {...register('title')}
                            placeholder="e.g. AI Portfolio Platform"
                            className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.title && (
                            <div className="text-[11px] text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>{errors.title.message}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium block">Category</label>
                        <Input
                            {...register('category')}
                            placeholder="e.g. Web Development"
                            className={cn(errors.category && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.category && (
                            <div className="text-[11px] text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>{errors.category.message}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium block">Technologies</label>
                        <Input
                            {...register('technologies')}
                            placeholder="e.g. React, FastAPI, PostgreSQL"
                            className={cn(errors.technologies && "border-destructive focus-visible:ring-destructive")}
                        />
                        {errors.technologies && (
                            <div className="text-[11px] text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>{errors.technologies.message}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium block">Project Image</label>
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

            <div className="space-y-1.5">
                <label className="text-sm font-medium block">Description</label>
                <textarea
                    {...register('description')}
                    rows={4}
                    className={cn(
                        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        errors.description && "border-destructive focus-visible:ring-destructive"
                    )}
                    placeholder="Describe your project..."
                />
                {errors.description && (
                    <div className="text-[11px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.description.message}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium block">Project URL</label>
                    <Input
                        {...register('project_url')}
                        placeholder="https://example.com"
                        className={cn(errors.project_url && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.project_url && (
                        <div className="text-[11px] text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.project_url.message}</span>
                        </div>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium block">GitHub URL</label>
                    <Input
                        {...register('github_url')}
                        placeholder="https://github.com/username/repo"
                        className={cn(errors.github_url && "border-destructive focus-visible:ring-destructive")}
                    />
                    {errors.github_url && (
                        <div className="text-[11px] text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.github_url.message}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                <div
                    className={cn(
                        "w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200",
                        isFeatured ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                    onClick={() => setValue('is_featured', !isFeatured)}
                >
                    <div className={cn(
                        "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200",
                        isFeatured && "translate-x-5"
                    )} />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-semibold block">Featured Project</label>
                    <p className="text-[11px] text-muted-foreground">This project will be highlighted on your homepage.</p>
                </div>
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
