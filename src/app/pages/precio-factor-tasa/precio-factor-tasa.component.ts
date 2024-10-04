import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { PrecioFactorTasa } from 'app/models/precio-factor-tasa.interface';
import { PrecioFactorTasaCreateComponent } from '../precio-factor-tasa-create/precio-factor-tasa-create.component';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { PrecioFactorTasaService } from 'app/services/precio-factor-tasa.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-precio-factor-tasa',
  standalone: true,
  imports: [CommonModule, ModalComponent, PrecioFactorTasaCreateComponent, FormsModule, MatPaginatorModule, MatTableModule, MatInputModule],
  templateUrl: './precio-factor-tasa.component.html',
  styleUrl: './precio-factor-tasa.component.scss'
})
export default class PrecioFactorTasaComponent {

  precioFactorTasa = signal<PrecioFactorTasa[]>([]);
  isModalOpen = false;
  private toastr = inject(ToastrService);
  PrecioFactorTasa!: PrecioFactorTasa;
  dataSource = new MatTableDataSource<PrecioFactorTasa>([]);
  displayedColumns: string[] = ['id', 'parametro', 'fuente', 'tipo','descripcion', 'unidad', 'valor', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pftService = inject(PrecioFactorTasaService);
  filterId = '';
  filterParametro = '';
  filterTipo = '';

  ngOnInit(): void {
    this.getPrecioFactorTasa();
  }
  getPrecioFactorTasa() {
    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        this.precioFactorTasa.set(data);
        this.dataSource.data = data;
        this.applyFilter();
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter() {
    this.dataSource.filterPredicate = (data: PrecioFactorTasa, filter: string) => {
      const [id, parametro, tipo] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (parametro ? data.parametro.toLowerCase().includes(parametro) : true) &&
        (tipo ? data.tipo.toString().toLowerCase().includes(tipo) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterParametro.toLowerCase(),
      this.filterTipo.toLowerCase(),
    ].join(';');
  }
  loadPrecioFactorTasa(pft: PrecioFactorTasa) {

    console.log(pft)
    this.PrecioFactorTasa = pft;
    this.openModal();
  }
  closeModal() {
    this.isModalOpen = false;
    this.getPrecioFactorTasa();
  }
  openModal() {
    this.isModalOpen = true;
  }
  deletePrecioFactorTasa(id: number) {
    this.pftService.eliminaPrecioFactorTasa(id).subscribe({
      next: () => {
        this.toastr.success('Linea Base Eliminada');
        this.getPrecioFactorTasa();
      },
    });
  }

}
