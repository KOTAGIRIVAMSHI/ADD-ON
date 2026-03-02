import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Zap, Shield, Sparkles } from 'lucide-react';
import '../styles/LegalPages.css';

const AboutUs = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: Users,
            title: 'Community-Driven',
            description: 'Built by students, for students. Our platform connects you with peers in your campus community.'
        },
        {
            icon: Zap,
            title: 'Fast & Efficient',
            description: 'Lightning-fast performance with real-time updates, instant messaging, and seamless transactions.'
        },
        {
            icon: Shield,
            title: 'Safe & Secure',
            description: 'Your data is protected with enterprise-grade security, verified reviews, and activity monitoring.'
        },
        {
            icon: Sparkles,
            title: 'Modern Design',
            description: 'Beautiful, intuitive interface designed for mobile and desktop. A joy to use.'
        }
    ];

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
                        About Campus Hub
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Empowering students with a modern marketplace for books, gear, and knowledge.
                    </p>
                </div>

                {/* Content */}
                <div className="legal-content space-y-12">
                    <section>
                        <h2>Our Mission</h2>
                        <p>
                            Campus Hub is on a mission to make campus life easier and more connected. We believe that buying and selling shouldn't require leaving your campus, and that students should have a safe, efficient platform to share resources, knowledge, and gear with their peers.
                        </p>
                        <p>
                            By removing friction from student commerce and collaboration, we enable more focus on what matters: academics, friendships, and personal growth.
                        </p>
                    </section>

                    <section>
                        <h2>Why We Built This</h2>
                        <p>
                            Campus life throws unique challenges at students. You need textbooks but don't want to pay full price. You've outgrown that calculator. Your roommate is looking for study materials. Traditional marketplaces don't understand campus dynamics.
                        </p>
                        <p>
                            We built Campus Hub to solve these problems with a platform specifically designed for campus communities. Fast, local, trustworthy, and built by students who understand your needs.
                        </p>
                    </section>

                    {/* Features Grid */}
                    <section>
                        <h2 className="mb-8">Why Choose Campus Hub?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="card-glass p-6 rounded-lg"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                                <Icon size={24} className="text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                                <p className="text-gray-400 text-sm">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h2>What We Offer</h2>
                        <ul>
                            <li><strong>Marketplace:</strong> Buy and sell textbooks, electronics, furniture, and more with other students in your campus community.</li>
                            <li><strong>Study Materials:</strong> Share and discover study notes, past papers, and learning resources.</li>
                            <li><strong>Events:</strong> Connect with peers at campus events and networking opportunities.</li>
                            <li><strong>Ride Sharing:</strong> Coordinate rides with other students for a safe and affordable commute.</li>
                            <li><strong>Direct Messaging:</strong> Communicate securely with sellers, buyers, and friends.</li>
                            <li><strong>Ratings & Reviews:</strong> Build trust through verified reviews and community feedback.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Our Values</h2>
                        <ul>
                            <li><strong>Trust:</strong> We prioritize safety, security, and transparent practices.</li>
                            <li><strong>Community:</strong> We celebrate the diversity and collaboration that makes campus unique.</li>
                            <li><strong>Innovation:</strong> We continuously improve our platform with student feedback.</li>
                            <li><strong>Accessibility:</strong> We make our platform free and easy to use for all students.</li>
                            <li><strong>Integrity:</strong> We operate with honesty and hold ourselves accountable.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Our Team</h2>
                        <p>
                            Campus Hub was founded by a group of students who experienced the frustration of inefficient campus commerce firsthand. We've grown into a dedicated team passionate about making campus life better for everyone.
                        </p>
                        <p>
                            Our team includes developers, designers, and students who understand the unique needs of campus communities. We're constantly working to improve Campus Hub based on your feedback.
                        </p>
                    </section>

                    <section>
                        <h2>Growth & Impact</h2>
                        <p>
                            Since our launch, Campus Hub has:
                        </p>
                        <ul>
                            <li>Connected thousands of students across campus</li>
                            <li>Facilitated millions of rupees in peer-to-peer transactions</li>
                            <li>Received 4.8+ star ratings from our community</li>
                            <li>Expanded to multiple departments and areas</li>
                            <li>Built a trusted, safe community with verified reviews</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Looking Ahead</h2>
                        <p>
                            We're excited about the future of Campus Hub. We're working on new features like advanced search, real-time notifications, and analytics to help you make smarter decisions.
                        </p>
                        <p>
                            Our vision is to become the go-to platform for all student needs — not just buying and selling, but connecting, learning, and growing together as a community.
                        </p>
                    </section>

                    <section>
                        <h2>Join Us</h2>
                        <p>
                            Whether you're looking to buy, sell, or connect with fellow students, Campus Hub is here for you. We're honored to be part of your campus community and look forward to serving you.
                        </p>
                        <p>
                            Have feedback? Ideas? We'd love to hear from you. Reach out anytime at <strong>hello@campushub.com</strong>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
