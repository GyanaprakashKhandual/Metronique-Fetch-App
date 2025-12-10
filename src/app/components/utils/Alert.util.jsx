import { AlertCircle, CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const ALERT_STYLES = {
    success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        icon: 'text-emerald-600',
        particleColor: '#10b981',
    },
    error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        icon: 'text-red-600',
        particleColor: '#ef4444',
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-900',
        icon: 'text-amber-600',
        particleColor: '#f59e0b',
    },
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        icon: 'text-blue-600',
        particleColor: '#3b82f6',
    },
};

const ICON_MAP = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const SEEDED_PARTICLES = [
    { angle: 15, distance: 280 },
    { angle: 45, distance: 320 },
    { angle: 75, distance: 290 },
    { angle: 105, distance: 310 },
    { angle: 135, distance: 300 },
    { angle: 165, distance: 330 },
    { angle: 195, distance: 285 },
    { angle: 225, distance: 315 },
    { angle: 255, distance: 295 },
    { angle: 285, distance: 325 },
    { angle: 315, distance: 310 },
    { angle: 345, distance: 290 },
    { angle: 30, distance: 270 },
    { angle: 60, distance: 305 },
    { angle: 90, distance: 295 },
    { angle: 120, distance: 320 },
    { angle: 150, distance: 300 },
    { angle: 180, distance: 310 },
    { angle: 210, distance: 275 },
    { angle: 240, distance: 325 },
    { angle: 270, distance: 285 },
    { angle: 300, distance: 315 },
    { angle: 330, distance: 305 },
    { angle: 20, distance: 290 },
    { angle: 50, distance: 310 },
];

const Particle = ({ x, y, color, delay, angle, distance }) => {
    const radians = (angle * Math.PI) / 180;
    const endX = x + distance * Math.cos(radians);
    const endY = y + distance * Math.sin(radians);
    const rotation = angle + (angle % 2 === 0 ? 120 : -120);

    return (
        <motion.div
            initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
            }}
            animate={{
                x: endX - x,
                y: endY - y,
                opacity: 0,
                scale: 0,
                rotate: rotation,
            }}
            transition={{
                duration: 1.4,
                delay,
                ease: 'easeOut',
            }}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
            style={{
                backgroundColor: color,
                left: x,
                top: y,
                boxShadow: `0 0 6px ${color}`,
            }}
        />
    );
};

const AlertComponent = ({
    id,
    type = 'info',
    message,
    duration = 4000,
    onClose,
}) => {
    const [show, setShow] = useState(true);
    const [isDisintegrating, setIsDisintegrating] = useState(false);
    const [particles, setParticles] = useState([]);
    const alertRef = useRef(null);

    const style = ALERT_STYLES[type] || ALERT_STYLES.info;
    const IconComponent = ICON_MAP[type] || Info;

    const createParticles = () => {
        if (!alertRef.current) return;
        const rect = alertRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const newParticles = SEEDED_PARTICLES.map((particle, idx) => ({
            id: idx,
            x: centerX,
            y: centerY,
            angle: particle.angle,
            distance: particle.distance,
            delay: idx * 0.02,
        }));

        setParticles(newParticles);
    };

    const handleClose = () => {
        setIsDisintegrating(true);
        createParticles();
        setTimeout(() => {
            setShow(false);
            onClose(id);
        }, 1500);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    ref={alertRef}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{
                        opacity: isDisintegrating ? 0 : 1,
                        x: 0,
                        scale: isDisintegrating ? 0.95 : 1,
                        filter: isDisintegrating ? 'blur(0.5px)' : 'blur(0px)',
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: isDisintegrating ? 0.8 : 0.4,
                        ease: 'easeInOut',
                    }}
                    className={`relative flex items-center gap-3 px-5 py-4 rounded-lg border shadow-lg overflow-hidden max-w-sm ${style.bg} ${style.border} ${style.text}`}
                >
                    {isDisintegrating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
                            transition={{ duration: 0.6, times: [0, 0.2, 0.4, 0.7, 1] }}
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `linear-gradient(45deg, transparent, ${style.particleColor}20, transparent)`,
                            }}
                        />
                    )}

                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${style.icon}`} />

                    <p className="text-sm font-medium flex-grow">{message}</p>

                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Close alert"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {isDisintegrating && (
                        <div className="absolute inset-0 pointer-events-none">
                            {particles.map((particle) => (
                                <Particle
                                    key={particle.id}
                                    x={particle.x}
                                    y={particle.y}
                                    color={style.particleColor}
                                    delay={particle.delay}
                                    angle={particle.angle}
                                    distance={particle.distance}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertComponent;