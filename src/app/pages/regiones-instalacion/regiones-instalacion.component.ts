import { Component, inject, signal, ViewChild } from '@angular/core';
import { RegionesInstalacionCreateComponent } from '../regiones-instalacion-create/regiones-instalacion-create.component';
import { ModalComponent } from 'app/components/modal/modal.component';
import { RegionesInstalacion } from 'app/models/regiones-instalacion.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RegionesInstalacionService } from 'app/services/regiones-instalacion.services';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-regiones-instalacion',
  standalone: true,
  imports: [RegionesInstalacionCreateComponent, ModalComponent, CommonModule,FormsModule, MatPaginatorModule, MatTableModule,MatInputModule],
  templateUrl: './regiones-instalacion.component.html',
  styleUrl: './regiones-instalacion.component.scss'
})
export default class RegionesInstalacionComponent {

  regInstalacion = signal<RegionesInstalacion[]>([]);
  regService = inject(RegionesInstalacionService);
  private toastr = inject(ToastrService);
  RegionesInstalacion!: RegionesInstalacion;
  isModalOpen=false;
  filterId = '';
  filterRegion = '';
  filterGhi ='';
  filterPvout = '';
  displayedColumns: string[] = ['id', 'region', 'ghi','pvout','actions'];
  dataSource = new MatTableDataSource<RegionesInstalacion>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getRegionesInstalacion();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getRegionesInstalacion() {
    this.regService.getRegionesInstalacion().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        this.regInstalacion.set(data);
        this.dataSource.data = data;
        this.applyFilter();
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }

  loadCaedec(reg: RegionesInstalacion) {

    console.log(reg)
    this.RegionesInstalacion = reg;
    this.openModal();
  }
  applyFilter() {
    this.dataSource.filterPredicate = (data: RegionesInstalacion, filter: string) => {
      const [id, region, ghi, pvout] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (region ? data.region.toLowerCase().includes(region) : true) &&
        (ghi ? data.ghi.toString().toLowerCase().includes(ghi) : true) &&
        (pvout ? data.pvout.toString().toLowerCase().includes(pvout) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterRegion.toLowerCase(),
      this.filterGhi.toLowerCase(),
      this.filterPvout.toLowerCase()
    ].join(';');
  }

  closeModal() {
    this.isModalOpen = false;
    this.getRegionesInstalacion();
  }
  openModal() {
    this.isModalOpen = true;
  }
  deleteRegionesInstalacion(id: number) {
    this.regService.eliminaRegionesInstalacion(id).subscribe({
      next: () => {
        this.toastr.success('Region  Eliminado');
        this.getRegionesInstalacion();
      },
    });
  }

}
