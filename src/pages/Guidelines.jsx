import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import '../styles/LegalPages.css';

const Guidelines = () => {
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
                        Community Guidelines
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Help us keep Campus Hub safe, respectful, and trustworthy for everyone.
                    </p>
                </div>

                {/* Content */}
                <div className="legal-content space-y-8">
                    <section>
                        <h2>Our Community Commitment</h2>
                        <p>
                            Campus Hub is built on the foundation of trust, respect, and collaboration. These guidelines help us maintain a positive community where every student feels safe and valued. By using Campus Hub, you agree to follow these guidelines.
                        </p>
                    </section>

                    <section>
                        <h2>1. Be Respectful and Honest</h2>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 mb-6">
                            <div className="flex gap-4">
                                <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-semibold mb-2">DO:</h4>
                                    <ul className="text-gray-300 text-sm space-y-2">
                                        <li>✓ Treat others with kindness and respect</li>
                                        <li>✓ Use accurate, honest descriptions for listings</li>
                                        <li>✓ Communicate professionally in messages</li>
                                        <li>✓ Be truthful in reviews and ratings</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                            <div className="flex gap-4">
                                <XCircle className="text-red-400 flex-shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-semibold mb-2">DON'T:</h4>
                                    <ul className="text-gray-300 text-sm space-y-2">
                                        <li>✗ Harass, threaten, or intimidate anyone</li>
                                        <li>✗ Use offensive, abusive, or discriminatory language</li>
                                        <li>✗ Post misleading or false information</li>
                                        <li>✗ Manipulate prices or reviews</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>2. Listings & Marketplace</h2>
                        <p>
                            Help keep the marketplace clean and trustworthy by following these guidelines when posting or purchasing items.
                        </p>

                        <h3>What You Can Sell:</h3>
                        <ul>
                            <li>Textbooks and study materials</li>
                            <li>Electronics (laptops, calculators, phones)</li>
                            <li>Furniture and household items</li>
                            <li>Clothing and accessories</li>
                            <li>Notes and learning resources</li>
                            <li>Instruments and sports equipment</li>
                            <li>Other legitimate student goods</li>
                        </ul>

                        <h3>What You Cannot Sell:</h3>
                        <ul>
                            <li>Counterfeit or stolen items</li>
                            <li>Weapons or dangerous items</li>
                            <li>Alcohol or tobacco (age-restricted items)</li>
                            <li>Illegal drugs or substances</li>
                            <li>Items violating intellectual property rights</li>
                            <li>Adult or explicit content</li>
                            <li>Items that could harm someone</li>
                        </ul>

                        <h3>Good Listing Practices:</h3>
                        <ul>
                            <li>Use clear, descriptive titles</li>
                            <li>Upload high-quality, accurate photos</li>
                            <li>Provide detailed condition information</li>
                            <li>Be honest about wear, damage, or defects</li>
                            <li>Set fair, realistic prices</li>
                            <li>Respond promptly to inquiries</li>
                            <li>Update your listing status when sold</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Reviews and Ratings</h2>
                        <p>
                            Reviews help build trust in our community. Please leave honest, helpful reviews based on your real experience.
                        </p>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <AlertCircle size={20} className="text-blue-400" />
                                Review Best Practices
                            </h4>
                            <ul className="text-gray-300 space-y-3">
                                <li>• Be specific about what you liked or disliked</li>
                                <li>• Focus on your actual experience with the transaction</li>
                                <li>• Avoid personal attacks or offensive language</li>
                                <li>• Don't mention prices or personal details</li>
                                <li>• Only review after you've received/sold the item</li>
                                <li>• Help others make informed decisions</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2>4. Messages and Communication</h2>
                        <ul>
                            <li>Keep conversations professional and respectful</li>
                            <li>Don't spam or send unsolicited messages</li>
                            <li>Don't ask for personal information beyond what's necessary for the transaction</li>
                            <li>Don't attempt to move transactions off-platform to avoid our protections</li>
                            <li>Report threatening or inappropriate messages immediately</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Safety and Security</h2>
                        <ul>
                            <li>Never share your password with anyone</li>
                            <li>Verify buyer/seller identity before meeting</li>
                            <li>Meet in safe, public locations for transactions</li>
                            <li>Don't share sensitive financial information</li>
                            <li>Report suspicious accounts or activity immediately</li>
                            <li>Use official Campus Hub payment methods only</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Spam and Manipulation</h2>
                        <p>
                            Keep the community clean by avoiding spam and manipulative behavior:
                        </p>
                        <ul>
                            <li>Don't create fake accounts or duplicate listings</li>
                            <li>Don't artificially inflate or deflate prices</li>
                            <li>Don't manipulate reviews or ratings</li>
                            <li>Don't spam messages or post similar listings repeatedly</li>
                            <li>Don't engage in coordinated inauthentic behavior</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Intellectual Property</h2>
                        <ul>
                            <li>Only upload content you own or have permission to share</li>
                            <li>Don't violate copyright or trademark rights</li>
                            <li>Don't share materials that infringe on others' rights</li>
                            <li>Use original descriptions and photos in listings</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Consequences of Violations</h2>
                        <p>
                            We enforce these guidelines to keep our community safe. Violations may result in:
                        </p>
                        <ul>
                            <li><strong>Warning:</strong> First-time minor violations</li>
                            <li><strong>Content Removal:</strong> Inappropriate listings or messages removed</li>
                            <li><strong>Account Suspension:</strong> Temporary ban from platform (7-30 days)</li>
                            <li><strong>Account Termination:</strong> Permanent ban for serious violations</li>
                            <li><strong>Legal Action:</strong> If laws are violated, we may report to authorities</li>
                        </ul>
                    </section>

                    <section>
                        <h2>9. Reporting Violations</h2>
                        <p>
                            If you see something that violates these guidelines, please report it:
                        </p>
                        <ul>
                            <li>Click the "Report" button on listings, reviews, or profiles</li>
                            <li>Email abuse@campushub.com with details and screenshots</li>
                            <li>Contact a moderator if you see urgent safety concerns</li>
                        </ul>
                        <p className="mt-4 text-gray-400 text-sm">
                            Please provide as much detail as possible to help us investigate. All reports are treated confidentially.
                        </p>
                    </section>

                    <section>
                        <h2>10. Questions or Appeals</h2>
                        <p>
                            If your account was suspended or content was removed and you believe it was a mistake, you can appeal:
                        </p>
                        <ul>
                            <li>Email appeals@campushub.com with your account details</li>
                            <li>Explain why you believe the action was incorrect</li>
                            <li>Provide any supporting evidence or context</li>
                        </ul>
                        <p className="mt-4">
                            We'll review your appeal within 48 hours and respond with our decision.
                        </p>
                    </section>

                    <section>
                        <h2>11. Continuous Improvement</h2>
                        <p>
                            These guidelines may be updated as Campus Hub grows and our community evolves. We'll notify you of significant changes via email. Your continued use of Campus Hub means you accept the updated guidelines.
                        </p>
                    </section>

                    <section className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                        <h3 className="text-white font-semibold mb-3">Together, We Build a Better Community</h3>
                        <p className="text-gray-300">
                            Thank you for helping make Campus Hub a safe, respectful, and trustworthy platform. By following these guidelines, you're helping thousands of students have positive, meaningful experiences on our platform.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Guidelines;
