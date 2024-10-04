import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LineaBase } from 'app/models/linea-base.interface';
import { LineaBaseService } from 'app/services/linea-base.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-linea-base-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './linea-base-create.component.html',
  styleUrl: './linea-base-create.component.scss'
})
export class LineaBaseCreateComponent {

  @Input() data: LineaBase | null = null;
  @Output() onCloseModal = new EventEmitter();
  private toastr = inject(ToastrService);
  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private lineaBaseService: LineaBaseService) {
    this.dataForm = this.fb.group({
      proyecto: new FormControl('', [Validators.required]),
      tipo_linea_base: new FormControl('', [Validators.required]),
      tecnologia : new FormControl('', [Validators.required]),
      tipo_tecnologia : new FormControl('', [Validators.required]),
      unidad_medida : new FormControl('', [Validators.required]),
      medida : new FormControl('', [Validators.required]),
      
    });

  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        proyecto : this.data.proyecto,
        tipo_linea_base: this.data.tipo_linea_base,
        tecnologia : this.data.tecnologia,
        tipo_tecnologia : this.data.tipo_tecnologia,
        unidad_medida : this.data.unidad_medida,
        medida : this.data.medida
                        
      });
    }
  }



  onSubmit(){

    if(this.dataForm.valid)
    {
      if(this.data)
      {
        this.lineaBaseService.actualizaLineaBase(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Linea Base actualizada con exito!');
                this.data=null;
                
              },
              error: (err: any) => {
                  // Manejar el error
                  console.error('Error al actualizar la Línea Base:', err);
                  this.toastr.error('No se pudo actualizar la Línea Base. Inténtelo nuevamente más tarde.');
              }
            })
      }
      else
      {
        
        this.lineaBaseService.crearLineaBase(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Linea Base registrado con exito!');
            
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
    
  }
  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }

}
