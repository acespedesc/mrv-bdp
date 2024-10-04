import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from 'app/models/usuario.interface';
import { UsuarioService } from 'app/services/usuario.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './usuario-create.component.html',
  styleUrl: './usuario-create.component.scss'
})
export class UsuarioCreateComponent {
  @Input() data: Usuario | null = null;
  @Output() onCloseModal = new EventEmitter();
  dataForm!: FormGroup;
  private toastr = inject(ToastrService);


  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.dataForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      apellido_paterno: new FormControl('', [Validators.required]),
      apellido_materno: new FormControl('', [Validators.required]),
      nro_documento: new FormControl('', [Validators.required]),
      usuario: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required]),
      contraseña: new FormControl('', [Validators.required]),

    });
  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        nombre: this.data.nombre,
        apellido_paterno: this.data.apellido_paterno,
        apellido_materno: this.data.apellido_materno,
        nro_documento: this.data.nro_documento,
        usuario: this.data.usuario,
        correo: this.data.correo,
        contraseña: this.data.contraseña,

      });
    }
  }



  onSubmit() {

    if (this.dataForm.valid) {
      if (this.data) {
       // console.log("es edicion")
       //this.dataForm.get('contraseña')?.disable();
        this.usuarioService.actualizaUsuario(this.data.id, this.dataForm.value)
          .subscribe({
            next: (response: any) => {
              this.resetdataForm();
              this.toastr.success('Usuario Actualizado');
              this.data = null;
              console.log("Registro actualizado");
            },
            error: (err: any) => {
              this.toastr.error('Error al actualizar el usuario: ' + err.message);
              console.error("Error al actualizar el registro", err);
            }
          
          });

      }
      else {

        console.log(" es nuevo")
       // this.dataForm.get('contraseña')?.enable();
        this.usuarioService.crearUsuario(this.dataForm.value).subscribe({
          next: (response: any) => {
            this.resetdataForm();
            this.toastr.success('Usuario Creado');

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
    this.data=null;

  }
  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }

}
