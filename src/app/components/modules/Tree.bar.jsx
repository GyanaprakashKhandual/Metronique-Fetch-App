'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Folder, File, FileJson, FileCode, Loader, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getFileIcon = (extension) => {
    if (['java'].includes(extension)) return <FileCode className="w-4 h-4 text-orange-500" />;
    if (['feature'].includes(extension)) return <FileCode className="w-4 h-4 text-green-500" />;
    if (['json'].includes(extension)) return <FileJson className="w-4 h-4 text-yellow-500" />;
    if (['xml', 'properties'].includes(extension)) return <FileCode className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
};

const FolderItem = ({ item, level = 0 }) => {
    const [expanded, setExpanded] = useState(level < 2);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer group"
                style={{ paddingLeft: `${level * 16}px` }}
                onClick={() => item.children && setExpanded(!expanded)}
            >
                {item.children && item.children.length > 0 ? (
                    <motion.div
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                    >
                        {expanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                    </motion.div>
                ) : (
                    <div className="w-4" />
                )}

                <Folder className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />

                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {item.name}
                </span>

                {item.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto hidden md:inline">
                        {item.description}
                    </span>
                )}
            </motion.div>

            <AnimatePresence>
                {expanded && item.children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {item.children.map((child, idx) =>
                            child.type === 'folder' ? (
                                <FolderItem key={idx} item={child} level={level + 1} />
                            ) : (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded group"
                                    style={{ paddingLeft: `${(level + 1) * 16 + 16}px` }}
                                >
                                    {getFileIcon(child.extension)}

                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {child.name}
                                    </span>

                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto hidden lg:inline">
                                        {child.lines} lines
                                    </span>
                                </motion.div>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ProjectStructureExplorer({ projectId }) {
    const [structure, setStructure] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('structure');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const structureRes = await fetch(
                    `http://localhost:5000/api/v1/projects/${projectId}/folder-structure`,
                    {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!structureRes.ok) throw new Error('Failed to fetch structure');
                const structureData = await structureRes.json();
                setStructure(structureData.data.root);

                const summaryRes = await fetch(
                    `http://localhost:5000/api/v1/projects/${projectId}/folder-summary`,
                    {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (summaryRes.ok) {
                    const summaryData = await summaryRes.json();
                    setSummary(summaryData.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Loader className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3"
                >
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <p className="text-gray-700 dark:text-gray-300">{error}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-white dark:bg-gray-950"
        >
            <div className="max-w-7xl mx-auto">
                <div className="border-b border-gray-200 dark:border-gray-800">
                    <div className="px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Project Structure
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {structure?.name}
                        </p>
                    </div>

                    <div className="flex gap-0 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
                        {['structure', 'summary'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab === 'structure' ? 'Folder Structure' : 'Summary'}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'structure' && (
                        <motion.div
                            key="structure"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 sm:p-6 lg:p-8"
                        >
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                    {structure && (
                                        <div className="p-4">
                                            <FolderItem item={structure} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'summary' && summary && (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 sm:p-6 lg:p-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
                                >
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Folders</p>
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{summary.stats.totalFolders}</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
                                >
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Total Files</p>
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{summary.stats.totalFiles}</p>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
                                >
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">Folder Types</p>
                                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{Object.keys(summary.stats.foldersByType).length}</p>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Folders by Type</h3>
                                    <div className="space-y-3">
                                        {Object.entries(summary.stats.foldersByType).map(([type, count]) => (
                                            <motion.div
                                                key={type}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                                                    {count}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Files by Extension</h3>
                                    <div className="space-y-3">
                                        {Object.entries(summary.stats.filesByExtension).map(([ext, count]) => (
                                            <motion.div
                                                key={ext}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-gray-700 dark:text-gray-300 font-mono">.{ext}</span>
                                                <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                                                    {count}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}