import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Caedec } from 'app/models/caedec.interface';
import { CaedecService } from 'app/services/caedec.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caedec-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './caedec-create.component.html',
  styleUrl: './caedec-create.component.scss'
})
export class CaedecCreateComponent {
  @Input() data: Caedec | null = null;
  @Output() onCloseModal = new EventEmitter();
  private toastr = inject(ToastrService);

  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private caedecService: CaedecService) {
    this.dataForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      actividad : new FormControl('', [Validators.required]),
    });

  }
  autoExpand(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    //textarea.style.height = 'auto'; // Resetear altura para que se ajuste
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar a la altura del contenido
}

  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        nombre : this.data.nombre,
        actividad : this.data.actividad
                
      });
    }
  }

  onSubmit(){

    if(this.dataForm.valid)
    {
      if(this.data)
      {
        
        this.caedecService.actualizaCaedec(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Caedec Modificado con exito!');
                this.data=null;
                
              }
            })
      }
      else
      {
        
        this.caedecService.crearCaedec(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Caedec registrado con exito!');
            
          }
        })
      }

    }
    else
    {
      this.dataForm.markAllAsTouched();
    }

  }

  onClose() {
    this.onCloseModal.emit(false);
    this.dataForm.reset();
  }
  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }
}
