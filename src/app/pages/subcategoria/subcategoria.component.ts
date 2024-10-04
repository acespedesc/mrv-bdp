import { Component, inject, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { ModalComponent } from 'app/components/modal/modal.component';
import { Subcategoria } from 'app/models/subcategoria.interface';
import { SubcategoriaService } from 'app/services/subcategoria.services';
import { ToastrService } from 'ngx-toastr';
import { SubcategoriaCreateComponent } from '../subcategoria-create/subcategoria-create.component';
import { InvversionElegibleComponent } from '../invversion-elegible/invversion-elegible.component';

@Component({
  selector: 'app-subcategoria',
  standalone: true,
  imports: [RouterLinkWithHref, ModalComponent, SubcategoriaCreateComponent, InvversionElegibleComponent],
  templateUrl: './subcategoria.component.html',
  styleUrl: './subcategoria.component.scss'
})
export default class SubcategoriaComponent {
  private subService = inject(SubcategoriaService)
  subcategorias = signal<Subcategoria[]>([]);
  
  Subcategoria! : Subcategoria;
  isModalOpen = false;
  isModalInvEleOpen = false;
  selectedSubcategoriaId: number | null=null;//almavena el id del provedor selecionado
  //selected: string | null=null;//almacena la razon social del provedor
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getSubcategorias();
    
  }

  getSubcategorias() {
    
    this.subService.getSubcategoria().subscribe({
      next: (data) => {
        this.subcategorias.set(data);
        //console.log("prueba de llamada a api "+  data);
      },
      error: () => {},
    });
  }

  loadSubcategoira(subcategoria: Subcategoria) {
    this.Subcategoria = subcategoria;
    this.openModal();
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.getSubcategorias()
    
  }

  deleteSubcategoria(id: number){

    this.subService.eliminaSubcategoria(id).subscribe({
      next:(response) =>{
        
        this.toastr.success('Subcategoria Eliminada');
        this.getSubcategorias()
        //console.log("Usuario eliminado")
  
        //this.usuarios$ = this.usuService.getUsuarios()
  
      },
    });
  
  }

  openModalInvElegible(subId :number) {

    console.log(subId)
    this.selectedSubcategoriaId=subId;
    //this.selectedRazonSocial= razonSocial;
    this.isModalInvEleOpen = true;

  }
  closeModalInvEle() {
    this.isModalInvEleOpen = false;
    //this.selectedProvedorId =null;
    //this.selectedRazonSocial =null
    //this.getProvedores()
    
  }

}


