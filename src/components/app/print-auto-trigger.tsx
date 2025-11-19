'use client';

import { useEffect } from 'react';

export function PrintAutoTrigger() {
  useEffect(() => {
    // Pequeno delay para garantir que estilos e imagens carregaram
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}