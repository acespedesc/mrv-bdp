import { Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { MaquinariaReciclajeCreateComponent } from "../maquinaria-reciclaje-create/maquinaria-reciclaje-create.component";
import { MaquinariaReciclaje } from 'app/models/maquinaria-reciclaje.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaquinariaReciclajeService } from 'app/services/maquinaria-reciclaje.services';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-maquinaria-reciclaje',
  standalone: true,
  imports: [ModalComponent, MaquinariaReciclajeCreateComponent, FormsModule,MatPaginatorModule, MatTableModule, MatInputModule],
  templateUrl: './maquinaria-reciclaje.component.html',
  styleUrl: './maquinaria-reciclaje.component.scss'
})
export class MaquinariaReciclajeComponent {
  @Output() onCloseMaqReciclaje = new EventEmitter();
  @Input() residuoId: number | null = null; // recibe el id de region
  @Input() clase: string | null = null;
  maquinariaReciclaje!: MaquinariaReciclaje;
  maquinaReciclajeiServices = inject(MaquinariaReciclajeService)
  private toastr = inject(ToastrService)
  isModalOpen=false;
  selectedResiduoId: number | null = null;
  dataSource = new MatTableDataSource<MaquinariaReciclaje>([]);
  displayedColumns: string[] = ['id', 'nombre','actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterId = '';
  filterNombre = '';


  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['residuoId'] && this.residuoId) {
      console.log(this.residuoId)
      this.selectedResiduoId = this.residuoId
      this.getMaquinaReciclaje(this.residuoId);
    }
   
  }
  getMaquinaReciclaje(resId: number | null) {
    if (resId) {
      this.maquinaReciclajeiServices.getMaquinariaReciclaje(resId).subscribe({
        next: (data) => {
          //this.agencias.set(data);
          this.dataSource.data = data;
          this.applyFilter();
          console.log("Datos cargadas:", data);
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
        },
      });
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  applyFilter() {
    this.dataSource.filterPredicate = (data: MaquinariaReciclaje, filter: string) => {
      const [id, nombre] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (nombre ? data.nombre.toLowerCase().includes(nombre) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterNombre.toLowerCase()
    ].join(';');
  }


  loadMaquinaReciclaje(maqReci: MaquinariaReciclaje) {

    console.log(maqReci)
    this.maquinariaReciclaje = maqReci;
    this.openModal();
  }
  deleteMaquinaReciclaje(id: number) {
    this.maquinaReciclajeiServices.eliminaMaquinariaReciclaje(id).subscribe({
      next: () => {
        this.toastr.success(' Eliminado!');
        this.getMaquinaReciclaje(this.residuoId);
      },
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
   this.getMaquinaReciclaje(this.residuoId);
  }

}
