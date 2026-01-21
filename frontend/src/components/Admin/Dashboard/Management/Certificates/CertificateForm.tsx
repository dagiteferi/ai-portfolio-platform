import React, { useState } from 'react';
import { Certificate } from '../../../../../services/api';
import { Button } from '../../../Button';
import { Input } from '../../../Input';
import { FileText, Upload, X } from 'lucide-react';

interface CertificateFormProps {
    certificate?: Certificate;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ certificate, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: certificate?.title || '',
        issuer: certificate?.issuer || '',
        date_issued: certificate?.date_issued || '',
        description: certificate?.description || '',
        is_professional: certificate?.is_professional || false,
        url: certificate?.url || '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

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
            setFileName(selectedFile.name);
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
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Certificate Title</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. AWS Certified Machine Learning"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Issuer</label>
                    <Input
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="e.g. Amazon Web Services"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Date Issued</label>
                    <Input
                        type="date"
                        name="date_issued"
                        value={formData.date_issued}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-end pb-2.5">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_professional"
                            name="is_professional"
                            checked={formData.is_professional}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_professional" className="text-sm font-medium">
                            Professional Certification
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Certificate File / PDF</label>
                <div className="relative group rounded-xl border-2 border-dashed border-muted-foreground/25 p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors bg-muted/5 overflow-hidden">
                    {file && file.type.startsWith('image/') ? (
                        <div className="relative w-full aspect-video">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => { setFile(null); setFileName(null); }}
                                className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full hover:bg-black/70 transition-colors text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (fileName || (formData.url && formData.url.match(/\.(jpeg|jpg|gif|png|webp)$/i))) ? (
                        <div className="flex flex-col items-center gap-3 w-full">
                            {formData.url && formData.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) && !file && (
                                <div className="relative w-full aspect-video mb-2">
                                    <img
                                        src={formData.url}
                                        alt="Current Certificate"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-3 w-full bg-background/50 p-3 rounded-lg border">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{fileName || 'Current Certificate File'}</p>
                                    <p className="text-xs text-muted-foreground">Click to change file</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setFile(null); setFileName(null); }}
                                    className="p-1 hover:bg-muted rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,image/*" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="h-8 w-8 stroke-1" />
                            <span className="text-xs font-medium">Upload PDF or Image</span>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf,image/*" />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Verification URL (Optional)</label>
                <Input
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://aws.amazon.com/verification/..."
                />
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Briefly describe the certification..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (certificate ? 'Update Certificate' : 'Create Certificate')}
                </Button>
            </div>
        </form>
    );
};

export default CertificateForm;
