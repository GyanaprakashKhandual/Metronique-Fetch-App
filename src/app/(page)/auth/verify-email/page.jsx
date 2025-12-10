'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api/v1/auth';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('');

    useEffect(() => {
        handleEmailVerification();
    }, []);

    const handleEmailVerification = async () => {
        console.log('[VerifyEmail] Starting email verification');

        try {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                console.warn('[VerifyEmail] Missing token or email in URL');
                setStatus('error');
                setMessage('Invalid verification link');
                setTimeout(() => router.push('/auth'), 3000);
                return;
            }

            console.log('[VerifyEmail] Verifying email:', email);

            const res = await fetch(`${API_BASE_URL}/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ token, email })
            });

            const data = await res.json();

            if (data.success) {
                console.log('[VerifyEmail] Email verified successfully:', email);
                setStatus('success');
                setMessage('Email verified successfully!');

                setTimeout(() => {
                    router.push('/app');
                }, 2000);
            } else {
                console.warn('[VerifyEmail] Verification failed:', data.message);
                setStatus('error');
                setMessage(data.message || 'Verification failed');
                setTimeout(() => router.push('/auth'), 3000);
            }
        } catch (error) {
            console.error('[VerifyEmail] Verification error:', error);
            setStatus('error');
            setMessage('An error occurred during verification');
            setTimeout(() => router.push('/auth'), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center relative z-10"
            >
                {status === 'processing' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                        >
                            <motion.div className="relative w-24 h-24 mx-auto mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border-4 border-gray-200"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-1 rounded-full border-4 border-transparent border-t-black border-r-black"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-black opacity-30" />
                                </div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-center text-lg font-semibold text-gray-900 mb-2"
                            >
                                Verifying your email
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-sm text-gray-500 mb-6"
                            >
                                Please wait while we confirm your email address
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex justify-center gap-2"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-black rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.4, delay: 0.2, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-black rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -8, 0], opacity: [1, 0.6, 1] }}
                                    transition={{ duration: 1.4, delay: 0.4, repeat: Infinity }}
                                    className="w-2.5 h-2.5 bg-black rounded-full"
                                />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 bg-white rounded-xl p-4 shadow-md border border-gray-200 max-w-sm"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                                <p className="text-xs text-gray-600 font-medium">Confirming email address</p>
                            </div>
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-black"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '90%' }}
                                    transition={{ duration: 3, ease: 'easeInOut' }}
                                />
                            </div>
                        </motion.div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <motion.div
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </motion.div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center text-2xl font-semibold text-gray-900 mb-2"
                            >
                                {message}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-center text-sm text-gray-500"
                            >
                                Your email has been verified successfully
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-6 flex gap-2 justify-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2.5 h-2.5 bg-black rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                                className="w-2.5 h-2.5 bg-black rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                                className="w-2.5 h-2.5 bg-black rounded-full"
                            />
                        </motion.div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <motion.div
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <AlertCircle className="w-12 h-12 text-gray-900" />
                                </motion.div>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-center text-2xl font-semibold text-gray-900 mb-2"
                            >
                                {message}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-center text-sm text-gray-500 mb-6"
                            >
                                We couldn&apos;t verify your email. Please try again or contact support.
                            </motion.p>

                            <div className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{ opacity: [1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-xs text-gray-500"
                                >
                                    Redirecting to login...
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </div>
    );
}