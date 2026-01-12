import React, { useState } from 'react';
import { TechnicalSkill } from '@/services/api';
import { Button } from '@/components/Admin/Button';
import { Input } from '@/components/Admin/Input';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface SkillFormProps {
    skill?: TechnicalSkill;
    onSubmit: (formData: FormData | Partial<TechnicalSkill>) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onSubmit, onCancel, isSubmitting }) => {
    // Helper to convert descriptive proficiency to percentage
    const getInitialProficiency = (p?: string) => {
        if (!p) return 50;
        if (p === 'Expert') return 100;
        if (p === 'Advanced') return 75;
        if (p === 'Intermediate') return 50;
        if (p === 'Beginner') return 25;
        // If it's already a number string (e.g. "85"), parse it
        const num = parseInt(p);
        return isNaN(num) ? 50 : num;
    };

    const [formData, setFormData] = useState({
        name: skill?.name || '',
        category: skill?.category || '',
        proficiency: String(getInitialProficiency(skill?.proficiency)),
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

        if (file) {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('proficiency', formData.proficiency);
            data.append('file', file);
            await onSubmit(data);
        } else {
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
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-sm font-medium block">Proficiency</label>
                            <span className="text-xs font-bold text-primary">{formData.proficiency}%</span>
                        </div>
                        <input
                            type="range"
                            name="proficiency"
                            min="0"
                            max="100"
                            step="5"
                            value={formData.proficiency}
                            onChange={handleChange}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Advanced</span>
                            <span>Expert</span>
                        </div>
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
