'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Users, FileText, Settings, LogOut, Upload, Download,
    Trash2, Edit, Eye, Search, Filter, ChevronDown, AlertCircle,
    CheckCircle, Loader, X, Copy, Share2, MoreVertical, FolderOpen,
    FileIcon, Image, Music, Video, Archive, Database
} from 'lucide-react';

const API_BASE_TEAM = 'http://localhost:5000/api/v1/team';
const API_BASE_FILE = 'http://localhost:50000/api/v1/files';

const TeamPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [teams, setTeams] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('createTeam');
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalSize: '0 KB',
        byType: {}
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Fetch Teams
    const fetchTeams = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/my-teams`, { headers });
            const data = await res.json();
            if (data.success) {
                setTeams(data.data.teams || []);
                if (data.data.teams?.length > 0) setSelectedTeam(data.data.teams[0]);
            }
        } catch (err) {
            setError('Failed to fetch teams');
        }
        setLoading(false);
    };

    // Fetch Files
    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_FILE}/files`, { headers });
            const data = await res.json();
            if (data.success) setFiles(data.data.files || []);
        } catch (err) {
            setError('Failed to fetch files');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) {
            fetchTeams();
            fetchFiles();
        }
    }, [token]);

    // Create Team
    const handleCreateTeam = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    name: formData.teamName,
                    description: formData.teamDescription,
                    settings: { visibility: formData.visibility || 'private' }
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team created successfully!');
                setShowModal(false);
                setFormData({});
                fetchTeams();
            }
        } catch (err) {
            setError('Failed to create team');
        }
        setLoading(false);
    };

    // Update Team
    const handleUpdateTeam = async () => {
        if (!selectedTeam) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    name: formData.teamName || selectedTeam.name,
                    description: formData.teamDescription || selectedTeam.description
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team updated successfully!');
                setShowModal(false);
                fetchTeams();
            }
        } catch (err) {
            setError('Failed to update team');
        }
        setLoading(false);
    };

    // Delete Team
    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team deleted successfully!');
                fetchTeams();
            }
        } catch (err) {
            setError('Failed to delete team');
        }
        setLoading(false);
    };

    // Upload Files
    const handleFileUpload = async (e) => {
        const fileList = e.target.files;
        if (!fileList) return;

        setLoading(true);
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            try {
                const res = await fetch(`${API_BASE_FILE}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataUpload
                });
                const data = await res.json();
                if (data.success) {
                    setUploadProgress(((i + 1) / fileList.length) * 100);
                }
            } catch (err) {
                setError(`Failed to upload ${file.name}`);
            }
        }
        setSuccess('Files uploaded successfully!');
        setUploadProgress(0);
        setLoading(false);
        fetchFiles();
    };

    // Delete File
    const handleDeleteFile = async (fileId) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            const res = await fetch(`${API_BASE_FILE}/delete/${fileId}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('File deleted!');
                fetchFiles();
            }
        } catch (err) {
            setError('Failed to delete file');
        }
    };

    // Invite Member
    const handleInviteMember = async () => {
        if (!selectedTeam) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/invitations`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    email: formData.memberEmail,
                    role: formData.memberRole || 'member'
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Invitation sent successfully!');
                setShowModal(false);
                setFormData({});
            }
        } catch (err) {
            setError('Failed to send invitation');
        }
        setLoading(false);
    };

    // Team Members Management
    const fetchTeamMembers = async (teamId) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members`, { headers });
            const data = await res.json();
            if (data.success) {
                setTeamMembers(data.data.members || []);
            }
        } catch (err) {
            setError('Failed to fetch team members');
        }
        setLoading(false);
    };

    // Remove Member
    const handleRemoveMember = async (teamId, memberId) => {
        if (!window.confirm('Remove this member from team?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Member removed successfully!');
                if (selectedTeam) fetchTeamMembers(selectedTeam._id);
            }
        } catch (err) {
            setError('Failed to remove member');
        }
        setLoading(false);
    };

    // Update Member Role
    const handleUpdateMemberRole = async (teamId, memberId) => {
        if (!selectedTeam || !formData.memberRole) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}/role`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ role: formData.memberRole })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Member role updated!');
                setShowModal(false);
                fetchTeamMembers(teamId);
            }
        } catch (err) {
            setError('Failed to update member role');
        }
        setLoading(false);
    };

    // Get File Stats
    const fetchFileStats = async () => {
        try {
            const res = await fetch(`${API_BASE_FILE}/stats`, { headers });
            const data = await res.json();
            if (data.success) {
                const statsData = data.data;
                setStats({
                    totalFiles: statsData.totalFiles || 0,
                    totalSize: statsData.totalSizeFormatted || '0 KB',
                    byType: statsData.byType || {}
                });
            }
        } catch (err) {
            console.log('Stats fetch error:', err);
        }
    };

    // Get Files by Type
    const fetchFilesByType = async (fileType) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_FILE}/files/type/${fileType}`, { headers });
            const data = await res.json();
            if (data.success) {
                setFiles(data.data.files || []);
            }
        } catch (err) {
            setError(`Failed to fetch ${fileType} files`);
        }
        setLoading(false);
    };

    // Delete Multiple Files
    const handleDeleteMultipleFiles = async (fileIds) => {
        if (!window.confirm(`Delete ${fileIds.length} files?`)) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_FILE}/delete-multiple`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ fileIds })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(`${data.deleted} files deleted!`);
                setSelectedFiles([]);
                fetchFiles();
            }
        } catch (err) {
            setError('Failed to delete files');
        }
        setLoading(false);
    };

    // Bulk Invite Members
    const handleBulkInviteMembers = async () => {
        if (!selectedTeam || !formData.bulkEmails) return;
        setLoading(true);
        try {
            const emails = formData.bulkEmails.split(',').map(e => e.trim());
            const invitations = emails.map(email => ({
                email,
                role: formData.memberRole || 'member'
            }));

            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/invitations/bulk`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ invitations })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Bulk invitations sent!');
                setShowModal(false);
                setFormData({});
            }
        } catch (err) {
            setError('Failed to send bulk invitations');
        }
        setLoading(false);
    };

    // Update Team Settings
    const handleUpdateTeamSettings = async () => {
        if (!selectedTeam) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    settings: {
                        visibility: formData.visibility,
                        allowMemberInvites: formData.allowMemberInvites,
                        requireApprovalForJoin: formData.requireApprovalForJoin,
                        defaultMemberRole: formData.defaultMemberRole
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team settings updated!');
                setShowModal(false);
                fetchTeams();
            }
        } catch (err) {
            setError('Failed to update settings');
        }
        setLoading(false);
    };

    // Get Team Invitations
    const fetchTeamInvitations = async (teamId) => {
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/invitations`, { headers });
            const data = await res.json();
            if (data.success) {
                return data.data.invitations || [];
            }
        } catch (err) {
            setError('Failed to fetch invitations');
        }
        return [];
    };

    // Resend Invitation
    const handleResendInvitation = async (teamId, invitationId) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/invitations/${invitationId}/resend`, {
                method: 'POST',
                headers
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Invitation resent!');
            }
        } catch (err) {
            setError('Failed to resend invitation');
        }
        setLoading(false);
    };

    // Cancel Invitation
    const handleCancelInvitation = async (teamId, invitationId) => {
        if (!window.confirm('Cancel this invitation?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/invitations/${invitationId}`, {
                method: 'DELETE',
                headers
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Invitation cancelled!');
            }
        } catch (err) {
            setError('Failed to cancel invitation');
        }
        setLoading(false);
    };

    // Archive Team
    const handleArchiveTeam = async (teamId) => {
        if (!window.confirm('Archive this team? You can restore it later.')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/archive`, {
                method: 'POST',
                headers
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team archived!');
                fetchTeams();
            }
        } catch (err) {
            setError('Failed to archive team');
        }
        setLoading(false);
    };

    // Get Team Stats
    const fetchTeamStats = async (teamId) => {
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/stats`, { headers });
            const data = await res.json();
            if (data.success) {
                return data.data.stats;
            }
        } catch (err) {
            console.log('Error fetching stats:', err);
        }
        return null;
    };

    // Enhanced File Upload with Progress
    const handleEnhancedFileUpload = async (e) => {
        const fileList = e.target.files;
        if (!fileList) return;

        setIsUploading(true);
        let successCount = 0;
        let failureCount = 0;

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            try {
                const res = await fetch(`${API_BASE_FILE}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formDataUpload
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        successCount++;
                        setUploadProgress(Math.round(((i + 1) / fileList.length) * 100));
                    } else {
                        failureCount++;
                    }
                }
            } catch (err) {
                failureCount++;
            }
        }

        setSuccess(`${successCount} file(s) uploaded successfully!`);
        if (failureCount > 0) {
            setError(`${failureCount} file(s) failed to upload`);
        }
        setUploadProgress(0);
        setIsUploading(false);
        fetchFiles();
    };

    // Download File
    const handleDownloadFile = async (fileUrl, fileName) => {
        try {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setSuccess('File download started!');
        } catch (err) {
            setError('Failed to download file');
        }
    };

    // Upgrade Subscription
    const handleUpgradeSubscription = async (plan, seats) => {
        if (!selectedTeam) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/subscription/upgrade`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ plan, seats })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Subscription upgraded!');
                fetchTeams();
            }
        } catch (err) {
            setError('Failed to upgrade subscription');
        }
        setLoading(false);
    };

    // Copy to Clipboard
    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('Copied to clipboard!');
    };

    // Share Team Link
    const handleShareTeam = async (teamId) => {
        const shareUrl = `${window.location.origin}?team=${teamId}`;
        handleCopyToClipboard(shareUrl);
    };

    // Filter and Search Enhanced
    const getFilteredTeams = () => {
        return teams.filter(t =>
            t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getFilteredFiles = () => {
        let filtered = files.filter(f =>
            f.filename?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered;
    };

    useEffect(() => {
        if (selectedTeam) {
            fetchTeamMembers(selectedTeam._id);
            fetchFileStats();
        }
    }, [selectedTeam]);

    const openModal = (type) => {
        setModalType(type);
        setFormData({});
        setShowModal(true);
    };

    const filteredTeams = teams.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFiles = files.filter(f =>
        f.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (fileType) => {
        const icons = {
            image: Image,
            video: Video,
            audio: Music,
            document: FileText,
            archive: Archive,
            database: Database
        };
        const Icon = icons[fileType] || FileIcon;
        return <Icon className="w-5 h-5" />;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const renderModalContent = () => {
        switch (modalType) {
            case 'bulkInvite':
                return (
                    <>
                        <textarea
                            placeholder="Enter emails separated by commas&#10;example@mail.com, user@mail.com"
                            value={formData.bulkEmails || ''}
                            onChange={(e) => setFormData({ ...formData, bulkEmails: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                            rows="4"
                        />
                        <select
                            value={formData.memberRole || 'member'}
                            onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </>
                );
            case 'updateMemberRole':
                return (
                    <select
                        value={formData.memberRole || 'member'}
                        onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="viewer">Viewer</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                );
            case 'teamSettings':
                return (
                    <>
                        <select
                            value={formData.visibility || 'private'}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.allowMemberInvites || false}
                                onChange={(e) => setFormData({ ...formData, allowMemberInvites: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span>Allow members to invite others</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.requireApprovalForJoin || false}
                                onChange={(e) => setFormData({ ...formData, requireApprovalForJoin: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <span>Require approval for join requests</span>
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-white border-b border-gray-200 sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Team Hub</h1>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={() => openModal('createTeam')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> New Team
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Alerts */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="fixed top-24 right-6 bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 z-40"
                    >
                        <AlertCircle className="w-5 h-5" />
                        {error}
                        <button onClick={() => setError('')}>
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="fixed top-24 right-6 bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-3 z-40"
                    >
                        <CheckCircle className="w-5 h-5" />
                        {success}
                        <button onClick={() => setSuccess('')}>
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 mb-8 border-b border-gray-200"
                >
                    {['overview', 'teams', 'files', 'members', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-4 font-medium transition capitalize ${activeTab === tab
                                ? 'border-b-2 border-green-500 text-green-600'
                                : 'text-gray-600 hover:text-black'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                variants={itemVariants}
                                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 mb-2">Total Teams</p>
                                        <h3 className="text-3xl font-bold text-green-600">{teams.length}</h3>
                                    </div>
                                    <Users className="w-10 h-10 text-green-600" />
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 mb-2">Total Files</p>
                                        <h3 className="text-3xl font-bold text-blue-600">{files.length}</h3>
                                    </div>
                                    <FileText className="w-10 h-10 text-blue-600" />
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 mb-2">Active Members</p>
                                        <h3 className="text-3xl font-bold text-red-600">
                                            {teams.reduce((sum, t) => sum + (t.stats?.totalMembers || 0), 0)}
                                        </h3>
                                    </div>
                                    <Users className="w-10 h-10 text-red-600" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Teams Tab */}
                    {activeTab === 'teams' && (
                        <motion.div variants={containerVariants} className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <Loader className="w-8 h-8 text-green-500" />
                                    </motion.div>
                                </div>
                            ) : filteredTeams.length === 0 ? (
                                <motion.div variants={itemVariants} className="text-center py-12">
                                    <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No teams found</p>
                                </motion.div>
                            ) : (
                                filteredTeams.map(team => (
                                    <motion.div
                                        key={team._id}
                                        variants={itemVariants}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setSelectedTeam(team)}
                                        className={`p-6 rounded-xl border transition cursor-pointer ${selectedTeam?._id === team._id
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 bg-white hover:border-green-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-black">{team.name}</h3>
                                                <p className="text-gray-600 text-sm mt-1">{team.description}</p>
                                                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                                                    <span>👥 {team.stats?.totalMembers || 1} members</span>
                                                    <span>📊 {team.stats?.totalProjects || 0} projects</span>
                                                    <span className="text-green-600">Plan: {team.subscription?.plan}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openModal('editTeam')}
                                                    className="p-2 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Edit className="w-5 h-5 text-blue-500" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteTeam(team._id)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-500" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* Files Tab */}
                    {activeTab === 'files' && (
                        <motion.div variants={containerVariants} className="space-y-6">
                            <motion.div
                                variants={itemVariants}
                                className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:bg-green-50 transition"
                            >
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                    <p className="text-gray-700 font-medium">Click to upload files</p>
                                    <p className="text-gray-500 text-sm">or drag and drop</p>
                                </label>
                            </motion.div>

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <motion.div
                                    variants={itemVariants}
                                    className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                                >
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="bg-green-500 h-full"
                                    />
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {loading ? (
                                    <div className="flex justify-center col-span-full py-12">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                            <Loader className="w-8 h-8 text-blue-500" />
                                        </motion.div>
                                    </div>
                                ) : filteredFiles.length === 0 ? (
                                    <motion.div variants={itemVariants} className="col-span-full text-center py-12">
                                        <FileIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No files uploaded yet</p>
                                    </motion.div>
                                ) : (
                                    filteredFiles.map(file => (
                                        <motion.div
                                            key={file._id}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    {getFileIcon(file.fileType)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{file.filename}</p>
                                                    <p className="text-xs text-gray-500">{file.sizeFormatted}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                                                >
                                                    <Download className="w-3 h-3 inline mr-1" /> Download
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteFile(file._id)}
                                                    className="flex-1 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                                                >
                                                    <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && selectedTeam && (
                        <motion.div variants={containerVariants} className="space-y-4">
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openModal('inviteMember')}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> Invite Member
                            </motion.button>
                            <motion.div
                                variants={itemVariants}
                                className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-center"
                            >
                                <p className="text-gray-600">Team: {selectedTeam.name}</p>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{selectedTeam.stats?.totalMembers || 1}</p>
                                <p className="text-gray-500 text-sm">Active Members</p>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && selectedTeam && (
                        <motion.div variants={containerVariants} className="space-y-6 max-w-2xl">
                            <motion.div
                                variants={itemVariants}
                                className="border border-gray-200 p-6 rounded-xl"
                            >
                                <h3 className="text-lg font-bold mb-4">Subscription Plan</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Current Plan:</span>
                                        <span className="font-bold text-green-600 capitalize">{selectedTeam.subscription?.plan}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Seats Used:</span>
                                        <span className="font-bold">{selectedTeam.subscription?.usedSeats}/{selectedTeam.subscription?.seats}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-bold text-green-600 capitalize">{selectedTeam.subscription?.status}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="border border-gray-200 p-6 rounded-xl"
                            >
                                <h3 className="text-lg font-bold mb-4">Team Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm">Tests Passed</p>
                                        <p className="text-2xl font-bold text-purple-600">{selectedTeam.stats?.totalTestsPassed || 0}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                                        <p className="text-gray-600 text-sm">Tests Failed</p>
                                        <p className="text-2xl font-bold text-red-600">{selectedTeam.stats?.totalTestsFailed || 0}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl max-w-md w-full p-6 space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    {modalType === 'createTeam' && 'Create New Team'}
                                    {modalType === 'editTeam' && 'Edit Team'}
                                    {modalType === 'inviteMember' && 'Invite Member'}
                                    {modalType === 'bulkInvite' && 'Bulk Invite Members'}
                                    {modalType === 'updateMemberRole' && 'Update Member Role'}
                                    {modalType === 'teamSettings' && 'Team Settings'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {(modalType === 'createTeam' || modalType === 'editTeam') && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Team Name"
                                        value={formData.teamName || ''}
                                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <textarea
                                        placeholder="Team Description"
                                        value={formData.teamDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, teamDescription: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        rows="3"
                                    />
                                    {modalType === 'createTeam' && (
                                        <select
                                            value={formData.visibility || 'private'}
                                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="private">Private</option>
                                            <option value="public">Public</option>
                                        </select>
                                    )}
                                </>
                            )}

                            {modalType === 'inviteMember' && (
                                <>
                                    <input
                                        type="email"
                                        placeholder="Member Email"
                                        value={formData.memberEmail || ''}
                                        onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={formData.memberRole || 'member'}
                                        onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </>
                            )}

                            {renderModalContent()}

                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (modalType === 'createTeam') handleCreateTeam();
                                        else if (modalType === 'editTeam') handleUpdateTeam();
                                        else if (modalType === 'inviteMember') handleInviteMember();
                                        else if (modalType === 'bulkInvite') handleBulkInviteMembers();
                                        else if (modalType === 'updateMemberRole') handleUpdateMemberRole(selectedTeam._id, selectedTeam._id);
                                        else if (modalType === 'teamSettings') handleUpdateTeamSettings();
                                    }}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" /> Loading
                                        </>
                                    ) : (
                                        'Save'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamPage;