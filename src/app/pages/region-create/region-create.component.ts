import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Agencia } from 'app/models/agencia.interface';
import { Region } from 'app/models/region.interface';
import { RegionService } from 'app/services/region.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-region-create',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './region-create.component.html',
  styleUrl: './region-create.component.scss'
})
export class RegionCreateComponent {
  @Input() data: Region | null = null;
  @Output() onCloseModal = new EventEmitter();
  private toastr = inject(ToastrService);
  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private regionService: RegionService) {
    this.dataForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      
      
    });

  }
  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        nombre : this.data.nombre,
        
                        
      });
    }
  }

  onSubmit(){

    if(this.dataForm.valid)
    {
      if(this.data)
      {
        this.regionService.actualizaRegion(this.data.id, this.dataForm.value)
            .subscribe({
              next:(response: any) =>{
                this.resetdataForm();
                this.toastr.success('Region actualizada con exito!');
                this.data=null;
                
              }
            })
      }
      else
      {
        
        this.regionService.crearRegion(this.dataForm.value).subscribe({
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
