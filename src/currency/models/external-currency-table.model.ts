import { ExternalCurrencyRate } from './external-currency-rate.model';

export interface ExternalCurrencyTable {
  table: string;
  no: string;
  tradingDate: string;
  effectiveDate: string;
  rates: ExternalCurrencyRate[];
}

export type ExternalCurrencyTableData = ExternalCurrencyTable[];
