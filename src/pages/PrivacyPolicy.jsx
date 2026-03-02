import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/LegalPages.css';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

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
                        Privacy Policy
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="legal-content space-y-8">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Campus Hub ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                        </p>
                        <p>
                            Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Services.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <h3>2.1 Information You Provide Directly</h3>
                        <ul>
                            <li><strong>Account Registration:</strong> When you create an account, we collect your name, email address, phone number, campus affiliation, and profile picture.</li>
                            <li><strong>Listings & Posts:</strong> When you create listings or posts, we collect the content, images, pricing, and location information you provide.</li>
                            <li><strong>Communications:</strong> When you message other users, we store the content of your messages.</li>
                            <li><strong>Reviews & Ratings:</strong> When you submit reviews, we collect your ratings, review text, and associated metadata.</li>
                            <li><strong>Payment Information:</strong> If applicable, payment details are processed securely through third-party payment processors.</li>
                        </ul>

                        <h3>2.2 Information Collected Automatically</h3>
                        <ul>
                            <li><strong>Device Information:</strong> Browser type, device type, operating system, IP address.</li>
                            <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, searches, listings viewed.</li>
                            <li><strong>Location Data:</strong> Approximate location based on IP address (not precise GPS).</li>
                            <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance your experience.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li>Providing, maintaining, and improving our Services</li>
                            <li>Processing transactions and sending related information</li>
                            <li>Sending promotional communications (with your consent)</li>
                            <li>Responding to your inquiries and providing customer support</li>
                            <li>Monitoring and analyzing trends, usage, and activities</li>
                            <li>Detecting, preventing, and addressing technical issues and fraud</li>
                            <li>Personalizing your experience and content recommendations</li>
                            <li>Complying with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. How We Share Your Information</h2>
                        <p>We may share your information in the following circumstances:</p>
                        <ul>
                            <li><strong>With Other Users:</strong> Your profile information and listings are visible to other users to facilitate transactions.</li>
                            <li><strong>With Service Providers:</strong> We share information with third parties who assist in operating our website and conducting our business (hosting, analytics, payment processing).</li>
                            <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety.</li>
                            <li><strong>Business Transfers:</strong> If Campus Hub is merged, acquired, or sold, your information may be transferred as part of that transaction.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, and destruction. However, no method of transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2>6. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as your account is active or as needed to provide you with Services. You can request deletion of your data at any time, subject to certain legal and operational constraints.
                        </p>
                    </section>

                    <section>
                        <h2>7. Your Rights and Choices</h2>
                        <p>Depending on your location, you may have the following rights:</p>
                        <ul>
                            <li><strong>Access:</strong> You have the right to access your personal information</li>
                            <li><strong>Correction:</strong> You can update or correct your information</li>
                            <li><strong>Deletion:</strong> You can request deletion of your data</li>
                            <li><strong>Opt-Out:</strong> You can opt out of promotional communications</li>
                            <li><strong>Data Portability:</strong> You can request a copy of your data</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies to enhance your experience. You can control cookie preferences through your browser settings. However, disabling cookies may affect the functionality of our Services.
                        </p>
                    </section>

                    <section>
                        <h2>9. Third-Party Links</h2>
                        <p>
                            Our Services may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2>10. Children's Privacy</h2>
                        <p>
                            Our Services are not intended for children under 13. We do not knowingly collect information from children under 13. If we learn we have collected such information, we will delete it promptly.
                        </p>
                    </section>

                    <section>
                        <h2>11. Updates to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting the updated policy on our website with an updated "Last Updated" date.
                        </p>
                    </section>

                    <section>
                        <h2>12. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                        </p>
                        <ul>
                            <li><strong>Email:</strong> privacy@campushub.com</li>
                            <li><strong>Address:</strong> Campus Hub, Your Institution, City, State</li>
                            <li><strong>Phone:</strong> +1 (XXX) XXX-XXXX</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
