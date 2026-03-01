import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2, Link, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { uploadToSupabase, isSupabaseAvailable } from '../utils/supabaseUpload';
import { uploadToImgBB } from '../utils/imgbbUpload';

const ImageUpload = ({ onUpload, folder = 'listings' }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setUploaded(false);
            setProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);
        
        // Try Supabase first
        if (isSupabaseAvailable()) {
            try {
                setProgress(30);
                const downloadURL = await uploadToSupabase(file, 'images', folder);
                setProgress(100);
                onUpload(downloadURL);
                setUploading(false);
                setUploaded(true);
                return;
            } catch (supabaseError) {
                console.log("Supabase upload failed:", supabaseError);
            }
        }

        // Try Firebase as fallback
        try {
            setProgress(50);
            const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            onUpload(downloadURL);
            setUploading(false);
            setUploaded(true);
            setProgress(100);
            return;
        } catch (error) {
            console.log("Firebase upload failed, trying imgbb:", error);
        }

        // Try imgbb as last resort
        try {
            setProgress(70);
            const downloadURL = await uploadToImgBB(file);
            onUpload(downloadURL);
            setUploading(false);
            setUploaded(true);
            setProgress(100);
        } catch (imgbbError) {
            console.log("ImgBB upload failed, showing URL input:", imgbbError);
            setUploading(false);
            setProgress(0);
            // Fall back to URL input
            setShowUrlInput(true);
        }
    };

    const handleUrlSubmit = () => {
        if (imageUrl.trim()) {
            onUpload(imageUrl.trim());
            setUploaded(true);
            setPreview(imageUrl.trim());
        }
    };

    const clearSelection = () => {
        setFile(null);
        setPreview('');
        setProgress(0);
        setUploaded(false);
        setShowUrlInput(false);
        setImageUrl('');
    };

    return (
        <div className="w-full">
            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${preview ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                {preview || uploaded ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            {!uploading && !uploaded && (
                                <button
                                    onClick={handleUpload}
                                    className="bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Upload size={16} /> Start Upload
                                </button>
                            )}
                            <button
                                onClick={clearSelection}
                                className="bg-white/10 hover:bg-rose-500 text-white p-2 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {(uploading) && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                                <Loader2 className="text-primary animate-spin mb-3" size={32} />
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden max-w-xs">
                                    <div
                                        className="bg-primary h-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-white font-bold mt-2 text-sm">{progress}% Uploaded</p>
                            </div>
                        )}
                    </div>
                ) : showUrlInput ? (
                    <div className="w-full flex flex-col items-center gap-4">
                        <Link className="text-primary" size={32} />
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Paste image URL here..."
                            className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowUrlInput(false)}
                                className="btn-secondary px-4 py-2"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleUrlSubmit}
                                className="btn-primary px-4 py-2"
                                disabled={!imageUrl.trim()}
                            >
                                Use URL
                            </button>
                        </div>
                    </div>
                ) : (
                    <label className="cursor-pointer w-full flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 mb-4 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <ImageIcon size={24} />
                        </div>
                        <p className="text-white font-medium mb-1">Click to upload photo</p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">PNG, JPG up to 5MB</p>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                )}
            </div>
            {file && !uploading && !uploaded && !showUrlInput && (
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle2 size={12} /> {file.name} selected
                    </p>
                    <button
                        onClick={() => setShowUrlInput(true)}
                        className="text-xs text-gray-400 hover:text-primary flex items-center gap-1"
                    >
                        <Link size={12} /> Or use URL
                    </button>
                </div>
            )}
            {uploaded && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Image added successfully
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
