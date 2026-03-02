/**
 * Authentication Security Helpers
 * Handles secure password validation, account protection, and auth best practices
 */

import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    setPersistence,
    browserLocalPersistence,
    signOut
} from 'firebase/auth';
import { validatePasswordStrength } from './securityHelpers';

/**
 * Configure Firebase Auth persistence
 * @param {object} auth - Firebase auth instance
 * @returns {Promise}
 */
export const configureAuthPersistence = async (auth) => {
    try {
        await setPersistence(auth, browserLocalPersistence);
        return true;
    } catch (err) {
        console.error('Error configuring auth persistence:', err);
        return false;
    }
};

/**
 * Safely update user password with security checks
 * @param {object} user - Firebase user
 * @param {string} currentPassword - Current password for re-authentication
 * @param {string} newPassword - New password
 * @returns {Promise<object>} Result with success flag and message
 */
export const securePasswordUpdate = async (user, currentPassword, newPassword) => {
    if (!user || !currentPassword || !newPassword) {
        return {
            success: false,
            message: 'Missing required fields'
        };
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (passwordValidation.score < 3) {
        return {
            success: false,
            message: `Password too weak. ${passwordValidation.feedback.join(', ')}`
        };
    }

    // Prevent using same password
    if (currentPassword === newPassword) {
        return {
            success: false,
            message: 'New password must be different from current password'
        };
    }

    try {
        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, newPassword);

        return {
            success: true,
            message: 'Password updated successfully'
        };
    } catch (err) {
        if (err.code === 'auth/wrong-password') {
            return {
                success: false,
                message: 'Current password is incorrect'
            };
        }
        return {
            success: false,
            message: `Password update failed: ${err.message}`
        };
    }
};

/**
 * Validate email format more strictly
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    // RFC 5322 simplified validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

/**
 * Check if an email domain is suspicious/disposable
 * @param {string} email - Email to check
 * @returns {boolean} True if domain is suspicious
 */
export const isSuspiciousEmailDomain = (email) => {
    const suspiciousDomains = [
        'tempmail.com',
        'guerrillamail.com',
        '10minutemail.com',
        'throwaway.email',
        'mailinator.com',
        'fakeinbox.com',
        'sharklasers.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return suspiciousDomains.some(d => domain === d || domain?.endsWith('.' + d));
};

/**
 * Detect suspicious authentication patterns (brute force, credential stuffing)
 * @param {string} userId - User ID or email
 * @param {number} threshold - Failed attempts threshold
 * @returns {boolean} True if suspicious
 */
const failedAuthAttempts = new Map();

export const recordFailedAuthAttempt = (identifier) => {
    const now = Date.now();
    if (!failedAuthAttempts.has(identifier)) {
        failedAuthAttempts.set(identifier, []);
    }

    const attempts = failedAuthAttempts.get(identifier);
    attempts.push(now);

    // Clean up old attempts (> 15 minutes)
    const recentAttempts = attempts.filter(t => now - t < 15 * 60 * 1000);
    failedAuthAttempts.set(identifier, recentAttempts);

    return recentAttempts.length;
};

export const checkIsSuspiciousAuthActivity = (identifier, threshold = 5) => {
    const attempts = failedAuthAttempts.get(identifier) || [];
    
    // Clean up old attempts (> 15 minutes)
    const now = Date.now();
    const recentAttempts = attempts.filter(t => now - t < 15 * 60 * 1000);
    
    return recentAttempts.length >= threshold;
};

export const resetFailedAuthAttempts = (identifier) => {
    failedAuthAttempts.delete(identifier);
};

/**
 * Get account security recommendations
 * @param {object} user - User profile object with auth data
 * @returns {array} Array of security recommendations
 */
export const getSecurityRecommendations = (user) => {
    const recommendations = [];

    // Check for email verification
    if (user && !user.emailVerified) {
        recommendations.push({
            level: 'warning',
            message: 'Verify your email address',
            action: 'Verification email has been sent'
        });
    }

    // Check for MFA (when implemented)
    if (user && !user.mfaEnabled) {
        recommendations.push({
            level: 'info',
            message: 'Enable two-factor authentication',
            action: 'Add an extra layer of security to your account'
        });
    }

    // Check for old password (when last changed)
    if (user && user.passwordLastChangedAt) {
        const daysSinceChange = Math.floor((Date.now() - new Date(user.passwordLastChangedAt)) / (1000 * 60 * 60 * 24));
        if (daysSinceChange > 90) {
            recommendations.push({
                level: 'warning',
                message: `Password not changed for ${daysSinceChange} days`,
                action: 'Change your password periodically for security'
            });
        }
    }

    return recommendations;
};

/**
 * Safely terminate all active sessions
 * @param {object} auth - Firebase auth instance
 * @returns {Promise}
 */
export const terminateAllSessions = async (auth) => {
    try {
        await signOut(auth);
        localStorage.clear();
        sessionStorage.clear();
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

/**
 * Detect suspicious account activity patterns
 * @param {object} userActivity - User activity logs
 * @returns {object} Suspicious patterns found
 */
export const detectSuspiciousPatterns = (userActivity) => {
    const patterns = {
        multipleLocations: false,
        unusualTime: false,
        rapidActions: false,
        unusualDevice: false
    };

    // Check for multiple locations in short time
    if (userActivity && userActivity.locations && userActivity.locations.length > 2) {
        const recentLocations = userActivity.locations.slice(-3);
        const timeDiff = recentLocations[2].time - recentLocations[0].time;
        if (timeDiff < 60000) { // Less than 1 minute
            patterns.multipleLocations = true;
        }
    }

    // Check for activity outside normal hours (if available)
    if (userActivity && userActivity.lastActivity) {
        const hour = new Date(userActivity.lastActivity).getHours();
        if (hour < 5 || hour > 23) { // Outside 5 AM - 11 PM
            patterns.unusualTime = true;
        }
    }

    // Check for rapid actions
    if (userActivity && userActivity.actionHistory && userActivity.actionHistory.length > 50) {
        const recent = userActivity.actionHistory.slice(-50);
        const timeDiff = recent[49].time - recent[0].time;
        if (timeDiff < 30000) { // 50 actions in 30 seconds
            patterns.rapidActions = true;
        }
    }

    return patterns;
};

export default {
    configureAuthPersistence,
    securePasswordUpdate,
    isValidEmail,
    isSuspiciousEmailDomain,
    recordFailedAuthAttempt,
    checkIsSuspiciousAuthActivity,
    resetFailedAuthAttempts,
    getSecurityRecommendations,
    terminateAllSessions,
    detectSuspiciousPatterns
};
