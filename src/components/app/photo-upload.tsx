'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/supabase/storage';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function PhotoUpload({ value, onChange, disabled }: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    // Validação de tipo e tamanho
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem (PNG, JPG, etc.).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('A imagem é muito grande. O máximo é 5MB.');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage(file); // Chama a função de upload
      
      onChange(imageUrl); // Atualiza o formulário com a nova URL
      toast({
        title: 'Foto carregada!',
      });
      
    } catch (err: any) {
      console.error('Erro ao fazer upload da imagem:', err);
      // ✅ CORREÇÃO: Mostra o erro real do Supabase
      const friendlyError = err.message.includes('Bucket not found')
        ? 'Erro de configuração: Bucket não encontrado.'
        : err.message;
      setError(friendlyError);
      
      toast({
        title: 'Erro no Upload',
        description: friendlyError,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    // NOTA: Isso não deleta do bucket, apenas do formulário.
    // Você pode adicionar a lógica de deleteImage(value) aqui se desejar.
    onChange(null);
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* A prévia usa o Avatar, que já é circular (como no seu exemplo) */}
      <Avatar className="h-32 w-32 border-2">
        <AvatarImage 
          src={value ?? undefined} 
          alt="Foto do funcionário" 
          className="object-cover" // Isso garante que a foto preencha o círculo
        />
        <AvatarFallback className="text-xl font-semibold">
          <Camera className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={disabled || loading}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleClick}
          disabled={disabled || loading}
          variant="outline"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          {loading ? 'Enviando...' : 'Carregar Foto'}
        </Button>
        
        {value && (
          <Button
            type="button"
            onClick={handleRemovePhoto}
            disabled={disabled || loading}
            variant="ghost"
          >
            <X className="mr-2 h-4 w-4" /> Remover
          </Button>
        )}
      </div>

      {error && (
        // ✅ A mensagem de erro agora é dinâmica
        <p className="text-sm text-destructive mt-2 text-center">{error}</p>
      )}
    </div>
  );
}