import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import '../styles/LegalPages.css';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate form submission (in production, this would send to a backend)
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Have a question? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Contact Information */}
                    <div className="md:col-span-1">
                        <div className="space-y-8">
                            {/* Email */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <Mail className="text-blue-400" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Email</h3>
                                    <p className="text-gray-400 text-sm">
                                        <a href="mailto:support@campushub.com" className="hover:text-blue-400 transition-colors">
                                            support@campushub.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <Phone className="text-green-400" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Phone</h3>
                                    <p className="text-gray-400 text-sm">
                                        <a href="tel:+1234567890" className="hover:text-green-400 transition-colors">
                                            +1 (234) 567-890
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <MapPin className="text-purple-400" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Address</h3>
                                    <p className="text-gray-400 text-sm">
                                        Campus Hub HQ<br />
                                        University Avenue, Building A<br />
                                        College Station, TX 77840
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Response Time Info */}
                        <div className="mt-12 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <p className="text-blue-300 text-sm">
                                <strong>Response Time:</strong> We typically respond within 24-48 hours during business days.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        {submitted ? (
                            <div className="h-full flex items-center justify-center p-8 bg-green-500/5 border border-green-500/20 rounded-lg">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                        <Send className="text-green-400" size={32} />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-400">
                                        Thank you for reaching out. We'll get back to you soon.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                {/* Name */}
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                {/* Subject */}
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>

                                {/* Message */}
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {/* Privacy Notice */}
                                <p className="text-gray-500 text-xs text-center mt-4">
                                    We respect your privacy. Your information will only be used to respond to your inquiry.
                                    See our <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</a> for more details.
                                </p>
                            </form>
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="border-t border-gray-800 pt-12">
                    <h2 className="text-2xl font-bold text-white mb-8">Common Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                            <h3 className="text-white font-semibold mb-3">What's your response time?</h3>
                            <p className="text-gray-400 text-sm">
                                We typically respond to all inquiries within 24-48 business hours. During peak times, it may take a bit longer.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                            <h3 className="text-white font-semibold mb-3">How can I report a problem?</h3>
                            <p className="text-gray-400 text-sm">
                                Fill out the contact form above with details about your issue. You can also email us directly at support@campushub.com.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                            <h3 className="text-white font-semibold mb-3">Do you have live chat support?</h3>
                            <p className="text-gray-400 text-sm">
                                Currently, we provide support via email and contact form. Live chat support is coming soon.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                            <h3 className="text-white font-semibold mb-3">Can I schedule a call?</h3>
                            <p className="text-gray-400 text-sm">
                                For urgent matters, please mention this in your message and we'll get in touch to schedule a call if needed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
