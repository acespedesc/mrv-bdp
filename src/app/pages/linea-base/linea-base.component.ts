import { Component, inject, signal, ViewChild } from '@angular/core';
import { LineaBaseCreateComponent } from '../linea-base-create/linea-base-create.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'app/components/modal/modal.component';
import { LineaBase } from 'app/models/linea-base.interface';
import { LineaBaseService } from 'app/services/linea-base.services';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-linea-base',
  standalone: true,
  imports: [LineaBaseCreateComponent, ModalComponent, CommonModule, FormsModule, MatPaginatorModule, MatTableModule, MatInputModule],
  templateUrl: './linea-base.component.html',
  styleUrl: './linea-base.component.scss'
})
export default class LineaBaseComponent {

  lineaBase = signal<LineaBase[]>([]);
  isModalOpen = false;
  LineaBase!: LineaBase;
  private toastr = inject(ToastrService);
  lbService = inject(LineaBaseService);
  dataSource = new MatTableDataSource<LineaBase>([]);
  displayedColumns: string[] = ['id', 'proyecto', 'tipo_linea_base', 'tecnologia', 'tipo_tecnologia', 'unidad_medida', 'medida', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterId = '';
  filterProyecto = '';
  filterTipoLineaBase = '';
  filterTecnologia = '';
  filterTipoTecnologia = '';


  ngOnInit(): void {
    this.getLineaBase();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getLineaBase() {
    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        this.lineaBase.set(data);
        this.dataSource.data = data;
        this.applyFilter();
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }




  applyFilter() {
    this.dataSource.filterPredicate = (data: LineaBase, filter: string) => {
      const [id, proyecto, tipo_linea_base, tecnologia, tipo_tecnologia] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (proyecto ? data.proyecto.toLowerCase().includes(proyecto) : true) &&
        (tipo_linea_base ? data.tipo_linea_base.toLowerCase().includes(tipo_linea_base) : true) &&
        (tecnologia ? data.tecnologia.toString().toLowerCase().includes(tecnologia) : true) &&
        (tipo_tecnologia ? data.tipo_tecnologia.toString().toLowerCase().includes(tipo_tecnologia) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterProyecto.toLowerCase(),
      this.filterTipoLineaBase.toLowerCase(),
      this.filterTecnologia.toLowerCase(),
      this.filterTipoTecnologia.toLowerCase()
    ].join(';');
  }


  closeModal() {
    this.isModalOpen = false;
    this.getLineaBase();
  }
  openModal() {
    this.isModalOpen = true;
  }

  loadLineaBase(reg: LineaBase) {

    console.log(reg)
    this.LineaBase = reg;
    this.openModal();
  }

  deleteLineaBase(id: number) {
    this.lbService.eliminaLineaBase(id).subscribe({
      next: () => {
        this.toastr.success('Linea Base Eliminada');
        this.getLineaBase();
      },
    });
  }
}
