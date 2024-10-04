import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from 'app/components/modal/modal.component';
import { Circular } from 'app/models/circular.interface';
import { AgenciaService } from 'app/services/agencia.services';
import { CaedecService } from 'app/services/caedec.services';
import { EcoCircularService } from 'app/services/eco-circular.services';
import { RegionService } from 'app/services/region.services';
import { ToastrService } from 'ngx-toastr';
import { CapitalOperacionComponent } from '../capital-operacion/capital-operacion.component';
import { Ods } from 'app/models/ods.interface';
import { CapitalInversionComponent } from "../capital-inversion/capital-inversion.component";
import { CapitalInversionPatrimonioComponent } from '../capital-inversion-patrimonio/capital-inversion-patrimonio.component';


@Component({
  selector: 'app-eco-circular-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent, CapitalOperacionComponent, CapitalInversionComponent, CapitalInversionPatrimonioComponent],
  templateUrl: './eco-circular-create.component.html',
  styleUrl: './eco-circular-create.component.scss'
})
export class EcoCircularCreateComponent {
  @Input() data: Circular | null = null;
  @Output() onCloseModal = new EventEmitter();
  dataForm!: FormGroup;
  regionList: { value: number; name: string }[] = [];
  agenciaList: { value: number; name: string }[] = [];
  items: { nombre: string; actividad: string; id: number }[] = [];
  regService = inject(RegionService);
  private toastr = inject(ToastrService);
  ageService = inject(AgenciaService);
  searchTermControl = new FormControl('');
  caeService = inject(CaedecService);
  isModalCoOpen = false;
  isModalCiOpen = false;
  isModalCipOpen = false;
  ods!: Ods
  isVisible: boolean = false;


  regionId!: number;
  agenciaId!: number;
  nroSolicitud!: string;
  caedecId!: number;
  respaldo!: string;
  objetivoOperacion!: string;
  destinoCapInvOpe!: string;
  tipoEmpresa!: string;
  cantidadEmpleosGen!: number;
  montoCreditoMn!: number;
  montoCreditoMe!: number;

  respaldoList: { value: string, name: string }[] = [
    { value: '', name: 'Seleccione respaldo' },
    { value: 'Ficha técnica', name: 'Ficha técnica' },
    { value: 'Cotización/Proforma', name: 'Cotización/Proforma' },
    { value: 'Factura', name: 'Factura' },
    { value: 'Estudio de Factibilidad', name: 'Estudio de Factibilidad' }
  ];
  objetivoOperacionList: { value: string, name: string }[] = [
    { value: '', name: 'Seleccione un objetivo' },
    { value: 'Capital de Operación', name: 'Capital de Operación' },
    { value: 'Capital de Inversión', name: 'Capital de Inversión' },

  ];
  claseInversionList: { value: string, name: string }[] = [
    { value: '', name: 'Seleccione clase de inv.' },
    { value: '1', name: 'MAQUINARIA PARA EL RECICLAJE Y/O APROVECHAMIENTO DE RESIDUOS' },
    { value: '2', name: 'OTRO TIPO DE INVERSIONES PARA EL RECICLAJE Y/O APROVECHAMIENTO DE RESIDUOS' },

  ];



  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.dataForm = this.fb.group({
      region: new FormControl('', [Validators.required]),
      agencia: new FormControl('', [Validators.required]),
      nro_solicitud: new FormControl('', [Validators.required]),
      nivel_medida: new FormControl('', [Validators.required]),
      tipo_empresa: new FormControl({ value: '', disabled: true }, [Validators.required]),
      respaldo: new FormControl('', [Validators.required]),
      monto_inv_mn: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      tipo_cambio: new FormControl(6.96, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      monto_inv_me: new FormControl({ value: '', disabled: true }, [Validators.required]),
      obj_ope: new FormControl('', [Validators.required]),
      dest_cap_inv_ope: new FormControl('', [Validators.required]),
      nro_emp_dir_gen: new FormControl('', [Validators.required]),
      nro_emp_ind_gen: new FormControl('', [Validators.required]),
      clase_inv: new FormControl(''),

      fin_pobreza: new FormControl(false),
      hambre_cero: new FormControl(false),
      salud_bienestar: new FormControl(false),
      educacion_calidad: new FormControl(false),
      igualdad_genero: new FormControl(false),
      agua_limp_sanea: new FormControl(false),
      enr_ase_nocon: new FormControl(false),
      trab_dec_creeco: new FormControl(false),
      ind_ino_inf: new FormControl(false),
      reduc_desig: new FormControl(false),
      ciu_com_sos: new FormControl(false),
      prod_con_res: new FormControl(false),
      acc_por_cli: new FormControl(false),
      vida_sub: new FormControl(false),
      vida_eco_terr: new FormControl(false),
      paz_jus_instsol: new FormControl(false),
      ali_lograr_obj: new FormControl(false),

    });


  }

  ngOnInit(): void {
    this.getRegiones();
    this.getCaedecs();
    // Subscribe a los cambios de monto_inv_mn y tipo_cambio
    this.dataForm.get('monto_inv_mn')?.valueChanges.subscribe(() => this.calculateMontoInvMe());
    this.dataForm.get('tipo_cambio')?.valueChanges.subscribe(() => this.calculateMontoInvMe());

    // Suscríbase a los cambios en el término de búsqueda para controlar la visibilidad del menú desplegable
    this.searchTermControl.valueChanges.subscribe(() => {
      this.showDropdown = true;
    });
  }
  calculateMontoInvMe(): void {
    const montoInvMn = this.dataForm.get('monto_inv_mn')?.value;
    const tipoCambio = this.dataForm.get('tipo_cambio')?.value;
    if (montoInvMn && tipoCambio) {
      const montoInvMe = (montoInvMn / tipoCambio).toFixed(2);
      this.dataForm.get('monto_inv_me')?.setValue(montoInvMe, { emitEvent: false });
    }
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
  onRegionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const subcategoriaId = +selectElement.value;
    if (subcategoriaId) {
      this.getAgenciasRegion(subcategoriaId);
    } else {
      this.agenciaList = [];
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
  hideDropdown() {
    setTimeout(() => {
      if (!this.dropdownClicked) {
        this.showDropdown = false;
      }
    }, 100);
  }
  selectItem(item: { nombre: string; actividad: string; id: number }) {
    this.searchTermControl.setValue(item.nombre);
    this.dataForm.get('nivel_medida')?.setValue(item.nombre);
    this.caedecId = item.id;//id de caedec
    this.showDropdown = false;

    if (item.actividad.trim() === '37100' || item.actividad.trim() === '37200') {
      this.dataForm.get('tipo_empresa')?.setValue('Empresa Recicladora')
    }
    else {
      this.dataForm.get('tipo_empresa')?.setValue('Empresa que emplea M.P. Reciclada')
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!event.target || !(event.target as HTMLElement).closest('.relative')) {
      this.showDropdown = false;
    }
  }





  onSubmit() {
    //console.log(this.dataForm.valid)
    this.ods = this.dataForm.value;



    if (this.dataForm.valid) {
      //console.log(this.selectedObjOpe)

      this.regionId = parseInt(this.dataForm.get('region')?.value);
      this.agenciaId = parseInt(this.dataForm.get('agencia')?.value);
      this.nroSolicitud = this.dataForm.get('nro_solicitud')?.value;
      this.respaldo = this.dataForm.get('respaldo')?.value;
      this.objetivoOperacion = this.dataForm.get('obj_ope')?.value;
      this.destinoCapInvOpe = this.dataForm.get('dest_cap_inv_ope')?.value;
      this.tipoEmpresa = this.dataForm.get('tipo_empresa')?.value;
      this.cantidadEmpleosGen = parseInt(this.dataForm.get('nro_emp_dir_gen')?.value) + parseInt(this.dataForm.get('nro_emp_ind_gen')?.value)
      this.montoCreditoMn = parseFloat(this.dataForm.get('monto_inv_mn')?.value);
      this.montoCreditoMe = parseFloat(this.dataForm.get('monto_inv_me')?.value);

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


      switch (this.selectedObjOpe) {
        case 'Capital de Operación':
          this.openModalCO();
          break;
        case 'Capital de Inversión':
          console.log(this.dataForm.get('clase_inv')?.value)
          if (parseInt(this.dataForm.get('clase_inv')?.value) === 1) {
            this.openModalCI();
          }
          else {
            console.log('abrir modal para inverion patrimonio')
            this.openModalCIP();
          }
          break;

      }

    }
    else {
      this.dataForm.markAllAsTouched();
    }
  }
  onClose() {
    this.onCloseModal.emit(false);
    this.dataForm.reset({
      region: '',
      agencia: '',
      respaldo: '',
      obj_ope: ''
    })
    this.dataForm.get('tipo_cambio')?.setValue(6.96);
  }
  openModalCO() {

    this.isModalCoOpen = true;

  }
  closeModalCO() {
    this.isModalCoOpen = false;
    this.onClose()

    //this.get

  }
  selectedObjOpe: string = '';
  onObjOpeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedObjOpe = selectElement.value;
    const claseInvControl = this.dataForm.get('clase_inv');

    if (this.selectedObjOpe === 'Capital de Inversión') {
      this.isVisible = true;
      this.dataForm.get('clase_inv')?.setValue(this.claseInversionList[0].value);
      claseInvControl?.setValidators([Validators.required]);
    }
    else {
      this.isVisible = false;
      claseInvControl?.clearValidators();
    }
    claseInvControl?.updateValueAndValidity();
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }


  closeModalCI() {
    this.isModalCiOpen = false;
    this.onClose()

  }
  openModalCI() {

    this.isModalCiOpen = true;

  }

  closeModalCIP() {
    this.isModalCipOpen = false;
    this.onClose()

  }
  openModalCIP() {

    this.isModalCipOpen = true;

  }
}
