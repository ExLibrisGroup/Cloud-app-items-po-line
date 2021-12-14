import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Item } from "../models/item.model";
import { CHRON, ENUM } from "../static/constants";
import { Materials } from "../services/material-types.service"

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

  @Input() opened: boolean =false;
  realBarcode: string;
  realTempCallNumber: string;

  get enumeration() {
    return ENUM;
  }
  get chronology() {
    return CHRON;
  }
  constructor(
    private materials: Materials,
  ) {}

  ngOnInit(): void {
    this.realBarcode = this.item.item_data.barcode;
    this.realTempCallNumber = this.item.holding_data.temp_call_number;
  }

  onRestoreItem() {
    this.item.item_data.barcode = this.realBarcode;
    this.item.holding_data.temp_call_number = this.realTempCallNumber;
    this.itemToRestore.emit(this.item);
  }
  onSaveItem() {
    this.opened = !this.opened;
    this.itemToSave.emit(this.item);
  }
}
