import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from 'app/components/modal/modal.component';
import { InversionElegible } from 'app/models/inversion-elegible.interface';
import { Subcategoria } from 'app/models/subcategoria.interface';
import { InvElegibleService } from 'app/services/inversion-elegible.services';
import { ToastrService } from 'ngx-toastr';
import { InvversionElegibleImgComponent } from '../invversion-elegible-img/invversion-elegible-img.component';


@Component({
  selector: 'app-invversion-elegible',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent,RouterModule, InvversionElegibleImgComponent],
  templateUrl: './invversion-elegible.component.html',
  styleUrl: './invversion-elegible.component.scss'
})
export class InvversionElegibleComponent {
  @Input() data: InversionElegible| null = null;
  @Output() onCloseModalInvEle = new EventEmitter();
  @Input() subcategoriaId: number | null = null; // recibe el id de subcategoria
  dataForm!: FormGroup;

  invElegibles = signal<InversionElegible[]>([]);
  invElegible!:InvElegibleService 
  contenidoB64!: string;
  isModalImagenOpen = false;

  selectedFile: Blob | null = null;
  fileName: string | null = null; // Propiedad para almacenar el nombre del archivo

  @ViewChild('contenidoInput', { static: false }) contenidoInput!: ElementRef;

  constructor(private fb: FormBuilder, private invEleService: InvElegibleService, private toastr: ToastrService) {
    this.dataForm = this.fb.group({

      nombre : new FormControl('', [Validators.required]),
      categoria : new FormControl('', [Validators.required]),
      indicador_efi_ener : new FormControl('', [Validators.required]),
      linea_base :new FormControl('', [Validators.required]),
      criterio_elegible : new FormControl('', [Validators.required]),
      img_elegible:new FormControl('', [Validators.required]),
      subcategoriaId: new FormControl(''),
      //fecha_subida: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.subcategoriaId) {
      this.getArchivos(this.subcategoriaId);
    }
  }



  onSubmit() {

    if(this.dataForm.valid)
    {
      if(this.data){
        console.log("es edicion")
      }
      else 
      {
        console.log("es creacion")
        this.invEleService.crearInversionElegible(this.dataForm.value).subscribe({
          next: (response: any) => {
            this.resetdataForm();
            this.limpiarDatosArchivo();
            this.toastr.success("Archivo adjuntado exitosamente");
          }
        })
      }

    }
    else
    {
      this.dataForm.markAllAsTouched();
    }

  }

  limpiarDatosArchivo() {
    this.dataForm.reset();
    if (this.contenidoInput) {
      this.contenidoInput.nativeElement.value = ''; // Vaciamos el input de archivo
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando el provedorId cambia, carga los archivos
    if (changes['subcategoriaId'] && this.subcategoriaId) {
      this.getArchivos(this.subcategoriaId);
    }

    // Si hay datos para editar, establece los valores en el formulario
    if (this.data) {
      this.dataForm.patchValue({
        nombre : this.data.nombre,
        categoria : this.data.categoria,
        indicador_efi_ener: this.data.indicador_efi_ener,
        linea_base:this.data.linea_base,
        criterio_elegible : this.data.criterio_elegible,
        subcategoriaId: this.data.subcategoriaId,
        fecha_subida: this.data.fecha_subida
      });
    }
  }

  onClose() {
    this.onCloseModalInvEle.emit(false);
    this.dataForm.reset()
    //this.limpiarDatosArchivo();
    //this.getArchivos(null);

  }

  onFileSelected(event: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      // Verificar si el archivo es un PDF
      if (file.type === 'image/jpeg') {
        this.fileName = file.name; // Guardar el nombre del archivo
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedFile = new Blob([reader.result as ArrayBuffer], { type: file.type });
          console.log('Archivo convertido a Blob:', this.selectedFile);
          this.dataForm.patchValue({
            //nombre: this.fileName,
            img_elegible: this.selectedFile, // Almacena el PDF en blob
            subcategoriaId: this.subcategoriaId,

          });

        };
        reader.readAsArrayBuffer(file);
      } else {
        //console.error('Por favor, seleccione un archivo PDF.');
        this.fileName = null; // Reiniciar el nombre del archivo si no es PDF
        this.dataForm.get('img_elegible')?.setErrors({ invalidFileType: true }); // Establece un error en el control
      }
    }
  }

  getArchivos(subId: number | null) {
    if (subId) {
      this.invEleService.getInversionElegible(subId).subscribe({
        next: (data) => {
          this.invElegibles.set(data);
          console.log("Archivos cargados:", data);
        },
        error: (err) => {
          console.error('Error al cargar archivos:', err);
        },
      });
    }
  }
  resetdataForm() {
    this.dataForm.reset();

    //this.onClose();
    this.getArchivos(this.subcategoriaId);

  }

  openModalImagen(archBase64: string) {

    console.log(archBase64)


    this.contenidoB64 = archBase64;
    //this.fileNombre = nombre;
    this.isModalImagenOpen = true;



  }

  closeModalImg() {
    this.isModalImagenOpen = false;

    this.getArchivos(this.subcategoriaId)

  }

  deleteInvElegible(id: number) {

    this.invEleService.eliminaInversionElegible(id).subscribe({
      next: (response) => {

        this.toastr.success('Proveedor Eliminado');
        this.getArchivos(this.subcategoriaId)

      },
    });

  }


}
