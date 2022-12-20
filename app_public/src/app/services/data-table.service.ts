import { Injectable } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {



  constructor() { }
  
  private createLanguageOptions(collection_pname: string,collection_sname:string){
    let dtLanguage: DataTables.LanguageSettings = {
      lengthMenu: `Mostrando _MENU_ ${collection_pname}`,
      info: `Mostrando de _START_ a _END_ de _TOTAL_ ${collection_pname}`,
      infoEmpty: `Mostrando 0 a 0 de 0 ${collection_pname}`,
      infoFiltered: `(filtrado de un total de _MAX_ ${collection_pname})`,
      loadingRecords: "Cargando...",
      processing: "Procesando...",
      zeroRecords: `No se ha encontrado un ${collection_sname} coincidente`,
      search: 'Buscar:',
      paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior'
      }
    }
    return dtLanguage;
  }

  public createDtOptions(collection_pname: string,collection_sname:string): any{
    let dtOptions: any =  {
      responsive: true,
      language: this.createLanguageOptions(collection_pname,collection_sname),
      columnDefs: [
        {
          targets:0,
          responsivePriority: 1
        },
        {
          targets:-1,
          orderable: false,
          responsivePriority: 2
        },
        {
          targets:-2,
          orderable: false,
          responsivePriority: 2
        },
      ],
      colReorder: {
        fixedColumnsRight: 2
      }
    };
    return dtOptions;
  }

  public rerender(dtElement:DataTableDirective,dtTrigger:Subject<any>, data:any): void {
    dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      dtTrigger.next(data);
    });
  }
}
