import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, MapPin, Clock, Users, Plus, Filter, Search, ChevronRight, Tag, X, Loader2, UserCheck, UserPlus, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbHelpers } from '../utils/dbHelpers';
import ImageUpload from '../components/ImageUpload';

const CATEGORIES = ['All', 'Tech', 'Sports', 'Workshop', 'Community'];

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [registering, setRegistering] = useState(null);

    // Load events
    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await dbHelpers.getUpcomingEvents(50);
                setEvents(data);
            } catch (err) {
                console.error('Error loading events:', err);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        category: 'Tech',
        date: '',
        time: '',
        location: '',
        description: '',
        seats: '',
        image: ''
    });

    const handleRegister = async (event) => {
        if (!user) {
            alert("Please sign in to register for events!");
            return;
        }

        setRegistering(event.id);
        try {
            await dbHelpers.registerForEvent(event.id, user.uid);
            const data = await dbHelpers.getUpcomingEvents(50);
            setEvents(data);
            alert("Successfully registered! See you there.");
        } catch (err) {
            alert(err.message || "Failed to register. Try again.");
        } finally {
            setRegistering(null);
        }
    };

    const handleUnregister = async (event) => {
        if (!user) return;
        
        if (!confirm("Are you sure you want to cancel your registration?")) return;

        setRegistering(event.id);
        try {
            await dbHelpers.unregisterFromEvent(event.id, user.uid);
            const data = await dbHelpers.getUpcomingEvents(50);
            setEvents(data);
        } catch (err) {
            alert(err.message || "Failed to unregister. Try again.");
        } finally {
            setRegistering(null);
        }
    };

    const isRegistered = (event) => {
        return user && event.registeredUsers?.includes(user.uid);
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleHostEvent = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please sign in to host an event!");
            return;
        }

        try {
            await dbHelpers.createEvent({
                title: newEvent.title,
                category: newEvent.category,
                date: newEvent.date,
                time: newEvent.time,
                location: newEvent.location,
                description: newEvent.description,
                seats: newEvent.seats ? parseInt(newEvent.seats) : 0,
                organizerName: user.name,
                organizerId: user.uid,
                image: newEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=400'
            });

            setIsModalOpen(false);
            setNewEvent({ title: '', category: 'Tech', date: '', time: '', location: '', description: '', seats: '', image: '' });
            
            // Refresh events
            const data = await dbHelpers.getUpcomingEvents(50);
            setEvents(data);
        } catch (err) {
            console.error(err);
            alert("Failed to post event. Try again.");
        }
    };

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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm mb-8"
                    >
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 size={48} className="text-primary animate-spin" />
                            <p className="text-gray-400 font-medium">Fetching campus events...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {filteredEvents.map(event => (
                                <div key={event.id} className="card-glass overflow-hidden group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row">

                                    {/* Image Section */}
                                    <div className="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0 bg-neutral-900">
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                                        {/* Date Badge */}
                                        <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md rounded-lg p-2 text-center border border-white/10 min-w-[60px]">
                                            <div className="text-primary text-xs font-bold uppercase">{event.date?.split(' ')[0] || 'TBD'}</div>
                                            <div className="text-white text-xl font-bold">{event.date?.split(' ')[1]?.replace(',', '') || event.date}</div>
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
                                                    <span>{event.registeredUsers?.length || 0} attending</span>
                                                    {event.seats && <span className="text-gray-600">• {event.seats} spots</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                                            <p className="text-gray-400 text-sm line-clamp-1 flex-1 pr-4">{event.description}</p>
                                            <button onClick={() => setSelectedEvent(event)} className="btn-secondary whitespace-nowrap px-4 py-2 text-sm group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all">
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
                    )}
                </div>
            </div>

            {/* Event Details Modal */}
            {selectedEvent && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
                    <div className="card-glass w-full max-w-2xl bg-neutral-900 overflow-hidden flex flex-col shadow-2xl relative animate-[slide-up_0.3s_ease-out]">
                        <div className="relative h-48 overflow-hidden">
                            <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-4">
                                <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">{selectedEvent.category}</span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                            <p className="text-primary font-medium text-sm mb-4">by {selectedEvent.organizer}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar size={16} className="text-gray-500" />
                                    <span>{selectedEvent.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={16} className="text-gray-500" />
                                    <span>{selectedEvent.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 col-span-2">
                                    <MapPin size={16} className="text-gray-500" />
                                    <span>{selectedEvent.location}</span>
                                </div>
                            </div>
                            
                            {selectedEvent.description && (
                                <div className="mb-6">
                                    <h3 className="text-white font-semibold mb-2">About</h3>
                                    <p className="text-gray-400 text-sm">{selectedEvent.description}</p>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Users size={16} className="text-gray-500" />
                                    <span>{selectedEvent.registeredUsers?.length || 0} attending</span>
                                    {selectedEvent.seats && <span className="text-gray-600">• {selectedEvent.seats} spots</span>}
                                </div>
                                {isRegistered(selectedEvent) ? (
                                    <button 
                                        onClick={() => handleUnregister(selectedEvent)}
                                        disabled={registering === selectedEvent.id}
                                        className="btn-secondary"
                                    >
                                        {registering === selectedEvent.id ? <Loader2 size={16} className="animate-spin" /> : "Cancel Registration"}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleRegister(selectedEvent)}
                                        disabled={registering === selectedEvent.id}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {registering === selectedEvent.id ? <Loader2 size={16} className="animate-spin" /> : <><UserPlus size={16} /> Register</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>, document.body
            )}

            {/* Host Event Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
                    <div className="card-glass w-full max-w-xl bg-neutral-900 overflow-hidden flex flex-col shadow-2xl relative animate-[slide-up_0.3s_ease-out]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Calendar className="text-primary" /> Host an Event
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleHostEvent} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Event Title <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    placeholder="e.g. Hackathon 2024"
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                                    <select
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    >
                                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Location <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        placeholder="e.g. Auditorium"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Date <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        placeholder="e.g. Oct 20"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Time <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                        placeholder="e.g. 5:00 PM"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Seats (leave empty for unlimited)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newEvent.seats}
                                    onChange={(e) => setNewEvent({ ...newEvent, seats: e.target.value })}
                                    placeholder="e.g. 50"
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    rows="3"
                                    placeholder="Tell us more about the event..."
                                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Event Cover Image (Required)</label>
                                <ImageUpload
                                    folder="events"
                                    onUpload={(url) => setNewEvent({ ...newEvent, image: url })}
                                />
                            </div>

                            <div className="mt-4 flex gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Host Event</button>
                            </div>
                        </form>
                    </div>
                </div>, document.body
            )}
        </div>
    );
};

export default Events;
