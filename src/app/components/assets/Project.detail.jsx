'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderIcon,
    FileIcon,
    PlusIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    PlayIcon,
    DownloadIcon,
    Trash2Icon,
    RefreshCwIcon,
    CheckCircleIcon,
    XCircleIcon
} from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('accessToken'); // or sessionStorage

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        let response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        let data = await response.json();

        // Handle token refresh on 401
        if (response.status === 401 && localStorage.getItem('refreshToken')) {
            console.log('[API] Token expired, attempting refresh...');

            try {
                const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    localStorage.setItem('accessToken', refreshData.data.accessToken);

                    // Retry original request with new token
                    headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
                    response = await fetch(`${API_BASE_URL}${endpoint}`, {
                        ...options,
                        headers,
                        credentials: 'include',
                    });
                    data = await response.json();
                } else {
                    // Refresh failed, redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                window.location.href = '/login';
            }
        }

        if (!response.ok) {
            throw new Error(data.message || `API request failed: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// File Tree Component
const FileTreeNode = ({ node, path = '', onAddItem }) => {
    const [expanded, setExpanded] = useState(false);
    const isFolder = node.type === 'folder';

    return (
        <div className="select-none">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 py-2 px-3 hover:bg-white/5 rounded-lg cursor-pointer group"
                onClick={() => isFolder && setExpanded(!expanded)}
            >
                {isFolder && (
                    <motion.div
                        animate={{ rotate: expanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRightIcon size={16} className="text-blue-400" />
                    </motion.div>
                )}

                {isFolder ? (
                    <FolderIcon size={18} className="text-yellow-400" />
                ) : (
                    <FileIcon size={18} className="text-blue-300" />
                )}

                <span className="text-sm text-gray-200 flex-1">{node.name}</span>

                {isFolder && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddItem(path + '/' + node.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <PlusIcon size={14} className="text-green-400" />
                    </motion.button>
                )}
            </motion.div>

            <AnimatePresence>
                {expanded && isFolder && node.children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-4 border-l border-white/10 pl-2"
                    >
                        {node.children.map((child, idx) => (
                            <FileTreeNode
                                key={idx}
                                node={child}
                                path={path + '/' + node.name}
                                onAddItem={onAddItem}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Create Project Modal
const CreateProjectModal = ({ onClose, onProjectCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const data = await apiCall('/projects', {
                method: 'POST',
                body: JSON.stringify({ name, description, visibility }),
            });

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onProjectCreated(data.data.project);
                    onClose();
                }, 1000);
            }
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
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-lg border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                    {success && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <CheckCircleIcon className="text-green-400" size={24} />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="My Awesome Test Project"
                            disabled={loading || success}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="3"
                            placeholder="Describe your test automation project..."
                            disabled={loading || success}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Visibility
                        </label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading || success}
                        >
                            <option value="private">Private</option>
                            <option value="team">Team</option>
                            <option value="public">Public</option>
                        </select>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                            <XCircleIcon size={16} />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                            <CheckCircleIcon size={16} />
                            Project created successfully! Generating test structure...
                        </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            disabled={loading || success}
                            className="flex-1 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreate}
                            disabled={loading || success || !name}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <RefreshCwIcon size={16} />
                                </motion.div>
                            )}
                            {loading ? 'Creating...' : success ? 'Created!' : 'Create Project'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Add Item Modal
const AddItemModal = ({ onClose, onItemAdded, parentPath, projectId }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('file');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const data = await apiCall(`/projects/${projectId}/structure/add`, {
                method: 'POST',
                body: JSON.stringify({ parentPath, name, type, content }),
            });

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onItemAdded(data.data);
                    onClose();
                }, 800);
            }
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
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-lg border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Add {type === 'file' ? 'File' : 'Folder'}</h2>
                    {success && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        >
                            <CheckCircleIcon className="text-green-400" size={24} />
                        </motion.div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="file"
                                    checked={type === 'file'}
                                    onChange={(e) => setType(e.target.value)}
                                    className="text-blue-500"
                                    disabled={loading || success}
                                />
                                <span className="text-white">File</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="folder"
                                    checked={type === 'folder'}
                                    onChange={(e) => setType(e.target.value)}
                                    className="text-blue-500"
                                    disabled={loading || success}
                                />
                                <span className="text-white">Folder</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={type === 'file' ? 'MyTest.java' : 'my-folder'}
                            disabled={loading || success}
                        />
                    </div>

                    {type === 'file' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                                rows="6"
                                placeholder="// Your code here..."
                                disabled={loading || success}
                            />
                        </div>
                    )}

                    <div className="text-xs text-gray-400 bg-black/20 px-3 py-2 rounded-lg">
                        Adding to: <span className="text-blue-400 font-mono">{parentPath || '/'}</span>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                            <XCircleIcon size={16} />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                        >
                            <CheckCircleIcon size={16} />
                            {type === 'file' ? 'File' : 'Folder'} added successfully!
                        </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={onClose}
                            disabled={loading || success}
                            className="flex-1 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAdd}
                            disabled={loading || success || !name}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                    <RefreshCwIcon size={16} />
                                </motion.div>
                            )}
                            {loading ? 'Adding...' : success ? 'Added!' : 'Add'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
    >
        <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-${color}-500/20`}>
                <Icon className={`text-${color}-400`} size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
            </div>
        </div>
    </motion.div>
);

// Main App Component
export default function TestAutomationPlatform() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectStructure, setProjectStructure] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [addItemPath, setAddItemPath] = useState('');
    const [loading, setLoading] = useState(false);

    const handleProjectCreated = (project) => {
        setProjects([project, ...projects]);
        setSelectedProject(project);
        loadProjectStructure(project.id);
    };

    const loadProjectStructure = async (projectId) => {
        setLoading(true);
        try {
            const data = await apiCall(`/projects/${projectId}/structure`);
            if (data.success) {
                setProjectStructure(data.data);
            }
        } catch (err) {
            console.error('Failed to load project structure:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (path) => {
        setAddItemPath(path);
        setShowAddItemModal(true);
    };

    const handleItemAdded = (data) => {
        setProjectStructure(data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50"
                        >
                            <PlayIcon className="text-white" size={24} />
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Test Automation Platform</h1>
                            <p className="text-sm text-gray-400">Selenium • TestNG • Cucumber • Rest Assured</p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        <PlusIcon size={20} />
                        New Project
                    </motion.button>
                </div>
            </motion.header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Projects Sidebar */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="col-span-3"
                    >
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FolderIcon className="text-blue-400" size={20} />
                                My Projects
                            </h2>

                            <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                                {projects.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <FolderIcon className="mx-auto text-gray-600 mb-3" size={48} />
                                        <p className="text-gray-400 text-sm">No projects yet</p>
                                        <p className="text-gray-500 text-xs mt-1">Create your first project!</p>
                                    </motion.div>
                                ) : (
                                    projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ x: 4 }}
                                            onClick={() => {
                                                setSelectedProject(project);
                                                loadProjectStructure(project.id);
                                            }}
                                            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedProject?.id === project.id
                                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500 shadow-lg shadow-blue-500/20'
                                                : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                                }`}
                                        >
                                            <h3 className="text-white font-medium text-sm flex items-center gap-2">
                                                <FolderIcon size={14} className={selectedProject?.id === project.id ? 'text-blue-400' : 'text-gray-400'} />
                                                {project.name}
                                            </h3>
                                            {project.description && (
                                                <p className="text-gray-400 text-xs mt-1 truncate">{project.description}</p>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="col-span-9"
                    >
                        {selectedProject ? (
                            <div className="space-y-6">
                                {/* Project Header */}
                                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                                            <p className="text-gray-400">{selectedProject.description || 'No description provided'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2 text-white font-medium transition-colors shadow-lg shadow-green-500/30"
                                            >
                                                <PlayIcon size={16} />
                                                Run Tests
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 text-white font-medium transition-colors shadow-lg shadow-blue-500/30"
                                            >
                                                <DownloadIcon size={16} />
                                                Export
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    {projectStructure && (
                                        <div className="grid grid-cols-3 gap-4">
                                            <StatsCard
                                                icon={FileIcon}
                                                label="Total Files"
                                                value={projectStructure.stats?.totalFiles || 0}
                                                color="blue"
                                            />
                                            <StatsCard
                                                icon={FolderIcon}
                                                label="Total Folders"
                                                value={projectStructure.stats?.totalFolders || 0}
                                                color="yellow"
                                            />
                                            <StatsCard
                                                icon={CheckCircleIcon}
                                                label="Status"
                                                value={projectStructure.stats?.generated ? 'Ready' : 'Pending'}
                                                color="green"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Project Structure */}
                                <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <FolderIcon className="text-yellow-400" size={24} />
                                            Project Structure
                                        </h3>
                                        {loading && (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <RefreshCwIcon className="text-blue-400" size={20} />
                                            </motion.div>
                                        )}
                                    </div>

                                    {loading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                                            />
                                        </div>
                                    ) : projectStructure ? (
                                        <div className="bg-black/30 rounded-lg p-4 max-h-[600px] overflow-auto custom-scrollbar">
                                            <FileTreeNode
                                                node={projectStructure.structure}
                                                onAddItem={handleAddItem}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-400">
                                            <FileIcon className="mx-auto mb-3" size={48} />
                                            <p>No structure available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">                                <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="max-w-lg mx-auto"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FolderIcon className="text-blue-400" size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Welcome to Test Automation Platform</h3>
                                <p className="text-gray-400 mb-8">
                                    Create your first project to start building automated tests with Selenium, TestNG, Cucumber, and Rest Assured.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/30"
                                >
                                    <PlusIcon size={20} />
                                    Create Your First Project
                                </motion.button>
                            </motion.div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Create Project Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onProjectCreated={handleProjectCreated}
                    />
                )}
            </AnimatePresence>

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddItemModal && selectedProject && (
                    <AddItemModal
                        onClose={() => setShowAddItemModal(false)}
                        onItemAdded={handleItemAdded}
                        parentPath={addItemPath}
                        projectId={selectedProject.id}
                    />
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="mt-12 border-t border-white/10 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div className="text-gray-400 text-sm">
                            © 2024 Test Automation Platform. Built with React & Node.js.
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <motion.a
                                whileHover={{ scale: 1.05, color: "#60a5fa" }}
                                href="#"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Documentation
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, color: "#60a5fa" }}
                                href="#"
                                className="hover:text-blue-400 transition-colors"
                            >
                                API Reference
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.05, color: "#60a5fa" }}
                                href="#"
                                className="hover:text-blue-400 transition-colors"
                            >
                                Support
                            </motion.a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }
            `}</style>
        </div>
    );
}