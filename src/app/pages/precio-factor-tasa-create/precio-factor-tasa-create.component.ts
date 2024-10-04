import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrecioFactorTasa } from 'app/models/precio-factor-tasa.interface';
import { PrecioFactorTasaService } from 'app/services/precio-factor-tasa.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-precio-factor-tasa-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './precio-factor-tasa-create.component.html',
  styleUrl: './precio-factor-tasa-create.component.scss'
})
export class PrecioFactorTasaCreateComponent {
  @Input() data: PrecioFactorTasa | null = null;
  @Output() onCloseModal = new EventEmitter();
  dataForm!: FormGroup;
  private toastr = inject(ToastrService);

  constructor(private fb: FormBuilder, private pftService: PrecioFactorTasaService) {
    this.dataForm = this.fb.group({
      parametro: new FormControl('', [Validators.required]),
      fuente : new FormControl('', [Validators.required]),
      tipo : new FormControl('', [Validators.required]),
      unidad : new FormControl('', [Validators.required]),
      valor : new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
      
    });

  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        parametro: this.data.parametro,
        fuente : this.data.fuente,
        tipo : this.data.tipo,  
        descripcion: this.data.descripcion,      
        unidad : this.data.unidad,
        valor : this.data.valor
                        
      });
    }
  }
  onSubmit() {

    if (this.dataForm.valid) {
      if (this.data) {
        this.pftService.actualizaPrecioFactorTasa(this.data.id, this.dataForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetdataForm();
              this.toastr.success('Precio factor tasa actualizada con exito!');
              this.data = null;

            }
          })
      }
      else {

        this.pftService.crearPrecioFactorTasa(this.dataForm.value).subscribe({
          next: (response: any) => {
            this.resetdataForm();
            this.toastr.success('Precio factor tasa registrado con exito!');

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

  }
  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }

}
