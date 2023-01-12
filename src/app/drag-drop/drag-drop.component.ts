import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent {
  fileArr: any[] = [];

  upload(fileList: FileList) {
    if(this.fileArr.length == 0){
      const fileListAsArray: File[] = Array.from(fileList);
      console.log(this.fileArr);
      fileListAsArray.forEach((item, _index) => {
        this.fileArr.push({ file: item }); // archivos a mostrar en lista
      });
    }
  }

}
