import React, { useState } from 'react';
import { TechnicalSkill } from '../../../services/api';
import { Button } from '../Button';
import { Input } from '../Input';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface SkillFormProps {
    skill?: TechnicalSkill;
    onSubmit: (formData: FormData | Partial<TechnicalSkill>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: skill?.name || '',
        category: skill?.category || '',
        proficiency: skill?.proficiency || 'Intermediate',
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(skill?.icon || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        // If there's a file, we must use FormData
        if (file) {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('proficiency', formData.proficiency);
            data.append('file', file);
            await onSubmit(data);
        } else {
            // Otherwise we can just send JSON (or still FormData if preferred)
            await onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Skill Name</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. React"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Category</label>
                        <Input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Frontend"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Proficiency</label>
                        <select
                            name="proficiency"
                            value={formData.proficiency}
                            onChange={handleChange}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>

                <div className="w-full md:w-48 space-y-4">
                    <label className="text-sm font-medium mb-1.5 block">Icon</label>
                    <div className="relative group aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-colors bg-muted/5">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4" />
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
                                <ImageIcon className="h-8 w-8 stroke-1" />
                                <span className="text-[10px] font-medium">Upload Icon</span>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (skill ? 'Update Skill' : 'Create Skill')}
                </Button>
            </div>
        </form>
    );
};

export default SkillForm;
