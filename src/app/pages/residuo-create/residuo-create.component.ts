import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Residuo } from 'app/models/residuo.interface';
import { ResiduoService } from 'app/services/residuo.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-residuo-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './residuo-create.component.html',
  styleUrl: './residuo-create.component.scss'
})
export class ResiduoCreateComponent {
  @Input() data: Residuo | null = null;
  @Output() onCloseModal = new EventEmitter();
  private toastr = inject(ToastrService);
  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private residuoService: ResiduoService) {
    this.dataForm = this.fb.group({
      clase: ['', Validators.required],
            
    });

  }
  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        clase : this.data.clase,
        
                        
      });
    }
  }

  onSubmit(){

    if(this.dataForm.valid)
    {
      if(this.data)
      {
        this.residuoService.actualizaResiduo(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Clase de Residuo actualizad');
                this.data=null;
                
              }
            })
      }
      else
      {
        
        this.residuoService.crearResiduo(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Residuo registrado con exito!');
            
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
