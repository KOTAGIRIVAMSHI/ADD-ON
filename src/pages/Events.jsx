import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Plus, Filter, Search, ChevronRight, Tag } from 'lucide-react';

const DUMMY_EVENTS = [
    {
        id: 1,
        title: "Hacktoberfest 2024 Launch",
        category: "Tech",
        date: "Oct 15, 2024",
        time: "5:00 PM - 8:00 PM",
        location: "Main Auditorium",
        organizer: "GDSC JNTUH",
        attendees: 124,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
        description: "Join us for the kickoff of Hacktoberfest! Learn about open source, make your first pull request, and earn exclusive swag."
    },
    {
        id: 2,
        title: "Inter-Branch Volleyball Finals",
        category: "Sports",
        date: "Oct 18, 2024",
        time: "3:30 PM",
        location: "Indoor Stadium",
        organizer: "Sports Council",
        attendees: 350,
        image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800&h=400",
        description: "The highly anticipated finals between CSE and Mechanical. Come show your support!"
    },
    {
        id: 3,
        title: "Robotics Workshop: Arduino Basics",
        category: "Workshop",
        date: "Oct 20, 2024",
        time: "10:00 AM - 1:00 PM",
        location: "ECE Lab 2",
        organizer: "Robotics Club",
        attendees: 45,
        image: "https://images.unsplash.com/photo-1555661530-68c8e98db4e6?auto=format&fit=crop&q=80&w=800&h=400",
        description: "A hands-on workshop covering the fundamentals of Arduino programming and circuit design."
    },
    {
        id: 4,
        title: "Annual Cultural Fest Needs Volunteers",
        category: "Community",
        date: "Nov 01, 2024",
        time: "All Day",
        location: "Campus Grounds",
        organizer: "Student Union",
        attendees: 80,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800&h=400",
        description: "We're looking for enthusiastic volunteers to help organize and manage the upcoming cultural fest."
    }
];

const CATEGORIES = ['All', 'Tech', 'Sports', 'Workshop', 'Community'];

const Events = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredEvents = DUMMY_EVENTS.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in container mx-auto max-w-7xl relative overflow-hidden">

            <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-primary" size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                    Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Events</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Discover hackathons, club meetings, sports tournaments, and everything happening on campus.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10 w-full">

                {/* Sidebar Filters */}
                <aside className="w-full lg:w-72 flex-shrink-0 card-glass p-6 lg:sticky lg:top-24">
                    <button className="btn-primary w-full flex items-center justify-center gap-2 text-sm mb-8">
                        <Plus size={18} />
                        Host an Event
                    </button>

                    <div className="flex items-center gap-2 mb-6 text-white font-semibold text-lg border-b border-white/10 pb-4">
                        <Filter size={20} className="text-primary" />
                        <h2>Categories</h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`text-left px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-between group ${activeCategory === category
                                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-inner'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <Tag size={16} className={activeCategory === category ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'} />
                                    {category}
                                </span>
                                {activeCategory === category && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Feed */}
                <div className="flex-1 w-full min-h-[500px]">
                    {/* Search Bar */}
                    <div className="relative mb-8 group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by event name or organizer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 text-white rounded-2xl py-4 flex pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder-gray-500 shadow-inner text-lg"
                        />
                    </div>

                    <div className="mb-6 flex justify-between items-center text-sm text-gray-400 px-2 border-b border-white/5 pb-4">
                        <span>Showing <strong className="text-white">{filteredEvents.length}</strong> upcoming events</span>
                    </div>

                    {/* Events List */}
                    <div className="flex flex-col gap-6">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="card-glass overflow-hidden group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row">

                                {/* Image Section */}
                                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0 bg-neutral-900">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                                    {/* Date Badge */}
                                    <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md rounded-lg p-2 text-center border border-white/10 min-w-[60px]">
                                        <div className="text-primary text-xs font-bold uppercase">{event.date.split(' ')[0]}</div>
                                        <div className="text-white text-xl font-bold">{event.date.split(' ')[1].replace(',', '')}</div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute bottom-3 right-3 z-20">
                                        <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex flex-col flex-1 justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors leading-tight">{event.title}</h3>
                                        </div>
                                        <p className="text-primary font-medium text-sm mb-4">by {event.organizer}</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Clock size={16} className="text-gray-500" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <MapPin size={16} className="text-gray-500" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400 sm:col-span-2">
                                                <Users size={16} className="text-gray-500" />
                                                <span>{event.attendees} attending</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                                        <p className="text-gray-400 text-sm line-clamp-1 flex-1 pr-4">{event.description}</p>
                                        <button className="btn-secondary whitespace-nowrap px-4 py-2 text-sm group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredEvents.length === 0 && (
                            <div className="card-glass p-16 text-center rounded-2xl border-dashed border-white/10 flex-grow flex flex-col items-center justify-center">
                                <Search className="text-gray-600 mb-6" size={56} />
                                <h3 className="text-2xl text-white font-semibold mb-3">No events found</h3>
                                <p className="text-gray-400 max-w-md mx-auto mb-8">Try adjusting your search terms or category filter to find what you're looking for.</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;
