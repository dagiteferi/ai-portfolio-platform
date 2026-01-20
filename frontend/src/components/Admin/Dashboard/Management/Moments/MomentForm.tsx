import React, { useState } from 'react';
import { MemorableMoment } from '../../../../../services/api';
import { Button } from '../../../Button';
import { Input } from '../../../Input';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface MomentFormProps {
    moment?: MemorableMoment;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const MomentForm: React.FC<MomentFormProps> = ({ moment, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: moment?.title || '',
        description: moment?.description || '',
        date: moment?.date || '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(moment?.image_url || null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                        <label className="text-sm font-medium mb-1.5 block">Title</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. First AI Model Deployment"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Date</label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium mb-1.5 block">Moment Image</label>
                    <div className="relative group aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-colors bg-muted/5">
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
                                <span className="text-xs font-medium">Upload Image</span>
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Describe this memorable moment..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (moment ? 'Update Moment' : 'Create Moment')}
                </Button>
            </div>
        </form>
    );
};

export default MomentForm;
