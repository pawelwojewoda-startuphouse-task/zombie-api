import { HttpService } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ExternalCurrencyCode, ExternalCurrencyTableData } from './models';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpServiceMock: HttpService = null;

  function mockHtttpService(response) {
    httpServiceMock = {
      get: jest.fn().mockImplementation(() => of(response)),
    } as any;
  }

  const externalCurrencyTableData: ExternalCurrencyTableData = [
    {
      table: 'C',
      no: '248/C/NBP/2020',
      tradingDate: '2020-12-18',
      effectiveDate: '2020-12-21',
      rates: [
        {
          currency: 'dolar amerykański',
          code: ExternalCurrencyCode.Usd,
          bid: 3.6322,
          ask: 3.7056,
        },
        {
          currency: 'dolar australijski',
          code: 'AUD' as ExternalCurrencyCode,
          bid: 2.7614,
          ask: 2.8172,
        },
        {
          currency: 'euro',
          code: ExternalCurrencyCode.Eur,
          bid: 4.4451,
          ask: 4.5349,
        },
      ],
    },
  ];

  const response: AxiosResponse<ExternalCurrencyTableData> = {
    data: externalCurrencyTableData,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  beforeEach(() => {
    mockHtttpService(response);

    service = new CurrencyService(httpServiceMock);
  });

  describe('Initialization', () => {
    it('should be defined ', () => {
      // Arrange (Given)
      // -

      // Act (When)
      // -

      // Assert (Then)
      expect(service).toBeDefined();
    });

    it('should be initialized with appropriate EUR and USD rates', async () => {
      // Arrange (Given)
      // -

      // Act (When)
      const plnToEurRate = await service.getPlnToEurRate();
      const plnToUsdRate = await service.getPlnToUsdRate();

      // Assert (Then)
      expect(plnToEurRate).toStrictEqual(4.5349);
      expect(plnToUsdRate).toStrictEqual(3.7056);
    });

    it('should perform HTTP call only once, upon initialization', async () => {
      // Arrange (Given)
      // -

      // Act (When) + Assert (Then)
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
      await service.convertPlnToEur(0);
      await service.convertPlnToUsd(0);
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Calculation', () => {
    it('should return integer numbers', async () => {
      // Arrange (Given)
      const plnAmount = 1111;

      // Act (When)
      const amountInEur = await service.convertPlnToEur(plnAmount);
      const amountInUsd = await service.convertPlnToUsd(plnAmount);

      // Assert (Then)
      expect(Number.isInteger(amountInEur)).toStrictEqual(true);
      expect(Number.isInteger(amountInUsd)).toStrictEqual(true);
    });

    it('should correctly convert between currencies', async () => {
      // Arrange (Given)
      const plnAmount = 2222;

      // Act (When)
      const amountInEur = await service.convertPlnToEur(plnAmount);
      const amountInUsd = await service.convertPlnToUsd(plnAmount);

      // Assert (Then)
      expect(amountInEur).toStrictEqual(489);
      expect(amountInUsd).toStrictEqual(599);
    });
  });
});
