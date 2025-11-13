'use server';

import { analyzeEmployeePhoto } from '@/ai/flows/analyze-employee-photo';

export async function analyzePhotoAction(photoDataUri: string) {
  try {
    const result = await analyzeEmployeePhoto({ photoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing photo:', error);
    return { success: false, error: 'Failed to analyze photo.' };
  }
}
