import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.services';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'app/models/usuario.interface'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  @Input() data: Usuario | null = null;
  dataForm!: FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService,private toastr: ToastrService) {
    this.dataForm = this.fb.group({
      
      correo: new FormControl('', [Validators.required]),
      contraseña: new FormControl('', [Validators.required]),
      
    });
  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        
        correo: this.data.correo,
        contraseña: this.data.contraseña
       
      });
    }
  }

  onSubmit() {
    
    if (this.dataForm.valid) {
    
         this.authService.login(this.dataForm.value);
    }
    else
    {
      this.dataForm.markAllAsTouched();
    }

  }
}
