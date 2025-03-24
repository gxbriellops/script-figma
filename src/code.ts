import { TextSplitter } from './textSplitter';
import { SlideGenerator } from './slideGenerator';
import { CarouselConfig, UIMessage } from './interfaces';

// Mostra a interface do plugin
figma.showUI(__html__, { width: 450, height: 650, themeColors: true });

/**
 * Manipulador de mensagens da interface do usuário
 */
figma.ui.onmessage = async (msg: UIMessage) => {
  try {
    // Verifica o tipo de mensagem
    if (msg.type === 'create-carousel') {
      // Feedback visual para o usuário
      figma.notify("Gerando carrossel...", { timeout: 2000 });
      
      // Valida os dados recebidos
      if (!msg.text || msg.text.trim().length === 0) {
        throw new Error("O texto está vazio!");
      }
      
      if (msg.slideCount <= 0 || msg.slideCount > 30) {
        throw new Error("O número de slides deve estar entre 1 e 30!");
      }
      
      // Configura a criação do carrossel
      const carouselConfig: CarouselConfig = {
        text: msg.text,
        slideCount: msg.slideCount,
        fontFamily: msg.fontFamily,
        primaryColor: msg.primaryColor,
        secondaryColor: msg.secondaryColor,
        textColor: msg.textColor,
        layoutStyle: msg.layoutStyle,
        includePageNumbers: msg.includePageNumbers,
        fontWeight: msg.fontWeight,
        fontSize: msg.fontSize,
        lineHeight: msg.lineHeight,
        padding: msg.padding
      };
      
      // Processa o texto para dividir em slides
      const textSplitter = new TextSplitter();
      const textFragments = textSplitter.splitTextIntoSlides(
        msg.text, 
        msg.slideCount
      );
      
      // Verifica se a divisão do texto foi bem-sucedida
      if (textFragments.length === 0) {
        throw new Error("Não foi possível dividir o texto em slides!");
      }
      
      // Cria os slides no Figma
      const slideGenerator = new SlideGenerator();
      await slideGenerator.createSlides(textFragments, carouselConfig);
      
      // Notifica sucesso
      figma.notify("Carrossel criado com sucesso!");
    } else if (msg.type === 'cancel') {
      // Fecha o plugin se o usuário cancelar
      figma.closePlugin();
    }
  } catch (error) {
    // Manipula qualquer erro que ocorra
    console.error("Erro:", error);
    figma.notify(`Erro: ${error instanceof Error ? error.message : String(error)}`, { error: true });
  }
};

// Função executada quando o plugin é fechado
figma.on("close", () => {
  // Limpeza de recursos, se necessário
});