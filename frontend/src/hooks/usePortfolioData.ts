import { useQueries } from '@tanstack/react-query';
import * as api from '../services/api';

export interface PortfolioData {
    projects: api.Project[];
    skills: api.TechnicalSkill[];
    experience: api.WorkExperience[];
    education: api.Education[];
    certificates: api.Certificate[];
    moments: api.MemorableMoment[];
    cvs: api.CV[];
}

export const usePortfolioData = () => {
    const results = useQueries({
        queries: [
            {
                queryKey: ['projects'],
                queryFn: api.getAdminProjects,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ['skills'],
                queryFn: api.getAdminSkills,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ['experience'],
                queryFn: api.getAdminExperience,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ['education'],
                queryFn: api.getAdminEducation,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ['certificates'],
                queryFn: api.getAdminCertificates,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ['moments'],
                queryFn: api.getAdminMoments,
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ['cvs'],
                queryFn: api.getAdminCVs,
                staleTime: 1000 * 60 * 5,
            },
        ],
    });

    const isLoading = results.some((result) => result.isLoading);
    const isError = results.some((result) => result.isError);

    const data: PortfolioData = {
        projects: (results[0].data as api.Project[]) || [],
        skills: (results[1].data as api.TechnicalSkill[]) || [],
        experience: (results[2].data as api.WorkExperience[]) || [],
        education: (results[3].data as api.Education[]) || [],
        certificates: (results[4].data as api.Certificate[]) || [],
        moments: (results[5].data as api.MemorableMoment[]) || [],
        cvs: (results[6].data as api.CV[]) || [],
    };

    return {
        data,
        isLoading,
        isError,
        results,
    };
};
