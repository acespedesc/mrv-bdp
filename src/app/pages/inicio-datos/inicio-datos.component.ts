import { Component, inject, signal, ViewChild } from '@angular/core';
import { InicioDatosCreateComponent } from '../inicio-datos-create/inicio-datos-create.component';
import { ModalComponent } from 'app/components/modal/modal.component';
import { EcoeficienciaService } from 'app/services/ecoeficiencia.services';
import { Ecoeficiencia } from 'app/models/ecoeficiencia.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { EbFvComponent } from '../eb-fv/eb-fv.component';
import { InicioDatosReporteEcoComponent } from "../inicio-datos-reporte-eco/inicio-datos-reporte-eco.component";


@Component({
  selector: 'app-inicio-datos',
  standalone: true,
  imports: [InicioDatosCreateComponent, ModalComponent, CommonModule, FormsModule, MatPaginatorModule, MatTableModule, MatInputModule, EbFvComponent, InicioDatosReporteEcoComponent],
  templateUrl: './inicio-datos.component.html',
  styleUrl: './inicio-datos.component.scss'
})
export default class InicioDatosComponent {
  Ecoeficiencia!: Ecoeficiencia;
  ecoeficienciaId!: number;
  isModalOpen = false
  ecoService = inject(EcoeficienciaService);
  ecoeficiencias = signal<Ecoeficiencia[]>([]);
  displayedColumns: string[] = ['id', 'nro_solicitud', 'respaldo', 'monto_inv_me', 'produccion_energia_anual', 'reduccion_emisiones_anual', 'actions'];
  dataSource = new MatTableDataSource<Ecoeficiencia>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterId = '';
  private toastr = inject(ToastrService);
  isModalDocOpen = false;


  ngOnInit(): void {
    this.getEcoeficiencia();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getEcoeficiencia() {
    this.ecoService.getEcoeficiencia().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        this.ecoeficiencias.set(data);
        this.dataSource.data = data;
        this.applyFilter();
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Ecoeficiencia, filter: string) => {
      const [id] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true);
    };
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.getEcoeficiencia()

  }

  openModalDoc(ecoId: number) {
  //console.log(ecoId)
    this.ecoeficienciaId = ecoId
    /*this.ecoeficienciaId = ecoId*/
    this.isModalDocOpen = true;

  }
  closeModalDoc() {
    this.isModalDocOpen = false;

    //this.getArchivos(this.subcategoriaId)

  }

  deleteEcoeficiencia(id: number) {
    this.ecoService.eliminaEcoeficiencia(id).subscribe({
      next: () => {
        this.toastr.success('Registro de Ecoeficiencia Eliminado');
        this.getEcoeficiencia();
      },
    });
  }

}
