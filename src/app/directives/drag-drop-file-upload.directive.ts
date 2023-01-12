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
  @Output() fileDropped = new EventEmitter<File>();

  @HostBinding('style.background-color')
  private background = '#ffffff';

  @HostBinding('style.background-image')
  private image = 'url("./assets/upload-icon.png")';

  @HostBinding('style.border')
  private border = '';

  // Dragover Event - cambia el color del div al arrastar el archivo
  @HostListener('dragover', ['$event'])
  dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#E2FDE3';
    this.border = '2px dashed #075F0A';
  }

  // Dragleave Event - se suelta el evento y cambia color
  @HostListener('dragleave', ['$event'])
  public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff';
    this.border = '';
  }

  // Drop Event - al soltar el archivo
  @HostListener('drop', ['$event'])
  public drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#ffffff';
    this.border = '';

    const file: File = event.dataTransfer!.files[0]; // cantidad de archivos adjuntos

    this.fileDropped.emit(file);
  }
}
