import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { WorkExperience } from '../../../../../services/api';
import { Button } from '../../../Button';
import { Input } from '../../../Input';

interface ExperienceFormProps {
    experience?: WorkExperience;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

const parseAchievements = (value?: string) =>
    value ? value.split(';').map((a) => a.trim()).filter(Boolean) : [''];

const parseTechnologies = (value?: string) =>
    value ? value.split(',').map((t) => t.trim()).filter(Boolean) : [];

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        company: experience?.company || '',
        title: experience?.title || '',
        type: experience?.type || 'Full-time',
        location: experience?.location || '',
        start_date: experience?.start_date ? String(experience.start_date).slice(0, 10) : '',
        end_date: experience?.end_date ? String(experience.end_date).slice(0, 10) : '',
        is_current: experience?.is_current || false,
        description: experience?.description || '',
    });
    const [achievements, setAchievements] = useState<string[]>(parseAchievements(experience?.achievements));
    const [technologies, setTechnologies] = useState<string[]>(parseTechnologies(experience?.technologies));
    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const nextValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
            ...(name === 'is_current' && nextValue === true ? { end_date: '' } : {}),
        }));
    };

    const updateAchievement = (index: number, value: string) => {
        setAchievements((prev) => prev.map((item, i) => (i === index ? value : item)));
    };

    const addAchievement = () => {
        setAchievements((prev) => [...prev, '']);
    };

    const removeAchievement = (index: number) => {
        setAchievements((prev) => (prev.length === 1 ? [''] : prev.filter((_, i) => i !== index)));
    };

    const addSkill = () => {
        const skill = skillInput.trim();
        if (!skill) return;
        if (!technologies.some((t) => t.toLowerCase() === skill.toLowerCase())) {
            setTechnologies((prev) => [...prev, skill]);
        }
        setSkillInput('');
    };

    const removeSkill = (index: number) => {
        setTechnologies((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            start_date: formData.start_date || null,
            end_date: formData.is_current ? null : (formData.end_date || null),
            achievements: achievements.map((a) => a.trim()).filter(Boolean).join('; ') || null,
            technologies: technologies.map((t) => t.trim()).filter(Boolean).join(', ') || null,
        };
        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Job Title</label>
                    <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Web Developer"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Company</label>
                    <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. PURPOSE BLACK ETH"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Employment Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium mb-1.5 block">Location</label>
                    <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Remote or Addis Ababa"
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
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Short summary shown on the experience card..."
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <label className="text-sm font-medium block">Key Achievements</label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Each item becomes a bullet under “Show More” on the site.
                        </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={achievement}
                                onChange={(e) => updateAchievement(index, e.target.value)}
                                placeholder={`Achievement ${index + 1}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="px-2 shrink-0"
                                onClick={() => removeAchievement(index)}
                                aria-label="Remove achievement"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="text-sm font-medium block">Skills Used</label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Press Enter or comma to add. Shown as tags on the experience card.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="e.g. React.js"
                    />
                    <Button type="button" variant="outline" onClick={addSkill}>
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add
                    </Button>
                </div>
                {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, index) => (
                            <span
                                key={`${tech}-${index}`}
                                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
                            >
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => removeSkill(index)}
                                    className="text-muted-foreground hover:text-foreground"
                                    aria-label={`Remove ${tech}`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background">
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
