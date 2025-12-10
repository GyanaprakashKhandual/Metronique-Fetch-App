'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Loader, Plus, AlertCircle, Check, Trash2 } from 'lucide-react';

const DatabaseSection = ({ projectId }) => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'mongodb',
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
    });

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/databases`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (!response.ok) throw new Error('Failed to fetch connections');

            const data = await response.json();
            setConnections(data.data.connections);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleConnect = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/projects/${projectId}/databases/connect`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error('Failed to connect database');

            const data = await response.json();
            setConnections([...connections, data.data.connection]);
            setShowForm(false);
            setFormData({
                type: 'mongodb',
                host: '',
                port: '',
                database: '',
                username: '',
                password: '',
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                    <Database size={20} />
                    Database Connections
                </h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
                >
                    <Plus size={16} />
                    Add Connection
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

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                >
                    <h4 className="font-semibold mb-4">Add New Database Connection</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Database Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            >
                                <option value="mongodb">MongoDB</option>
                                <option value="mysql">MySQL</option>
                                <option value="postgresql">PostgreSQL</option>
                                <option value="mssql">MSSQL</option>
                                <option value="oracle">Oracle</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Host
                            </label>
                            <input
                                type="text"
                                name="host"
                                value={formData.host}
                                onChange={handleChange}
                                placeholder="localhost"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Port
                            </label>
                            <input
                                type="number"
                                name="port"
                                value={formData.port}
                                onChange={handleChange}
                                placeholder="27017"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Database Name
                            </label>
                            <input
                                type="text"
                                name="database"
                                value={formData.database}
                                onChange={handleChange}
                                placeholder="database_name"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="admin"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setShowForm(false)}
                            className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConnect}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader size={16} className="animate-spin" />}
                            Connect
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader className="animate-spin" size={32} />
                </div>
            ) : connections.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-600 dark:text-gray-400"
                >
                    No database connections yet
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {connections.map((conn, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold">{conn.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{conn.type}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${conn.status === 'connected'
                                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                    }`}>
                                    {conn.status}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <p>{conn.host}:{conn.port}</p>
                                <p className="text-xs">{conn.database}</p>
                            </div>
                            <button className="w-full p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default DatabaseSection;