'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Loader, Play, RefreshCw, AlertCircle, Check } from 'lucide-react';

const AnalysisSection = ({ projectId }) => {
    const [status, setStatus] = useState(null);
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchAnalysisStatus();
    }, []);

    const fetchAnalysisStatus = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/analysis/status`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch analysis status');

            const data = await response.json();
            setStatus(data.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchAPIs = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/analysis/apis?page=${page}&limit=20`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch APIs');

            const data = await response.json();
            setApis(data.data.endpoints);
            setPagination(data.data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartAnalysis = async () => {
        try {
            setAnalyzing(true);
            const response = await fetch(
                'http://localhost:5000/api/v1/projects/' + projectId + '/analysis/start',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ projectId }),
                }
            );

            if (!response.ok) throw new Error('Failed to start analysis');

            const data = await response.json();
            setStatus(data.data);

            const interval = setInterval(async () => {
                await fetchAnalysisStatus();
            }, 3000);

            return () => clearInterval(interval);
        } catch (err) {
            setError(err.message);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code size={20} />
                    Code Analysis
                </h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartAnalysis}
                    disabled={analyzing || status?.status === 'analyzing'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {analyzing || status?.status === 'analyzing' ? (
                        <>
                            <Loader size={16} className="animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            Start Analysis
                        </>
                    )}
                </motion.button>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm flex items-center gap-2"
                >
                    <AlertCircle size={16} />
                    {error}
                </motion.div>
            )}

            {status && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Analysis Status</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.status === 'completed'
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                : status.status === 'analyzing'
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                            {status.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Files', value: status.totalFiles },
                            { label: 'Total Routes', value: status.totalRoutes },
                            { label: 'Controllers', value: status.totalControllers },
                            { label: 'Models', value: status.totalModels },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <p className="text-2xl font-bold text-black dark:text-white">{item.value || 0}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    {status.startedAt && (
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p>Started: {new Date(status.startedAt).toLocaleString()}</p>
                            {status.completedAt && (
                                <p>Completed: {new Date(status.completedAt).toLocaleString()}</p>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Discovered APIs</h4>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={fetchAPIs}
                        className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw size={14} />
                        Refresh
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader className="animate-spin" size={32} />
                    </div>
                ) : apis.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-gray-600 dark:text-gray-400"
                    >
                        No APIs discovered yet. Run analysis to discover endpoints.
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                    >
                        {apis.map((api, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
                                                {api.method}
                                            </span>
                                            <p className="font-mono text-sm">{api.path}</p>
                                        </div>
                                        {api.description && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{api.description}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(api.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </motion.div>
                        ))}

                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    disabled={page === pagination.pages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default AnalysisSection;