import { Injectable } from "@angular/core";
import {
  CloudAppEventsService,
  CloudAppRestService,
  Entity,
  EntityType,
  HttpMethod,
  PageInfo,
  Request as ExRequest
} from "@exlibris/exl-cloudapp-angular-lib";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Item } from "../models/item.model";

@Injectable({
  providedIn: "root",
})
export class AlmaService {
  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService
  ) {}

  isPageEmpty(): Observable<boolean> {
    return this.eventsService.getPageMetadata().pipe(
      map<PageInfo, boolean>((pageInfo: PageInfo) => {
        let pageContent = (pageInfo.entities || []).filter((e) =>
          [EntityType.ITEM].includes(e.type)
        );
        return pageContent.length > 0;
      })
    );
  }

  getBarcode(barcode: string): Observable<Item> {
    return this.restService.call<Item>(`/items?item_barcode=${barcode}`);
  }

  getItem(link: string): Observable<Item> {
    return this.restService.call<Item>({
      url: link,
      queryParams:{view:'label'}
    });
  }

  getItemsFromEntitiesArray(entities: Array<Entity>) {
    let observables = [];
    entities.forEach((entity) => observables.push(this.getItem(entity.link)));
    return forkJoin(observables);
  }

  buildItemLink(item: Item ,generateDescription:boolean) {
    if (generateDescription==null) // For building link for get
    { 
      return `/bibs/${item.bib_data.mms_id}/holdings/${item.holding_data.holding_id}/items/${item.item_data.pid}`;
    }
    return `/bibs/${item.bib_data.mms_id}/holdings/${item.holding_data.holding_id}/items/${item.item_data.pid}?generate_description=${generateDescription}`;
  }
  updateItem(item: Item,generateDescription : boolean) {
    let req: ExRequest = {
      requestBody: item,
      url: this.buildItemLink(item,generateDescription),
      method: HttpMethod.PUT,
    };
    return this.restService.call<Item>(req);
  }
  updateArrayOfItems(items: Item[],generateDescription : boolean) {
    let observables = [];
    items.forEach((item) => observables.push(this.updateItem(item,generateDescription)));
    return forkJoin(observables);
  }
}
