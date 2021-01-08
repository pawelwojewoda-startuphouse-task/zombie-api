import { HttpService, Injectable } from '@nestjs/common';
import { ExternalCurrencyTableData, ExternalCurrencyCode } from './models';
import * as config from 'config';

const currencyApiConfig = config.get('currencyApi');

@Injectable()
export class CurrencyService {
  public readonly currencyApiUrl: string = currencyApiConfig.url;

  private plnToUsdRate = null;
  private plnToEurRate = null;
  private isReadyPromise: Promise<void>;

  public constructor(private httpService: HttpService) {
    this.isReadyPromise = this.init();
  }

  public async convertPlnToEur(plnAmount: number): Promise<number> {
    await this.isReadyPromise;
    return Math.floor(plnAmount / this.plnToEurRate);
  }

  public async convertPlnToUsd(plnAmount: number): Promise<number> {
    await this.isReadyPromise;
    return Math.floor(plnAmount / this.plnToUsdRate);
  }

  public async getPlnToEurRate(): Promise<number> {
    await this.isReadyPromise;
    return this.plnToEurRate;
  }

  public async getPlnToUsdRate(): Promise<number> {
    await this.isReadyPromise;
    return this.plnToUsdRate;
  }

  private async init(): Promise<void> {
    const response = await this.httpService
      .get<ExternalCurrencyTableData>(this.currencyApiUrl)
      .toPromise();

    const { data } = response;

    this.plnToEurRate = data[0].rates.find(
      (rate) => rate.code === ExternalCurrencyCode.Eur,
    ).ask;
    this.plnToUsdRate = data[0].rates.find(
      (rate) => rate.code === ExternalCurrencyCode.Usd,
    ).ask;
  }
}
