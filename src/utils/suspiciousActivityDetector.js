import {
    logActivity,
    flagSuspiciousActivity,
    getUserActivityLog,
    ACTIVITY_TYPES,
    ACTIVITY_SEVERITY
} from './activityLogger';
import { SUSPICIOUS_ACTIVITY_THRESHOLDS } from '../config/securityConfig';

/**
 * Suspicious Activity Detector
 * Automatically detects and flags suspicious user behavior patterns
 */

export const suspiciousActivityDetector = {
    /**
     * Check for rapid login attempts (brute force detection)
     * Flags if more than FAILED_LOGINS failed attempts within the window
     */
    async checkRapidFailedLogins(userId) {
        try {
            const activities = await getUserActivityLog(userId, 100);
            const now = Date.now();
            const windowMs = SUSPICIOUS_ACTIVITY_THRESHOLDS.FAILED_LOGINS_WINDOW_MINUTES * 60 * 1000;
            
            const recentFailedLogins = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (
                    activity.activityType === ACTIVITY_TYPES.LOGIN &&
                    activity.metadata?.status === 'FAILED' &&
                    (now - actTime) < windowMs
                );
            });

            if (recentFailedLogins.length >= SUSPICIOUS_ACTIVITY_THRESHOLDS.FAILED_LOGINS) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.LOGIN,
                    `Rapid failed login attempts detected: ${recentFailedLogins.length} attempts in ${SUSPICIOUS_ACTIVITY_THRESHOLDS.FAILED_LOGINS_WINDOW_MINUTES} minutes`,
                    {
                        failedAttempts: recentFailedLogins.length,
                        threshold: SUSPICIOUS_ACTIVITY_THRESHOLDS.FAILED_LOGINS,
                        windowMinutes: SUSPICIOUS_ACTIVITY_THRESHOLDS.FAILED_LOGINS_WINDOW_MINUTES,
                        detectionType: 'BRUTE_FORCE'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check rapid failed logins:', error);
            return false;
        }
    },

    /**
     * Check for rapid listing creation (spam/abuse detection)
     * Flags if user creates multiple listings very quickly
     */
    async checkRapidListingCreation(userId) {
        try {
            const activities = await getUserActivityLog(userId, 100);
            const now = Date.now();
            const windowMs = 5 * 60 * 1000; // 5 minutes
            
            const recentListings = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (
                    activity.activityType === ACTIVITY_TYPES.LISTING_CREATE &&
                    (now - actTime) < windowMs
                );
            });

            // Flag if more than 10 listings created in 5 minutes
            const threshold = 10;
            if (recentListings.length >= threshold) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.LISTING_CREATE,
                    `Rapid listing creation detected: ${recentListings.length} listings created in 5 minutes`,
                    {
                        listingsCreated: recentListings.length,
                        threshold: threshold,
                        detectionType: 'SPAM_ABUSE'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check rapid listing creation:', error);
            return false;
        }
    },

    /**
     * Check for rapid material uploads (spam/abuse detection)
     */
    async checkRapidMaterialUpload(userId) {
        try {
            const activities = await getUserActivityLog(userId, 100);
            const now = Date.now();
            const windowMs = 5 * 60 * 1000; // 5 minutes
            
            const recentMaterials = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (
                    activity.activityType === ACTIVITY_TYPES.MATERIAL_UPLOAD &&
                    (now - actTime) < windowMs
                );
            });

            // Flag if more than 5 materials uploaded in 5 minutes
            const threshold = 5;
            if (recentMaterials.length >= threshold) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.MATERIAL_UPLOAD,
                    `Rapid material uploads detected: ${recentMaterials.length} materials uploaded in 5 minutes`,
                    {
                        materialsUploaded: recentMaterials.length,
                        threshold: threshold,
                        detectionType: 'SPAM_ABUSE'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check rapid material upload:', error);
            return false;
        }
    },

    /**
     * Check for rapid messaging (spam detection)
     */
    async checkRapidMessaging(userId) {
        try {
            const activities = await getUserActivityLog(userId, 100);
            const now = Date.now();
            const windowMs = 1 * 60 * 1000; // 1 minute
            
            const recentMessages = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (
                    activity.activityType === ACTIVITY_TYPES.MESSAGE_SEND &&
                    (now - actTime) < windowMs
                );
            });

            // Flag if more than 20 messages in 1 minute
            const threshold = 20;
            if (recentMessages.length >= threshold) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.MESSAGE_SEND,
                    `Rapid messaging detected: ${recentMessages.length} messages sent in 1 minute`,
                    {
                        messagesSent: recentMessages.length,
                        threshold: threshold,
                        detectionType: 'SPAM'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check rapid messaging:', error);
            return false;
        }
    },

    /**
     * Check for unusual IP address changes
     */
    async checkUnusualIpChange(userId) {
        try {
            const activities = await getUserActivityLog(userId, 50);
            const now = Date.now();
            const windowMs = 30 * 60 * 1000; // 30 minutes
            
            const recentActivities = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (now - actTime) < windowMs;
            });

            if (recentActivities.length < 2) return false;

            // Check for IP changes
            const ips = recentActivities.map(a => a.ipAddress).filter(Boolean);
            const uniqueIps = new Set(ips);

            // Flag if more than 3 different IPs in 30 minutes (potential account compromise)
            const threshold = 3;
            if (uniqueIps.size > threshold && ips.length >= threshold) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.LOGIN,
                    `Unusual IP address changes detected: ${uniqueIps.size} different IPs in 30 minutes`,
                    {
                        uniqueIps: Array.from(uniqueIps),
                        threshold: threshold,
                        detectionType: 'ACCOUNT_COMPROMISE'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check unusual IP change:', error);
            return false;
        }
    },

    /**
     * Check for unusual device changes
     */
    async checkUnusualDeviceChange(userId) {
        try {
            const activities = await getUserActivityLog(userId, 50);
            const now = Date.now();
            const windowMs = 60 * 60 * 1000; // 1 hour
            
            const recentActivities = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (now - actTime) < windowMs;
            });

            if (recentActivities.length < 2) return false;

            // Extract device fingerprints
            const devices = recentActivities
                .map(a => a.deviceInfo?.userAgent || 'UNKNOWN')
                .filter(Boolean);
            const uniqueDevices = new Set(devices);

            // Flag if more than 2 different devices in 1 hour
            const threshold = 2;
            if (uniqueDevices.size > threshold && devices.length >= threshold) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.LOGIN,
                    `Unusual device changes detected: ${uniqueDevices.size} different devices in 1 hour`,
                    {
                        uniqueDevices: uniqueDevices.size,
                        threshold: threshold,
                        detectionType: 'ACCOUNT_COMPROMISE'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check unusual device change:', error);
            return false;
        }
    },

    /**
     * Check for rapid data exports (compliance concern)
     */
    async checkRapidDataExports(userId) {
        try {
            const activities = await getUserActivityLog(userId, 50);
            const now = Date.now();
            const windowMs = SUSPICIOUS_ACTIVITY_THRESHOLDS.RAPID_DATA_EXPORT_WINDOW_MINUTES * 60 * 1000;
            
            const recentExports = activities.filter(activity => {
                const actTime = activity.timestamp?.toDate?.()?.getTime?.() || 0;
                return (
                    activity.activityType === ACTIVITY_TYPES.EXPORT_DATA &&
                    (now - actTime) < windowMs
                );
            });

            if (recentExports.length >= SUSPICIOUS_ACTIVITY_THRESHOLDS.RAPID_DATA_EXPORT) {
                await flagSuspiciousActivity(
                    userId,
                    ACTIVITY_TYPES.EXPORT_DATA,
                    `Rapid data exports detected: ${recentExports.length} exports in ${SUSPICIOUS_ACTIVITY_THRESHOLDS.RAPID_DATA_EXPORT_WINDOW_MINUTES} minutes`,
                    {
                        exportsCount: recentExports.length,
                        threshold: SUSPICIOUS_ACTIVITY_THRESHOLDS.RAPID_DATA_EXPORT,
                        windowMinutes: SUSPICIOUS_ACTIVITY_THRESHOLDS.RAPID_DATA_EXPORT_WINDOW_MINUTES,
                        detectionType: 'DATA_COMPLIANCE'
                    }
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check rapid data exports:', error);
            return false;
        }
    },

    /**
     * Run all suspicious activity checks for a user
     */
    async runAllChecks(userId) {
        try {
            const results = await Promise.allSettled([
                this.checkRapidFailedLogins(userId),
                this.checkRapidListingCreation(userId),
                this.checkRapidMaterialUpload(userId),
                this.checkRapidMessaging(userId),
                this.checkUnusualIpChange(userId),
                this.checkUnusualDeviceChange(userId),
                this.checkRapidDataExports(userId)
            ]);

            const flaggedCount = results.filter(
                r => r.status === 'fulfilled' && r.value === true
            ).length;

            return {
                success: true,
                flaggedCount: flaggedCount,
                checks: [
                    'RapidFailedLogins',
                    'RapidListingCreation',
                    'RapidMaterialUpload',
                    'RapidMessaging',
                    'UnusualIpChange',
                    'UnusualDeviceChange',
                    'RapidDataExports'
                ],
                results: results.map((r, i) => ({
                    checkName: [
                        'RapidFailedLogins',
                        'RapidListingCreation',
                        'RapidMaterialUpload',
                        'RapidMessaging',
                        'UnusualIpChange',
                        'UnusualDeviceChange',
                        'RapidDataExports'
                    ][i],
                    flagged: r.status === 'fulfilled' ? r.value : false,
                    error: r.status === 'rejected' ? r.reason?.message : null
                }))
            };
        } catch (error) {
            console.error('Failed to run all suspicious activity checks:', error);
            return {
                success: false,
                error: error.message,
                flaggedCount: 0
            };
        }
    },

    /**
     * Check if a specific activity appears suspicious
     */
    async analyzeActivity(userId, activityType, metadata) {
        const suspiciousPatterns = {
            [ACTIVITY_TYPES.LOGIN]: (meta) =>
                meta.status === 'FAILED' || meta.method === 'BRUTE_FORCE',
            [ACTIVITY_TYPES.LISTING_CREATE]: (meta) =>
                meta.category === 'FLAGGED' || meta.price < 0,
            [ACTIVITY_TYPES.MATERIAL_UPLOAD]: (meta) =>
                meta.size > 100 * 1024 * 1024 || meta.fileType === 'MALICIOUS',
            [ACTIVITY_TYPES.MESSAGE_SEND]: (meta) =>
                meta.messageLength === 0 || meta.messageLength > 5000,
            [ACTIVITY_TYPES.PROFILE_UPDATE]: (meta) =>
                meta.changedFields?.includes('email') &&
                meta.changedFields?.includes('password')
        };

        const isSuspicious = suspiciousPatterns[activityType]?.(metadata) || false;

        if (isSuspicious) {
            try {
                await logActivity(
                    userId,
                    activityType,
                    metadata,
                    ACTIVITY_SEVERITY.WARNING
                );
            } catch (error) {
                console.error('Failed to log suspicious activity:', error);
            }
        }

        return isSuspicious;
    }
};

export default suspiciousActivityDetector;
