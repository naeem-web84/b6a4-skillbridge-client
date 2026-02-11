'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateTutorProfileInput, Category } from '@/types';
import { tutorService } from '@/services/tutor.service';

export default function BeTutorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    headline: '',
    bio: '',
    hourlyRate: '',
    experienceYears: '',
    education: '',
    certifications: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await tutorService.getCategories();
        if (result.success) {
          setCategories(result.categories || []);
        }
      } catch {
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);

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
    
    if (!formData.headline.trim()) {
      alert('Headline is required');
      return;
    }
    
    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      alert('Hourly rate must be greater than 0');
      return;
    }
    
    if (selectedCategories.length === 0) {
      alert('Please select at least one category');
      return;
    }

    const categoriesData = selectedCategories.map(categoryId => ({
      categoryId,
      proficiencyLevel: 'Intermediate',
    }));

    const submissionData: CreateTutorProfileInput = {
      headline: formData.headline,
      bio: formData.bio,
      hourlyRate: parseFloat(formData.hourlyRate),
      experienceYears: parseInt(formData.experienceYears) || 0,
      education: formData.education,
      certifications: formData.certifications,
      categories: categoriesData,
    };

    setLoading(true);
    
    try {
      const result = await tutorService.createTutorProfile(submissionData);
      
      if (result.success) {
        alert('Tutor profile created successfully! You are now a tutor.');
        router.push('/dashboard');
        router.refresh();
      } else {
        alert('Failed: ' + (result.message || 'Failed to create tutor profile'));
      }
    } catch {
      alert('Error: Failed to create tutor profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>Become a Tutor</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Fill in your details to start teaching</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
         
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Professional Headline *
          </label>
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleInputChange}
            placeholder="e.g., Experienced Math Tutor with 5+ Years Experience"
            style={{ 
              width: '100%', 
              padding: '8px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
            required
          />
        </div>

       
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            About You
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            placeholder="Tell students about your teaching style, experience, and qualifications..."
            style={{ 
              width: '100%', 
              padding: '8px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
           
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Hourly Rate (USD) *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0', left: '0', bottom: '0', display: 'flex', alignItems: 'center', paddingLeft: '12px', color: '#6b7280' }}>
                <span>$</span>
              </div>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                min="1"
                step="0.01"
                required
                style={{ 
                  width: '100%', 
                  padding: '8px 16px 8px 32px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

           
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Years of Experience *
            </label>
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              min="0"
              required
              style={{ 
                width: '100%', 
                padding: '8px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

         
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Education
          </label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            placeholder="e.g., B.Sc. in Computer Science, University of XYZ"
            style={{ 
              width: '100%', 
              padding: '8px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

       
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Certifications
          </label>
          <textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleInputChange}
            rows={2}
            placeholder="List any relevant certifications (comma separated)"
            style={{ 
              width: '100%', 
              padding: '8px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
        </div>

         
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Teaching Categories *
          </label>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {categories.map((category) => (
              <div key={category.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  style={{ height: '16px', width: '16px', color: '#2563eb' }}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

      
        <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginTop: '16px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'CREATING TUTOR PROFILE...' : 'BECOME A TUTOR'}
          </button>
        </div>
      </form>
    </div>
  );
}