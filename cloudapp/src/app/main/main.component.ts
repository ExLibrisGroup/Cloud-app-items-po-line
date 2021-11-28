import { Subscription } from "rxjs";
import { concatMap, finalize } from "rxjs/operators";
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import {
  CloudAppEventsService,
  Entity,
  PageInfo,
  RestErrorResponse,
  AlertService,
  EntityType,
} from "@exlibris/exl-cloudapp-angular-lib";
import { Item } from "../models/item.model";
import { AlmaService } from "../services/alma.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  private pageLoad$: Subscription;
  isLoading: boolean = false;
  generateDescription : boolean =false;
  allEdit : boolean=false;
  items: Array<Item> = [];
  entities: Array<Entity> = [];

  constructor(
    private almaService: AlmaService,
    private eventsService: CloudAppEventsService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
    setInterval(
      () =>
        this.almaService
          .isPageEmpty()
          .subscribe({ next: (res) => (res ? null : (this.entities = [])) }),
      2000
    );
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  onPageLoad = (pageInfo: PageInfo) => {
    let pageContent = (pageInfo.entities || []).filter((e) =>
      [EntityType.ITEM].includes(e.type)
    );
    this.entities = pageContent.length > 0 ? pageContent : this.entities;
    if (pageContent.length > 0) {
      this.getItemsFromEntities().subscribe({
        next: (res: Item[]) => {
          this.items = res;
        },
        error: (err: RestErrorResponse) => {
          console.error(err);
          this.alertService.error(`Could not load item: ${err.message}`);
        },
      });
    }
  };

  getItemsFromEntities() {
    this.isLoading = true;
    return this.almaService
      .getItemsFromEntitiesArray(this.entities)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  onRestoreItem(idx: number) {
    if (idx !== -1) {
      this.isLoading = true;
      this.almaService
        .getBarcode(this.items[idx].item_data.barcode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (item: Item) => (this.items[idx] = item),
          error: (err: RestErrorResponse) => {
            console.error(err);
            this.alertService.error(`Could not restore item: ${err.message}`);
          },
          complete: () => {
            this.alertService.success(
              `Successfully restored ${this.items[idx].item_data.barcode}`
            );
          },
        });
    }
  }

  onSaveAllClicked() {
    this.isLoading = true;
    this.almaService
      .updateArrayOfItems(this.items,this.generateDescription)
      .pipe(
        finalize(() => (this.isLoading = false)),
        concatMap(() => this.eventsService.refreshPage())
      )
      .subscribe({
        next: () => {
          this.alertService.success("Successfully saved all items");
        },
        error: (err: RestErrorResponse) => {
          console.error(err);
          this.alertService.error(`Could not save item: ${err.message}`);
        },
      });
  }
  onSaveItem(data: { item: Item; idx: number }) {
    this.isLoading = true;
    this.almaService
      .updateItem(data.item,this.generateDescription)
      .pipe(
        finalize(() => (this.isLoading = false)),
        concatMap((item: Item) =>
          this.almaService.getItem(this.almaService.buildItemLink(item,null))
        ),
        concatMap(() => this.eventsService.refreshPage())
      )
      .subscribe({
        next: () => {
          this.alertService.success(`Successfully saved item`);
        },
        error: (err: RestErrorResponse) => {
          console.error(err);
          this.alertService.error(`Could not save item: ${err.message}`);
        },
      });
  }
  onRestoreAllItems() {
    this.getItemsFromEntities().subscribe({
      next: (res: Item[]) => {
        this.items = res;
        this.alertService.success(`Successfully restored all items`);
      },
      error: (err: RestErrorResponse) => {
        console.error(err);
        this.alertService.error(`Could not load item: ${err.message}`);
      },
    });
  }

  onEditAllItems() {
    console.log("onEditAllItems");
    this.allEdit = true;
  }

}
