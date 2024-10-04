import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { Usuario } from 'app/models/usuario.interface';
import { UsuarioService } from 'app/services/usuario.services';
import { ToastrService } from 'ngx-toastr';
import { UsuarioCreateComponent } from '../usuario-create/usuario-create.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ModalComponent,UsuarioCreateComponent,RouterModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export default class UsuarioComponent {
  usuarios = signal<Usuario[]>([]);
  Usuario!:Usuario;

  usuService=inject(UsuarioService);
  private toastr = inject(ToastrService);
  isModalOpen = false;

  ngOnInit(): void {
 
  this.getUsuarios();
    
  }

  getUsuarios() {
    this.usuService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        //console.log(data);
      },
      error: () => {},
    });
  }

  openModal() {
    this.isModalOpen = true;
    
  }

  loadUsuario(usuario: Usuario) {
    this.Usuario = usuario;
    this.openModal();
  }

  closeModal() {
    this.isModalOpen = false;
    this.getUsuarios();
    
  }

  deleteUsuario(id: number){
    console.log(id)

    this.usuService.eliminaUsuario(id).subscribe({
      next:(response) =>{
        
        this.toastr.success('Usuario Eliminado');
        this.getUsuarios()
        console.log("Usuario eliminado")
  
        //this.usuarios$ = this.usuService.getUsuarios()
  
      },
    });
  
  }

}
