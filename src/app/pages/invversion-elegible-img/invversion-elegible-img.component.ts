import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-invversion-elegible-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invversion-elegible-img.component.html',
  styleUrl: './invversion-elegible-img.component.scss'
})
export class InvversionElegibleImgComponent {

  @Output() onCloseModalImg = new EventEmitter();
  @Input() pdfbase64!: string;

  getImageSrc(): string {
    // Ajusta el tipo MIME según el tipo de imagen que estás usando (e.g., image/png, image/jpeg)
    return `data:image/png;base64,${this.pdfbase64}`;
  }

}
