'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PanelLeft,
    ChevronDown,
    Search,
    Folder,
    Users,
    User,
    Settings,
    Shield,
    Bell,
    Wrench,
    Sun,
    Moon,
    Home,
    Lock,
    Book,
    Code
} from 'lucide-react';
import { FcDocument, FcInvite } from 'react-icons/fc';
import { BiEnvelope } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { useProject } from '@/app/scripts/Project.context';

const StatusBar = () => {
    const router = useRouter();
    const { selectedProject, setSelectedProject, projects, loading: projectsLoading } = useProject();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const searchInputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Update filtered projects when projects change
    useEffect(() => {
        setFilteredProjects(projects);
    }, [projects]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (dropdownOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [dropdownOpen]);

    // Handle search
    useEffect(() => {
        const filtered = projects.filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (project.slug && project.slug.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredProjects(filtered);
        setSelectedIndex(-1);
    }, [searchQuery, projects]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!dropdownOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < filteredProjects.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && filteredProjects[selectedIndex]) {
                    handleProjectSelect(filteredProjects[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setDropdownOpen(false);
                setSearchQuery('');
                setSelectedIndex(-1);
                break;
        }
    };

    // Handle project selection
    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setDropdownOpen(false);
        setSearchQuery('');
        setSelectedIndex(-1);
        router.push(`/app/${project.slug}`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
                setSearchQuery('');
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`scrollbar fixed bottom-0 left-0 right-0 z-50 ${isDarkTheme ? 'dark' : ''}`}>
            <div className="h-9 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-2 text-xs font-medium">
                {/* Sidebar Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors mr-1"
                    aria-label="Toggle Sidebar"
                >
                    <PanelLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Project Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        onKeyDown={handleKeyDown}
                    >
                        <Folder className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                            {selectedProject ? selectedProject.name : 'Select Project'}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-700 dark:text-gray-300" />
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full left-0 mb-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
                            >
                                {/* Search Bar */}
                                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Search projects..."
                                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-700 dark:text-gray-300"
                                        />
                                    </div>
                                </div>

                                {/* Project List */}
                                <div className="max-h-64 overflow-y-auto">
                                    {projectsLoading ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                                            Loading projects...
                                        </div>
                                    ) : filteredProjects.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                                            No projects found
                                        </div>
                                    ) : (
                                        filteredProjects.map((project, index) => (
                                            <button
                                                key={project._id}
                                                onClick={() => handleProjectSelect(project)}
                                                className={`w-full text-left px-3 py-2 text-xs transition-colors ${index === selectedIndex
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                <div className="font-medium">{project.name}</div>
                                                {project.description && (
                                                    <div className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
                                                        {project.description}
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Separator */}
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                {/* Navigation Items */}
                <div className="flex items-center gap-1 flex-1">

                    <button
                        onClick={() => router.push('/app/teams')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Home</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/profile')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Code className="w-3.5 h-3.5" />
                        <span>Editor</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/projects')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Folder className="w-3.5 h-3.5" />
                        <span>Projects</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/profile')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Book className="w-3.5 h-3.5" />
                        <span>Documents</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/teams')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Access Control</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/teams')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>Teams</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/profile')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <BiEnvelope className="w-3.5 h-3.5" />
                        <span>Invite</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/profile')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile</span>
                    </button>

                    <button
                        onClick={() => router.push('/settings')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                    </button>

                    <button
                        onClick={() => router.push('/configuration')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Wrench className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Configuration</span>
                    </button>

                    <button
                        onClick={() => router.push('/app/profile')}
                        className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notification</span>
                    </button>
                    {/* Separator */}
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                </div>
            </div>
        </div>
    );
};

export default StatusBar;