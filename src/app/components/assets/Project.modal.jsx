'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, CheckCircle, Plus, Trash2, ChevronDown } from 'lucide-react';

const CreateProjectModal = ({ onClose, onCreate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: 'private',
        repository: {
            connected: false,
            url: '',
            fullName: '',
            owner: '',
            name: '',
            branch: 'main',
            accessToken: ''
        },
        technology: {
            language: 'java',
            framework: 'spring-boot',
            database: ['mongodb'],
            orm: 'hibernate'
        },
        databaseConnections: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        repo: false,
        tech: false,
        db: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRepositoryChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            repository: {
                ...prev.repository,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleTechnologyChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            technology: {
                ...prev.technology,
                [name]: value
            }
        }));
    };

    const handleDatabaseChange = (index, field, value) => {
        const newConnections = [...formData.databaseConnections];
        newConnections[index] = {
            ...newConnections[index],
            [field]: value
        };
        setFormData((prev) => ({
            ...prev,
            databaseConnections: newConnections
        }));
    };

    const addDatabase = () => {
        setFormData((prev) => ({
            ...prev,
            databaseConnections: [
                ...prev.databaseConnections,
                {
                    name: '',
                    type: 'mongodb',
                    host: '',
                    port: '',
                    username: '',
                    password: '',
                    database: '',
                    connectionString: ''
                }
            ]
        }));
    };

    const removeDatabase = (index) => {
        setFormData((prev) => ({
            ...prev,
            databaseConnections: prev.databaseConnections.filter((_, i) => i !== index)
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                'http://localhost:5000/api/v1/projects/create-with-unified-structure',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) throw new Error('Failed to create project');

            const data = await response.json();
            await onCreate(data.data.project);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: '🧪', title: 'TestNG Framework', desc: 'Unit & functional testing' },
        { icon: '🔗', title: 'REST Assured API', desc: 'API testing with assertions' },
        { icon: '🥒', title: 'Cucumber BDD', desc: 'Behavior-driven scenarios' },
        { icon: '💾', title: 'Database Testing', desc: 'Query execution & validation' },
        { icon: '🔐', title: 'Authentication', desc: 'OAuth, JWT, session handling' },
        { icon: '📊', title: 'Reporting', desc: 'Allure & ExtentReports' },
    ];

    const languages = ['java', 'python', 'javascript', 'csharp'];
    const frameworks = ['spring-boot', 'express', 'django', 'dotnet-core'];
    const databases = ['mongodb', 'mysql', 'postgresql', 'sqlite', 'mssql'];
    const orms = ['hibernate', 'mongoose', 'sequelize', 'prisma'];

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-white dark:bg-gray-950 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <div>
                        <h2 className="text-2xl font-bold text-black dark:text-white">
                            Create Unified API Test Environment
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Integrated Cucumber + REST Assured + TestNG
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {step === 1 ? (
                    <div className="p-6 space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., E-commerce API Testing"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your testing project..."
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                                    Visibility
                                </label>
                                <select
                                    name="visibility"
                                    value={formData.visibility}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                >
                                    <option value="private">Private</option>
                                    <option value="team">Team</option>
                                    <option value="public">Public</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-gray-200 dark:border-gray-800 pt-6">
                            <button
                                type="button"
                                onClick={() => toggleSection('repo')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="font-medium text-black dark:text-white">📦 Git Repository (Optional)</span>
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform text-gray-600 dark:text-gray-400 ${expandedSections.repo ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {expandedSections.repo && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                                    >
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="connected"
                                                checked={formData.repository.connected}
                                                onChange={handleRepositoryChange}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-black dark:text-white">Connect Repository</span>
                                        </label>

                                        {formData.repository.connected && (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    name="url"
                                                    placeholder="Repository URL"
                                                    value={formData.repository.url}
                                                    onChange={handleRepositoryChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Full Name (owner/repo)"
                                                    value={formData.repository.fullName}
                                                    onChange={handleRepositoryChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    name="accessToken"
                                                    placeholder="Access Token"
                                                    value={formData.repository.accessToken}
                                                    onChange={handleRepositoryChange}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="button"
                                onClick={() => toggleSection('tech')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="font-medium text-black dark:text-white">⚙️ Technology Stack</span>
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform text-gray-600 dark:text-gray-400 ${expandedSections.tech ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {expandedSections.tech && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                                    >
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                                            <select
                                                name="language"
                                                value={formData.technology.language}
                                                onChange={handleTechnologyChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                            >
                                                {languages.map(lang => (
                                                    <option key={lang} value={lang}>{lang}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Framework</label>
                                            <select
                                                name="framework"
                                                value={formData.technology.framework}
                                                onChange={handleTechnologyChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                            >
                                                {frameworks.map(fw => (
                                                    <option key={fw} value={fw}>{fw}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Database</label>
                                            <select
                                                name="database"
                                                value={formData.technology.database[0]}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    technology: { ...prev.technology, database: [e.target.value] }
                                                }))}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                            >
                                                {databases.map(db => (
                                                    <option key={db} value={db}>{db}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ORM</label>
                                            <select
                                                name="orm"
                                                value={formData.technology.orm}
                                                onChange={handleTechnologyChange}
                                                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                                            >
                                                {orms.map(orm => (
                                                    <option key={orm} value={orm}>{orm}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="button"
                                onClick={() => toggleSection('db')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span className="font-medium text-black dark:text-white">💾 Database Connections ({formData.databaseConnections.length})</span>
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform text-gray-600 dark:text-gray-400 ${expandedSections.db ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {expandedSections.db && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                                    >
                                        {formData.databaseConnections.map((db, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-2 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Connection Name"
                                                        value={db.name}
                                                        onChange={(e) => handleDatabaseChange(idx, 'name', e.target.value)}
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    />
                                                    <select
                                                        value={db.type}
                                                        onChange={(e) => handleDatabaseChange(idx, 'type', e.target.value)}
                                                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    >
                                                        {databases.map(d => (
                                                            <option key={d} value={d}>{d}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDatabase(idx)}
                                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Host"
                                                        value={db.host}
                                                        onChange={(e) => handleDatabaseChange(idx, 'host', e.target.value)}
                                                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Port"
                                                        value={db.port}
                                                        onChange={(e) => handleDatabaseChange(idx, 'port', e.target.value)}
                                                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Username"
                                                        value={db.username}
                                                        onChange={(e) => handleDatabaseChange(idx, 'username', e.target.value)}
                                                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="Password"
                                                        value={db.password}
                                                        onChange={(e) => handleDatabaseChange(idx, 'password', e.target.value)}
                                                        className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                    />
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Database Name"
                                                    value={db.database}
                                                    onChange={(e) => handleDatabaseChange(idx, 'database', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                />

                                                <input
                                                    type="text"
                                                    placeholder="Connection String (Optional)"
                                                    value={db.connectionString}
                                                    onChange={(e) => handleDatabaseChange(idx, 'connectionString', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                                                />
                                            </motion.div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={addDatabase}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <Plus size={16} />
                                            Add Database Connection
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-3 border-t border-gray-200 dark:border-gray-800 pt-6">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(2)}
                                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors font-medium"
                            >
                                Next: Review Features
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                ✨ Your unified testing environment will include:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900"
                                >
                                    <div className="text-3xl mb-2">{feature.icon}</div>
                                    <h4 className="font-semibold text-black dark:text-white mb-1">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h4 className="font-semibold text-black dark:text-white mb-3">Auto-Generated Structure:</h4>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex gap-2">
                                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span>32+ Folders (src/test/java, resources, features, utils, config, models, etc.)</span>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span>50+ Java Test Classes (TestNG, step definitions, runners, utils)</span>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span>20+ Cucumber Feature Files (API, Database, Auth, Integration scenarios)</span>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span>Configuration Files (pom.xml, testng.xml, properties, schemas)</span>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span>Test Data Files (JSON test data, environment configs, API schemas)</span>
                                </div>
                            </div>
                        </div>

                        {formData.repository.connected && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm"
                            >
                                ✓ Git Repository connected: {formData.repository.fullName}
                            </motion.div>
                        )}

                        {formData.databaseConnections.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm"
                            >
                                ✓ {formData.databaseConnections.length} database connection(s) configured
                            </motion.div>
                        )}

                        <div className="flex gap-3 border-t border-gray-200 dark:border-gray-800 pt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                            >
                                Back
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader size={16} className="animate-spin" />
                                        Creating Environment...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} />
                                        Create Unified Environment
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CreateProjectModal;