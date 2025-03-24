import { CarouselConfig, RGB } from './interfaces';
import { hexToRgb, loadFonts, getTextAlignmentFromLayout } from './utils';

/**
 * SlideGenerator - Classe responsável pela criação de slides no Figma
 */
export class SlideGenerator {
  // Dimensões dos slides
  private readonly SLIDE_WIDTH = 1080;
  private readonly SLIDE_HEIGHT = 1350;
  private readonly DEFAULT_PADDING = 80;
  private readonly DEFAULT_FONT_SIZE = 32;
  private readonly DEFAULT_LINE_HEIGHT = 1.5;
  
  /**
   * Cria slides no Figma com base nos fragmentos de texto e configurações
   * @param textFragments Array de strings com o conteúdo de cada slide
   * @param config Configurações do carrossel
   * @returns Promise que resolve quando todos os slides forem criados
   */
  public async createSlides(textFragments: string[], config: CarouselConfig): Promise<void> {
    try {
      // Carrega as fontes necessárias
      await loadFonts(config.fontFamily);
      
      // Configurações com valores padrão
      const padding = config.padding || this.DEFAULT_PADDING;
      const fontSize = config.fontSize || this.DEFAULT_FONT_SIZE;
      const lineHeight = config.lineHeight || this.DEFAULT_LINE_HEIGHT;
      
      // Cria um frame para agrupar todos os slides (como um board)
      const carouselBoard = figma.createFrame();
      carouselBoard.name = "Carrossel de Texto";
      carouselBoard.layoutMode = "HORIZONTAL";
      carouselBoard.primaryAxisSizingMode = "AUTO";
      carouselBoard.counterAxisSizingMode = "AUTO";
      carouselBoard.itemSpacing = 100;
      carouselBoard.paddingLeft = 50;
      carouselBoard.paddingRight = 50;
      carouselBoard.paddingTop = 50;
      carouselBoard.paddingBottom = 50;
      carouselBoard.fills = [];  // Torna o board transparente
      
      // Cores convertidas para o formato RGB do Figma
      const primaryColor = hexToRgb(config.primaryColor);
      const textColor = hexToRgb(config.textColor);
      const secondaryColor = config.secondaryColor ? 
        hexToRgb(config.secondaryColor) : 
        this.getDarkerColor(primaryColor);
      
      // Alinhamento do texto com base no estilo de layout
      const textAlignment = getTextAlignmentFromLayout(config.layoutStyle);
      
      // Cria um frame para cada slide
      for (let i = 0; i < textFragments.length; i++) {
        // Pula criação de slide se o texto estiver vazio
        if (!textFragments[i].trim() && i > 0) continue;
        
        // Cria frame com as dimensões especificadas
        const slideFrame = figma.createFrame();
        slideFrame.resize(this.SLIDE_WIDTH, this.SLIDE_HEIGHT);
        slideFrame.name = `Slide ${i + 1}`;
        
        // Define cor de fundo
        slideFrame.fills = [{
          type: 'SOLID',
          color: primaryColor
        }];
        
        // Adiciona um decorador de cabeçalho (opcional)
        this.addHeaderDecorator(slideFrame, secondaryColor);
        
        // Cria bloco de texto
        const textBlock = figma.createText();
        textBlock.fontName = { family: config.fontFamily, style: "Regular" };
        textBlock.fills = [{
          type: 'SOLID',
          color: textColor
        }];
        
        // Configura o texto
        textBlock.characters = textFragments[i];
        textBlock.fontSize = fontSize;
        textBlock.lineHeight = { value: fontSize * lineHeight, unit: 'PIXELS' };
        textBlock.textAlignHorizontal = textAlignment;
        
        // Posiciona e redimensiona o texto
        const textWidth = this.SLIDE_WIDTH - (padding * 2);
        textBlock.resize(textWidth, textBlock.height);
        textBlock.x = padding;
        textBlock.y = padding * 1.5;  // Ajuste vertical para dar espaço ao cabeçalho
        
        // Verifica se deve adicionar numeração
        if (config.includePageNumbers) {
          this.addPageNumber(slideFrame, i + 1, textFragments.length, config.fontFamily, textColor);
        }
        
        // Adiciona o texto ao frame
        slideFrame.appendChild(textBlock);
        
        // Adiciona o slide ao board
        carouselBoard.appendChild(slideFrame);
      }
      
      // Centraliza o carrossel na viewport
      figma.viewport.scrollAndZoomIntoView([carouselBoard]);
      
      // Notifica que a operação foi concluída
      figma.notify(`Carrossel com ${textFragments.length} slides criado com sucesso!`);
      
    } catch (error) {
      console.error("Erro ao criar slides:", error);
      figma.notify(`Erro ao criar slides: ${error}`, { error: true });
    }
  }
  
  /**
   * Adiciona um elemento decorativo no topo do slide
   */
  private addHeaderDecorator(frame: FrameNode, color: RGB): void {
    const decorator = figma.createRectangle();
    decorator.resize(this.SLIDE_WIDTH, 10);
    decorator.x = 0;
    decorator.y = 0;
    decorator.fills = [{
      type: 'SOLID',
      color: color
    }];
    
    frame.appendChild(decorator);
  }
  
  /**
   * Adiciona numeração de página no rodapé do slide
   */
  private addPageNumber(
    frame: FrameNode, 
    current: number, 
    total: number, 
    fontFamily: string, 
    textColor: RGB
  ): void {
    const pageNumber = figma.createText();
    pageNumber.fontName = { family: fontFamily, style: "Regular" };
    pageNumber.characters = `${current}/${total}`;
    pageNumber.fontSize = 24;
    
    // Posiciona no canto inferior direito
    pageNumber.x = this.SLIDE_WIDTH - pageNumber.width - 50;
    pageNumber.y = this.SLIDE_HEIGHT - pageNumber.height - 50;
    
    // Define a cor do texto
    pageNumber.fills = [{
      type: 'SOLID',
      color: textColor
    }];
    
    frame.appendChild(pageNumber);
  }
  
  /**
   * Calcula uma versão mais escura da cor para uso como cor secundária
   */
  private getDarkerColor(color: RGB): RGB {
    return {
      r: Math.max(color.r - 0.2, 0),
      g: Math.max(color.g - 0.2, 0),
      b: Math.max(color.b - 0.2, 0)
    };
  }
}