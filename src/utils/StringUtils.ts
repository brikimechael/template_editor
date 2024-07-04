export function fillContent(content: string | undefined, params: Record<string, string> | undefined, delimiter: string|undefined): string | undefined {
    let openingDelimiter: string;
    let closingDelimiter: string;
  
    switch (delimiter) {
      case '${}':
        openingDelimiter = '\\${';
        closingDelimiter = '}';
        break;
      case '{{}}':
        openingDelimiter = '\\{\\{';
        closingDelimiter = '\\}\\}';
        break;
      default:
        openingDelimiter = '\\[\\[';
        closingDelimiter = '\\]\\]';
        break;
    }
    
    const regex = new RegExp(`${openingDelimiter}(.*?)${closingDelimiter}`, 'g');
  
    if (content !== undefined && params !== undefined) {
      return content.replace(regex, (match, key) => {
        return key in params ? params[key] : match;
      });
    }
  
    return content;
  }
  