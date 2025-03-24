// Interfaces compartilhadas para o plugin

export interface CarouselConfig {
    text: string;
    slideCount: number;
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    layoutStyle: 'centered' | 'left-aligned' | 'right-aligned';
    includePageNumbers: boolean;
    fontWeight?: number;
    fontSize?: number;
    lineHeight?: number;
    padding?: number;
  }
  
  // Mensagens entre a UI e o código principal
  export interface CreateCarouselMessage {
    type: 'create-carousel';
    text: string;
    slideCount: number;
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    layoutStyle: 'centered' | 'left-aligned' | 'right-aligned';
    includePageNumbers: boolean;
    fontWeight?: number;
    fontSize?: number;
    lineHeight?: number;
    padding?: number;
  }
  
  export type UIMessage = CreateCarouselMessage;
  
  // Configuração de cores RGB
  export interface RGB {
    r: number;
    g: number;
    b: number;
  }