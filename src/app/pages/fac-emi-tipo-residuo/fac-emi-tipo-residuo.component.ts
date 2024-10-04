import { Component, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { FacEmiTipoResiduoCreateComponent } from "../fac-emi-tipo-residuo-create/fac-emi-tipo-residuo-create.component";
import { FacEmiTipoResiduo } from 'app/models/fac-emi-tipo-residuo.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { FacEmiTipoResiduoService } from 'app/services/fac-emi-tipo-residuo.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fac-emi-tipo-residuo',
  standalone: true,
  imports: [ModalComponent, FacEmiTipoResiduoCreateComponent,MatPaginatorModule, MatTableModule, MatInputModule, FormsModule],
  templateUrl: './fac-emi-tipo-residuo.component.html',
  styleUrl: './fac-emi-tipo-residuo.component.scss'
})
export class FacEmiTipoResiduoComponent {
  @Output() onCloseFacEmiTipRes = new EventEmitter();
  @Input() residuoId: number | null = null; // recibe el id de region
  @Input() clase: string | null = null;
  fetrServices = inject(FacEmiTipoResiduoService)
  isModalOpen=false;
  FacEmiTipoResiduo!: FacEmiTipoResiduo;
  selectedResiduoId: number | null = null;
  private toastr= inject(ToastrService)

  dataSource = new MatTableDataSource<FacEmiTipoResiduo>([]);
  displayedColumns: string[] = ['id', 'nombre','fuente','valor','actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filterId = '';
  filterNombre = '';

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['residuoId'] && this.residuoId) {
      console.log(this.residuoId)
      this.selectedResiduoId = this.residuoId
      this.getFactEmiTipoResiduo(this.residuoId);
    }

    
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getFactEmiTipoResiduo(resId: number | null) {
    if (resId) {
      this.fetrServices.getFacEmiTipoResiduo(resId).subscribe({
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

  openModal() {
    this.isModalOpen = true;
  }

  loadFacEmiTipoResiduo(fetr: FacEmiTipoResiduo) {

    console.log(fetr)
    this.FacEmiTipoResiduo = fetr;
    this.openModal();
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: FacEmiTipoResiduo, filter: string) => {
      const [id, nombre] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (nombre ? data.nombre.toLowerCase().includes(nombre) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterNombre.toLowerCase()
    ].join(';');
  }

  closeModal() {
    this.isModalOpen = false;
    this.getFactEmiTipoResiduo(this.residuoId);
  }

  deleteFacEmiTipoResiduo(id: number) {
    this.fetrServices.eliminaFacEmiTipoResiduo(id).subscribe({
      next: () => {
        this.toastr.success(' Eliminado!');
        this.getFactEmiTipoResiduo(this.residuoId);
      },
    });
  }
}
