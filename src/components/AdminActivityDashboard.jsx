import React, { useState, useEffect } from 'react';
import { getAllActivityLogs, getSuspiciousActivities, ACTIVITY_TYPES, ACTIVITY_SEVERITY } from '../utils/activityLogger';
import AdminReviewModeration from './AdminReviewModeration';
import '../styles/AdminActivityDashboard.css';

const AdminActivityDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [suspiciousActivities, setSuspiciousActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('activities');
    const [filterType, setFilterType] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('');
    const [sortBy, setSortBy] = useState('timestamp');
    const [searchUserId, setSearchUserId] = useState('');

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const [allLogs, suspiciousLogs] = await Promise.all([
                getAllActivityLogs(500),
                getSuspiciousActivities('PENDING')
            ]);
            setActivities(allLogs || []);
            setSuspiciousActivities(suspiciousLogs || []);
        } catch (error) {
            console.error('Failed to load activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterActivities = (activityList) => {
        let filtered = activityList;

        if (searchUserId) {
            filtered = filtered.filter(activity =>
                activity.userId?.toLowerCase().includes(searchUserId.toLowerCase())
            );
        }

        if (filterType && activeTab === 'activities') {
            filtered = filtered.filter(activity => activity.activityType === filterType);
        }

        if (filterSeverity && activeTab === 'activities') {
            filtered = filtered.filter(activity => activity.severity === filterSeverity);
        }

        return filtered.sort((a, b) => {
            const aTime = a.timestamp?.toDate?.()?.getTime?.() || 0;
            const bTime = b.timestamp?.toDate?.()?.getTime?.() || 0;
            return sortBy === 'timestamp' ? bTime - aTime : aTime - bTime;
        });
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case ACTIVITY_SEVERITY.CRITICAL:
                return '#dc3545';
            case ACTIVITY_SEVERITY.WARNING:
                return '#ffc107';
            case ACTIVITY_SEVERITY.INFO:
                return '#17a2b8';
            default:
                return '#6c757d';
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleString();
        } catch {
            return 'N/A';
        }
    };

    const getActivityTypeLabel = (type) => {
        const labels = {
            [ACTIVITY_TYPES.LOGIN]: 'Login',
            [ACTIVITY_TYPES.LOGOUT]: 'Logout',
            [ACTIVITY_TYPES.SIGNUP]: 'Sign Up',
            [ACTIVITY_TYPES.PASSWORD_CHANGE]: 'Password Changed',
            [ACTIVITY_TYPES.PASSWORD_RESET_REQUEST]: 'Password Reset',
            [ACTIVITY_TYPES.ACCOUNT_LOCKED]: 'Account Locked',
            [ACTIVITY_TYPES.LISTING_CREATE]: 'Listing Created',
            [ACTIVITY_TYPES.LISTING_UPDATE]: 'Listing Updated',
            [ACTIVITY_TYPES.LISTING_DELETE]: 'Listing Deleted',
            [ACTIVITY_TYPES.LISTING_VIEW]: 'Listing Viewed',
            [ACTIVITY_TYPES.LISTING_MARK_SOLD]: 'Listing Marked Sold',
            [ACTIVITY_TYPES.REVIEW_SUBMIT]: 'Review Submitted',
            [ACTIVITY_TYPES.REVIEW_APPROVED]: 'Review Approved',
            [ACTIVITY_TYPES.REVIEW_REJECTED]: 'Review Rejected',
            [ACTIVITY_TYPES.REVIEW_DELETE]: 'Review Deleted',
            [ACTIVITY_TYPES.REVIEW_HELPFUL]: 'Review Marked Helpful',
            [ACTIVITY_TYPES.REVIEW_UNHELPFUL]: 'Review Marked Unhelpful',
            [ACTIVITY_TYPES.MATERIAL_UPLOAD]: 'Material Uploaded',
            [ACTIVITY_TYPES.MATERIAL_UPDATE]: 'Material Updated',
            [ACTIVITY_TYPES.MATERIAL_DELETE]: 'Material Deleted',
            [ACTIVITY_TYPES.MATERIAL_VIEW]: 'Material Viewed',
            [ACTIVITY_TYPES.WISHLIST_ADD]: 'Added to Wishlist',
            [ACTIVITY_TYPES.WISHLIST_REMOVE]: 'Removed from Wishlist',
            [ACTIVITY_TYPES.MESSAGE_SEND]: 'Message Sent',
            [ACTIVITY_TYPES.MESSAGE_DELETE]: 'Message Deleted',
            [ACTIVITY_TYPES.CHAT_CREATE]: 'Chat Created',
            [ACTIVITY_TYPES.PROFILE_UPDATE]: 'Profile Updated',
            [ACTIVITY_TYPES.USER_REPORT]: 'User Report',
            [ACTIVITY_TYPES.FILE_UPLOAD]: 'File Uploaded',
            [ACTIVITY_TYPES.EXPORT_DATA]: 'Data Exported',
            [ACTIVITY_TYPES.ERROR]: 'Error Occurred'
        };
        return labels[type] || type;
    };

    const ActivityRow = ({ activity, isSuspicious = false }) => (
        <tr className="activity-row">
            <td className="user-cell">{activity.userId}</td>
            <td className="type-cell">{getActivityTypeLabel(activity.activityType)}</td>
            <td className="timestamp-cell">{formatTimestamp(activity.timestamp)}</td>
            <td className="ip-cell">{activity.ipAddress || 'N/A'}</td>
            <td className="device-cell">{activity.deviceInfo?.userAgent?.substring(0, 30) || 'N/A'}...</td>
            {!isSuspicious && (
                <td>
                    <span
                        className="severity-badge"
                        style={{ backgroundColor: getSeverityColor(activity.severity) }}
                    >
                        {activity.severity}
                    </span>
                </td>
            )}
            {isSuspicious && (
                <td className="reason-cell">{activity.reason}</td>
            )}
            <td className="status-cell">{activity.status || 'PENDING'}</td>
        </tr>
    );

    const filteredAll = filterActivities(activities);
    const filteredSuspicious = filterActivities(suspiciousActivities);

    const currentData = activeTab === 'all' ? filteredAll : filteredSuspicious;

    return (
        <div className="admin-activity-dashboard">
            <div className="dashboard-header">
                <h1>Activity Log Dashboard</h1>
                <button className="refresh-btn" onClick={loadActivities} disabled={loading}>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activities')}
                >
                    All Activities ({filteredAll.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'suspicious' ? 'active' : ''}`}
                    onClick={() => setActiveTab('suspicious')}
                >
                    Suspicious Activities ({filteredSuspicious.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Review Moderation
                </button>
            </div>

            <div className="filters-section">
                {activeTab !== 'reviews' && (
                    <>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by User ID..."
                            value={searchUserId}
                            onChange={(e) => setSearchUserId(e.target.value)}
                        />

                        {activeTab === 'activities' && (
                            <>
                                <select
                                    className="filter-select"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="">All Activity Types</option>
                                    {Object.values(ACTIVITY_TYPES).map((type) => (
                                        <option key={type} value={type}>
                                            {getActivityTypeLabel(type)}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="filter-select"
                                    value={filterSeverity}
                                    onChange={(e) => setFilterSeverity(e.target.value)}
                                >
                                    <option value="">All Severity Levels</option>
                                    <option value={ACTIVITY_SEVERITY.INFO}>Info</option>
                                    <option value={ACTIVITY_SEVERITY.WARNING}>Warning</option>
                                    <option value={ACTIVITY_SEVERITY.CRITICAL}>Critical</option>
                                </select>
                            </>
                        )}

                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="timestamp">Newest First</option>
                            <option value="timestamp_asc">Oldest First</option>
                        </select>
                    </>
                )}
            </div>

            <div className="table-container">
                {activeTab === 'reviews' ? (
                    <AdminReviewModeration />
                ) : (
                    <>
                        {loading ? (
                            <div className="loading">Loading activities...</div>
                        ) : currentData.length === 0 ? (
                            <div className="empty-state">No activities found</div>
                        ) : (
                            <table className="activities-table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Activity Type</th>
                                        <th>Timestamp</th>
                                        <th>IP Address</th>
                                        <th>Device</th>
                                        {activeTab === 'activities' ? (
                                            <th>Severity</th>
                                        ) : (
                                            <th>Reason</th>
                                        )}
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((activity, idx) => (
                                        <ActivityRow
                                            key={idx}
                                            activity={activity}
                                            isSuspicious={activeTab === 'suspicious'}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>

            {activeTab !== 'reviews' && (
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Activities</h3>
                        <p className="stat-value">{activities.length}</p>
                    </div>
                    <div className="stat-card warning">
                        <h3>Suspicious Activities</h3>
                        <p className="stat-value">{suspiciousActivities.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Critical Events</h3>
                        <p className="stat-value">
                            {activities.filter(a => a.severity === ACTIVITY_SEVERITY.CRITICAL).length}
                        </p>
                    </div>
                    <div className="stat-card">
                        <h3>Unique Users</h3>
                        <p className="stat-value">
                            {new Set(activities.map(a => a.userId)).size}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminActivityDashboard;
