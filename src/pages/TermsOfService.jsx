import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../styles/LegalPages.css';

const TermsOfService = () => {
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
                        Terms of Service
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content */}
                <div className="legal-content space-y-8">
                    <section>
                        <h2>1. Agreement to Terms</h2>
                        <p>
                            These Terms of Service ("Terms") constitute a legal agreement between you and Campus Hub ("Company," "we," "us," or "our"). By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
                        </p>
                    </section>

                    <section>
                        <h2>2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Campus Hub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul>
                            <li>Modifying or copying the materials</li>
                            <li>Using the materials for any commercial purpose or for any public display</li>
                            <li>Attempting to decompile or reverse engineer any software contained on Campus Hub</li>
                            <li>Removing any copyright or other proprietary notations from the materials</li>
                            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                            <li>Engaging in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Disclaimer</h2>
                        <p>
                            The materials on Campus Hub are provided on an 'as is' basis. Campus Hub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section>
                        <h2>4. Limitations</h2>
                        <p>
                            In no event shall Campus Hub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Campus Hub, even if Campus Hub or a Campus Hub authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>

                    <section>
                        <h2>5. Accuracy of Materials</h2>
                        <p>
                            The materials appearing on Campus Hub could include technical, typographical, or photographic errors. Campus Hub does not warrant that any of the materials on its website are accurate, complete, or current. Campus Hub may make changes to the materials contained on its website at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2>6. Materials License</h2>
                        <p>
                            Campus Hub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Campus Hub of the site. Use of any such linked website is at the user's own risk.
                        </p>
                    </section>

                    <section>
                        <h2>7. Modifications</h2>
                        <p>
                            Campus Hub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                        </p>
                    </section>

                    <section>
                        <h2>8. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Campus Hub operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>

                    <section>
                        <h2>9. User Conduct</h2>
                        <p>
                            You agree not to engage in any of the following prohibited conduct:
                        </p>
                        <ul>
                            <li>Harassing, threatening, or intimidating other users</li>
                            <li>Posting false, misleading, or defamatory content</li>
                            <li>Uploading or sharing malware or harmful code</li>
                            <li>Violating intellectual property rights</li>
                            <li>Engaging in fraudulent or deceptive conduct</li>
                            <li>Spamming or sending unsolicited messages</li>
                            <li>Attempting unauthorized access to accounts or systems</li>
                        </ul>
                    </section>

                    <section>
                        <h2>10. Intellectual Property Rights</h2>
                        <p>
                            All content on Campus Hub, including text, graphics, logos, images, and software, is the property of Campus Hub or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or transmit any content without our permission.
                        </p>
                    </section>

                    <section>
                        <h2>11. User-Generated Content</h2>
                        <p>
                            By submitting content (listings, reviews, messages) to Campus Hub, you grant us a non-exclusive, royalty-free license to use, reproduce, modify, and distribute that content. You represent that you own or have the right to use all content you submit.
                        </p>
                    </section>

                    <section>
                        <h2>12. Accounts and Passwords</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You agree to notify Campus Hub immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2>13. Termination</h2>
                        <p>
                            Campus Hub may terminate your account and access to the Services at any time, in our sole discretion, for any reason or no reason, with or without notice.
                        </p>
                    </section>

                    <section>
                        <h2>14. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, Campus Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Services.
                        </p>
                    </section>

                    <section>
                        <h2>15. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <ul>
                            <li><strong>Email:</strong> legal@campushub.com</li>
                            <li><strong>Address:</strong> Campus Hub, Your Institution, City, State</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
