import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, HostListener, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaedecService } from 'app/services/caedec.services';
import { EcoeficienciaService } from 'app/services/ecoeficiencia.services';
import { InvElegibleService } from 'app/services/inversion-elegible.services';
import { SubcategoriaService } from 'app/services/subcategoria.services';
import { ToastrService } from 'ngx-toastr';

import { ModalComponent } from 'app/components/modal/modal.component';
import { EbFvComponent } from "../eb-fv/eb-fv.component";
import { Ecoeficiencia } from 'app/models/ecoeficiencia.interface';
import { EbSbComponent } from "../eb-sb/eb-sb.component";
import { EbCaComponent } from "../eb-ca/eb-ca.component";
import { RegionService } from 'app/services/region.services';
import { AgenciaService } from 'app/services/agencia.services';
import { Ods } from 'app/models/ods.interface';

@Component({
  selector: 'app-inicio-datos-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EbFvComponent, ModalComponent, EbSbComponent, EbCaComponent],
  templateUrl: './inicio-datos-create.component.html',
  styleUrls: ['./inicio-datos-create.component.scss']
})
export class InicioDatosCreateComponent {
  @Input() data: Ecoeficiencia | null = null;
  @Output() onCloseModal = new EventEmitter();

  caeService = inject(CaedecService);
  subService = inject(SubcategoriaService);
  invEleService = inject(InvElegibleService);
  regService = inject(RegionService);
  ageService = inject(AgenciaService);
  searchTermControl = new FormControl('');
  items: { nombre: string; actividad: string; id: number }[] = [];  // Store the objects here
  subcategoriaList: { value: number; name: string }[] = [];
  regionList: { value: number; name: string }[] = [];
  agenciaList: { value: number; name: string }[] = [];
  inversionElegibleList: { value: number; name: string; image: string; categoria: string; indicador_efi_ener: string; linea_base: string; criterio_elegible: string }[] = [];
  isModalEbFvOpen = false;
  isModalEbSbOpen = false;
  isModalEbCaOpen = false;
  dataForm: FormGroup;
  ods!:Ods


  regionId!: number;
  agenciaId!: number;
  nroSolicitud!: string;
  caedecId!: number;
  respaldo!: string;
  subcategoriaId!: number;
  inversionElegibleId!: number;
  MontoInvUSD!: number;
  MontoInvBS!: number;

  respaldoList: { value: string, name: string }[] = [
    { value: '', name: 'Seleccione una región' },
    { value: 'Ficha técnica', name: 'Ficha técnica' },
    { value: 'Cotización/Proforma', name: 'Cotización/Proforma' },
    { value: 'Factura', name: 'Factura' },
    { value: 'Estudio de Factibilidad', name: 'Estudio de Factibilidad' },
    //{ value: 'Cotización', name: 'Cotización' },
  ];


  constructor(private fb: FormBuilder, private ecoeficienciaService: EcoeficienciaService, private toastr: ToastrService) {
    this.dataForm = this.fb.group({
      regionId: new FormControl('', [Validators.required]),
      agencia: new FormControl('', [Validators.required]),
      nro_solicitud: new FormControl('', [Validators.required]),
      nivel_medida: new FormControl('', [Validators.required]),
      caedecId: new FormControl(''),
      respaldo: new FormControl('', [Validators.required]),
      monto_inv_mn: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      tipo_cambio: new FormControl(6.96, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      subcategoria: new FormControl('', [Validators.required]),
      //monto_inv_me: new FormControl('', [Validators.required]),
      monto_inv_me: new FormControl({ value: '', disabled: true }, [Validators.required]),
      tipo_tecnologia: new FormControl('', [Validators.required]),

      fin_pobreza :new FormControl(false),
      hambre_cero :new FormControl(false),
      salud_bienestar :new FormControl(false),
      educacion_calidad :new FormControl(false),
      igualdad_genero :new FormControl(false),
      agua_limp_sanea :new FormControl(false),
      enr_ase_nocon :new FormControl(false),
      trab_dec_creeco :new FormControl(false),
      ind_ino_inf :new FormControl(false),
      reduc_desig :new FormControl(false),
      ciu_com_sos :new FormControl(false),
      prod_con_res :new FormControl(false),
      acc_por_cli :new FormControl(false),
      vida_sub :new FormControl(false),
      vida_eco_terr :new FormControl(false),
      paz_jus_instsol :new FormControl(false),
      ali_lograr_obj :new FormControl(false),
    });
    

  }
  ngOnChanges(): void {
    if (this.data) {
      this.dataForm.patchValue({
        regionId: this.data.regionId,
        //cliente: this.data.cliente,
        //codigo_credito: this.data.codigo_credito,
        nivel_medida: this.data.nivel_medida,
        respaldo: this.data.respaldo,
        monto_inv_mn: this.data.monto_inv_mn,
        monto_inv_me: this.data.monto_inv_me,


      });
    }
  }



  ngOnInit(): void {
    this.getCaedecs();
    this.getSubcategorias();
    this.getRegiones()
    // Subscribe a los cambios de monto_inv_mn y tipo_cambio
    this.dataForm.get('monto_inv_mn')?.valueChanges.subscribe(() => this.calculateMontoInvMe());
    this.dataForm.get('tipo_cambio')?.valueChanges.subscribe(() => this.calculateMontoInvMe());

    // Suscríbase a los cambios en el término de búsqueda para controlar la visibilidad del menú desplegable
    this.searchTermControl.valueChanges.subscribe(() => {
      this.showDropdown = true;
    });
  }

  getCaedecs() {
    this.caeService.getCaedecs().subscribe({
      next: (data) => {
        this.items = data.map((a: { nombre: string; actividad: string; id: number }) => ({
          nombre: `(${a.actividad}) ${a.nombre}`,
          actividad: a.actividad,
          id: a.id
        }));
      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }

  getSubcategorias() {

    this.subService.getSubcategoria().subscribe({
      next: (data) => {
        //this.subcategorias.set(data);
        console.log(data);
        this.subcategoriaList = data.map((item: { id: number; medida_estandar: string }) => ({
          value: item.id,
          name: item.medida_estandar
        }));
      },
      error: () => {
        this.toastr.error('Error al cargar las subcategorías');
      }
    });
  }
  getRegiones() {

    this.regService.getRegion().subscribe({
      next: (data) => {
        //this.subcategorias.set(data);
        console.log(data);
        this.regionList = data.map((item: { id: number; nombre: string }) => ({
          value: item.id,
          name: item.nombre
        }));
      },
      error: () => {
        this.toastr.error('Error al cargar las subcategorías');
      }
    });
  }


  showDropdown = false;
  dropdownClicked = false;

  get filteredItems(): { nombre: string; actividad: string; id: number }[] {
    const searchTerm = this.searchTermControl.value?.toLowerCase() ?? '';
    if (!searchTerm) {
      return [];
    }
    return this.items.filter(item =>
      item.nombre.toLowerCase().includes(searchTerm)
    );
  }








  onSubmit() {

    //console.log(this.dataForm.value);
    this.ods = this.dataForm.value;
   // console.log(this.ods);
    if (this.dataForm.valid) {
      // Handle form submission logic
     // console.log('Selected item ID:', this.selectedCriterioElegible);

     // console.log(this.dataForm.value)
      
      //this.MontoInvUSD = parseFloat(this.dataForm.get('monto_inv_me')?.value);
      this.regionId = parseInt(this.dataForm.get('regionId')?.value);
      //console.log(this.regionId)
      this.agenciaId = parseInt(this.dataForm.get('agencia')?.value);
      this.nroSolicitud = this.dataForm.get('nro_solicitud')?.value;
      this.respaldo = this.dataForm.get('respaldo')?.value;
      this.subcategoriaId = parseInt(this.dataForm.get('subcategoria')?.value);
      this.inversionElegibleId = parseInt(this.dataForm.get('tipo_tecnologia')?.value);
      this.MontoInvBS = parseFloat(this.dataForm.get('monto_inv_mn')?.value);
      this.MontoInvUSD = parseFloat(this.dataForm.get('monto_inv_me')?.value);

      // Verificar si al menos un ODS está seleccionado
      const odsControls = [
        'fin_pobreza', 'hambre_cero', 'salud_bienestar', 'educacion_calidad',
        'igualdad_genero', 'agua_limp_sanea', 'enr_ase_nocon', 'trab_dec_creeco',
        'ind_ino_inf', 'reduc_desig', 'ciu_com_sos', 'prod_con_res',
        'acc_por_cli', 'vida_sub', 'vida_eco_terr', 'paz_jus_instsol',
        'ali_lograr_obj'
      ];
      const isOdsSelected = odsControls.some(control => this.dataForm.get(control)?.value);
      if (!isOdsSelected) {
        this.toastr.error('Debes seleccionar al menos un ODS.');
        return;
      }
      
      
      switch (this.selectedCriterioElegible) {

        case 'Paneles solares On grid u Off Grid':
          this.openModalEB_FV();
          break;
        case 'Sistemas de bombeo eléctrico solar':
          this.openModalEB_SB()
          break;
        case 'Calefón o terma solar':
          this.openModalEB_CA()
          break;
      }


     // console.log(this.MontoInvUSD);
      //console.log(formValue[0].monto_inv_me)
      // this.MontoInvUSD = montoInvMe;

      //this.isModalEbFvOpen = true;

    } else {
      this.dataForm.markAllAsTouched();
    }
  }

  onClose() {
    this.onCloseModal.emit(false);
    this.dataForm.reset({
      regionId: '',
      agencia: '',
      respaldo: '',
      subcategoria: '',
      tipo_tecnologia: '',
            
    })
    this.dataForm.get('tipo_cambio')?.setValue(6.96);
    this.selectedImage = ''; // Limpia la imagen si no hay selección
    this.selectedCategory = '';
    this.selectedIndicadorEfiEner = '';
    this.selectedLineaBase = '';
    this.selectedCriterioElegible = '';

    this.MontoInvUSD=0;
  }

  selectItem(item: { nombre: string; actividad: string; id: number }) {
    this.searchTermControl.setValue(item.nombre);
    this.dataForm.get('nivel_medida')?.setValue(item.nombre);
    this.caedecId = item.id;//id de caedec
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!event.target || !(event.target as HTMLElement).closest('.relative')) {
      this.showDropdown = false;
    }
  }

  hideDropdown() {
    setTimeout(() => {
      if (!this.dropdownClicked) {
        this.showDropdown = false;
      }
    }, 100);
  }

  calculateMontoInvMe(): void {
    const montoInvMn = this.dataForm.get('monto_inv_mn')?.value;
    const tipoCambio = this.dataForm.get('tipo_cambio')?.value;
    if (montoInvMn && tipoCambio) {
      const montoInvMe = (montoInvMn / tipoCambio).toFixed(2);
      this.dataForm.get('monto_inv_me')?.setValue(montoInvMe, { emitEvent: false });
    }
  }

  onRegionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValueRegion = +selectElement.value;
    if (selectedValueRegion) {
      this.getAgenciasRegion(selectedValueRegion);
    } else {
      this.agenciaList = [];
    }
  }
  onSubcategoriaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const subcategoriaId = +selectElement.value;

    if (subcategoriaId) {
      this.dataForm.get('tipo_tecnologia')?.setValue('')
      this.getInvElegibleParaSubcategoria(subcategoriaId);
    } else {
      this.inversionElegibleList = [];
      this.dataForm.get('tipo_tecnologia')?.setValue('')
    }

  }
  getAgenciasRegion(regionId: number): void {
    this.ageService.getAgencia(regionId).subscribe({
      next: (data) => {

        this.agenciaList = data.map((item: { id: number; nombre: string }) => ({
          value: item.id,
          name: item.nombre
        }));
      },
      error: () => {
        this.toastr.error('Error al cargar las agencias');
      }
    });

  }
  getInvElegibleParaSubcategoria(subcategoriaId: number): void {

    this.invEleService.getInversionElegible(subcategoriaId).subscribe({
      next: (data) => {
        //this.invEleg.set(data);
        //console.log(data);
        this.inversionElegibleList = data.map((item: { id: number; nombre: string, contenidoB64: string, categoria: string, indicador_efi_ener: string, linea_base: string, criterio_elegible: string }) => ({
          value: item.id,
          name: item.nombre,
          image: item.contenidoB64,
          categoria: item.categoria,
          indicador_efi_ener: item.indicador_efi_ener,
          linea_base: item.linea_base,
          criterio_elegible: item.criterio_elegible

        }));
      },
      error: (err) => {
        console.error('Error al cargar archivos:', err);
      },
    });

  }

  selectedImage: string = '';
  selectedCategory: string = '';
  selectedIndicadorEfiEner: string = '';
  selectedLineaBase: string = '';
  selectedCriterioElegible: string = '';

  onTipoTecnologiaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    const selectedItem = this.inversionElegibleList.find(item => item.value === +selectedValue);
    if (selectedItem) {
      this.selectedImage = selectedItem.image; // Actualiza la imagen seleccionada
      this.selectedCategory = selectedItem.categoria;
      this.selectedIndicadorEfiEner = selectedItem.indicador_efi_ener;
      this.selectedLineaBase = selectedItem.linea_base;
      this.selectedCriterioElegible = selectedItem.criterio_elegible;
    } else {
      this.selectedImage = ''; // Limpia la imagen si no hay selección
      this.selectedCategory = '';
      this.selectedIndicadorEfiEner = '';
      this.selectedLineaBase = '';
      this.selectedCriterioElegible = '';
    }

  }

  openModalEB_FV() {

    this.isModalEbFvOpen = true;


  }


  closeModalEB_FV() {
    this.isModalEbFvOpen = false;
    this.onClose()
    //this.MontoInvUSD = null
    //this.getArchivos(this.subcategoriaId)

  }
  openModalEB_SB() {

    this.isModalEbSbOpen = true;
    const monME = parseFloat(this.dataForm.get('monto_inv_me')?.value);
    this.MontoInvUSD = monME
    
   
  }
  closeModalEB_SB() {
    this.isModalEbSbOpen = false;
    this.onClose()
    //this.MontoInvUSD = null
    //this.getArchivos(this.subcategoriaId)

  }

  openModalEB_CA() {
    
    this.isModalEbCaOpen = true;

  }

  closeModalEB_CA() {
    this.isModalEbCaOpen = false;
    this.onClose()
    //this.MontoInvUSD = null
    //this.getArchivos(this.subcategoriaId)

  }

}