import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useTestimonials, Testimonial } from '../hooks/useTestimonials';
import ImageUpload from './ImageUpload';

interface TestimonialManagerProps {
  onBack: () => void;
}

const TestimonialManager: React.FC<TestimonialManagerProps> = ({ onBack }) => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, fetchAllTestimonials } = useTestimonials();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    display_order: 0,
    active: true
  });

  React.useEffect(() => {
    fetchAllTestimonials();
  }, []);

  const handleAddTestimonial = () => {
    const nextOrder = testimonials.length > 0 
      ? Math.max(...testimonials.map(t => t.display_order), 0) + 1 
      : 0;
    setFormData({
      title: '',
      description: '',
      image_url: '',
      display_order: nextOrder,
      active: true
    });
    setCurrentView('add');
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      title: testimonial.title,
      description: testimonial.description || '',
      image_url: testimonial.image_url,
      display_order: testimonial.display_order,
      active: testimonial.active
    });
    setCurrentView('edit');
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        setIsProcessing(true);
        await deleteTestimonial(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete testimonial');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveTestimonial = async () => {
    if (!formData.title || !formData.image_url) {
      alert('Please fill in title and upload an image');
      return;
    }

    try {
      setIsProcessing(true);
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData);
      } else {
        await addTestimonial(formData);
      }
      setCurrentView('list');
      setEditingTestimonial(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save testimonial');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingTestimonial(null);
  };

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-blue-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 md:h-16 gap-2">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={handleCancel}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 md:gap-2 group"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm md:text-base">Back</span>
                </button>
                <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {currentView === 'add' ? '✨ Add New Testimonial' : '✏️ Edit Testimonial'}
                </h1>
              </div>
              <div className="flex space-x-2 md:space-x-3">
                <button onClick={handleCancel} className="px-2 md:px-4 py-1.5 md:py-2 border-2 border-gray-300 hover:border-gray-400 rounded-lg md:rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                  <X className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button 
                  onClick={handleSaveTestimonial} 
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all flex items-center gap-1 md:gap-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 text-xs md:text-sm"
                >
                  <Save className="h-3 w-3 md:h-4 md:w-4" />
                  {isProcessing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 border-2 border-blue-100">
            {/* Basic Information */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-xl md:text-2xl">📝</span>
                Testimonial Information
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field text-sm md:text-base"
                    placeholder="e.g., Customer Progress Update - Appetite Suppression"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field text-sm md:text-base"
                    placeholder="Optional description of the testimonial..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="input-field text-sm md:text-base"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                <div className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 md:w-5 md:h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-xs md:text-sm font-semibold text-gray-700">✅ Active (Show on testimonials page)</span>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-xl md:text-2xl">🖼️</span>
                Testimonial Image *
              </h3>
              <ImageUpload
                currentImage={formData.image_url || undefined}
                onImageChange={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
              />
              <p className="text-xs text-gray-500 mt-2">Upload customer conversation screenshots or delivery confirmations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 md:gap-2 group"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base">Dashboard</span>
              </button>
              <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Testimonials</h1>
            </div>
            <button
              onClick={handleAddTestimonial}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-medium text-xs md:text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-1 md:gap-2"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-8">
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-blue-100 p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{testimonial.title}</h3>
                  {testimonial.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{testimonial.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEditTestimonial(testimonial)}
                    disabled={isProcessing}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                    disabled={isProcessing}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={testimonial.image_url}
                  alt={testimonial.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-[10px] text-gray-500">
                  Order: {testimonial.display_order}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  testimonial.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {testimonial.active ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-blue-100">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={testimonial.image_url}
                  alt={testimonial.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 flex-1">{testimonial.title}</h3>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEditTestimonial(testimonial)}
                      disabled={isProcessing}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      disabled={isProcessing}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {testimonial.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{testimonial.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Order: {testimonial.display_order}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    testimonial.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {testimonial.active ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-sm text-gray-600 mb-4">Add your first customer testimonial to build trust</p>
            <button
              onClick={handleAddTestimonial}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add First Testimonial
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialManager;

