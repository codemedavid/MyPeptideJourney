import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Star, X, ZoomIn, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTestimonials } from '../hooks/useTestimonials';

const Testimonials: React.FC = () => {
  const navigate = useNavigate();
  const { testimonials, loading } = useTestimonials();
  const [selectedImage, setSelectedImage] = useState<typeof testimonials[0] | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-md border-b-2 border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Customer Testimonials
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm md:text-base font-semibold text-gray-700">100% Legit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-4 border border-blue-100">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm md:text-base font-semibold text-gray-700">
              Verified Customer Reviews & Transactions
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Real Results from Real Customers
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            See authentic conversations, delivery confirmations, and progress updates from our satisfied customers. 
            All testimonials are verified and showcase genuine experiences.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        )}

        {/* Testimonials Image Gallery */}
        {!loading && testimonials.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No testimonials yet</h3>
            <p className="text-sm text-gray-600">Check back soon for customer reviews and testimonials!</p>
          </div>
        )}

        {!loading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedImage(testimonial)}
            >
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden bg-gray-100">
                <img
                  src={testimonial.image_url}
                  alt={testimonial.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                          <div class="text-center p-4">
                            <p class="text-gray-600 text-sm">Image: ${testimonial.title}</p>
                            <p class="text-gray-500 text-xs mt-2">Please add image to: ${testimonial.image_url}</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                    <ZoomIn className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Click to View</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="p-4 md:p-5">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                  {testimonial.title}
                </h3>
                {testimonial.description && (
                  <p className="text-xs md:text-sm text-gray-600">
                    {testimonial.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {selectedImage.title}
                </h3>
                <div className="relative">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                {selectedImage.description && (
                  <p className="text-sm text-gray-600 mt-4">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}


        {/* CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who have achieved their goals with our premium peptides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Products
              </button>
              <a
                href="https://m.me/maria.m.donaire.2024"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} My Peptide Journey. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            All testimonials are from verified customers. Results may vary.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Testimonials;

