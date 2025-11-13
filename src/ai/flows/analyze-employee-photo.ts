// This is an AI-powered tool to analyze employee photos for integrity and adherence to company standards.
'use server';
/**
 * @fileOverview Analyzes uploaded employee photos to verify their integrity and adherence to company standards.
 *
 * - analyzeEmployeePhoto - A function that handles the photo analysis process.
 * - AnalyzeEmployeePhotoInput - The input type for the analyzeEmployeePhoto function.
 * - AnalyzeEmployeePhotoOutput - The return type for the analyzeEmployeePhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmployeePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of an employee, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnalyzeEmployeePhotoInput = z.infer<typeof AnalyzeEmployeePhotoInputSchema>;

const FaceDetectionResultSchema = z.object({
  faceDetected: z.boolean().describe('Whether a face is detected in the image.'),
  confidence: z.number().describe('The confidence level of the face detection.'),
});

const ImageAnalysisResultSchema = z.object({
  integrityCheck: z.boolean().describe('Whether the image is valid and not corrupted.'),
  meetsDimensionRequirements: z.boolean().describe('Whether the image meets the required dimension.'),
  meetsSizeRequirements: z.boolean().describe('Whether the image meets the required size.'),
  faceDetectionResult: FaceDetectionResultSchema.describe('Result of face detection analysis')
});

const AnalyzeEmployeePhotoOutputSchema = z.object({
  analysisResult: ImageAnalysisResultSchema.describe('The analysis result of the employee photo'),
  feedback: z.string().describe('Feedback on the photo and any issues found.')
});

export type AnalyzeEmployeePhotoOutput = z.infer<typeof AnalyzeEmployeePhotoOutputSchema>;

export async function analyzeEmployeePhoto(input: AnalyzeEmployeePhotoInput): Promise<AnalyzeEmployeePhotoOutput> {
  return analyzeEmployeePhotoFlow(input);
}

const detectFaces = ai.defineTool({
  name: 'detectFaces',
  description: 'Detects faces in an image and returns confidence level.',
  inputSchema: z.object({
    photoDataUri: z.string().describe('The photo data URI to analyze.')
  }),
  outputSchema: FaceDetectionResultSchema,
}, async (input) => {
  // Placeholder implementation, replace with actual face detection logic
  // This could use a separate image analysis service or library
  return { faceDetected: true, confidence: 0.9 };
});

const analyzeImage = ai.defineTool({
  name: 'analyzeImage',
  description: 'Checks the integrity, dimensions, and size of an image.',
  inputSchema: z.object({
    photoDataUri: z.string().describe('The photo data URI to analyze.')
  }),
  outputSchema: ImageAnalysisResultSchema,
}, async (input) => {
  // Placeholder implementation, replace with actual image analysis logic
  // This could use a separate image analysis service or library
  return {
    integrityCheck: true,
    meetsDimensionRequirements: true,
    meetsSizeRequirements: true,
    faceDetectionResult: { faceDetected: false, confidence: 0.0 },
  };
});

const analyzePhotoPrompt = ai.definePrompt({
  name: 'analyzePhotoPrompt',
  tools: [analyzeImage, detectFaces],
  input: {schema: AnalyzeEmployeePhotoInputSchema},
  output: {schema: AnalyzeEmployeePhotoOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing employee photos to ensure they meet company standards. Here are the company standards:

  - The image must be a valid image file and not corrupted.
  - The image dimensions must be at least 200x200 pixels.
  - The image file size must be less than 5MB.
  - A face must be detected in the photo.

  Given the employee photo, use the provided tools to analyze the photo and generate feedback. First use the analyzeImage tool to check integrity, dimensions, and size, then use the detectFaces tool to verify that the photo contains a face.

  Photo: {{media url=photoDataUri}}
`,
});

const analyzeEmployeePhotoFlow = ai.defineFlow(
  {
    name: 'analyzeEmployeePhotoFlow',
    inputSchema: AnalyzeEmployeePhotoInputSchema,
    outputSchema: AnalyzeEmployeePhotoOutputSchema,
  },
  async input => {
    const {output} = await analyzePhotoPrompt(input);
    return output!;
  }
);
