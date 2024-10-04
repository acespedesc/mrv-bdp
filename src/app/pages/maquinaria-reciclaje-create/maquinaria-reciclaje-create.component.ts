import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaquinariaReciclaje } from 'app/models/maquinaria-reciclaje.interface';
import { MaquinariaReciclajeService } from 'app/services/maquinaria-reciclaje.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maquinaria-reciclaje-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './maquinaria-reciclaje-create.component.html',
  styleUrl: './maquinaria-reciclaje-create.component.scss'
})
export class MaquinariaReciclajeCreateComponent {
  @Input() data: MaquinariaReciclaje | null = null;
  @Output() onCloseModal = new EventEmitter();

  @Input() resiId: number | null = null;
  dataForm!: FormGroup;
  private toastr=inject(ToastrService)

  constructor(private fb: FormBuilder, private maqReciclajeService: MaquinariaReciclajeService) {
    this.dataForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      residuoId: new FormControl('')
    });

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['resiId'] && this.resiId) {
      //this.getArchivos(this.subcategoriaId);
      console.log(this.resiId)
    }
    if (this.data) {
      this.dataForm.patchValue({
        nombre: this.data.nombre,
        residuoId: this.data.residuoId

      });
    }
  }



  onSubmit() 
  {
    this.dataForm.patchValue({
      residuoId: this.resiId //llave foranea
    });
    
    if (this.dataForm.valid) {
      if (this.data) {
        this.maqReciclajeService.actualizaMaquinariaReciclaje(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Factor Emi. Tipo Residuo actualizado!');
                this.data=null;
                
              }
            })
      }
      else {
        
           

        this.maqReciclajeService.crearMaquinariaReciclaje(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Maquinaria de Reciclaje registrado!');
            
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
