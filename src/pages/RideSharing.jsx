import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Car, UserCircle2, MessageCircle } from 'lucide-react';

const DUMMY_RIDES = [
    {
        id: 1,
        type: 'offering', // offering or requesting
        user: "Vikram S.",
        vehicle: "Honda Amaze",
        from: "JNTUH Main Gate",
        to: "Secunderabad Station",
        date: "Oct 20, 2024",
        time: "4:30 PM",
        seats: 3,
        price: "Rs. 100",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        id: 2,
        type: 'requesting',
        user: "Anjali K.",
        from: "Kukatpally Housing Board",
        to: "CSE Block, JNTUH",
        date: "Oct 21, 2024",
        time: "8:30 AM",
        seats: 1,
        price: "Negotiable",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b"
    },
    {
        id: 3,
        type: 'offering',
        user: "Rahul T.",
        vehicle: "Royal Enfield Classic 350",
        from: "Madhapur",
        to: "JNTUH Campus",
        date: "Oct 21, 2024",
        time: "9:00 AM",
        seats: 1,
        price: "Rs. 50 (Petrol Share)",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        id: 4,
        type: 'requesting',
        user: "Priya M.",
        from: "JNTUH Hostels",
        to: "Inorbit Mall, Madhapur",
        date: "Oct 22, 2024",
        time: "5:00 PM",
        seats: 2,
        price: "Looking to split cab",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d"
    }
];

const RideSharing = () => {
    const [activeTab, setActiveTab] = useState('all'); // all, offering, requesting
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRides = DUMMY_RIDES.filter(ride => {
        const matchesTab = activeTab === 'all' || ride.type === activeTab;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = ride.from.toLowerCase().includes(searchLower) ||
            ride.to.toLowerCase().includes(searchLower);
        return matchesTab && matchesSearch;
    });

    return (
        <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in container mx-auto max-w-7xl relative overflow-hidden">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Car className="text-primary" size={24} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-white">
                            Ride <span className="text-primary">Sharing</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Find a carpool or split an auto/cab with fellow students.
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none btn-secondary">Request Ride</button>
                    <button className="flex-1 md:flex-none btn-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]">Offer Ride</button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-neutral-900 border border-white/10 rounded-2xl p-1 mb-8 max-w-sm">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-white'
                        }`}
                >
                    All Rides
                </button>
                <button
                    onClick={() => setActiveTab('offering')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'offering' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg' : 'text-gray-500 hover:text-emerald-400'
                        }`}
                >
                    Offering
                </button>
                <button
                    onClick={() => setActiveTab('requesting')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'requesting' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-lg' : 'text-gray-500 hover:text-blue-400'
                        }`}
                >
                    Requesting
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 group max-w-3xl">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Search by source or destination (e.g., Secunderabad, JNTUH)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 text-white rounded-2xl py-4 flex pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder-gray-500 shadow-inner text-lg"
                />
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                {filteredRides.map((ride) => (
                    <div key={ride.id} className="card-glass p-6 md:p-8 hover:bg-white/[0.04] transition-all duration-300 group border-l-4" style={{ borderLeftColor: ride.type === 'offering' ? '#10b981' : '#3b82f6' }}>

                        <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-4">
                                <img src={ride.avatar} alt={ride.user} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                <div>
                                    <h3 className="text-white font-bold text-lg">{ride.user}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${ride.type === 'offering' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {ride.type === 'offering' ? 'OFFERING' : 'REQUESTING'}
                                        </span>
                                        {ride.type === 'offering' && (
                                            <span className="text-gray-400 text-xs flex items-center gap-1">
                                                <Car size={12} /> {ride.vehicle}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-primary font-bold">{ride.price}</div>
                                <div className="text-gray-500 text-xs mt-1 font-medium">{ride.seats} seat(s) {ride.type === 'offering' ? 'available' : 'needed'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-6 relative">
                            {/* Line connecting dots */}
                            <div className="absolute top-4 left-3 bottom-4 w-0.5 bg-white/10 z-0 hidden sm:block"></div>

                            <div className="flex flex-col gap-6 sm:pl-8 sm:relative z-10 w-full">
                                <div className="flex items-start gap-4 h-full relative">
                                    <div className="w-6 h-6 rounded-full bg-neutral-800 border-2 border-gray-500 flex items-center justify-center z-10 hidden sm:flex left-[-39px] absolute">
                                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 flex-1 border border-white/5">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">From</div>
                                        <div className="text-white font-medium">{ride.from}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 h-full relative">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10 hidden sm:flex left-[-39px] absolute">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                    <div className="bg-primary/5 rounded-xl p-3 flex-1 border border-primary/20 shadow-inner">
                                        <div className="text-xs text-primary uppercase font-bold mb-1 tracking-wider">To</div>
                                        <div className="text-white font-medium">{ride.to}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/5 gap-4">
                            <div className="flex items-center gap-6 text-sm text-gray-400 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-500" />
                                    <span>{ride.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <span>{ride.time}</span>
                                </div>
                            </div>

                            <button className="btn-secondary whitespace-nowrap px-6 w-full sm:w-auto flex justify-center items-center gap-2 group-hover:bg-white/10 transition-colors">
                                <MessageCircle size={16} /> Contact
                            </button>
                        </div>
                    </div>
                ))}

                {filteredRides.length === 0 && (
                    <div className="card-glass p-16 text-center rounded-2xl border-dashed border-white/10 col-span-1 lg:col-span-2 flex flex-col items-center justify-center">
                        <Car className="text-gray-600 mb-6" size={56} />
                        <h3 className="text-2xl text-white font-semibold mb-3">No rides found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">We couldn't find any rides matching your search. Try adjusting the source/destination or checking back later.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default RideSharing;
