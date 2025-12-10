'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader, RefreshCw, AlertCircle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

const TestingSection = ({ projectId }) => {
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [selectedExecution, setSelectedExecution] = useState(null);
    const [results, setResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(false);

    useEffect(() => {
        fetchExecutionHistory();
    }, [page]);

    const fetchExecutionHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/executions/history?page=${page}&limit=10`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch execution history');

            const data = await response.json();
            setExecutions(data.data.executions);
            setPagination(data.data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchExecutionResults = async (executionId) => {
        try {
            setLoadingResults(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/executions/${executionId}/results`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch results');

            const data = await response.json();
            setResults(data.data.results);
            setSelectedExecution(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingResults(false);
        }
    };

    const handleRunTests = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/tests/run`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        projectId,
                        environment: 'dev',
                        parallelExecution: false,
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to run tests');

            const data = await response.json();
            await fetchExecutionHistory();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
                return <CheckCircle className="text-green-600 dark:text-green-400" size={16} />;
            case 'failed':
                return <XCircle className="text-red-600 dark:text-red-400" size={16} />;
            default:
                return <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={16} />;
        }
    };

    if (selectedExecution) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                <motion.button
                    whileHover={{ x: -4 }}
                    onClick={() => setSelectedExecution(null)}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    ← Back to Executions
                </motion.button>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <BarChart3 size={20} />
                            Test Results
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedExecution.summary?.status === 'passed'
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                            }`}>
                            {selectedExecution.summary?.status}
                        </span>
                    </div>

                    {selectedExecution.summary && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {selectedExecution.summary.passed || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Passed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {selectedExecution.summary.failed || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Failed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                    {selectedExecution.summary.skipped || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Skipped</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {selectedExecution.summary.total || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</p>
                            </div>
                        </div>
                    )}
                </motion.div>

                <div className="space-y-2">
                    <h4 className="font-semibold mb-4">Individual Test Results</h4>
                    {loadingResults ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="animate-spin" size={32} />
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                            No results available
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2"
                        >
                            {results.map((result, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                                >
                                    <div className="flex items-start gap-3">
                                        {getStatusIcon(result.status)}
                                        <div className="flex-1">
                                            <p className="font-medium">{result.testScript?.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {result.endpoint?.method} {result.endpoint?.path}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                {result.duration}ms
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${result.status === 'passed'
                                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                : result.status === 'failed'
                                                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {result.status}
                                        </span>
                                    </div>
                                    {result.errorMessage && (
                                        <p className="text-xs text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                                            {result.errorMessage}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Play size={20} />
                    Test Executions
                </h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRunTests}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader size={16} className="animate-spin" />
                            Running...
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            Run Tests
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

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader className="animate-spin" size={32} />
                </div>
            ) : executions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-600 dark:text-gray-400"
                >
                    <p className="mb-4">No test executions yet</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={handleRunTests}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                    >
                        <Play size={16} />
                        Run Your First Test
                    </motion.button>
                </motion.div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                    >
                        {executions.map((exec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => fetchExecutionResults(exec._id)}
                                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 cursor-pointer hover:border-black dark:hover:border-white transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold">Execution on {new Date(exec.startTime).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {exec.testScripts?.length || 0} tests
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${exec.status === 'completed'
                                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                            : exec.status === 'running'
                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {exec.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

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
                </>
            )}
        </motion.div>
    );
};

export default TestingSection;