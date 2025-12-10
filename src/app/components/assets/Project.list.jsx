'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Calendar, User, FileText } from 'lucide-react';
import Link from 'next/link';

const ProjectList = ({ projects, onSelectProject }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {projects.map((project) => (
                <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    onClick={() => onSelectProject(project._id)}
                    className="group cursor-pointer"
                >
                    <div className="h-full p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-black dark:hover:border-white transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-gray-900/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {project.description || 'No description'}
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="ml-4"
                            >
                                <ChevronRight className="text-gray-400 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors" size={20} />
                            </motion.div>
                        </div>

                        <div className="space-y-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <User size={16} />
                                <span>{project.owner?.firstName || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Calendar size={16} />
                                <span>{formatDate(project.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <FileText size={16} />
                                <span className="capitalize">{project.status}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                                {project.visibility}
                            </span>
                            {project.team && (
                                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                    Team
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProjectList;