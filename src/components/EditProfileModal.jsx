import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Camera, Loader2, User, BookOpen, Phone, FileText, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const BRANCHES = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
    'Architecture',
    'Business Administration',
    'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated', 'Other'];

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        branch: 'Student',
        year: '1st Year',
        bio: '',
        phone: '',
        avatar: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: ''
    });

    // Update formData when modal opens or user changes
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || '',
                branch: user.branch || 'Student',
                year: user.year || '1st Year',
                bio: user.bio || '',
                phone: user.phone || '',
                avatar: user.avatar || '',
                linkedin: user.linkedin || '',
                github: user.github || '',
                twitter: user.twitter || '',
                website: user.website || ''
            });
        }
    }, [isOpen, user?.uid, user?.name, user?.branch, user?.year, user?.bio, user?.phone, user?.avatar, user?.linkedin, user?.github, user?.twitter, user?.website]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be less than 2MB');
            return;
        }

        setLoading(true);
        try {
            const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, avatar: url }));
        } catch (err) {
            setError('Failed to upload image. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await updateUserProfile({
                name: formData.name,
                branch: formData.branch,
                year: formData.year,
                bio: formData.bio,
                phone: formData.phone,
                avatar: formData.avatar,
                linkedin: formData.linkedin,
                github: formData.github,
                twitter: formData.twitter,
                website: formData.website
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-[scale-in_0.3s_ease-out]">
                <div className="p-6 border-b border-white/10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm py-3 px-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={formData.avatar || 'https://i.pravatar.cc/150'}
                                alt="Avatar"
                                className="w-24 h-24 rounded-3xl border-2 border-primary/30 object-cover"
                            />
                            <label className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-black flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                <Camera size={14} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click camera to change photo</p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Branch</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all appearance-none"
                                >
                                    {BRANCHES.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Year</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all appearance-none"
                                >
                                    {YEARS.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Phone (optional)</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Bio (optional)</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-3 text-gray-500" size={18} />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Tell us about yourself..."
                                className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500 resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-3">Social Links (optional)</p>
                        <div className="space-y-3">
                            <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="LinkedIn URL"
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                                />
                            </div>
                            <div className="relative">
                                <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="GitHub URL"
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                                />
                            </div>
                            <div className="relative">
                                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="url"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    placeholder="Twitter/X URL"
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                                />
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="Personal Website"
                                    className="w-full bg-black/30 border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
