import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subcategoria } from 'app/models/subcategoria.interface';
import { SubcategoriaService } from 'app/services/subcategoria.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subcategoria-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subcategoria-create.component.html',
  styleUrl: './subcategoria-create.component.scss'
})
export class SubcategoriaCreateComponent {
  @Input() data: Subcategoria | null = null;
  @Output() onCloseModal = new EventEmitter();

  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private subcategoriaService: SubcategoriaService, private toastr: ToastrService) {
    this.dataForm = this.fb.group({
      medida_estandar: new FormControl('', [Validators.required])

    });
  }
  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        medida_estandar: this.data.medida_estandar,

      });
    }
  }

  onSubmit() {

    if (this.dataForm.valid) {

      if(this.data)
      {
        this.subcategoriaService.actualizaSubcategoria(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Subcategoria Actualizada');
                this.data=null;
                console.log("Registro actualizado");
              }
            })

      }
      else
      {
        this.subcategoriaService.crearSubcategoria(this.dataForm.value).subscribe({
          next: (respomse: any) => {
            this.resetdataForm();
            this.toastr.success("Subcategoria creada")
            //alert("Proovedor creado")
          }
        });
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
