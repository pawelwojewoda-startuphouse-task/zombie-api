export enum ExternalCurrencyCode {
  Usd = 'USD',
  Eur = 'EUR',
}

export interface ExternalCurrencyRate {
  currency: string;
  code: ExternalCurrencyCode;
  bid: number;
  ask: number;
}
