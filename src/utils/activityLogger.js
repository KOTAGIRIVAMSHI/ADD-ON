/**
 * Activity Logger - Comprehensive audit trail system
 * Logs all user actions for security, compliance, and analysis
 * 
 * Features:
 * - User action tracking (login, logout, create, update, delete)
 * - IP address and device tracking
 * - Error and failure logging
 * - Suspicious activity flagging
 * - Retention policies
 */

import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const COLLECTIONS = {
  ACTIVITY_LOG: 'activityLogs',
  SUSPICIOUS_ACTIVITY: 'suspiciousActivities'
};

/**
 * Activity Types
 */
export const ACTIVITY_TYPES = {
  // Authentication
  LOGIN: 'AUTH_LOGIN',
  LOGOUT: 'AUTH_LOGOUT',
  SIGNUP: 'AUTH_SIGNUP',
  PASSWORD_CHANGE: 'AUTH_PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST: 'AUTH_PASSWORD_RESET_REQUEST',
  ACCOUNT_LOCKED: 'AUTH_ACCOUNT_LOCKED',
  
  // Listings
  LISTING_CREATE: 'LISTING_CREATE',
  LISTING_UPDATE: 'LISTING_UPDATE',
  LISTING_DELETE: 'LISTING_DELETE',
  LISTING_VIEW: 'LISTING_VIEW',
  LISTING_MARK_SOLD: 'LISTING_MARK_SOLD',
  
  // Reviews & Ratings
  REVIEW_SUBMIT: 'REVIEW_SUBMIT',
  REVIEW_APPROVED: 'REVIEW_APPROVED',
  REVIEW_REJECTED: 'REVIEW_REJECTED',
  REVIEW_DELETE: 'REVIEW_DELETE',
  REVIEW_HELPFUL: 'REVIEW_HELPFUL',
  REVIEW_UNHELPFUL: 'REVIEW_UNHELPFUL',
  
  // Materials
  MATERIAL_UPLOAD: 'MATERIAL_UPLOAD',
  MATERIAL_UPDATE: 'MATERIAL_UPDATE',
  MATERIAL_DELETE: 'MATERIAL_DELETE',
  MATERIAL_VIEW: 'MATERIAL_VIEW',
  
  // Wishlist
  WISHLIST_ADD: 'WISHLIST_ADD',
  WISHLIST_REMOVE: 'WISHLIST_REMOVE',
  
  // Messages
  MESSAGE_SEND: 'MESSAGE_SEND',
  MESSAGE_DELETE: 'MESSAGE_DELETE',
  CHAT_CREATE: 'CHAT_CREATE',
  
  // User Profile
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  PROFILE_VIEW: 'PROFILE_VIEW',
  
  // Admin Actions
  USER_REPORT: 'USER_REPORT',
  CONTENT_REPORT: 'CONTENT_REPORT',
  
  // Other
  FILE_UPLOAD: 'FILE_UPLOAD',
  EXPORT_DATA: 'EXPORT_DATA',
  ERROR: 'ERROR'
};

/**
 * Activity Severity Levels
 */
export const ACTIVITY_SEVERITY = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

/**
 * Get user's IP address (approximate - via browser)
 * Note: In production, this should be done server-side
 */
const getClientIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (err) {
    return 'unknown';
  }
};

/**
 * Get device info from user agent
 */
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  return {
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

/**
 * Log activity to Firestore
 * @param {string} userId - User ID
 * @param {string} activityType - Type of activity (from ACTIVITY_TYPES)
 * @param {object} metadata - Additional context data
 * @param {string} severity - Severity level (from ACTIVITY_SEVERITY)
 * @returns {Promise}
 */
export const logActivity = async (userId, activityType, metadata = {}, severity = ACTIVITY_SEVERITY.INFO) => {
  try {
    if (!userId || !activityType) {
      console.error('logActivity requires userId and activityType');
      return null;
    }

    const ipAddress = await getClientIpAddress();
    const deviceInfo = getDeviceInfo();

    const activityData = {
      userId,
      activityType,
      severity,
      timestamp: serverTimestamp(),
      ipAddress,
      deviceInfo,
      metadata,
      // For querying
      date: new Date().toISOString().split('T')[0],
      hour: new Date().getHours()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITY_LOG), activityData);
    
    console.debug(`[Activity Log] ${activityType} for user ${userId}`, metadata);
    
    return docRef.id;
  } catch (err) {
    console.error('Error logging activity:', err);
    return null;
  }
};

/**
 * Log failed authentication attempt
 * @param {string} email - Email or username
 * @param {string} reason - Reason for failure
 */
export const logFailedAuth = async (email, reason = 'INVALID_CREDENTIALS') => {
  try {
    const ipAddress = await getClientIpAddress();
    const deviceInfo = getDeviceInfo();

    await addDoc(collection(db, COLLECTIONS.ACTIVITY_LOG), {
      email,
      activityType: ACTIVITY_TYPES.LOGIN,
      severity: ACTIVITY_SEVERITY.WARNING,
      status: 'FAILED',
      failureReason: reason,
      timestamp: serverTimestamp(),
      ipAddress,
      deviceInfo,
      date: new Date().toISOString().split('T')[0],
      hour: new Date().getHours()
    });

    console.debug(`[Auth Failure] ${reason} for ${email}`);
  } catch (err) {
    console.error('Error logging failed auth:', err);
  }
};

/**
 * Flag suspicious activity
 * @param {string} userId - User ID
 * @param {string} activityType - Type of suspicious activity
 * @param {string} reason - Reason it's flagged as suspicious
 * @param {object} details - Additional details
 */
export const flagSuspiciousActivity = async (userId, activityType, reason, details = {}) => {
  try {
    await addDoc(collection(db, COLLECTIONS.SUSPICIOUS_ACTIVITY), {
      userId,
      activityType,
      reason,
      details,
      timestamp: serverTimestamp(),
      status: 'PENDING', // PENDING, REVIEWED, FALSE_ALARM, CONFIRMED
      reviewed: false,
      reviewedBy: null,
      reviewedAt: null,
      action: null, // ACTION_WARN, ACTION_RESTRICT, ACTION_BAN
      date: new Date().toISOString().split('T')[0]
    });

    console.warn(`[Suspicious Activity] ${reason} for user ${userId}`, details);
  } catch (err) {
    console.error('Error flagging suspicious activity:', err);
  }
};

/**
 * Get activity log for a user
 * @param {string} userId - User ID
 * @param {number} limit - Max results to return
 * @returns {Promise<array>}
 */
export const getUserActivityLog = async (userId, limit = 100) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITY_LOG),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    let activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by timestamp descending
    activities.sort((a, b) => {
      const aTime = a.timestamp?.toMillis?.() || 0;
      const bTime = b.timestamp?.toMillis?.() || 0;
      return bTime - aTime;
    });
    
    return activities.slice(0, limit);
  } catch (err) {
    console.error('Error fetching user activity log:', err);
    return [];
  }
};

/**
 * Get all activity logs for admin dashboard
 * @param {number} limit - Max results
 * @returns {Promise<array>}
 */
export const getAllActivityLogs = async (limit = 500) => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.ACTIVITY_LOG));
    let activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by timestamp descending
    activities.sort((a, b) => {
      const aTime = a.timestamp?.toMillis?.() || 0;
      const bTime = b.timestamp?.toMillis?.() || 0;
      return bTime - aTime;
    });
    
    return activities.slice(0, limit);
  } catch (err) {
    console.error('Error fetching all activity logs:', err);
    return [];
  }
};

/**
 * Get suspicious activities
 * @param {string} status - Filter by status (PENDING, REVIEWED, etc.)
 * @returns {Promise<array>}
 */
export const getSuspiciousActivities = async (status = 'PENDING') => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SUSPICIOUS_ACTIVITY),
      where('status', '==', status)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error fetching suspicious activities:', err);
    return [];
  }
};

/**
 * Get activity logs for a specific date range
 * @param {string} userId - User ID (optional)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<array>}
 */
export const getActivityLogsByDateRange = async (userId, startDate, endDate) => {
  try {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    let q;
    if (userId) {
      q = query(
        collection(db, COLLECTIONS.ACTIVITY_LOG),
        where('userId', '==', userId),
        where('date', '>=', startDateStr),
        where('date', '<=', endDateStr)
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.ACTIVITY_LOG),
        where('date', '>=', startDateStr),
        where('date', '<=', endDateStr)
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error fetching activity logs by date range:', err);
    return [];
  }
};

/**
 * Delete old activity logs (data retention policy)
 * Should be called via scheduled Cloud Function
 * @param {number} retentionDays - Number of days to keep logs
 * @returns {Promise<number>} Number of deleted documents
 */
export const deleteOldActivityLogs = async (retentionDays = 365) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    const q = query(
      collection(db, COLLECTIONS.ACTIVITY_LOG),
      where('date', '<', cutoffDateStr)
    );
    
    const snapshot = await getDocs(q);
    let deletedCount = 0;
    
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
      deletedCount++;
    }
    
    console.log(`Deleted ${deletedCount} old activity logs`);
    return deletedCount;
  } catch (err) {
    console.error('Error deleting old activity logs:', err);
    return 0;
  }
};

/**
 * Get user login history
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @returns {Promise<array>}
 */
export const getUserLoginHistory = async (userId, limit = 50) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITY_LOG),
      where('userId', '==', userId),
      where('activityType', '==', ACTIVITY_TYPES.LOGIN)
    );
    
    const snapshot = await getDocs(q);
    let logins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by timestamp descending
    logins.sort((a, b) => {
      const aTime = a.timestamp?.toMillis?.() || 0;
      const bTime = b.timestamp?.toMillis?.() || 0;
      return bTime - aTime;
    });
    
    return logins.slice(0, limit);
  } catch (err) {
    console.error('Error fetching login history:', err);
    return [];
  }
};

/**
 * Export activity logs to CSV (for compliance/audit)
 * @param {array} activities - Activity logs to export
 * @returns {string} CSV content
 */
export const exportActivityLogsToCSV = (activities) => {
  const headers = ['Date', 'User ID', 'Activity Type', 'Severity', 'IP Address', 'Status', 'Metadata'];
  const rows = activities.map(a => [
    new Date(a.timestamp?.toMillis?.() || 0).toISOString(),
    a.userId || a.email || 'unknown',
    a.activityType,
    a.severity,
    a.ipAddress,
    a.status || 'success',
    JSON.stringify(a.metadata || {})
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  return csv;
};

export default {
  logActivity,
  logFailedAuth,
  flagSuspiciousActivity,
  getUserActivityLog,
  getAllActivityLogs,
  getSuspiciousActivities,
  getActivityLogsByDateRange,
  deleteOldActivityLogs,
  getUserLoginHistory,
  exportActivityLogsToCSV,
  ACTIVITY_TYPES,
  ACTIVITY_SEVERITY
};
