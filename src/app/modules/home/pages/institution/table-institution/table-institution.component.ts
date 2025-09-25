import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from "../../../../components/components.module";
import { Institution } from '../../../interfaces/Institution';
import { Column } from '../../../../components/interfaces/column';

@Component({
  selector: 'app-table-institution',
  templateUrl: './table-institution.component.html',
  styleUrls: ['./table-institution.component.css'],
  imports: [ComponentsModule]
})
export class TableInstitutionComponent implements OnInit {

  records!: Institution[];

  columns: Column[] = [
    { name: "Institution", value: "name" },
    { name: "Picture", value: "url", image: true }
  ]

  ngOnInit(): void {

  }

}
