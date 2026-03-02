import React from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft } from 'lucide-react';
import '../styles/InfoModal.css';

const InfoModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    showClose = true,
    subtitle = null,
    fullPage = false 
}) => {
    if (!isOpen) return null;

    if (fullPage) {
        return (
            <div className="info-modal-fullpage">
                <div className="info-modal-header">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
                </div>

                <div className="info-modal-content">
                    {subtitle && (
                        <p className="text-gray-400 text-lg mb-8">{subtitle}</p>
                    )}
                    {children}
                </div>
            </div>
        );
    }

    return createPortal(
        <div className="info-modal-overlay">
            <div className="info-modal-container">
                <div className="info-modal-header-bar">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    {showClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="info-modal-body">
                    {subtitle && (
                        <p className="text-gray-400 mb-6 text-sm">{subtitle}</p>
                    )}
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InfoModal;
