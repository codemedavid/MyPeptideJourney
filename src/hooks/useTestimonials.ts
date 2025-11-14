import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Testimonial {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setTestimonials(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setTestimonials(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchAllTestimonials();
      return data;
    } catch (err) {
      console.error('Error adding testimonial:', err);
      throw err;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { error: updateError } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchAllTestimonials();
    } catch (err) {
      console.error('Error updating testimonial:', err);
      throw err;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchAllTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    fetchAllTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
};

