/**
 * Security Helpers - Input validation, sanitization, and protection
 * Implements OWASP security best practices
 */

import DOMPurify from 'dompurify';

// ==================== INPUT SANITIZATION ====================
/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} dirty - Unsanitized HTML/text
 * @returns {string} Clean HTML
 */
export const sanitizeHtml = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, { 
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize plain text (strip all HTML tags)
 * @param {string} text - Text to sanitize
 * @returns {string} Plain text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

/**
 * Sanitize email addresses
 * @param {string} email - Email to validate/sanitize
 * @returns {string|null} Valid email or null
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed) ? trimmed : null;
};

/**
 * Sanitize URLs to prevent malicious redirects
 * @param {string} url - URL to validate
 * @returns {string|null} Valid URL or null
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const urlObj = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) return null;
    return url;
  } catch {
    return null;
  }
};

// ==================== INPUT VALIDATION ====================
/**
 * Validate and sanitize product listing data
 * @param {object} data - Product data
 * @returns {object|null} Validated data or null
 */
export const validateListing = (data) => {
  if (!data || typeof data !== 'object') return null;

  const errors = [];

  // Title validation: 3-100 chars
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3 || data.title.length > 100) {
    errors.push('Title must be 3-100 characters');
  }

  // Description validation: 10-2000 chars
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10 || data.description.length > 2000) {
    errors.push('Description must be 10-2000 characters');
  }

  // Price validation: positive number
  const price = parseFloat(data.price);
  if (isNaN(price) || price < 0 || price > 1000000) {
    errors.push('Price must be a positive number up to 1,000,000');
  }

  // Category validation
  const validCategories = ['Books', 'Tech & Gear', 'Electronics', 'Furniture', 'Clothing', 'Notes & Papers', 'Calculators', 'Instruments', 'Sports', 'Other'];
  if (!data.category || !validCategories.includes(data.category)) {
    errors.push('Invalid category selected');
  }

  // Image URL validation
  if (data.image && !sanitizeUrl(data.image)) {
    errors.push('Invalid image URL');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: sanitizeText(data.title.trim()),
      description: sanitizeHtml(data.description.trim()),
      price: price,
      category: data.category,
      condition: data.condition || 'Good',
      image: sanitizeUrl(data.image) || '',
      negotiable: Boolean(data.negotiable),
      location: sanitizeText((data.location || '').trim())
    }
  };
};

/**
 * Validate and sanitize message data
 * @param {string} text - Message text
 * @returns {object|null} Validated data or null
 */
export const validateMessage = (text) => {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Message cannot be empty' };
  }

  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Message too long (max 5000 characters)' };
  }

  // Check for spam patterns (excessive repeated characters)
  if (/(.)\1{50,}/.test(trimmed)) {
    return { valid: false, error: 'Message contains invalid patterns' };
  }

  return {
    valid: true,
    data: sanitizeText(trimmed)
  };
};

/**
 * Validate and sanitize user profile data
 * @param {object} data - Profile data
 * @returns {object|null} Validated data or null
 */
export const validateUserProfile = (data) => {
  if (!data || typeof data !== 'object') return null;

  const errors = [];

  // Name validation
  if (data.name && (typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 100)) {
    errors.push('Name must be 2-100 characters');
  }

  // Bio validation
  if (data.bio && (typeof data.bio !== 'string' || data.bio.length > 500)) {
    errors.push('Bio must be 0-500 characters');
  }

  // Phone validation (optional)
  if (data.phone && !/^\+?[0-9\s\-\(\)]{10,}$/.test(data.phone)) {
    errors.push('Invalid phone number');
  }

  // URL validations (optional)
  const urlFields = ['linkedin', 'github', 'twitter', 'website'];
  for (const field of urlFields) {
    if (data[field] && !sanitizeUrl(data[field])) {
      errors.push(`Invalid ${field} URL`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: data.name ? sanitizeText(data.name.trim()) : undefined,
      bio: data.bio ? sanitizeText(data.bio.trim()) : undefined,
      phone: data.phone ? sanitizeText(data.phone.trim()) : undefined,
      linkedin: data.linkedin ? sanitizeUrl(data.linkedin) : undefined,
      github: data.github ? sanitizeUrl(data.github) : undefined,
      twitter: data.twitter ? sanitizeUrl(data.twitter) : undefined,
      website: data.website ? sanitizeUrl(data.website) : undefined
    }
  };
};

/**
 * Validate material/syllabus upload data
 * @param {object} data - Upload data
 * @returns {object|null} Validated data or null
 */
export const validateMaterialUpload = (data) => {
  if (!data || typeof data !== 'object') return null;

  const errors = [];

  // Title validation
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3 || data.title.length > 200) {
    errors.push('Title must be 3-200 characters');
  }

  // URL validation
  if (!data.url || !sanitizeUrl(data.url)) {
    errors.push('Invalid file URL');
  }

  // Year validation
  const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  if (!data.year || !validYears.includes(data.year)) {
    errors.push('Invalid year selected');
  }

  // Branch validation
  const validBranches = ['CSE', 'ECE', 'Civil', 'Mech', 'AIML', 'AI-DS'];
  if (!data.branch || !validBranches.includes(data.branch)) {
    errors.push('Invalid branch selected');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: sanitizeText(data.title.trim()),
      url: sanitizeUrl(data.url),
      year: data.year,
      branch: data.branch,
      description: data.description ? sanitizeText(data.description.trim()) : ''
    }
  };
};

// ==================== RATE LIMITING ====================
/**
 * Simple in-memory rate limiter
 * @param {string} key - Rate limit key (usually user ID or IP)
 * @param {number} maxAttempts - Max attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if within limits
 */
const rateLimitStore = new Map();

export const checkRateLimit = (key, maxAttempts = 10, windowMs = 60000) => {
  const now = Date.now();
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }

  const attempts = rateLimitStore.get(key);
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }

  recentAttempts.push(now);
  rateLimitStore.set(key, recentAttempts);
  
  return true; // Within rate limit
};

/**
 * Reset rate limit for a key
 * @param {string} key - Rate limit key
 */
export const resetRateLimit = (key) => {
  rateLimitStore.delete(key);
};

// ==================== PASSWORD VALIDATION ====================
/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with score and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      score: 0,
      strength: 'Invalid',
      feedback: ['Password is required']
    };
  }

  const feedback = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score++;

  // Character type checks
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[!@#$%^&*]/.test(password)) score++;
  else feedback.push('Include special characters (!@#$%^&*)');

  // Common patterns to avoid
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
  if (commonPatterns.some(p => password.toLowerCase().includes(p))) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid common patterns');
  }

  const strengths = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  
  return {
    score,
    strength: strengths[Math.min(score, 5)],
    feedback
  };
};

// ==================== SECURITY HEADERS ====================
/**
 * Get recommended security headers configuration
 * @returns {object} Headers object
 */
export const getSecurityHeaders = () => ({
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.firebase.com *.firebaseio.com *.gstatic.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' *.firebase.com *.firebaseio.com *.gstatic.com; frame-src 'self' *.firebase.com",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
});

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeEmail,
  sanitizeUrl,
  validateListing,
  validateMessage,
  validateUserProfile,
  validateMaterialUpload,
  checkRateLimit,
  resetRateLimit,
  validatePasswordStrength,
  getSecurityHeaders
};
