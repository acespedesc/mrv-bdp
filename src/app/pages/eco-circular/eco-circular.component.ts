import { Component, inject, ViewChild } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { EcoCircularCreateComponent } from '../eco-circular-create/eco-circular-create.component';
import { InicioDatosCreateComponent } from "../inicio-datos-create/inicio-datos-create.component";
import { Circular } from 'app/models/circular.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EcoCircularService } from 'app/services/eco-circular.services';
import { EcoCircularReporteComponent } from "../eco-circular-reporte/eco-circular-reporte.component";

@Component({
  selector: 'app-eco-circular',
  standalone: true,
  imports: [ModalComponent, EcoCircularCreateComponent, InicioDatosCreateComponent, MatPaginatorModule, MatTableModule, MatInputModule, FormsModule, EcoCircularReporteComponent],
  templateUrl: './eco-circular.component.html',
  styleUrl: './eco-circular.component.scss'
})
export default class EcoCircularComponent {
  displayedColumns: string[] = ['id', 'nro_solicitud', 'respaldo', 'objetivo_operacion', 'ctd_residuos_rec', 'emision_gei_evi', 'actions'];
  dataSource = new MatTableDataSource<Circular>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterId = '';
  private toastr = inject(ToastrService);
  private ecoCirService = inject(EcoCircularService)
  ecoCircularId!: number;

  isModalOpen = false;
  isModalDocOpen = false;
  Circular!: Circular


  applyFilter() {
    this.dataSource.filterPredicate = (data: Circular, filter: string) => {
      const [id] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true);
    };
  }

  ngOnInit(): void {
    this.getEconomiaCircular();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getEconomiaCircular() {
    this.ecoCirService.getEconomiaCircular().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        //this.ecoeficiencias.set(data);
        this.dataSource.data = data;
        this.applyFilter();
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.getEconomiaCircular()

  }

  openModalDoc(ecoCirId: number) {
    console.log(ecoCirId)
    this.ecoCircularId = ecoCirId
    this.isModalDocOpen = true;
   
  }

  closeModalDoc() {
    this.isModalDocOpen = false;

  }

  deleteCircular(id: number) {
    this.ecoCirService.eliminaEcoCircular(id).subscribe({
      next: () => {
        this.toastr.success('Registro de Circular Eliminado');
        this.getEconomiaCircular();
      },
    });
  }
}
