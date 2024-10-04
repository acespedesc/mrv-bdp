import { Component, inject, signal, ViewChild } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { RegionCreateComponent } from '../region-create/region-create.component';
import { Region } from 'app/models/region.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RegionService } from 'app/services/region.services';
import { ToastrService } from 'ngx-toastr';
import { AgenciaComponent } from "../agencia/agencia.component";



@Component({
  selector: 'app-region',
  standalone: true,
  imports: [ModalComponent, RegionCreateComponent, CommonModule, FormsModule, MatPaginatorModule, MatTableModule, MatInputModule, AgenciaComponent],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss'
})
export default class RegionComponent {
  isModalOpen = false;
  isModalAgenciaOpen = false;
  Region!: Region;
  region = signal<Region[]>([]);
  dataSource = new MatTableDataSource<Region>([]);
  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  regService = inject(RegionService);
  private toastr = inject(ToastrService);
  selectedRegionId: number | null = null;//almacena el id de la region
  selectedNombreReg: string | null = null;//almacena el id de la region

  ngOnInit(): void {
    this.getRegion();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getRegion() {
    this.regService.getRegion().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        this.region.set(data);
        this.dataSource.data = data;

      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }

  loadRegion(reg: Region) {

    console.log(reg)
    this.Region = reg;
    this.openModal();
  }
  closeModal() {
    this.isModalOpen = false;
    this.getRegion();
  }

  openModal() {
    this.isModalOpen = true;
  }
  deleteRegion(id: number) {
    this.regService.eliminaRegion(id).subscribe({
      next: () => {
        this.toastr.success('Region Eliminada');
        this.getRegion();
      },
    });
  }

  openModalAgencia(regId: number, nombreReg: string) {

    //console.log(regId)
    this.selectedRegionId = regId;
    this.selectedNombreReg = nombreReg;
    //this.selectedRazonSocial= razonSocial;
    this.isModalAgenciaOpen = true;

  }
  closeModalAgencia() {
    this.isModalAgenciaOpen = false;
    this.getRegion();
    //this.selectedProvedorId =null;
    //this.selectedRazonSocial =null


  }

}
