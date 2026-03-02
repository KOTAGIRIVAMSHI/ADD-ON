import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import '../styles/LegalPages.css';

const FAQ = () => {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);

    const faqs = [
        {
            id: 1,
            category: 'Getting Started',
            question: 'How do I create an account?',
            answer: 'Click the "Sign Up" button on the homepage. Enter your email, set a password, and verify your campus affiliation. You\'ll be ready to use Campus Hub in minutes!'
        },
        {
            id: 2,
            category: 'Getting Started',
            question: 'Is Campus Hub free to use?',
            answer: 'Yes! Campus Hub is completely free. There are no membership fees or hidden charges. You can buy, sell, and interact with the community at no cost.'
        },
        {
            id: 3,
            category: 'Buying & Selling',
            question: 'How do I post a listing?',
            answer: 'Go to the Marketplace, click "Post an Item", fill in your item details (title, price, category, photos), and click "Post Listing". Your item will be live immediately!'
        },
        {
            id: 4,
            category: 'Buying & Selling',
            question: 'How do I buy something?',
            answer: 'Browse the Marketplace, click on an item you like, and click "Contact Seller". You can then negotiate and arrange pickup directly through our messaging system.'
        },
        {
            id: 5,
            category: 'Buying & Selling',
            question: 'Can I negotiate prices?',
            answer: 'Absolutely! Many sellers mark their items as "Negotiable". You can discuss pricing directly with sellers through the messaging feature.'
        },
        {
            id: 6,
            category: 'Buying & Selling',
            question: 'How do I mark an item as sold?',
            answer: 'Once you\'ve sold an item, you can mark it as "Sold" from your listings. This removes it from search results so other buyers don\'t contact you about it.'
        },
        {
            id: 7,
            category: 'Reviews & Safety',
            question: 'How do reviews work?',
            answer: 'After a transaction, you can leave a 1-5 star review of the buyer/seller. Reviews help build trust and credibility in the community. All reviews are moderated before posting.'
        },
        {
            id: 8,
            category: 'Reviews & Safety',
            question: 'Is my personal information safe?',
            answer: 'Yes. We use enterprise-grade encryption and security measures to protect your data. Your password is never stored in plain text, and your payment information is processed securely.'
        },
        {
            id: 9,
            category: 'Reviews & Safety',
            question: 'What if someone is being inappropriate?',
            answer: 'Report the user immediately by clicking the "Report" button on their profile or in the message thread. Our moderation team will investigate and take action.'
        },
        {
            id: 10,
            category: 'Features',
            question: 'Can I save items for later?',
            answer: 'Yes! Click the heart icon on any listing to add it to your Saved Items. You can view all your saved items from your wishlist at any time.'
        },
        {
            id: 11,
            category: 'Features',
            question: 'How do I search for specific items?',
            answer: 'Use the search bar on the Marketplace. You can filter by category, condition, price range, and location to find exactly what you need.'
        },
        {
            id: 12,
            category: 'Features',
            question: 'Can I upload multiple photos for my listing?',
            answer: 'Currently, you can upload one featured image. We recommend taking a clear, well-lit photo of your item to attract more buyers.'
        },
        {
            id: 13,
            category: 'Study Materials',
            question: 'How do I upload study materials?',
            answer: 'Go to Study Materials, click "Upload", add a title and description, select your branch and year, and upload your file. Your material will be available instantly.'
        },
        {
            id: 14,
            category: 'Study Materials',
            question: 'Can I download materials for free?',
            answer: 'Yes! All study materials on Campus Hub are free to download. We believe in making education accessible and collaborative.'
        },
        {
            id: 15,
            category: 'Events',
            question: 'How do I find events?',
            answer: 'Visit the Events section to see all upcoming campus events. You can filter by date, category, and search for specific events.'
        },
        {
            id: 16,
            category: 'Events',
            question: 'How do I register for events?',
            answer: 'Click on an event and click "Register". You\'ll receive confirmation and event updates. Event organizers can see your registration.'
        },
        {
            id: 17,
            category: 'Ride Sharing',
            question: 'How do I find a ride?',
            answer: 'Go to Ride Sharing and browse available rides. Filter by destination and time. Click on a ride to contact the driver and confirm your spot.'
        },
        {
            id: 18,
            category: 'Ride Sharing',
            question: 'Can I offer a ride?',
            answer: 'Yes! Click "Offer a Ride", enter your departure location, destination, time, and available seats. Other students can then book your ride.'
        },
        {
            id: 19,
            category: 'Messages',
            question: 'Can I message other users?',
            answer: 'Yes! You can message any user by clicking "Contact" on their profile or a listing. Messages are real-time and secure.'
        },
        {
            id: 20,
            category: 'Account',
            question: 'How do I edit my profile?',
            answer: 'Go to your Profile page and click "Edit". Update your name, avatar, bio, or any other information. Changes are saved instantly.'
        },
        {
            id: 21,
            category: 'Account',
            question: 'Can I delete my account?',
            answer: 'Yes. Go to Settings and click "Delete Account". Your data will be permanently removed. Note: Completed transactions cannot be undone.'
        },
        {
            id: 22,
            category: 'Account',
            question: 'What if I forgot my password?',
            answer: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a link to reset your password. The link expires in 24 hours.'
        },
        {
            id: 23,
            category: 'Support',
            question: 'How do I contact support?',
            answer: 'Email us at support@campushub.com or use the Contact page. Our team typically responds within 24 hours.'
        },
        {
            id: 24,
            category: 'Support',
            question: 'I found a bug. How do I report it?',
            answer: 'Send us an email at bugs@campushub.com with details about the issue. Include screenshots if possible. We appreciate your help making Campus Hub better!'
        }
    ];

    const categories = [...new Set(faqs.map(faq => faq.category))];

    const FAQItem = ({ faq }) => (
        <div
            className="faq-item card-glass rounded-lg overflow-hidden mb-4 transition-all"
            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
        >
            <div className="faq-question cursor-pointer p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <h3 className="text-white font-semibold text-lg pr-4">{faq.question}</h3>
                <ChevronDown
                    size={20}
                    className={`text-primary flex-shrink-0 transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                    }`}
                />
            </div>
            {expandedId === faq.id && (
                <div className="faq-answer border-t border-white/10 p-6 bg-black/20">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
            )}
        </div>
    );

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
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Find answers to common questions about Campus Hub.
                    </p>
                </div>

                {/* FAQ Sections */}
                <div className="space-y-12">
                    {categories.map(category => (
                        <section key={category}>
                            <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
                            <div className="space-y-3">
                                {faqs
                                    .filter(faq => faq.category === category)
                                    .map(faq => (
                                        <FAQItem key={faq.id} faq={faq} />
                                    ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Still have questions section */}
                <div className="mt-16 p-8 card-glass rounded-lg text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
                    <p className="text-gray-400 mb-6">
                        Can't find what you're looking for? Contact our support team and we'll be happy to help.
                    </p>
                    <a
                        href="mailto:support@campushub.com"
                        className="inline-block btn-primary px-6 py-3"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
