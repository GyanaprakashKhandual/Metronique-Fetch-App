'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectList from '@/app/components/assets/Project.list';
import CreateProjectModal from '@/app/components/assets/Project.modal';
import ProjectDetail from '@/app/components/assets/Project.detail';
import { Plus, Search, Loader } from 'lucide-react';

export default function ProjectPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [page]);

    const fetchProjects = async () => {
        try {
            console.log("📡 Fetching projects...");
            console.log("➡️ Page:", page);
            console.log("➡️ Search Term:", searchTerm);

            setLoading(true);

            const url = `http://localhost:5000/api/v1/projects?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}`;
            console.log("🌐 Final Request URL:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            console.log("📥 Response Status:", response.status);

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn("🔒 Unauthorized! Redirecting to login...");
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Failed to fetch projects');
            }

            const data = await response.json();
            console.log("📝 Raw JSON Response:", data);

            if (!data?.data) {
                console.error("❌ ERROR: Backend did not return expected 'data' object");
                console.error("Returned Response:", data);
                throw new Error("Invalid API Response Format");
            }

            console.log("📦 Projects:", data.data.projects);
            console.log("📊 Pagination:", data.data.pagination);

            setProjects(data.data.projects);
            setPagination(data.data.pagination);
            setError(null);

        } catch (err) {
            console.error("🔥 FETCH ERROR:", err.message);
            setError(err.message);
        } finally {
            console.log("⛔ Fetch complete. Loading off.");
            setLoading(false);
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(projectData),
            });

            if (!response.ok) throw new Error('Failed to create project');

            const data = await response.json();
            setProjects([data.data.project, ...projects]);
            setShowCreateModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSelectProject = async (projectId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch project details');

            const data = await response.json();
            setSelectedProject(data.data.project);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1);
    };

    if (selectedProject) {
        return (
            <ProjectDetail
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                onRefresh={() => {
                    fetchProjects();
                    setSelectedProject(null);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Projects</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage and organize your API testing projects
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                    >
                        <Plus size={20} />
                        New Project
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                    </div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
                    >
                        {error}
                    </motion.div>
                )}

                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-16"
                    >
                        <Loader className="animate-spin text-black dark:text-white" size={32} />
                    </motion.div>
                ) : projects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            No projects yet. Create your first project to get started.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                        >
                            <Plus size={20} />
                            Create First Project
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div>
                        <ProjectList
                            projects={projects}
                            onSelectProject={handleSelectProject}
                        />

                        {pagination && pagination.pages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center gap-2 mt-8"
                            >
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    disabled={page === pagination.pages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    Next
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onCreate={handleCreateProject}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}