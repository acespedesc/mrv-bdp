import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FacEmiTipoResiduo } from 'app/models/fac-emi-tipo-residuo.interface';
import { FacEmiTipoResiduoService } from 'app/services/fac-emi-tipo-residuo.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fac-emi-tipo-residuo-create',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './fac-emi-tipo-residuo-create.component.html',
  styleUrl: './fac-emi-tipo-residuo-create.component.scss'
})
export class FacEmiTipoResiduoCreateComponent {
  @Input() data: FacEmiTipoResiduo | null = null;
  @Output() onCloseModal = new EventEmitter();
  @Input() resiId: number | null = null;
  dataForm!: FormGroup;
  private toastr=inject(ToastrService)

  constructor(private fb: FormBuilder, private fetrService: FacEmiTipoResiduoService) {
    this.dataForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      fuente: new FormControl('', [Validators.required]),
      unidad: new FormControl('', [Validators.required]),
      valor: new FormControl('', [Validators.required]),
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
        fuente :this.data.fuente,
        unidad : this.data.unidad,
        valor : this.data.valor,
        residuoId: this.data.residuoId

      });
    }
  }

  onSubmit() {

    if (this.dataForm.valid) {
      if (this.data) {
        this.fetrService.actualizaFacEmiTipoResiduo(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Factor Emi. Tipo Residuo actualizado!');
                this.data=null;
                
              }
            })
      }
      else {
        
        this.dataForm.patchValue({
          residuoId: this.resiId //llave foranea
        });
        

        this.fetrService.crearFacEmiTipoResiduo(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Factor emision TipoResiduo registrado!');
            
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
