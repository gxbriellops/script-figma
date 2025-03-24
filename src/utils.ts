import { RGB } from './interfaces';

/**
 * Converte uma cor hexadecimal para formato RGB utilizado pelo Figma
 * @param hex String com a cor em formato hexadecimal (ex: "#FF5500")
 * @returns Objeto com valores RGB entre 0 e 1
 */
export function hexToRgb(hex: string): RGB {
  // Remove o caractere '#' se presente
  const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
  
  // Converte os valores hexadecimais para decimal e normaliza para o intervalo 0-1
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  
  return { r, g, b };
}

/**
 * Carrega fontes necessárias para o plugin
 * @param fontFamily Nome da família da fonte
 * @returns Promise que resolve quando a fonte for carregada
 */
export async function loadFonts(fontFamily: string): Promise<void> {
  try {
    // Carrega estilos comuns da fonte
    await Promise.all([
      figma.loadFontAsync({ family: fontFamily, style: "Regular" }),
      figma.loadFontAsync({ family: fontFamily, style: "Bold" }),
      figma.loadFontAsync({ family: fontFamily, style: "Medium" })
    ]);
  } catch (error) {
    // Se falhar ao carregar algum estilo da fonte, carrega apenas o Regular
    console.error(`Erro ao carregar estilos da fonte ${fontFamily}:`, error);
    await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
  }
}

/**
 * Calcula o alinhamento de texto com base no estilo de layout
 * @param layoutStyle Estilo de layout especificado pelo usuário
 * @returns Valor de alinhamento do texto para Figma
 */
export function getTextAlignmentFromLayout(
  layoutStyle: 'centered' | 'left-aligned' | 'right-aligned'
): 'CENTER' | 'LEFT' | 'RIGHT' {
  switch (layoutStyle) {
    case 'centered':
      return 'CENTER';
    case 'right-aligned':
      return 'RIGHT';
    case 'left-aligned':
    default:
      return 'LEFT';
  }
}