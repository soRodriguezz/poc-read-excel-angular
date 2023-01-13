import { Component } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import * as XLSX from 'xlsx';

interface Result {
  rut: string;
  gerencia: string;
  necesidad: string;
}

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css'],
})
export class DragDropComponent {
  public excelList: File[] = [];
  public results: Result[] = [];

  upload(excel: File) {
    if (!excel || this.excelList.length) return;

    this.excelList.push(excel);

    const excelObservable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(excel, subscriber);
    });

    excelObservable.subscribe((datos: Result[]) => {
      console.log(datos);
      this.results = datos;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (progressEvent: any) => {
      const { result } = progressEvent.target;
      let headers: any = {};
      let valido: boolean = true;

      const wb: XLSX.WorkBook = XLSX.readFile(result); // se lee el excel

      const workSheetName: string = wb.SheetNames[0]; // siempre toma la hoja 1

      const workSheet: XLSX.WorkSheet = wb.Sheets[workSheetName]; // lee filas y columnas de la hoja 1

      // * Validacion de encabezados
      for (let z in workSheet) {
        if (z[0] === '!') continue; // limpia las columnas que no sirven

        // obtiene la columna, la fila y el valor
        let col = z.substring(0, 1);
        let row = parseInt(z.substring(1));
        let value = workSheet[z].v;

        // almacenar nombres de encabezado
        if (row == 1) {
          headers[col] = value;
        }

        if (
          headers['A'] != 'rut' &&
          headers['B'] != 'gerencia' &&
          headers['C'] != 'necesidad'
        ) {
          valido = false;
        }
      }

      if (!valido) {
        console.log('no cumple el formato');
      }

      // * Valida que las columnas no esten vacias, que sean numeros y que los valores sean de 0 a 10
      // for (let cell in workSheet) {
      //   // Aquí se comprueba que la celda no esté vacía
      //   if (workSheet[cell].v === '' || workSheet[cell].v === null) {
      //     console.log('Error: Celda vacía.');
      //   }
      //   // Aquí se comprueba que el valor de la celda sea un número
      //   if (typeof workSheet[cell].v !== 'number') {
      //     console.log('Error: El valor de la celda no es un número.');
      //   }
      //   // Aquí se comprueba que el valor de la celda esté dentro de un rango
      //   if (workSheet[cell].v < 0 || workSheet[cell].v > 10) {
      //     console.log('Error: El valor de la celda no está dentro del rango.');
      //   }
      // }

      const data: Result[] = XLSX.utils.sheet_to_json(workSheet);

      const formarJSON = data.map((dato: Result) => {
        return {
          rut: dato.rut ? dato.rut : null,
          gerencia: dato.gerencia ? dato.gerencia : null,
          necesidad: dato.necesidad ? dato.necesidad : null,
        };
      });

      // * cuenta los datos nulos por fila
      let nullFields: any = [];
      let rutNulos: number = 0;
      let gerenciaNulos: number = 0;
      let necesidadNulos: number = 0;

      // Recorrer la matriz de objetos
      formarJSON.forEach((row: any) => {
        // Recorrer cada columna
        Object.keys(row).forEach((field: string) => {
          // Comprobar si el valor de la columna es nulo
          if (row[field] === null) {
            if (field === 'rut') {
              rutNulos += 1;
            }
            if (field === 'gerencia') {
              gerenciaNulos += 1;
            }
            if (field === 'necesidad') {
              necesidadNulos += 1;
            }
            // Agregar el nombre de la columna a la lista
            nullFields.push(field);
          }
        });
      });

      console.log( nullFields );
      console.log( `Ruts vacios: ${ rutNulos }` );
      console.log( `Gerencias vacias: ${ gerenciaNulos }` );
      console.log( `Necesidades vacias: ${ necesidadNulos }` );

      subscriber.next( formarJSON ); // retorna los datos al subscribirse
      subscriber.complete(); // termina la subscripcion
    };
  }

  eliminarAdjunto() {
    this.excelList = [];
    this.results = [];
  }
}
