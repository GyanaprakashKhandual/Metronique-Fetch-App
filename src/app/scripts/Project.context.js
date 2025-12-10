'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProjectState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects from API
    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/v1/projects', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data && result.data.projects) {
                setProjects(result.data.projects);

                // If there's a saved project in localStorage, try to restore it
                const savedProjectId = localStorage.getItem('selectedProjectId');
                if (savedProjectId) {
                    const savedProject = result.data.projects.find(p => p._id === savedProjectId);
                    if (savedProject) {
                        setSelectedProjectState(savedProject);
                    } else {
                        // If saved project not found, clear localStorage
                        localStorage.removeItem('selectedProjectId');
                    }
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Set selected project and save to localStorage
    const setSelectedProject = (project) => {
        setSelectedProjectState(project);
        if (project && project._id) {
            localStorage.setItem('selectedProjectId', project._id);
        } else {
            localStorage.removeItem('selectedProjectId');
        }
    };

    // Clear selected project
    const clearSelectedProject = () => {
        setSelectedProjectState(null);
        localStorage.removeItem('selectedProjectId');
    };

    // Refresh projects (useful for when projects are updated)
    const refreshProjects = () => {
        fetchProjects();
    };

    // Load projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const value = {
        projects,
        selectedProject,
        setSelectedProject,
        clearSelectedProject,
        refreshProjects,
        loading,
        error,
        // Additional helper properties
        projectId: selectedProject?._id,
        projectName: selectedProject?.name,
        projectSlug: selectedProject?.slug,
        projectDescription: selectedProject?.description,
        projectOwner: selectedProject?.owner,
        projectTeam: selectedProject?.team,
        projectStatus: selectedProject?.status,
        projectVisibility: selectedProject?.visibility,
        projectTechnology: selectedProject?.technology,
        projectRepository: selectedProject?.repository,
        projectStats: selectedProject?.stats,
        projectEndpoints: selectedProject?.endpoints,
        projectTestConfig: selectedProject?.testConfig,
        projectAnalysis: selectedProject?.analysis,
        projectMetadata: selectedProject?.metadata,
        projectDatabaseConnections: selectedProject?.databaseConnections,
        projectCollaborators: selectedProject?.collaborators,
        projectTags: selectedProject?.tags,
        projectCategory: selectedProject?.category,
        projectPriority: selectedProject?.priority,
        projectCreatedAt: selectedProject?.createdAt,
        projectUpdatedAt: selectedProject?.updatedAt,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};

export default ProjectContext;