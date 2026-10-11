/**
 * Pinly Brand Configuration
 * All buyer-facing branding variables are kept here and configured via admin settings.
 */

export interface BrandConfig {
  name: string;
  taglineEn: string;
  taglineAr: string;
  primaryColor: string;
  inkColor: string;
  paperColor: string;
  logoText: string;
  supportEmail: string;
  version: string;
}

export const brandConfig: BrandConfig = {
  name: 'Pinly',
  taglineEn: 'Client review and approval platform for freelancers and small agencies',
  taglineAr: 'منصة مراجعة واعتماد الأعمال للعملاء والمستقلين والوكالات',
  primaryColor: '#FF5A3C', // Coral signal
  inkColor: '#0F1A2E',     // Ink navy
  paperColor: '#F7F5F0',   // Paper background
  logoText: 'Pinly',
  supportEmail: 'support@pinly.app',
  version: '1.0.0',
};
