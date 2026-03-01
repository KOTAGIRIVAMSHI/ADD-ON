import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase'));

export const supabase = isSupabaseConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

export const uploadToSupabase = async (file, bucket = 'images', folder = 'uploads') => {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
    }

    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Supabase upload error:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrl;
};

export const isSupabaseAvailable = () => isSupabaseConfigured;
