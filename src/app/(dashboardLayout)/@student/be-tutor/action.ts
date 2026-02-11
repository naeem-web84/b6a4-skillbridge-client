'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
 
export async function createTutorProfile(formData: FormData) { 
  try {
    const data = {
      headline: formData.get('headline') as string,
      bio: formData.get('bio') as string,
      hourlyRate: parseFloat(formData.get('hourlyRate') as string),
      experienceYears: parseInt(formData.get('experienceYears') as string),
      education: formData.get('education') as string,
      certifications: formData.get('certifications') as string,
      categories: JSON.parse(formData.get('categories') as string || '[]'),
    };

    const response = await fetch(`${process.env.API_URL}/tutor/create-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create tutor profile');
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function checkEligibility() {
  try {
    const response = await fetch(`${process.env.API_URL}/tutor/check-eligibility`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check eligibility');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { canBecome: false, message: 'Failed to check eligibility' };
  }
}