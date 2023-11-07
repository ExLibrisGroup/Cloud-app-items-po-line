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
import { ItemPolicy } from "../services/item-policy.service";
import { CloudAppRestService } from "@exlibris/exl-cloudapp-angular-lib";


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
  material_types = this.materials.types
  policy_types ;

  @Input() opened: boolean =false;
  realBarcode: string;
  realTempCallNumber: string;
  realMaterialType: string;
  realPolicy: string;
  realCallNumber: string;
  realCopyId: string;

  get enumeration() {
    return ENUM;
  }
  get chronology() {
    return CHRON;
  }
  constructor(
    private materials: Materials,
    private policies : ItemPolicy,
    private restService: CloudAppRestService,
  ) {}
  ngOnInit(): void {
    let library = this.item.holding_data.in_temp_location ? this.item.holding_data.temp_library.value : this.item.item_data.library.value;
    if(!(library in this.policies.types)){
      this.restService.call('/conf/code-tables/ItemPolicy?scope=' + library).subscribe(
        result => {
          this.policies.types[library] = result.row;
          this.policies.types[library].unshift({code:'', description:' '});
          this.policy_types = this.policies.types[library]
        })
    }else{
      this.policy_types = this.policies.types[library]
    }
      
    
    this.realBarcode = this.item.item_data.barcode;
    this.realTempCallNumber = this.item.holding_data.temp_call_number;
    this.realMaterialType = this.item.item_data.physical_material_type.value;
    this.realPolicy  = this.item.item_data.policy.value;
    this.realCallNumber  = this.item.item_data.alternative_call_number;
    this.realCopyId  = this.item.holding_data.copy_id;
  }

  onRestoreItem() {
    this.item.item_data.barcode = this.realBarcode;
    this.item.holding_data.temp_call_number = this.realTempCallNumber;
    this.realMaterialType = this.item.item_data.physical_material_type.value;
    
    this.item.item_data.policy.value = this.realPolicy;
    this.item.item_data.alternative_call_number = this.realCallNumber;
    this.item.holding_data.copy_id = this.realCopyId;
    this.itemToRestore.emit(this.item);
  }
  onSaveItem() {
    this.opened = !this.opened;
    this.itemToSave.emit(this.item);
  }
}
