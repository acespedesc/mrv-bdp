import { Component, inject, signal, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalComponent } from 'app/components/modal/modal.component';
import { Caedec } from 'app/models/caedec.interface';
import { CaedecService } from 'app/services/caedec.services';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CaedecCreateComponent } from '../caedec-create/caedec-create.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-caedec',
  standalone: true,
  imports: [CommonModule, ModalComponent, RouterModule, CaedecCreateComponent, FormsModule, MatPaginatorModule, MatTableModule, MatInputModule],
  templateUrl: './caedec.component.html',
  styleUrls: ['./caedec.component.scss']
})
export default class CaedecComponent implements OnInit, AfterViewInit {
  caedecs = signal<Caedec[]>([]);
  Caedec!: Caedec;
  caeService = inject(CaedecService);
  private toastr = inject(ToastrService);
  isModalOpen = false;

  displayedColumns: string[] = ['id', 'nombre', 'actividad', 'actions'];
  dataSource = new MatTableDataSource<Caedec>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterId = '';
  filterName = '';
  filterActivity = '';

  ngOnInit(): void {
    this.getCaedecs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  getCaedecs() {
    this.caeService.getCaedecs().subscribe({
      next: (data) => {
        //console.log('Datos recibidos:', data); // Verifica que los datos llegan
        this.caedecs.set(data);
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
    this.getCaedecs();
  }

  loadCaedec(caedec: Caedec) {

    console.log(caedec)
    this.Caedec = caedec;
    this.openModal();
  }

  deleteCaedec(id: number) {
    this.caeService.eliminaCaedec(id).subscribe({
      next: () => {
        this.toastr.success('Caedec Eliminado');
        this.getCaedecs();
      },
    });
  }

  applyFilter() {
    this.dataSource.filterPredicate = (data: Caedec, filter: string) => {
      const [id, name, activity] = filter.trim().split(';');
      return (id ? data.id.toString().toLowerCase().includes(id) : true) &&
        (name ? data.nombre.toLowerCase().includes(name) : true) &&
        (activity ? data.actividad.toLowerCase().includes(activity) : true);
    };

    this.dataSource.filter = [
      this.filterId.toLowerCase(),
      this.filterName.toLowerCase(),
      this.filterActivity.toLowerCase()
    ].join(';');
  }
}