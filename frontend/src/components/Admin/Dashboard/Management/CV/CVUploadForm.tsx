import React, { useState } from 'react';
import { Button } from '@/components/Admin/Button';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface CVUploadFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(selectedFile.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 transition-colors hover:border-primary/50 group bg-muted/5 relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".pdf,.doc,.docx"
                    />

                    {file ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm font-semibold">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setPreview(null);
                                }}
                                className="mt-4 text-xs font-medium text-destructive hover:underline z-20"
                            >
                                Remove file
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center">
                            <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm font-semibold">Click or drag to upload CV</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX up to 10MB</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!file || isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        "Upload CV"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default CVUploadForm;
