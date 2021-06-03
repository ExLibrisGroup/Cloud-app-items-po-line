import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Item } from "../models/item.model";

@Component({
  selector: "app-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.scss"],
})
export class ItemsListComponent implements OnInit {
  @Input() items: Item[];
  @Input() hideDescription : boolean;
  @Output() itemToRestore = new EventEmitter<number>();
  @Output() itemToSave = new EventEmitter<{ item: Item; idx: number }>();

  constructor() {}

  ngOnInit(): void {}

  onRestoreItem(item: Item) {
    let idx = -1;
    this.items.forEach((tmp, index) => {
      if (tmp.item_data.pid === item.item_data.pid) {
        idx = index;
      }
    });
    this.itemToRestore.emit(idx);
  }
  onSaveItem(item: Item) {
    let idx = -1;
    this.items.forEach((tmp, index) => {
      if (tmp.item_data.pid === item.item_data.pid) {
        idx = index;
      }
    });
    this.itemToSave.emit({ item: item, idx: idx });
  }
}
