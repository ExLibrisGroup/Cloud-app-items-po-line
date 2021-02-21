import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import {
  MaterialModule,
  getTranslateModule,
  AlertModule,
} from "@exlibris/exl-cloudapp-angular-lib";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MainComponent } from "./main/main.component";
import { ItemCardComponent } from "./item-card/item-card.component";
import { ItemsListComponent } from "./items-list/items-list.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ItemCardComponent,
    ItemsListComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AlertModule,
    MatExpansionModule,
    getTranslateModule(),
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "standard" },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
