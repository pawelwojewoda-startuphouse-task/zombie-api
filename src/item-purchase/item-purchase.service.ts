import { HttpService, Injectable } from '@nestjs/common';
import { ExternalItem, ExternalItemData } from './../item/models';
import * as config from 'config';

const itemPurchaseApiConfig = config.get('itemPurchaseApi');

@Injectable()
export class ItemPurchaseService {
  public readonly itemPurchaseApiUrl: string = itemPurchaseApiConfig.url;

  public constructor(private httpService: HttpService) {}

  public async purchaseItems(
    externalItemIds: number[],
  ): Promise<ExternalItem[]> {
    if (externalItemIds.length === 0) {
      return [];
    }

    /*
      If status is different from 2xx, httpService will throw an exception.
      In this case, Nest will send 500 Internal Server Error as a response.
      This should be properly logged.
      Also, I am assuming this method performs appropriate payment logic. 
    */

    const response = await this.httpService
      .get<ExternalItemData>(this.itemPurchaseApiUrl)
      .toPromise();
    const { data } = response;

    /*
      Maybe do something with response / data...
    */

    const purchasedUniqueItems = data.items.filter((externalItem) =>
      externalItemIds.some(
        (externalItemId) => externalItemId === externalItem.id,
      ),
    );

    // We allow duplicated items, i. e. if a request with JSON "{ externalIds: [3, 3] }"
    // was sent, i. e. we allow purchasing the same item more than once.
    // Due to that, non-unique items need to be cloned:

    const purchasedDuplicatedItems = purchasedUniqueItems
      .map((uniqueItem) => {
        const occurrences = externalItemIds.filter((id) => id === uniqueItem.id)
          .length;
        return Array.from({ length: occurrences }, () =>
          Object.assign({}, uniqueItem),
        );
      })
      .flat();

    /*
      Maybe do something with purchasedItems...
    */

    return purchasedDuplicatedItems;
  }
}
