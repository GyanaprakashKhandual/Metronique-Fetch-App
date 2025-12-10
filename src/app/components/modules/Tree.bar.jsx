'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronDown,
    ChevronRight,
    FolderOpen,
    FileText,
    Plus,
    Settings,
    Trash2,
    RefreshCw,
    Search,
    Home,
    Database,
    GitBranch,
    Bell,
    Clock,
    Share2,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

// Folder Item Component
const FolderItem = ({ folder, level = 0, onFolderClick, expandedFolders, onToggleExpand }) => {
    const isExpanded = expandedFolders[folder.id];

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer group transition-colors"
                style={{ paddingLeft: `${12 + level * 16}px` }}
                onClick={() => onToggleExpand(folder.id)}
            >
                <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {folder.children?.subFolders?.length > 0 ? (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    ) : (
                        <div className="w-4" />
                    )}
                </motion.div>

                <FolderOpen className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                    {folder.name}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                </div>
            </motion.div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Sub-folders */}
                        {folder.children?.subFolders?.map((subFolder) => (
                            <FolderItem
                                key={subFolder.id}
                                folder={subFolder}
                                level={level + 1}
                                onFolderClick={onFolderClick}
                                expandedFolders={expandedFolders}
                                onToggleExpand={onToggleExpand}
                            />
                        ))}

                        {/* Files */}
                        {folder.children?.files?.map((file) => (
                            <FileItem key={file.id} file={file} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// File Item Component
const FileItem = ({ file, level = 0 }) => {
    const getFileIcon = (extension) => {
        const iconMap = {
            java: '☕',
            js: '⚙️',
            xml: '📋',
            properties: '⚙️',
            json: '{}',
            yaml: '📄',
            md: '📝',
            txt: '📄'
        };
        return iconMap[extension] || '📄';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-600 rounded cursor-pointer group transition-colors"
            style={{ paddingLeft: `${12 + level * 16}px` }}
        >
            <div className="w-4 text-center text-sm">{getFileIcon(file.extension)}</div>
            <span className="text-sm text-gray-600 dark:text-gray-400 flex-1 truncate">
                {file.fileName}
            </span>
            <span className="text-xs text-gray-400 ml-auto mr-2">{file.lines} lines</span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-gray-400" />
            </div>
        </motion.div>
    );
};

// Sidebar Component
const ProjectSidebar = ({ project, hierarchy, loading, expandedFolders, onToggleExpand }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-800 dark:text-white truncate">
                        {project?.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                        {project?.status}
                    </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {project?.category}
                </p>
            </div>

            {/* Folders */}
            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                ) : hierarchy && hierarchy.length > 0 ? (
                    hierarchy.map((folder) => (
                        <FolderItem
                            key={folder.id}
                            folder={folder}
                            level={0}
                            expandedFolders={expandedFolders}
                            onToggleExpand={onToggleExpand}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No folders</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Plus className="w-4 h-4" />
                    New Folder
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <FileText className="w-4 h-4" />
                    New File
                </button>
            </div>
        </motion.div>
    );
};

// Config Panel Component
const ConfigPanel = ({ config, loading }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6"
        >
            <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Test Configuration
                </h3>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                ) : config ? (
                    <div className="grid grid-cols-2 gap-4">
                        <ConfigItem
                            label="Framework"
                            value={config.testConfig?.framework}
                            icon="⚙️"
                        />
                        <ConfigItem
                            label="Language"
                            value={config.testConfig?.language}
                            icon="💻"
                        />
                        <ConfigItem
                            label="Build Tool"
                            value={config.testConfig?.buildTool}
                            icon="🔨"
                        />
                        <ConfigItem
                            label="Timeout"
                            value={`${config.testConfig?.timeout}ms`}
                            icon="⏱️"
                        />
                        <ConfigItem
                            label="Retry Count"
                            value={config.testConfig?.retryCount}
                            icon="🔄"
                        />
                        <ConfigItem
                            label="Parallel"
                            value={config.testConfig?.parallel ? 'Yes' : 'No'}
                            icon="⚡"
                        />
                    </div>
                ) : null}
            </div>

            {/* Databases */}
            {config?.databaseConnections && config.databaseConnections.length > 0 && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-green-500" />
                        Databases ({config.databaseConnections.length})
                    </h4>
                    <div className="space-y-2">
                        {config.databaseConnections.map((db, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {db.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{db.type}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${db.isDefault ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                    }`}>
                                    {db.isDefault ? 'Default' : db.environment}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Repository */}
            {config?.repository && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-purple-500" />
                        Repository
                    </h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded space-y-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Name:</span> {config.repository.name}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Branch:</span> {config.repository.branch}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Sync:</span> {config.repository.syncFrequency}
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// Config Item Component
const ConfigItem = ({ label, value, icon }) => (
    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {icon} {value || 'N/A'}
        </p>
    </div>
);

// Main Component
export default function ProjectManagement() {
    const [userId, setUserId] = useState('');
    const [teamId, setTeamId] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [hierarchy, setHierarchy] = useState(null);
    const [config, setConfig] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState({});
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('projects'); // 'projects', 'hierarchy', 'config'
    const [activeTab, setActiveTab] = useState('overview');
    const [newProjectName, setNewProjectName] = useState('');
    const [creatingProject, setCreatingProject] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const API_CONFIG = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') || '' : ''}`
        },
        withCredentials: true
    };

    // Create new project
    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        setCreatingProject(true);
        try {
            const response = await axios.post(
                `${API_BASE}/projects`,
                {
                    name: newProjectName,
                    description: `Testing suite for ${newProjectName}`,
                    visibility: 'private',
                    category: 'web-api',
                    priority: 'medium',
                    teamId: teamId || null
                },
                API_CONFIG
            );

            if (response.data.success) {
                setNewProjectName('');
                setSelectedProject(response.data.data.project);
                await handleFetchProjectDetails(response.data.data.project.id);
                setView('hierarchy');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        } finally {
            setCreatingProject(false);
        }
    };

    // Fetch user projects
    const handleFetchUserProjects = async () => {
        if (!userId.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE}/projects/user/${userId}`,
                API_CONFIG
            );

            if (response.data.success) {
                setProjects(response.data.data.projects);
            }
        } catch (error) {
            console.error('Error fetching user projects:', error);
            alert('Failed to fetch user projects');
        } finally {
            setLoading(false);
        }
    };

    // Fetch team projects
    const handleFetchTeamProjects = async () => {
        if (!teamId.trim()) return;

        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE}/projects/team/${teamId}`,
                API_CONFIG
            );

            if (response.data.success) {
                setProjects(response.data.data.projects);
            }
        } catch (error) {
            console.error('Error fetching team projects:', error);
            alert('Failed to fetch team projects');
        } finally {
            setLoading(false);
        }
    };

    // Fetch complete project details with hierarchy
    const handleFetchProjectDetails = async (projectId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE}/projects/${projectId}`,
                API_CONFIG
            );

            if (response.data.success) {
                setSelectedProject(response.data.data.project);
                setHierarchy(response.data.data.folderStructure);
                setExpandedFolders({});
            }
        } catch (error) {
            console.error('Error fetching project details:', error);
            alert('Failed to fetch project details');
        } finally {
            setLoading(false);
        }
    };

    // Fetch project hierarchy
    const handleFetchHierarchy = async (projectId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE}/projects/${projectId}/hierarchy`,
                API_CONFIG
            );

            if (response.data.success) {
                setHierarchy(response.data.data.hierarchy);
            }
        } catch (error) {
            console.error('Error fetching hierarchy:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch project config
    const handleFetchConfig = async (projectId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE}/projects/${projectId}/config`,
                API_CONFIG
            );

            if (response.data.success) {
                setConfig(response.data.data.config);
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleExpand = (folderId) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const handleSelectProject = async (project) => {
        setSelectedProject(project);
        setView('hierarchy');
        await handleFetchProjectDetails(project.id);
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Home className="w-6 h-6 text-blue-500" />
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Project Management
                            </h1>
                        </div>

                        {selectedProject && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setView('overview');
                                        setActiveTab('overview');
                                    }}
                                    className={`px-4 py-2 rounded font-medium transition-colors ${view === 'overview'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => {
                                        setView('hierarchy');
                                        handleFetchHierarchy(selectedProject.id);
                                    }}
                                    className={`px-4 py-2 rounded font-medium transition-colors ${view === 'hierarchy'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Structure
                                </button>
                                <button
                                    onClick={() => {
                                        setView('config');
                                        handleFetchConfig(selectedProject.id);
                                    }}
                                    className={`px-4 py-2 rounded font-medium transition-colors ${view === 'config'
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    Configuration
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Panel - Projects List or Sidebar */}
                    {selectedProject && (view === 'hierarchy' || view === 'config') ? (
                        <ProjectSidebar
                            project={selectedProject}
                            hierarchy={hierarchy}
                            loading={loading}
                            expandedFolders={expandedFolders}
                            onToggleExpand={handleToggleExpand}
                        />
                    ) : null}

                    {/* Right Panel - Main Content */}
                    <motion.div
                        className="flex-1 overflow-auto p-6"
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {view === 'projects' || !selectedProject ? (
                            // Projects View
                            <div className="max-w-6xl mx-auto space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                                >
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                        Create New Project
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Enter project name..."
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleCreateProject}
                                            disabled={creatingProject || !newProjectName.trim()}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
                                        >
                                            {creatingProject ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    Create Project
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Fetch Projects */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                                >
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                        My Projects
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Enter user ID..."
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleFetchUserProjects}
                                            disabled={loading || !userId.trim()}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
                                        >
                                            {loading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                            Fetch User Projects
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Fetch Team Projects */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                                >
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                        Team Projects
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <input
                                            type="text"
                                            placeholder="Enter team ID..."
                                            value={teamId}
                                            onChange={(e) => setTeamId(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleFetchTeamProjects}
                                            disabled={loading || !teamId.trim()}
                                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
                                        >
                                            {loading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                            Fetch Team Projects
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Projects List */}
                                {projects.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search projects..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                            Category
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                            Priority
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredProjects.map((project) => (
                                                        <motion.tr
                                                            key={project.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <p className="text-sm font-medium text-gray-800 dark:text-white">
                                                                    {project.name}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {project.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'active'
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                    : project.status === 'draft'
                                                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                                    }`}>
                                                                    {project.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.priority === 'high'
                                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                                    : project.priority === 'medium'
                                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                                    }`}>
                                                                    {project.priority}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    onClick={() => handleSelectProject(project)}
                                                                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {projects.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
                                    >
                                        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            No Projects Found
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Create a new project or fetch existing projects to get started
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        ) : view === 'overview' ? (
                            // Overview View
                            <div className="max-w-4xl mx-auto space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                                {selectedProject?.name}
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {selectedProject?.description}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-lg font-medium ${selectedProject?.status === 'active'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}>
                                            {selectedProject?.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                        <StatsCard
                                            icon="📊"
                                            label="Total Tests"
                                            value={selectedProject?.stats?.totalTests || 0}
                                        />
                                        <StatsCard
                                            icon="✅"
                                            label="Passed"
                                            value={selectedProject?.stats?.passed || 0}
                                        />
                                        <StatsCard
                                            icon="❌"
                                            label="Failed"
                                            value={selectedProject?.stats?.failed || 0}
                                        />
                                        <StatsCard
                                            icon="⏭️"
                                            label="Skipped"
                                            value={selectedProject?.stats?.skipped || 0}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                                                Project Details
                                            </h3>
                                            <div className="space-y-3">
                                                <DetailRow label="Category" value={selectedProject?.category} />
                                                <DetailRow label="Priority" value={selectedProject?.priority} />
                                                <DetailRow label="Visibility" value={selectedProject?.visibility} />
                                                <DetailRow
                                                    label="Created"
                                                    value={new Date(selectedProject?.createdAt).toLocaleDateString()}
                                                />
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                                                Technology Stack
                                            </h3>
                                            <div className="space-y-3">
                                                <DetailRow
                                                    label="Language"
                                                    value={selectedProject?.technology?.language || 'N/A'}
                                                />
                                                <DetailRow
                                                    label="Framework"
                                                    value={selectedProject?.technology?.framework || 'N/A'}
                                                />
                                                <DetailRow
                                                    label="Database"
                                                    value={selectedProject?.technology?.database?.join(', ') || 'N/A'}
                                                />
                                                <DetailRow
                                                    label="ORM"
                                                    value={selectedProject?.technology?.orm || 'N/A'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ) : view === 'hierarchy' ? (
                            // Hierarchy View
                            <div className="max-w-4xl mx-auto">
                                <ConfigPanel config={config} loading={loading} />
                            </div>
                        ) : view === 'config' ? (
                            // Config View
                            <div className="max-w-4xl mx-auto">
                                <ConfigPanel config={config} loading={loading} />
                            </div>
                        ) : null}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Stats Card Component
const StatsCard = ({ icon, label, value }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center border border-blue-200 dark:border-gray-600"
    >
        <p className="text-3xl mb-2">{icon}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
);

// Detail Row Component
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-800 dark:text-white">{value}</span>
    </div>
);