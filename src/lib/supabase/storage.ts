import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid'; // Para nomes de arquivo únicos

/**
 * Faz o upload de um arquivo de imagem para o Supabase Storage.
 *
 * @param file O objeto File a ser carregado.
 * @returns A URL pública do arquivo carregado.
 */
export async function uploadImage(file: File): Promise<string> {
  const bucketName = 'avatars'; // ✅ O nome do bucket que criamos
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload da imagem:', error);
    // ✅ Joga o erro real do Supabase
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  // Obtém a URL pública
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  if (!publicUrlData) {
    throw new Error('Não foi possível obter a URL pública da imagem.');
  }

  return publicUrlData.publicUrl;
}