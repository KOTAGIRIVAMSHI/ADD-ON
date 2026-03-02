/**
 * Security Configuration
 * Central security settings and best practices
 */

// Content Security Policy Configuration
export const CSP_CONFIG = {
    'default-src': ["'self'"],
    'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for React dev tools, should be removed in production
        "'unsafe-eval'", // Required for some Firebase features
        '*.firebase.com',
        '*.firebaseio.com',
        '*.gstatic.com'
    ],
    'style-src': [
        "'self'",
        "'unsafe-inline'", // Tailwind requires this
        'fonts.googleapis.com'
    ],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'fonts.gstatic.com'],
    'connect-src': [
        "'self'",
        '*.firebase.com',
        '*.firebaseio.com',
        '*.gstatic.com'
    ],
    'frame-src': ["'self'", '*.firebase.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
};

// CORS Configuration
export const CORS_CONFIG = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

// Security Headers
export const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Rate Limiting Configuration
export const RATE_LIMITS = {
    // Authentication endpoints
    LOGIN: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000 // 15 minutes
    },
    REGISTER: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000 // 1 hour
    },
    PASSWORD_RESET: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000 // 1 hour
    },
    
    // General API endpoints
    LIST_CREATE: {
        maxAttempts: 20,
        windowMs: 60 * 60 * 1000 // 20 listings per hour
    },
    MESSAGE_SEND: {
        maxAttempts: 50,
        windowMs: 60 * 1000 // 50 messages per minute
    },
    PROFILE_UPDATE: {
        maxAttempts: 10,
        windowMs: 60 * 60 * 1000 // 10 updates per hour
    },
    
    // File uploads
    FILE_UPLOAD: {
        maxAttempts: 5,
        windowMs: 60 * 60 * 1000 // 5 uploads per hour
    },
    
    // Search endpoints
    SEARCH: {
        maxAttempts: 100,
        windowMs: 60 * 1000 // 100 searches per minute
    }
};

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_TYPES: [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif'
    ],
    ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif']
};

// Password Policy
export const PASSWORD_POLICY = {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
    SPECIAL_CHARS: '!@#$%^&*-+=_[]{}|:;<>,.?/',
    MAX_AGE_DAYS: 90,
    HISTORY: 5 // Prevent reusing last 5 passwords
};

// Session Configuration
export const SESSION_CONFIG = {
    IDLE_TIMEOUT_MINUTES: 30,
    MAX_SESSION_DURATION_HOURS: 24,
    WARN_BEFORE_TIMEOUT_MINUTES: 5
};

// Data Retention Configuration
export const DATA_RETENTION = {
    LOGS: 90, // days
    CHATS: 365, // days
    NOTIFICATIONS: 90, // days
    AUDIT_TRAIL: 365 // days
};

// Suspicious Activity Thresholds
export const SUSPICIOUS_ACTIVITY_THRESHOLDS = {
    FAILED_LOGINS: 5,
    FAILED_LOGINS_WINDOW_MINUTES: 15,
    PASSWORD_RESET_ATTEMPTS: 3,
    PASSWORD_RESET_WINDOW_HOURS: 1,
    RAPID_DATA_EXPORT: 10,
    RAPID_DATA_EXPORT_WINDOW_MINUTES: 5
};

// Feature Flags for Security
export const SECURITY_FEATURES = {
    REQUIRE_EMAIL_VERIFICATION: true,
    ENABLE_ACCOUNT_LOCKOUT: true,
    ENABLE_SUSPICIOUS_ACTIVITY_DETECTION: true,
    REQUIRE_STRONG_PASSWORDS: true,
    ENABLE_SESSION_TIMEOUT: true,
    ENABLE_ACTIVITY_LOGGING: true,
    ENABLE_RATE_LIMITING: true
};

// Encryption Configuration
export const ENCRYPTION_CONFIG = {
    ALGORITHM: 'AES-256-GCM',
    KEY_DERIVATION: 'PBKDF2',
    ITERATIONS: 100000,
    SALT_LENGTH: 32
};

// API Security Configuration
export const API_SECURITY = {
    TIMEOUT_MS: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
    ENABLE_REQUEST_SIGNING: false,
    ENABLE_REQUEST_ID_TRACKING: true
};

// Firestore Security Configuration
export const FIRESTORE_SECURITY = {
    MAX_DOCUMENT_SIZE: 1024 * 1024, // 1MB
    MAX_BATCH_SIZE: 500,
    ENABLE_FIELD_ENCRYPTION: true,
    SENSITIVE_FIELDS: [
        'email',
        'phone',
        'password',
        'creditCard',
        'ssn'
    ]
};

export default {
    CSP_CONFIG,
    CORS_CONFIG,
    SECURITY_HEADERS,
    RATE_LIMITS,
    FILE_UPLOAD_CONFIG,
    PASSWORD_POLICY,
    SESSION_CONFIG,
    DATA_RETENTION,
    SUSPICIOUS_ACTIVITY_THRESHOLDS,
    SECURITY_FEATURES,
    ENCRYPTION_CONFIG,
    API_SECURITY,
    FIRESTORE_SECURITY
};
