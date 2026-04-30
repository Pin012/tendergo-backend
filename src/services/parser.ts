import { TenderSearchItem } from '../types';

/**
 * Service for parsing PCC website HTML.
 * Note: Since we are in Workers without DOM, we use Regex and String manipulation.
 */
export class ParserService {
  static parseSearchList(html: string, baseUrl: string): TenderSearchItem[] {
    const items: TenderSearchItem[] = [];
    
    // Regex optimized for the specific structure of web.pcc.gov.tw search results
    // This is a simplified illustrative version; production might need more specific selector-like regex
    const rowRegex = /<tr class="(?:odd|even)">([\s\S]*?)<\/tr>/g;
    let match;
    
    while ((match = rowRegex.exec(html)) !== null) {
      const rowHtml = match[1];
      
      // Basic extraction via regex
      const tenderIdMatch = rowHtml.match(/<td align="left">([A-Z0-9-]+)<\/td>/);
      const titleMatch = rowHtml.match(/<a title="([^"]+)"/);
      const orgMatch = rowHtml.match(/<td[^>]*>([^<]+)<\/td>/); // Org usually first column
      const urlMatch = rowHtml.match(/href="([^"]+)"/);
      const dateMatch = rowHtml.match(/(\d{3}\/\d{2}\/\d{2})/g); // Notice/End dates

      if (tenderIdMatch && titleMatch) {
        const url = urlMatch ? (urlMatch[1].startsWith('http') ? urlMatch[1] : `${baseUrl}${urlMatch[1]}`) : '';
        items.push({
          tenderId: tenderIdMatch[1].trim(),
          title: titleMatch[1].trim(),
          orgName: orgMatch ? orgMatch[1].trim() : '',
          noticeDate: dateMatch ? dateMatch[0] : '',
          endDate: dateMatch && dateMatch.length > 1 ? dateMatch[1] : '',
          awardStatus: rowHtml.includes('已決標') ? '已決標' : '招標中',
          supplierName: '', // Filled in detail phase if needed
          tenderUrl: url
        });
      }
    }
    
    return items;
  }

  static parseDetailSupplier(html: string): string {
    // Attempt to find the winner column or row in the detail page
    // Usually defined in a <td> after "得標廠商" or "得標廠商名稱"
    const supplierRegex = /得標廠商(?:名稱)?[:\s]*<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/;
    const match = html.match(supplierRegex);
    
    if (match) {
      // Clean up HTML tags and whitespace
      return match[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Fallback search in tables
    const fallbackRegex = /<td[^>]*>\s*得標廠商\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/;
    const fallbackMatch = html.match(fallbackRegex);
    return fallbackMatch ? fallbackMatch[1].replace(/<[^>]*>/g, '').trim() : '';
  }
}
