'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader, GitBranch, Database, Code, Play, Settings } from 'lucide-react';
import RepositorySection from '../repository/Repo.modal';
import DatabaseSection from '../database/Database.list';
import AnalysisSection from '../code/Code.analysis';
import TestingSection from '../test/Test.main';

const ProjectDetail = ({ project, onBack, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [projectData, setProjectData] = useState(project);
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Settings },
        { id: 'repository', label: 'Repository', icon: GitBranch },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'analysis', label: 'Analysis', icon: Code },
        { id: 'testing', label: 'Testing', icon: Play },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'repository':
                return <RepositorySection projectId={projectData._id} repository={projectData.repository} />;
            case 'database':
                return <DatabaseSection projectId={projectData._id} />;
            case 'analysis':
                return <AnalysisSection projectId={projectData._id} />;
            case 'testing':
                return <TestingSection projectId={projectData._id} />;
            default:
                return <OverviewSection project={projectData} />;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <motion.button
                    whileHover={{ x: -4 }}
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Projects
                </motion.button>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2">{projectData.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{projectData.description}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="border-b border-gray-200 dark:border-gray-800 mb-8"
                >
                    <div className="flex overflow-x-auto gap-1 -mb-px">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    whileHover={{ y: -2 }}
                                    className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-black dark:border-white text-black dark:text-white'
                                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

const OverviewSection = ({ project }) => {
    const stats = [
        { label: 'Status', value: project.status, color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
        { label: 'Visibility', value: project.visibility, color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
        { label: 'Total Tests', value: project.stats?.totalTests || 0, color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' },
        { label: 'Success Rate', value: `${project.stats?.successRate || 0}%`, color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                    <p className={`text-3xl font-bold mb-4 ${stat.color.split(' ')[0]}`}>{stat.value}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${stat.color}`}>
                        {stat.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

export default ProjectDetail;