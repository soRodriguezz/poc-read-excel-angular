import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css'],
})
export class DragDropComponent {

  @ViewChild('fileDragDrop') fileDragDrop!: ElementRef;

  excelList: File[] = [];

  upload(excel: File) {

    if(!excel || this.excelList.length) return;

    this.excelList.push(excel);

    const excelObservable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(excel, subscriber);
    });

    excelObservable.subscribe(d => {
      console.log(d);
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);


    fileReader.onload = ( progressEvent: any) => {
      const { result } = progressEvent.target;

      const wb: XLSX.WorkBook = XLSX.read(result, { type: 'buffer' }); // se lee el excel

      const wsname: string = wb.SheetNames[0]; // siempre toma la hoja 1

      const ws: XLSX.WorkSheet = wb.Sheets[wsname]; // lee filas y columnas de la hoja 1

      const data = XLSX.utils.sheet_to_json(ws);

      subscriber.next(data); // retorna los datos al subscribirse
      subscriber.complete(); // termina la subscripcion
    };
  }

  eliminarAdjunto() {
    this.excelList = [];
  }
}
