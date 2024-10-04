import { Component, inject, ViewChild } from '@angular/core';
import { ResiduoCreateComponent } from "../residuo-create/residuo-create.component";
import { ModalComponent } from 'app/components/modal/modal.component';
import { Residuo } from 'app/models/residuo.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ResiduoService } from 'app/services/residuo.services';
import { ToastrService } from 'ngx-toastr';
import { FacEmiTipoResiduoComponent } from "../fac-emi-tipo-residuo/fac-emi-tipo-residuo.component";
import { MaquinariaReciclajeComponent } from "../maquinaria-reciclaje/maquinaria-reciclaje.component";

@Component({
  selector: 'app-residuo',
  standalone: true,
  imports: [ResiduoCreateComponent, ModalComponent, MatPaginatorModule, MatTableModule, MatInputModule, FacEmiTipoResiduoComponent, MaquinariaReciclajeComponent],
  templateUrl: './residuo.component.html',
  styleUrl: './residuo.component.scss'
})
export default class ResiduoComponent {

  Residuo!:Residuo;
  isModalOpen= false;
  dataSource = new MatTableDataSource<Residuo>([]);
  displayedColumns: string[] = ['id', 'clase','actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  resService = inject(ResiduoService);
  private toastr = inject(ToastrService);
  isModalFacEmiTipResOpen=false;
  isModalMaqReciOpen = false
  selectedResiduoId: number | null=null;
  selectedClase: string | null=null;


  ngOnInit(): void {
    this.getResiduo();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getResiduo() {
    this.resService.getResiduo().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        //this.region.set(data);
        this.dataSource.data = data;
        
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }
  loadResiduo(res: Residuo) {

    //console.log(res)
    this.Residuo = res;
    this.openModal();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.getResiduo();
    
  }
  deleteResiduo(id: number) {
    this.resService.eliminaResiduo(id).subscribe({
      next: () => {
        this.toastr.success('Clase de residuo Eliminada');
        this.getResiduo();
      },
    });
  }


  openModalFacEmiTipoRes(resId :number, clase: string) {

    //console.log(regId)
    this.selectedResiduoId = resId;
    this.selectedClase = clase;
    //this.selectedRazonSocial= razonSocial;
    this.isModalFacEmiTipResOpen = true;

  }


  closeModalFacEmiTipoRes() {
    this.isModalFacEmiTipResOpen = false;
    this.getResiduo();
    //this.selectedProvedorId =null;
    //this.selectedRazonSocial =null
    
    
  }


  openModalMaqReciclaje(resId :number, clase: string) {

    //console.log(regId)
    this.selectedResiduoId = resId;
    this.selectedClase = clase;
    //this.selectedRazonSocial= razonSocial;
    this.isModalMaqReciOpen = true;

  }
  closeModalMaqReciclaje() {

    this.isModalMaqReciOpen = false;
    this.getResiduo();

  }

}
