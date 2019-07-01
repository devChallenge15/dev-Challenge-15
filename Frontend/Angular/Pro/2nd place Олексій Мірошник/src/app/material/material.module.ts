import {NgModule} from '@angular/core';
import {MatButtonModule, MatCardModule, MatToolbarModule} from '@angular/material';

const modules: any[] = [
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {
}
