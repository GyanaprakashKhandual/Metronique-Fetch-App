'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Loader, Check, AlertCircle, ExternalLink } from 'lucide-react';

const RepositorySection = ({ projectId, repository }) => {
    const [formData, setFormData] = useState({
        repositoryUrl: '',
        branch: 'main',
        accessToken: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [connected, setConnected] = useState(!!repository?.connected);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleConnect = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!formData.repositoryUrl || !formData.accessToken) {
            setError('Repository URL and access token are required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/repository/connect`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error('Failed to connect repository');

            const data = await response.json();
            setSuccess(true);
            setConnected(true);
            setFormData({ repositoryUrl: '', branch: 'main', accessToken: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGetDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/repository`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch repository details');

            const data = await response.json();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {connected ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 rounded-lg"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Check className="text-green-600 dark:text-green-400" size={24} />
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                            Repository Connected
                        </h3>
                    </div>
                    {repository && (
                        <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                            <p><span className="font-medium">Full Name:</span> {repository.fullName}</p>
                            <p><span className="font-medium">URL:</span> {repository.url}</p>
                            <p><span className="font-medium">Branch:</span> {repository.branch}</p>
                            <p><span className="font-medium">Status:</span> {repository.status}</p>
                            <motion.a
                                whileHover={{ scale: 1.02 }}
                                href={repository.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                            >
                                View on GitHub
                                <ExternalLink size={16} />
                            </motion.a>
                        </div>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <GitBranch size={24} className="text-gray-600 dark:text-gray-400" />
                        <h3 className="text-lg font-semibold">Connect GitHub Repository</h3>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm flex items-center gap-2"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm flex items-center gap-2"
                        >
                            <Check size={16} />
                            Repository connected successfully
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Repository URL
                            </label>
                            <input
                                type="text"
                                name="repositoryUrl"
                                value={formData.repositoryUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/username/repo"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Branch
                            </label>
                            <input
                                type="text"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                placeholder="main"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                GitHub Access Token
                            </label>
                            <input
                                type="password"
                                name="accessToken"
                                value={formData.accessToken}
                                onChange={handleChange}
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConnect}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader size={18} className="animate-spin" />}
                            Connect Repository
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default RepositorySection;