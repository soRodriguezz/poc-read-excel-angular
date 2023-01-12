import {
  Directive,
  EventEmitter,
  Output,
  HostListener,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[appDragDropFileUpload]',
})
export class DragDropFileUploadDirective {
  @Output() fileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#ffffff';

  // Dragover Event - cambia el color del div al arrastar el archivo
  @HostListener('dragover', ['$event']) dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#e2eefd';
  }

  // Dragleave Event - se suelta el evento y cambia color
  @HostListener('dragleave', ['$event']) public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff';
  }

  // Drop Event - al soltar el archivo
  @HostListener('drop', ['$event']) public drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff';

    const files: FileList  = event.dataTransfer!.files; // cantidad de archivos adjuntos

    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
