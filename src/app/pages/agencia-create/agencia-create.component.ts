import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Agencia } from 'app/models/agencia.interface';
import { AgenciaService } from 'app/services/agencia.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agencia-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agencia-create.component.html',
  styleUrl: './agencia-create.component.scss'
})
export class AgenciaCreateComponent {
  @Input() data: Agencia | null = null;
  @Output() onCloseModal = new EventEmitter();
  @Input() regionId: number | null = null;
  private toastr=inject(ToastrService)
  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private agenciaService: AgenciaService) {
    this.dataForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      regionId: new FormControl('')
    });

  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['regionId'] && this.regionId) {
      //this.getArchivos(this.subcategoriaId);
      console.log(this.regionId)
    }
    if (this.data) {
      this.dataForm.patchValue({
        nombre: this.data.nombre,
        regionId: this.data.regionId

      });
    }
  }



  onSubmit() {

    if (this.dataForm.valid) {
      if (this.data) {
        this.agenciaService.actualizaAgencia(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Agencia actualizada!');
                this.data=null;
                
              }
            })
      }
      else {
        
        this.dataForm.patchValue({
          regionId: this.regionId //llave foranea
        });
        

        this.agenciaService.crearAgencia(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Agencia registrada con exito!');
            
          }
        })
      }

    }
    else {
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
