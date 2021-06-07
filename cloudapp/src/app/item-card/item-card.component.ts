import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Item } from "../models/item.model";
import { CHRON, ENUM } from "../static/constants";

@Component({
  selector: "app-item-card",
  templateUrl: "./item-card.component.html",
  styleUrls: ["./item-card.component.scss"],
})
export class ItemCardComponent implements OnInit {
  @Input() item: Item;
  @Input() hideDescription: boolean;
  @Output() itemToRestore = new EventEmitter<Item>();
  @Output() itemToSave = new EventEmitter<Item>();

  opened: boolean =false;
  realBarcode: string;

  get enumeration() {
    return ENUM;
  }
  get chronology() {
    return CHRON;
  }
  constructor() {}

  ngOnInit(): void {
    this.realBarcode = this.item.item_data.barcode;
  }

  onRestoreItem() {
    this.item.item_data.barcode = this.realBarcode;
    this.itemToRestore.emit(this.item);
  }
  onSaveItem() {
    this.opened = !this.opened;
    this.itemToSave.emit(this.item);
  }
}
