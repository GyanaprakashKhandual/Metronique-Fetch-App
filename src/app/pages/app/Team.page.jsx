'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Users, FileText, Settings, LogOut, Upload, Download,
    Trash2, Edit, Eye, Search, Filter, ChevronDown, AlertCircle,
    CheckCircle, Loader, X, Copy, Share2, MoreVertical, FolderOpen,
    FileIcon, Image, Music, Video, Archive, Database, Mail, User,
    Lock, Globe, CheckSquare, Square
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
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalSize: '0 KB',
        byType: {}
    });
    const [invitations, setInvitations] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const headers = {
        'Content-Type': 'application/json'
    };

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/my-teams`, {
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setTeams(data.data.teams || []);
                if (data.data.teams?.length > 0 && !selectedTeam) {
                    setSelectedTeam(data.data.teams[0]);
                }
            }
        } catch (err) {
            setError('Failed to fetch teams');
        }
        setLoading(false);
    };

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_FILE}/files`, {
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) setFiles(data.data.files || []);
        } catch (err) {
            setError('Failed to fetch files');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTeams();
        fetchFiles();
    }, []);

    const handleCreateTeam = async () => {
        if (!formData.teamName?.trim()) {
            setError('Team name is required');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.teamName,
                    description: formData.teamDescription || '',
                    settings: { visibility: formData.visibility || 'private' }
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team created successfully!');
                setShowModal(false);
                setFormData({});
                fetchTeams();
            } else {
                setError(data.message || 'Failed to create team');
            }
        } catch (err) {
            setError('Failed to create team');
        }
        setLoading(false);
    };

    const handleUpdateTeam = async () => {
        if (!selectedTeam || !formData.teamName?.trim()) {
            setError('Team name is required');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.teamName,
                    description: formData.teamDescription || '',
                    settings: selectedTeam.settings || {}
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team updated successfully!');
                setShowModal(false);
                fetchTeams();
            } else {
                setError(data.message || 'Failed to update team');
            }
        } catch (err) {
            setError('Failed to update team');
        }
        setLoading(false);
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm('Are you sure? This action cannot be undone.')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}`, {
                method: 'DELETE',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team deleted successfully!');
                fetchTeams();
            } else {
                setError(data.message || 'Failed to delete team');
            }
        } catch (err) {
            setError('Failed to delete team');
        }
        setLoading(false);
    };

    const handleArchiveTeam = async (teamId) => {
        if (!window.confirm('Archive this team? You can restore it later.')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/archive`, {
                method: 'POST',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team archived!');
                fetchTeams();
            } else {
                setError(data.message || 'Failed to archive team');
            }
        } catch (err) {
            setError('Failed to archive team');
        }
        setLoading(false);
    };

    const handleFileUpload = async (e) => {
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
                    credentials: 'include',
                    body: formDataUpload
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        successCount++;
                    } else {
                        failureCount++;
                    }
                } else {
                    failureCount++;
                }
                setUploadProgress(Math.round(((i + 1) / fileList.length) * 100));
            } catch (err) {
                failureCount++;
            }
        }

        if (successCount > 0) {
            setSuccess(`${successCount} file(s) uploaded successfully!`);
        }
        if (failureCount > 0) {
            setError(`${failureCount} file(s) failed to upload`);
        }
        setUploadProgress(0);
        setIsUploading(false);
        setTimeout(() => fetchFiles(), 500);
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm('Delete this file?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_FILE}/delete/${fileId}`, {
                method: 'DELETE',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('File deleted!');
                fetchFiles();
            } else {
                setError(data.message || 'Failed to delete file');
            }
        } catch (err) {
            setError('Failed to delete file');
        }
        setLoading(false);
    };

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

    const handleInviteMember = async () => {
        if (!selectedTeam || !formData.memberEmail?.trim()) {
            setError('Email is required');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/invitations`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    email: formData.memberEmail,
                    role: formData.memberRole || 'member',
                    message: formData.inviteMessage || ''
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Invitation sent successfully!');
                setShowModal(false);
                setFormData({});
                fetchTeamMembers(selectedTeam._id);
            } else {
                setError(data.message || 'Failed to send invitation');
            }
        } catch (err) {
            setError('Failed to send invitation');
        }
        setLoading(false);
    };

    const handleBulkInviteMembers = async () => {
        if (!selectedTeam || !formData.bulkEmails?.trim()) {
            setError('Emails are required');
            return;
        }
        setLoading(true);
        try {
            const emails = formData.bulkEmails
                .split(',')
                .map(e => e.trim())
                .filter(e => e);
            const invitations = emails.map(email => ({
                email,
                role: formData.memberRole || 'member',
                message: formData.inviteMessage || ''
            }));

            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/invitations/bulk`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ invitations })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Bulk invitations sent!');
                setShowModal(false);
                setFormData({});
            } else {
                setError(data.message || 'Failed to send bulk invitations');
            }
        } catch (err) {
            setError('Failed to send bulk invitations');
        }
        setLoading(false);
    };

    const fetchTeamMembers = async (teamId) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members`, {
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setTeamMembers(data.data.members || []);
            }
        } catch (err) {
            setError('Failed to fetch team members');
        }
        setLoading(false);
    };

    const handleRemoveMember = async (teamId, memberId) => {
        if (!window.confirm('Remove this member from team?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}`, {
                method: 'DELETE',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Member removed successfully!');
                fetchTeamMembers(teamId);
            } else {
                setError(data.message || 'Failed to remove member');
            }
        } catch (err) {
            setError('Failed to remove member');
        }
        setLoading(false);
    };

    const handleUpdateMemberRole = async (teamId, memberId) => {
        if (!selectedMember || !formData.memberRole) {
            setError('Role is required');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}/role`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify({ role: formData.memberRole })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Member role updated!');
                setShowModal(false);
                setSelectedMember(null);
                fetchTeamMembers(teamId);
            } else {
                setError(data.message || 'Failed to update member role');
            }
        } catch (err) {
            setError('Failed to update member role');
        }
        setLoading(false);
    };

    const handleUpdateMemberPermissions = async (teamId, memberId) => {
        if (!selectedMember) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}/permissions`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify({ permissions: formData.permissions || {} })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Permissions updated!');
                setShowModal(false);
                setSelectedMember(null);
                fetchTeamMembers(teamId);
            } else {
                setError(data.message || 'Failed to update permissions');
            }
        } catch (err) {
            setError('Failed to update permissions');
        }
        setLoading(false);
    };

    const handleSuspendMember = async (teamId, memberId) => {
        if (!window.confirm('Suspend this member?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}/suspend`, {
                method: 'POST',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Member suspended!');
                fetchTeamMembers(teamId);
            } else {
                setError(data.message || 'Failed to suspend member');
            }
        } catch (err) {
            setError('Failed to suspend member');
        }
        setLoading(false);
    };

    const handleReactivateMember = async (teamId, memberId) => {
        if (!window.confirm('Reactivate this member?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/members/${memberId}/reactivate`, {
                method: 'POST',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Member reactivated!');
                fetchTeamMembers(teamId);
            } else {
                setError(data.message || 'Failed to reactivate member');
            }
        } catch (err) {
            setError('Failed to reactivate member');
        }
        setLoading(false);
    };

    const fetchTeamInvitations = async (teamId) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/invitations`, {
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setInvitations(data.data.invitations || []);
            }
        } catch (err) {
            setError('Failed to fetch invitations');
        }
        setLoading(false);
    };

    const handleResendInvitation = async (teamId, invitationId) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/invitations/${invitationId}/resend`, {
                method: 'POST',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Invitation resent!');
            } else {
                setError(data.message || 'Failed to resend invitation');
            }
        } catch (err) {
            setError('Failed to resend invitation');
        }
        setLoading(false);
    };

    const handleCancelInvitation = async (teamId, invitationId) => {
        if (!window.confirm('Cancel this invitation?')) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/invitations/${invitationId}`, {
                method: 'DELETE',
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Invitation cancelled!');
                fetchTeamInvitations(teamId);
            } else {
                setError(data.message || 'Failed to cancel invitation');
            }
        } catch (err) {
            setError('Failed to cancel invitation');
        }
        setLoading(false);
    };

    const handleUpdateTeamSettings = async () => {
        if (!selectedTeam) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/settings`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    settings: {
                        visibility: formData.visibility || 'private',
                        allowMemberInvites: formData.allowMemberInvites || false,
                        requireApprovalForJoin: formData.requireApprovalForJoin || false,
                        defaultMemberRole: formData.defaultMemberRole || 'member'
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Team settings updated!');
                setShowModal(false);
                fetchTeams();
            } else {
                setError(data.message || 'Failed to update settings');
            }
        } catch (err) {
            setError('Failed to update settings');
        }
        setLoading(false);
    };

    const fetchTeamStats = async (teamId) => {
        try {
            const res = await fetch(`${API_BASE_TEAM}/${teamId}/stats`, {
                headers,
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                return data.data.stats;
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
        return null;
    };

    const handleUpgradeSubscription = async (plan, seats) => {
        if (!selectedTeam) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_TEAM}/${selectedTeam._id}/subscription/upgrade`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ plan, seats })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Subscription upgraded!');
                fetchTeams();
            } else {
                setError(data.message || 'Failed to upgrade subscription');
            }
        } catch (err) {
            setError('Failed to upgrade subscription');
        }
        setLoading(false);
    };

    const handleShareTeam = (teamId) => {
        const shareUrl = `${window.location.origin}?team=${teamId}`;
        navigator.clipboard.writeText(shareUrl);
        setSuccess('Team link copied to clipboard!');
    };

    useEffect(() => {
        if (selectedTeam) {
            fetchTeamMembers(selectedTeam._id);
            fetchTeamInvitations(selectedTeam._id);
            fetchTeamStats(selectedTeam._id);
        }
    }, [selectedTeam]);

    const openModal = (type, data = null) => {
        setModalType(type);
        if (data) setSelectedMember(data);
        setFormData({});
        setShowModal(true);
    };

    const filteredTeams = teams.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFiles = files.filter(f =>
        f.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredMembers = teamMembers.filter(m => {
        const fullName = `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.toLowerCase();
        const email = m.user?.email?.toLowerCase() || '';
        return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });

    const getFileIcon = (fileType) => {
        const icons = {
            image: Image,
            video: Video,
            audio: Music,
            document: FileText,
            archive: Archive,
            database: Database
        };
        return icons[fileType] || FileIcon;
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
                            placeholder="Enter emails separated by commas"
                            value={formData.bulkEmails || ''}
                            onChange={(e) => setFormData({ ...formData, bulkEmails: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600 resize-none"
                            rows="4"
                        />
                        <select
                            value={formData.memberRole || 'member'}
                            onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                        <textarea
                            placeholder="Optional message"
                            value={formData.inviteMessage || ''}
                            onChange={(e) => setFormData({ ...formData, inviteMessage: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600 resize-none"
                            rows="2"
                        />
                    </>
                );
            case 'updateMemberRole':
                return (
                    <select
                        value={formData.memberRole || selectedMember?.role || 'member'}
                        onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600"
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
                            value={formData.visibility || selectedTeam?.settings?.visibility || 'private'}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.allowMemberInvites || false}
                                onChange={(e) => setFormData({ ...formData, allowMemberInvites: e.target.checked })}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-white dark:text-gray-200">Allow members to invite others</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.requireApprovalForJoin || false}
                                onChange={(e) => setFormData({ ...formData, requireApprovalForJoin: e.target.checked })}
                                className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-white dark:text-gray-200">Require approval for join requests</span>
                        </label>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-200">
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6 text-white dark:text-black" />
                        </div>
                        <h1 className="text-2xl font-bold">Team Hub</h1>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal('createTeam')}
                            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" /> New Team
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="fixed top-24 right-6 bg-red-600 dark:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 z-40 shadow-lg"
                    >
                        <AlertCircle className="w-5 h-5" />
                        {error}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setError('')}
                            className="ml-2"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="fixed top-24 right-6 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 z-40 shadow-lg"
                    >
                        <CheckCircle className="w-5 h-5" />
                        {success}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setSuccess('')}
                            className="ml-2"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700"
                >
                    {['overview', 'teams', 'files', 'members', 'invitations', 'settings'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-4 font-medium transition capitalize ${activeTab === tab
                                ? 'border-b-2 border-black dark:border-white text-black dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >

                    {activeTab === 'overview' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">Total Teams</p>
                                        <h3 className="text-3xl font-bold text-black dark:text-white">{teams.length}</h3>
                                    </div>
                                    <Users className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">Total Members</p>
                                        <h3 className="text-3xl font-bold text-black dark:text-white">{teamMembers.length}</h3>
                                    </div>
                                    <Users className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-400 mb-2">Pending Invitations</p>
                                        <h3 className="text-3xl font-bold text-black dark:text-white">{invitations.length}</h3>
                                    </div>
                                    <Mail className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === 'teams' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <Loader className="w-8 h-8 text-black dark:text-white" />
                                    </motion.div>
                                </div>
                            ) : filteredTeams.length === 0 ? (
                                <motion.div variants={itemVariants} className="text-center py-12">
                                    <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">No teams found</p>
                                </motion.div>
                            ) : (
                                filteredTeams.map(team => (
                                    <motion.div
                                        key={team._id}
                                        variants={itemVariants}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setSelectedTeam(team)}
                                        className={`p-6 rounded-xl border transition cursor-pointer ${selectedTeam?._id === team._id
                                            ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-800'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-black dark:text-white">{team.name}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{team.description}</p>
                                                <div className="flex gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>👥 {team.stats?.totalMembers || 1} members</span>
                                                    <span>📊 {team.stats?.totalProjects || 0} projects</span>
                                                    <span className="font-medium">Plan: {team.subscription?.plan || 'Free'}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); openModal('editTeam'); }}
                                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <Edit className="w-5 h-5 text-black dark:text-white" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team._id); }}
                                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => { e.stopPropagation(); handleShareTeam(team._id); }}
                                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'files' && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                            <motion.div
                                variants={itemVariants}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">Click to upload files</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">or drag and drop</p>
                                </label>
                            </motion.div>

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <motion.div variants={itemVariants} className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="bg-black dark:bg-white h-full"
                                    />
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {loading ? (
                                    <div className="flex justify-center col-span-full py-12">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                            <Loader className="w-8 h-8 text-black dark:text-white" />
                                        </motion.div>
                                    </div>
                                ) : filteredFiles.length === 0 ? (
                                    <motion.div variants={itemVariants} className="col-span-full text-center py-12">
                                        <FileIcon className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
                                    </motion.div>
                                ) : (
                                    filteredFiles.map(file => (
                                        <motion.div
                                            key={file._id}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:shadow-gray-800 transition bg-white dark:bg-gray-800"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                    {React.createElement(getFileIcon(file.fileType), { className: "w-5 h-5 text-black dark:text-white" })}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate text-black dark:text-white">{file.filename}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{file.sizeFormatted}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDownloadFile(file.url, file.filename)}
                                                    className="flex-1 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                                >
                                                    <Download className="w-3 h-3 inline mr-1" /> Download
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteFile(file._id)}
                                                    className="flex-1 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800 transition"
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

                    {activeTab === 'members' && selectedTeam && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openModal('inviteMember')}
                                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus className="w-5 h-5" /> Invite Member
                            </motion.button>

                            <div className="space-y-3">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                            <Loader className="w-8 h-8 text-black dark:text-white" />
                                        </motion.div>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No members in this team</p>
                                ) : (
                                    filteredMembers.map(member => (
                                        <motion.div
                                            key={member._id}
                                            variants={itemVariants}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium text-black dark:text-white">{member.user?.firstName} {member.user?.lastName}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.user?.email}</p>
                                                    <span className="inline-block mt-2 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full capitalize">{member.role}</span>
                                                    {member.status === 'suspended' && (
                                                        <span className="inline-block ml-2 px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full">Suspended</span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => openModal('updateMemberRole', member)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                    >
                                                        <Edit className="w-5 h-5 text-black dark:text-white" />
                                                    </motion.button>
                                                    {member.status === 'suspended' ? (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleReactivateMember(selectedTeam._id, member._id)}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleSuspendMember(selectedTeam._id, member._id)}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <EyeOff className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                        </motion.button>
                                                    )}
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleRemoveMember(selectedTeam._id, member._id)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'invitations' && selectedTeam && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openModal('bulkInvite')}
                                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium"
                            >
                                <Plus className="w-5 h-5" /> Bulk Invite
                            </motion.button>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <Loader className="w-8 h-8 text-black dark:text-white" />
                                    </motion.div>
                                </div>
                            ) : invitations.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No pending invitations</p>
                            ) : (
                                invitations.map(inv => (
                                    <motion.div
                                        key={inv._id}
                                        variants={itemVariants}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-black dark:text-white">{inv.email}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Role: {inv.role}</p>
                                                <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${inv.status === 'accepted' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'}`}>
                                                    {inv.status}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {inv.status === 'pending' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleResendInvitation(selectedTeam._id, inv._id)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                    >
                                                        <Copy className="w-5 h-5 text-black dark:text-white" />
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleCancelInvitation(selectedTeam._id, inv._id)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'settings' && selectedTeam && (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openModal('teamSettings')}
                                className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium"
                            >
                                <Settings className="w-5 h-5" /> Edit Settings
                            </motion.button>

                            <motion.div variants={itemVariants} className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
                                <h3 className="text-lg font-bold mb-4 text-black dark:text-white">Subscription Plan</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Current Plan:</span>
                                        <span className="font-bold text-black dark:text-white capitalize">{selectedTeam.subscription?.plan || 'Free'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Seats Used:</span>
                                        <span className="font-bold text-black dark:text-white">{selectedTeam.subscription?.usedSeats || 0}/{selectedTeam.subscription?.seats || 5}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400 capitalize">{selectedTeam.subscription?.status || 'Active'}</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
                                <h3 className="text-lg font-bold mb-4 text-black dark:text-white">Team Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Members</p>
                                        <p className="text-2xl font-bold text-black dark:text-white">{selectedTeam.stats?.totalMembers || 0}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Total Projects</p>
                                        <p className="text-2xl font-bold text-black dark:text-white">{selectedTeam.stats?.totalProjects || 0}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>

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
                            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 space-y-4 border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-black dark:text-white">
                                    {modalType === 'createTeam' && 'Create New Team'}
                                    {modalType === 'editTeam' && 'Edit Team'}
                                    {modalType === 'inviteMember' && 'Invite Member'}
                                    {modalType === 'bulkInvite' && 'Bulk Invite Members'}
                                    {modalType === 'updateMemberRole' && 'Update Member Role'}
                                    {modalType === 'teamSettings' && 'Team Settings'}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setShowModal(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    <X className="w-5 h-5 text-black dark:text-white" />
                                </motion.button>
                            </div>

                            {(modalType === 'createTeam' || modalType === 'editTeam') && (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Team Name"
                                        defaultValue={modalType === 'editTeam' ? selectedTeam?.name : ''}
                                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                    <textarea
                                        placeholder="Team Description"
                                        defaultValue={modalType === 'editTeam' ? selectedTeam?.description : ''}
                                        onChange={(e) => setFormData({ ...formData, teamDescription: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                                        rows="3"
                                    />
                                    {modalType === 'createTeam' && (
                                        <select
                                            value={formData.visibility || 'private'}
                                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
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
                                        onChange={(e) => setFormData({ ...formData, memberEmail: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                    <select
                                        value={formData.memberRole || 'member'}
                                        onChange={(e) => setFormData({ ...formData, memberRole: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="member">Member</option>                    <option value="admin">Admin</option>
                                    </select>
                                    <textarea
                                        placeholder="Optional message"
                                        onChange={(e) => setFormData({ ...formData, inviteMessage: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                                        rows="2"
                                    />
                                </>
                            )}

                            {renderModalContent()}

                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
                                        else if (modalType === 'updateMemberRole') handleUpdateMemberRole(selectedTeam._id, selectedMember._id);
                                        else if (modalType === 'teamSettings') handleUpdateTeamSettings();
                                    }}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
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