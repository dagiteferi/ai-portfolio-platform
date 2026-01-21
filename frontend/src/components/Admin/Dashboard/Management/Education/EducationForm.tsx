import React, { useState } from 'react';
import { Education } from '../../../../../services/api';
import { Button } from '../../../Button';
import { Input } from '../../../Input';

interface EducationFormProps {
    education?: Education;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        institution: education?.institution || '',
        degree: education?.degree || '',
        field_of_study: education?.field_of_study || '',
        start_date: education?.start_date || '',
        end_date: education?.end_date || '',
        description: education?.description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Institution</label>
                    <Input
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="e.g. Stanford University"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Degree</label>
                    <Input
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        placeholder="e.g. Master of Science"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Field of Study</label>
                <Input
                    name="field_of_study"
                    value={formData.field_of_study}
                    onChange={handleChange}
                    placeholder="e.g. Artificial Intelligence"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Start Date</label>
                    <Input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">End Date</label>
                    <Input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                    />
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
                    placeholder="Describe your studies, honors, etc..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (education ? 'Update Education' : 'Create Education')}
                </Button>
            </div>
        </form>
    );
};

export default EducationForm;
