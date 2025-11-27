import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, GripVertical } from 'lucide-react';
import { useCategories, Category } from '../hooks/useCategories';

interface CategoryManagerProps {
  onBack: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onBack }) => {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '☕',
    sort_order: 0,
    active: true
  });

  const handleAddCategory = () => {
    const nextSortOrder = Math.max(...categories.map(c => c.sort_order), 0) + 1;
    setFormData({
      id: '',
      name: '',
      icon: '☕',
      sort_order: nextSortOrder,
      active: true
    });
    setCurrentView('add');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      icon: category.icon,
      sort_order: category.sort_order,
      active: category.active
    });
    setCurrentView('edit');
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete category');
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!formData.id || !formData.name || !formData.icon) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate ID format (kebab-case)
    const idRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!idRegex.test(formData.id)) {
      alert('Category ID must be in kebab-case format (e.g., "hot-drinks", "cold-beverages")');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setCurrentView('list');
      setEditingCategory(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingCategory(null);
  };

  const generateIdFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      id: currentView === 'add' ? generateIdFromName(name) : formData.id
    });
  };

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-blue-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 md:h-16">
              <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
                <button
                  onClick={handleCancel}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 md:gap-2 group"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm md:text-base">Back</span>
                </button>
                <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  {currentView === 'add' ? 'Add Category' : 'Edit Category'}
                </h1>
              </div>
              <div className="flex space-x-1.5 md:space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-2 md:px-4 py-1.5 md:py-2 border-2 border-gray-300 hover:border-gray-400 rounded-lg md:rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                >
                  <X className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all flex items-center gap-1 md:gap-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 text-xs md:text-sm"
                >
                  <Save className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Save</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 md:py-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 border-2 border-blue-100">
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Category ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                  placeholder="kebab-case-id"
                  disabled={currentView === 'edit'}
                />
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  {currentView === 'edit' 
                    ? 'Category ID cannot be changed after creation'
                    : 'Use kebab-case format (e.g., "hot-drinks", "cold-beverages")'
                  }
                </p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Icon *</label>
                <div className="flex items-center gap-2 md:gap-3">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter emoji or icon"
                  />
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                    {formData.icon}
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  Use an emoji or icon character (e.g., ☕, 🧊, 🫖, 🥐)
                </p>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg md:rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="0"
                />
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  Lower numbers appear first in the menu
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Active Category</span>
                </label>
              </div>
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 md:gap-2 group"
              >
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm md:text-base">Back</span>
              </button>
              <h1 className="text-base md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                Manage Categories
              </h1>
            </div>
            <button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-all font-medium text-xs md:text-sm shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1 md:gap-2"
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Add Category</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl overflow-hidden border-2 border-blue-100">
          <div className="p-3 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Categories</h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-6 md:py-8">
                <p className="text-sm md:text-base text-gray-500 mb-3 md:mb-4">No categories found</p>
                <button
                  onClick={handleAddCategory}
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all font-medium text-sm md:text-base shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Add First Category
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 md:space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-2 md:p-4 border-2 border-gray-200 rounded-lg md:rounded-xl hover:bg-blue-50 transition-all gap-2 md:gap-4"
                  >
                    <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                      <div className="flex items-center space-x-1 md:space-x-2 text-gray-400 cursor-move flex-shrink-0">
                        <GripVertical className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-[10px] md:text-sm text-gray-500">#{category.sort_order}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{category.name}</h3>
                        <p className="text-[10px] md:text-sm text-gray-500 truncate">ID: {category.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1.5 md:space-x-3 flex-shrink-0">
                      <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold whitespace-nowrap ${
                        category.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                      
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1.5 md:p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg md:rounded-xl transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 md:p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg md:rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;