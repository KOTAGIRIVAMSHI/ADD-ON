import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const ImageUpload = ({ onUpload, folder = 'general' }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploaded, setUploaded] = useState(false);

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
        const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (error) => {
                console.error("Upload error:", error);
                alert("Upload failed. Try again.");
                setUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                onUpload(downloadURL);
                setUploading(false);
                setUploaded(true);
            }
        );
    };

    const clearSelection = () => {
        setFile(null);
        setPreview('');
        setProgress(0);
        setUploaded(false);
    };

    return (
        <div className="w-full">
            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center min-h-[160px] ${preview ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                {preview ? (
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

                        {(uploading || uploaded) && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                                {uploading ? (
                                    <>
                                        <Loader2 className="text-primary animate-spin mb-3" size={32} />
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden max-w-xs">
                                            <div
                                                className="bg-primary h-full transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-white font-bold mt-2 text-sm">{progress}% Uploaded</p>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center animate-bounce-short">
                                        <CheckCircle2 className="text-primary mb-2" size={40} />
                                        <p className="text-white font-bold">Image Uploaded!</p>
                                    </div>
                                )}
                            </div>
                        )}
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
            {file && !uploading && !uploaded && (
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {file.name} selected. Click image to upload.
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
