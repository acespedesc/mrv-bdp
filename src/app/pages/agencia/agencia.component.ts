import { Component, EventEmitter, inject, Input, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AgenciaCreateComponent } from "../agencia-create/agencia-create.component";
import { Agencia } from 'app/models/agencia.interface';
import { ModalComponent } from 'app/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { AgenciaService } from 'app/services/agencia.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agencia',
  standalone: true,
  imports: [AgenciaCreateComponent, ModalComponent, CommonModule, FormsModule, MatPaginatorModule, MatTableModule, MatInputModule],
  templateUrl: './agencia.component.html',
  styleUrl: './agencia.component.scss'
})
export class AgenciaComponent {
  agencias = signal<Agencia[]>([]);
  @Output() onCloseModalAgencia = new EventEmitter();
  @Input() regionId: number | null = null; // recibe el id de region
  @Input() nomRegion: string | null = null;
  agenciaService = inject(AgenciaService);
  isModalOpen = false;
  Agencia!: Agencia;
  selectedRegionId: number | null = null;
  dataSource = new MatTableDataSource<Agencia>([]);
  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private toastr = inject(ToastrService);

  filterId = '';
  filterNombre = '';

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['regionId'] && this.regionId) {
      console.log(this.regionId)
      this.selectedRegionId = this.regionId
      this.getAgencias(this.regionId);
    }



  }

  getAgencias(regId: number | null) {
    if (regId) {
      this.agenciaService.getAgencia(regId).subscribe({
        next: (data) => {
          this.agencias.set(data);
          this.dataSource.data = data;
          this.applyFilter();
          console.log("Agencias cargadas:", data);
        },
        error: (err) => {
          console.error('Error al cargar agencias:', err);
        },
      });
    }
  }

  loadAgencia(age: Agencia) {

    console.log(age)
    this.Agencia = age;
    this.openModal();
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Agencia, filter: string) => {
      const [id, nombre] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (nombre ? data.nombre.toLowerCase().includes(nombre) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterNombre.toLowerCase()
    ].join(';');
  }

  deleteAgencia(id: number) {
    this.agenciaService.eliminaAgencia(id).subscribe({
      next: () => {
        this.toastr.success('Linea Base Eliminada');
        this.getAgencias(this.regionId);
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.getAgencias(this.regionId);
  }
}
