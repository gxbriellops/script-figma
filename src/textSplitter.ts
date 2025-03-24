/**
 * TextSplitter - Classe responsável por dividir um texto em fragmentos para slides
 * Implementação avançada que respeita parágrafos e divisões lógicas do texto
 */
export class TextSplitter {
    private readonly MAX_CHARS_PER_SLIDE = 800; // Limite máximo de caracteres por slide
  
    /**
     * Divide o texto em slides de forma inteligente
     * @param text Texto completo a ser dividido
     * @param slideCount Número desejado de slides
     * @returns Array de strings representando o conteúdo de cada slide
     */
    public splitTextIntoSlides(text: string, slideCount: number): string[] {
      // Se o texto estiver vazio, retorna um array vazio
      if (!text.trim()) {
        return [];
      }
  
      // Divide o texto em parágrafos
      const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
      
      // Se o número de parágrafos for menor ou igual ao número de slides,
      // podemos distribuir um ou mais parágrafos por slide
      if (paragraphs.length <= slideCount) {
        return this.distributeByParagraphs(paragraphs, slideCount);
      }
  
      // Caso contrário, fazemos uma distribuição mais complexa
      return this.distributeByContent(paragraphs, slideCount);
    }
  
    /**
     * Distribui parágrafos entre slides quando há menos parágrafos que slides
     */
    private distributeByParagraphs(paragraphs: string[], slideCount: number): string[] {
      const result: string[] = [];
      
      // Agrupa parágrafos considerando seus tamanhos
      let slideContent = "";
      let currentSlideIndex = 0;
      
      for (const paragraph of paragraphs) {
        // Se adicionar este parágrafo ultrapassar o limite e não for o primeiro do slide
        if (slideContent.length + paragraph.length > this.MAX_CHARS_PER_SLIDE && slideContent.length > 0) {
          result.push(slideContent);
          slideContent = paragraph;
          currentSlideIndex++;
        } else {
          // Adiciona o parágrafo ao slide atual com uma quebra de linha
          if (slideContent.length > 0) {
            slideContent += "\n\n";
          }
          slideContent += paragraph;
        }
        
        // Se atingimos o número máximo de slides, 
        // combinamos o resto dos parágrafos no último slide
        if (currentSlideIndex >= slideCount - 1 && result.length < slideCount - 1) {
          break;
        }
      }
      
      // Adiciona o último slide se houver conteúdo
      if (slideContent.length > 0) {
        result.push(slideContent);
      }
      
      // Se houver parágrafos restantes, adiciona ao último slide
      if (result.length < paragraphs.length && result.length > 0) {
        const remainingParagraphs = paragraphs.slice(result.length);
        result[result.length - 1] += "\n\n" + remainingParagraphs.join("\n\n");
      }
      
      // Preenchemos com slides vazios se necessário
      while (result.length < slideCount) {
        result.push("");
      }
      
      return result;
    }
  
    /**
     * Distribui o conteúdo entre slides quando há mais parágrafos que slides
     */
    private distributeByContent(paragraphs: string[], slideCount: number): string[] {
      // Calcula o total de caracteres e a média por slide
      const totalChars = paragraphs.reduce((sum, p) => sum + p.length, 0);
      const targetCharsPerSlide = totalChars / slideCount;
      
      const result: string[] = [];
      let currentSlide = "";
      let currentChars = 0;
      
      for (const paragraph of paragraphs) {
        // Se adicionar este parágrafo ultrapassar muito o limite médio por slide
        // e já tivermos conteúdo, criamos um novo slide
        if (currentChars > 0 && 
            (currentChars + paragraph.length > targetCharsPerSlide * 1.3 || 
             currentChars + paragraph.length > this.MAX_CHARS_PER_SLIDE)) {
          result.push(currentSlide);
          currentSlide = paragraph;
          currentChars = paragraph.length;
        } else {
          // Adiciona o parágrafo ao slide atual
          if (currentSlide.length > 0) {
            currentSlide += "\n\n";
          }
          currentSlide += paragraph;
          currentChars += paragraph.length;
        }
        
        // Se atingimos o número máximo de slides menos 1,
        // acrescentamos todos os parágrafos restantes ao último slide
        if (result.length >= slideCount - 1) {
          break;
        }
      }
      
      // Adiciona o último slide
      if (currentSlide.length > 0) {
        result.push(currentSlide);
      }
      
      // Certifica que não criamos mais slides que o necessário
      if (result.length < slideCount) {
        // Se criamos menos slides que o requisitado, preenchemos com vazios
        while (result.length < slideCount) {
          result.push("");
        }
      } else if (result.length > slideCount) {
        // Se criamos mais slides que o requisitado, combinamos os últimos
        const extraSlides = result.splice(slideCount - 1);
        result[slideCount - 1] = result[slideCount - 1] + "\n\n" + extraSlides.join("\n\n");
      }
      
      return result;
    }
  }