import { LowerCaseDirective } from './directive/lowerCase.directive';
import { UppercaseDirective } from './directive/uppercase.directive';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonComponent } from './button/button.component';
import { TableComponent } from './table/table.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    UppercaseDirective,
    LowerCaseDirective,
    ButtonComponent,
    TableComponent
  ],
  imports: [
    InputIconModule,
    IconFieldModule,
    PaginatorModule,
    InputTextModule,
    CommonModule,
    TableModule
  ],
  exports: [
    UppercaseDirective,
    LowerCaseDirective,
    ButtonComponent,
    TableComponent
  ]
})
export class ComponentsModule { }
