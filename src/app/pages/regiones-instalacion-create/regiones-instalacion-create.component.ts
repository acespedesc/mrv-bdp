import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegionesInstalacion } from 'app/models/regiones-instalacion.interface';
import { RegionesInstalacionService } from 'app/services/regiones-instalacion.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-regiones-instalacion-create',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './regiones-instalacion-create.component.html',
  styleUrl: './regiones-instalacion-create.component.scss'
})
export class RegionesInstalacionCreateComponent {
  @Input() data: RegionesInstalacion | null = null;
  @Output() onCloseModal = new EventEmitter();
  private toastr = inject(ToastrService);
  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private regService: RegionesInstalacionService) {
    this.dataForm = this.fb.group({
      region: new FormControl('', [Validators.required]),
      ghi : new FormControl('', [Validators.required]),
      pvout : new FormControl('', [Validators.required]),
    });

  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        region : this.data.region,
        ghi : this.data.ghi,
        pvout : this.data.pvout                
      });
    }
  }


  onSubmit(){

    if(this.dataForm.valid)
    {
      if(this.data)
      {
        this.regService.actualizaRegionesInstalacion(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Region actualizado con exito!');
                this.data=null;
                
              }
            })
      }
      else
      {
        this.regService.crearRegionesInstalacion(this.dataForm.value).subscribe({
          next:(response: any) =>{
            this.resetdataForm();
            this.toastr.success('Region registrado con exito!');
            
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
