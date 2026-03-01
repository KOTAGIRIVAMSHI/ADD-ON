import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, Car, UserCircle2, MessageCircle, Plus, X, Loader2, Ticket, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dbHelpers } from '../utils/dbHelpers';

const RideSharing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, offering, requesting
    const [searchTerm, setSearchTerm] = useState('');
    const [booking, setBooking] = useState(null);

    // Load rides
    useEffect(() => {
        const loadRides = async () => {
            try {
                const data = await dbHelpers.getAllRides();
                setRides(data);
            } catch (err) {
                console.error('Error loading rides:', err);
            } finally {
                setLoading(false);
            }
        };
        loadRides();
    }, []);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('offering'); // offering or requesting
    const [newRide, setNewRide] = useState({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: 1,
        price: '',
        vehicle: ''
    });

    const filteredRides = rides.filter(ride => {
        const matchesTab = activeTab === 'all' || ride.type === activeTab;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = ride.from.toLowerCase().includes(searchLower) ||
            ride.to.toLowerCase().includes(searchLower);
        return matchesTab && matchesSearch;
    });

    const handlePostRide = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please sign in to post a ride!");
            return;
        }

        try {
            await dbHelpers.createRide({
                type: modalType,
                driverName: user.name,
                driverId: user.uid,
                driverAvatar: user.avatar,
                from: newRide.from,
                to: newRide.to,
                date: newRide.date,
                time: newRide.time,
                seatsAvailable: Number(newRide.seats),
                price: newRide.price || (modalType === 'requesting' ? 'Negotiable' : 'Free'),
                vehicleType: modalType === 'offering' ? newRide.vehicle : null,
                notes: ''
            });

            setIsModalOpen(false);
            setNewRide({ from: '', to: '', date: '', time: '', seats: 1, price: '', vehicle: '' });
            
            // Refresh rides
            const data = await dbHelpers.getAllRides();
            setRides(data);
        } catch (err) {
            console.error(err);
            alert("Failed to post ride. Try again.");
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const isBooked = (ride) => {
        return user && ride.passengers?.includes(user.uid);
    };

    const getAvailableSeats = (ride) => {
        const total = parseInt(ride.seatsAvailable) || 0;
        const booked = ride.passengers?.length || 0;
        return total - booked;
    };

    const handleBookRide = async (ride) => {
        if (!user) {
            alert("Please sign in to book a seat!");
            return;
        }

        if (ride.driverId === user.uid) {
            alert("You can't book your own ride!");
            return;
        }

        setBooking(ride.id);
        try {
            await dbHelpers.bookRide(ride.id, user.uid);
            const data = await dbHelpers.getAllRides();
            setRides(data);
            alert("Seat booked successfully!");
        } catch (err) {
            alert(err.message || "Failed to book. Try again.");
        } finally {
            setBooking(null);
        }
    };

    const handleCancelBooking = async (ride) => {
        if (!confirm("Cancel your seat booking?")) return;

        setBooking(ride.id);
        try {
            await dbHelpers.cancelRideBooking(ride.id, user.uid);
            const data = await dbHelpers.getAllRides();
            setRides(data);
        } catch (err) {
            alert(err.message || "Failed to cancel. Try again.");
        } finally {
            setBooking(null);
        }
    };

    const handleContactDriver = async (ride) => {
        if (!user) {
            alert("Please sign in to contact the driver!");
            return;
        }

        if (ride.driverId === user.uid) {
            alert("This is your own ride!");
            return;
        }

        try {
            const chatId = await dbHelpers.getOrCreateChat(
                user.uid,
                ride.driverId,
                ride.id,
                `${ride.from} to ${ride.to}`
            );
            navigate('/messages', { state: { selectedChatId: chatId } });
        } catch (err) {
            console.error("Error starting chat:", err);
            alert("Failed to start chat. Try again.");
        }
    };

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
                    <button
                        onClick={() => openModal('requesting')}
                        className="flex-1 md:flex-none btn-secondary"
                    >
                        Request Ride
                    </button>
                    <button
                        onClick={() => openModal('offering')}
                        className="flex-1 md:flex-none btn-primary shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    >
                        Offer Ride
                    </button>
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
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 size={48} className="text-primary animate-spin" />
                    <p className="text-gray-400 font-medium">Finding available rides...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                    {filteredRides.map((ride) => (
                        <div key={ride.id} className="card-glass p-6 md:p-8 hover:bg-white/[0.04] transition-all duration-300 group border-l-4" style={{ borderLeftColor: ride.type === 'offering' ? '#10b981' : '#3b82f6' }}>

                            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                    <img src={ride.driverAvatar || `https://i.pravatar.cc/150?u=${ride.driverId}`} alt={ride.driverName} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{ride.driverName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${ride.type === 'offering' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {ride.type === 'offering' ? 'OFFERING' : 'REQUESTING'}
                                            </span>
                                            {ride.type === 'offering' && ride.vehicle && (
                                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                                    <Car size={12} /> {ride.vehicle}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-primary font-bold">{ride.price?.includes('Rs') || ride.price?.includes('₹') ? ride.price : `₹${ride.price || 0}`}</div>
                                    <div className="text-gray-500 text-xs mt-1 font-medium">
                                        {ride.type === 'offering' 
                                            ? `${getAvailableSeats(ride)}/${ride.seats} seats available`
                                            : `${ride.seats} seat(s) needed`
                                        }
                                    </div>
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

                                <div className="flex gap-2 w-full sm:w-auto">
                                    {ride.type === 'offering' && (
                                        isBooked(ride) ? (
                                            <button 
                                                onClick={() => handleCancelBooking(ride)}
                                                disabled={booking === ride.id}
                                                className="btn-secondary whitespace-nowrap px-4 w-full sm:w-auto flex justify-center items-center gap-2"
                                            >
                                                {booking === ride.id ? <Loader2 size={16} className="animate-spin" /> : <><UserMinus size={16} /> Cancel</>}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleBookRide(ride)}
                                                disabled={booking === ride.id || getAvailableSeats(ride) <= 0}
                                                className="btn-primary whitespace-nowrap px-4 w-full sm:w-auto flex justify-center items-center gap-2"
                                            >
                                                {booking === ride.id ? <Loader2 size={16} className="animate-spin" /> : <><Ticket size={16} /> Book Seat</>}
                                            </button>
                                        )
                                    )}
                                    <button onClick={() => handleContactDriver(ride)} className="btn-secondary whitespace-nowrap px-4 w-full sm:w-auto flex justify-center items-center gap-2 group-hover:bg-white/10 transition-colors">
                                        <MessageCircle size={16} /> Contact
                                    </button>
                                </div>
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
            )}

            {/* Modal for Posting Ride */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
                    <div className="card-glass w-full max-w-lg bg-neutral-900 overflow-hidden flex flex-col shadow-2xl relative animate-[slide-up_0.3s_ease-out]">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Car className="text-primary" /> {modalType === 'offering' ? 'Offer a Ride' : 'Request a Ride'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePostRide} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">From <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newRide.from}
                                        onChange={(e) => setNewRide({ ...newRide, from: e.target.value })}
                                        placeholder="Source location"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">To <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newRide.to}
                                        onChange={(e) => setNewRide({ ...newRide, to: e.target.value })}
                                        placeholder="Destination"
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
                                        value={newRide.date}
                                        onChange={(e) => setNewRide({ ...newRide, date: e.target.value })}
                                        placeholder="e.g. Oct 25"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Time <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={newRide.time}
                                        onChange={(e) => setNewRide({ ...newRide, time: e.target.value })}
                                        placeholder="e.g. 10:00 AM"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Seats <span className="text-primary">*</span></label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={newRide.seats}
                                        onChange={(e) => setNewRide({ ...newRide, seats: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">{modalType === 'offering' ? 'Price (₹ or Free)' : 'Price Preference'}</label>
                                    <input
                                        type="text"
                                        value={newRide.price}
                                        onChange={(e) => setNewRide({ ...newRide, price: e.target.value })}
                                        placeholder={modalType === 'offering' ? "e.g. 50 or Free" : "e.g. Negotiable"}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            {modalType === 'offering' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Vehicle Details</label>
                                    <input
                                        type="text"
                                        value={newRide.vehicle}
                                        onChange={(e) => setNewRide({ ...newRide, vehicle: e.target.value })}
                                        placeholder="e.g. Activa 6G, Swift"
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            )}

                            <div className="mt-4 flex gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Post Ride</button>
                            </div>
                        </form>
                    </div>
                </div>, document.body
            )}
        </div>
    );
};

export default RideSharing;
