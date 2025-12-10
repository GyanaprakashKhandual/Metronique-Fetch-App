'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertComponent from '../components/utils/Alert.util.jsx';
const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback(
        ({ type = 'info', message, duration = 4000 }) => {
            const id = Date.now();

            setAlerts((prev) => [
                ...prev,
                { id, type, message, duration },
            ]);

            return id;
        },
        []
    );

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setAlerts([]);
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, removeAlert, clearAll }}>
            {children}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
                {alerts.map((alert) => (
                    <div key={alert.id} className="pointer-events-auto">
                        <AlertComponent
                            id={alert.id}
                            type={alert.type}
                            message={alert.message}
                            duration={alert.duration}
                            onClose={removeAlert}
                        />
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error('useAlert must be used within AlertProvider');
    }

    return context.showAlert;
};