'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import Image from 'next/image';
import { analyzePhotoAction } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { AnalyzeEmployeePhotoOutput } from '@/ai/flows/analyze-employee-photo';

type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export function PhotoUpload() {
  const { setValue } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeEmployeePhotoOutput | null>(null);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAnalysisStatus('loading');
      setAnalysisResult(null);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        
        const result = await analyzePhotoAction(dataUri);
        
        if (result.success && result.data) {
          const { analysisResult: photoAnalysis, feedback } = result.data;
          setAnalysisResult(result.data);
          if (
            photoAnalysis.integrityCheck && 
            photoAnalysis.meetsDimensionRequirements && 
            photoAnalysis.meetsSizeRequirements &&
            photoAnalysis.faceDetectionResult.faceDetected
          ) {
            setAnalysisStatus('success');
            // Assuming successful upload and analysis gives a URL
            // For now, just store the data URI for preview
            setValue('photoUrl', dataUri);
          } else {
            setAnalysisStatus('error');
          }
        } else {
          setAnalysisStatus('error');
          setAnalysisResult({
            analysisResult: {
              integrityCheck: false,
              meetsDimensionRequirements: false,
              meetsSizeRequirements: false,
              faceDetectionResult: { faceDetected: false, confidence: 0 }
            },
            feedback: result.error || 'An unknown error occurred during analysis.'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const statusMap = {
    loading: { icon: <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />, text: 'Analisando foto...' },
    success: { icon: <CheckCircle className="h-8 w-8 text-green-500" />, text: 'Foto aprovada!' },
    error: { icon: <AlertTriangle className="h-8 w-8 text-destructive" />, text: 'Problema na foto' },
    idle: { icon: <UploadCloud className="h-8 w-8 text-muted-foreground" />, text: 'Clique para carregar ou arraste e solte' },
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={cn(
          "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
          analysisStatus === 'error' && 'border-destructive',
          analysisStatus === 'success' && 'border-green-500',
        )}>
        {preview ? (
            <Image src={preview} alt="Pré-visualização do funcionário" layout="fill" objectFit="contain" className="rounded-lg p-2" />
        ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {statusMap[analysisStatus].icon}
                <p className="mb-2 text-sm text-muted-foreground text-center px-2">{statusMap[analysisStatus].text}</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, ou WEBP (MAX. 5MB)</p>
            </div>
        )}
        <input id="dropzone-file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
      </div>

      {analysisStatus === 'error' && analysisResult && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Foto Rejeitada</AlertTitle>
          <AlertDescription>
            {analysisResult.feedback}
          </AlertDescription>
        </Alert>
      )}
      {analysisStatus === 'success' && analysisResult && (
         <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400">
          <CheckCircle className="h-4 w-4 !text-green-500" />
          <AlertTitle className="text-green-600 dark:text-green-500">Foto Aprovada</AlertTitle>
          <AlertDescription>
            {analysisResult.feedback}
          </AlertDescription>
        </Alert>
      )}

    </div>
  );
}
