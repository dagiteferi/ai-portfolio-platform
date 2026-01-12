import React, { useState } from 'react';
import { WorkExperience } from '../../../../../services/api';
import { Button } from '../../../Button';
import { Input } from '../../../Input';

interface ExperienceFormProps {
    experience?: WorkExperience;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        company: experience?.company || '',
        position: experience?.position || '',
        location: experience?.location || '',
        start_date: experience?.start_date || '',
        end_date: experience?.end_date || '',
        is_current: experience?.is_current || false,
        description: experience?.description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
                    <label className="text-sm font-medium mb-1.5 block">Job Title</label>
                    <Input
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="e.g. Senior AI Engineer"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Company</label>
                    <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Google"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        disabled={formData.is_current}
                    />
                </div>
                <div className="flex items-end pb-2.5">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_current"
                            name="is_current"
                            checked={formData.is_current}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_current" className="text-sm font-medium">
                            Current Position
                        </label>
                    </div>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Location</label>
                <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA or Remote"
                />
            </div>

            <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your responsibilities and achievements..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (experience ? 'Update Experience' : 'Create Experience')}
                </Button>
            </div>
        </form>
    );
};

export default ExperienceForm;
