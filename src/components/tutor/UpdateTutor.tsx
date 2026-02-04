'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateTutorProfileInput, Category } from '@/types';
import { updateTutorService } from '@/services/updateTutor.service';
import { tutorService } from '@/services/tutor.service';

// Simple toast component
const Toast = ({ message, type = 'success', onClose }: { 
  message: string; 
  type?: 'success' | 'error'; 
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center p-4 rounded-lg shadow-lg ${
        type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800' 
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default function UpdateTutorForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        hourlyRate: '',
        experienceYears: '',
        education: '',
        certifications: '',
    });

    // Load existing tutor data and categories
    useEffect(() => {
        const loadData = async () => {
            try {
                setFetching(true);

                // Load categories
                const categoriesResult = await tutorService.getCategories();
                if (categoriesResult.success) {
                    setCategories(categoriesResult.categories || []);
                }

                // Load existing tutor profile
                const profileResult = await tutorService.getTutorProfile();

                if (profileResult.success) {
                    // Access the data property with type assertion
                    const profileData = (profileResult as any).data || profileResult;

                    // Fill form with existing data
                    setFormData({
                        headline: profileData.headline || '',
                        bio: profileData.bio || '',
                        hourlyRate: profileData.hourlyRate?.toString() || '',
                        experienceYears: profileData.experienceYears?.toString() || '',
                        education: profileData.education || '',
                        certifications: profileData.certifications || '',
                    });

                    // Set selected categories
                    if (profileData.categories && Array.isArray(profileData.categories)) {
                        const categoryIds = profileData.categories.map((cat: any) => cat.categoryId || cat.id);
                        setSelectedCategories(categoryIds);
                    }
                } else {
                    setToast({ 
                        message: 'Unable to load tutor profile. You may need to create one first.', 
                        type: 'error' 
                    });
                    setTimeout(() => router.push('/become-tutor'), 2000);
                }
            } catch (error: any) {
                console.error('Failed to load data:', error);
                setToast({ 
                    message: 'Failed to load profile data: ' + error.message, 
                    type: 'error' 
                });
            } finally {
                setFetching(false);
            }
        };

        loadData();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryToggle = (categoryId: string) => {
        let newSelected = [...selectedCategories];

        if (newSelected.includes(categoryId)) {
            newSelected = newSelected.filter(id => id !== categoryId);
        } else {
            newSelected.push(categoryId);
        }

        setSelectedCategories(newSelected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate at least one field is being updated
        const isFormEmpty = !formData.headline &&
            !formData.bio &&
            !formData.hourlyRate &&
            !formData.experienceYears &&
            !formData.education &&
            !formData.certifications &&
            selectedCategories.length === 0;

        if (isFormEmpty) {
            setToast({ 
                message: 'Please update at least one field', 
                type: 'error' 
            });
            return;
        }

        // Prepare update data - only include fields that have values
        const updateData: Partial<CreateTutorProfileInput> = {};

        if (formData.headline) updateData.headline = formData.headline;
        if (formData.bio) updateData.bio = formData.bio;
        if (formData.hourlyRate) updateData.hourlyRate = parseFloat(formData.hourlyRate);
        if (formData.experienceYears) updateData.experienceYears = parseInt(formData.experienceYears);
        if (formData.education) updateData.education = formData.education;
        if (formData.certifications) updateData.certifications = formData.certifications;

        // Include categories if any selected
        if (selectedCategories.length > 0) {
            updateData.categories = selectedCategories.map(categoryId => ({
                categoryId,
                proficiencyLevel: 'Intermediate',
            }));
        }

        setLoading(true);

        try {
            const result = await updateTutorService.updateTutorProfile(updateData);

            if (result.success) {
                setToast({ 
                    message: 'Tutor profile updated successfully!', 
                    type: 'success' 
                });
                
                // Redirect after showing toast
                setTimeout(() => {
                    router.push('/dashboard');
                    router.refresh();
                }, 1500);
            } else {
                setToast({ 
                    message: result.message || 'Failed to update tutor profile', 
                    type: 'error' 
                });
            }
        } catch (error: any) {
            setToast({ 
                message: 'Error: ' + error.message, 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="max-w-3xl mx-auto p-4 md:p-8">
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <div className="text-lg text-gray-600">Loading tutor profile...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            
            <div className="max-w-3xl mx-auto p-4 md:p-8">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-8 md:mb-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Update Tutor Profile
                        </h1>
                        <p className="text-gray-600">
                            Update your tutor information. All fields are optional - only update what you want to change.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Headline */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Professional Headline
                            </label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleInputChange}
                                placeholder="e.g., Experienced Math Tutor with 5+ Years Experience"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                About You
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Tell students about your teaching style, experience, and qualifications..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>

                        {/* Hourly Rate and Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Hourly Rate */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Hourly Rate (USD)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-600 font-medium">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        value={formData.hourlyRate}
                                        onChange={handleInputChange}
                                        min="1"
                                        step="0.01"
                                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Years of Experience */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                />
                            </div>
                        </div>

                        {/* Education */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Education
                            </label>
                            <input
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleInputChange}
                                placeholder="e.g., B.Sc. in Computer Science, University of XYZ"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>

                        {/* Certifications */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800">
                                Certifications
                            </label>
                            <textarea
                                name="certifications"
                                value={formData.certifications}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="List any relevant certifications (comma separated)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
                            />
                        </div>

                        {/* Categories */}
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-800 mb-4">
                                Teaching Categories
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center p-3 hover:bg-white rounded-lg transition-colors">
                                        <input
                                            type="checkbox"
                                            id={`category-${category.id}`}
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleCategoryToggle(category.id)}
                                            className="h-5 w-5 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`category-${category.id}`}
                                            className="ml-3 text-sm font-medium text-gray-800 cursor-pointer"
                                        >
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700">
                                    {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCategories([])}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear all
                                </button>
                            </div>
                        </div>

                        {/* Submit and Cancel Buttons */}
                        <div className="pt-8 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-4 px-6 mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-black font-semibold rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg "
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        'Update Profile'
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-lg transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                Leave fields empty to keep current values
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}