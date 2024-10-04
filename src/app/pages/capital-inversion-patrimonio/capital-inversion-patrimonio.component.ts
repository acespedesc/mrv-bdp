import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ods } from 'app/models/ods.interface';
import { AuthService } from 'app/services/auth.services';
import { DocAuxCalService } from 'app/services/documento-aux-cal.services';
import { EcoCircularService } from 'app/services/eco-circular.services';
import { FacEmiTipoResiduoService } from 'app/services/fac-emi-tipo-residuo.services';
import { OdsService } from 'app/services/ods.services';
import { ResiduoService } from 'app/services/residuo.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-capital-inversion-patrimonio',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './capital-inversion-patrimonio.component.html',
  styleUrl: './capital-inversion-patrimonio.component.scss'
})
export class CapitalInversionPatrimonioComponent {
  @Output() onCloseModalCIP = new EventEmitter<boolean>();
  dataForm!: FormGroup;
  private readonly authService = inject(AuthService);
  private fetrService = inject(FacEmiTipoResiduoService)
  residuoList: { value: number; name: string }[] = [];
  facEmiTipoResList: { value: number; name: string }[][] = [];
  private toastr = inject(ToastrService);
  private residuoService = inject(ResiduoService);
  private ecoCirService = inject(EcoCircularService);
  private odsService= inject (OdsService);
  private ducService = inject(DocAuxCalService)
  @Input() dataOds: Ods | null = null;

  @Input() regionId!: number;
  @Input() agenciaId!: number;
  @Input() nroSolicitud!: string;
  @Input() caedecId!: number;
  @Input() respaldo!: string;
  @Input() objetivoOperacion!: string;
  @Input() destinoCapInvOpe!: string;
  @Input() tipoEmpresa!: string;
  @Input() cantidadEmpleosGen!: number;
  @Input() montoCreditoMn!: number;
  @Input() montoCreditoMe!: number;

  selectedFile: Blob | null = null;
  fileName: string | null = null;

  maxRows: number = 3;

  metodoEstimacionList: { value: string, name: string }[] = [
    { value: '', name: 'Seleccione estimación' },
    { value: 'Considerando la capacidad de producción', name: 'Considerando la capacidad de producción' },
    { value: 'Considerando Incremento en el patrimonio', name: 'Considerando Incremento en el patrimonio' },

  ];
  otroTipoInversionList: { value: string, name: string }[] = [
    { value: '', name: 'Seleccione inversión' },
    { value: 'Construcción de plantas de reciclaje.', name: 'Construcción de plantas de reciclaje.' },
    { value: 'Mejora o ampliación de plantas de reciclaje.', name: 'Mejora o ampliación de plantas de reciclaje.' },
    { value: 'Compra de terrenos', name: 'Compra de terrenos' },
    { value: 'Alquiler/anticretico de terrenos o infraestructura', name: 'Alquiler/anticretico de terrenos o infraestructura' },
    { value: 'Compra de vehiculos', name: 'Compra de vehiculos' },
    { value: 'Compra de montacargas o similares', name: 'Compra de montacargas o similares' },
    { value: 'Otros.', name: 'Otros.' }
  ];

  get residuos(): FormArray {
    return this.dataForm.get('residuos') as FormArray;
  }
  constructor(private fb: FormBuilder) {
    this.dataForm = this.fb.group({
      metodo_est: new FormControl('', [Validators.required]),
      tipo_inv: new FormControl('', [Validators.required]),
      patri_uni_prod: new FormControl('', [Validators.required]),

      clase: new FormControl(''),
      fac_emi_tipo_res: new FormControl(''),
      ctd_residuo: new FormControl(''),
      residuos: this.fb.array([]),

      ctd_res_ceciclaods_ton: new FormControl({ value: '', disabled: true } ),
      emi_gei_evi: new FormControl({ value: '', disabled: true }),

      contenido: new FormControl('', [Validators.required]),

      usuarioId: new FormControl(0),
      regionId: new FormControl(0),
      agenciaId: new FormControl(0),
      nro_solicitud: new FormControl(''),
      respaldo: new FormControl(''),
      caedecId: new FormControl(0),
      objetivo_operacion: new FormControl(0),
      tipos_tecnologia: new FormControl(0),
      metodo_estimacion: new FormControl(0),
      destino_cap_inv_ope: new FormControl(0),
      tipo_empresa: new FormControl(0),
      ctd_empleos_gen: new FormControl(0),
      monto_credito_mn: new FormControl(0),
      monto_credito_me: new FormControl(0),
      ctd_residuos_rec: new FormControl(0),
      emision_gei_evi: new FormControl(0),

    });
  }

  ngOnChanges() {

    this.authService.userId$.subscribe(userId => {

      this.dataForm.patchValue({
        usuarioId: parseInt(userId[0])
      });

    });

  }
  ngOnInit(): void {
    this.initializeResiduos(); // Llama a la función aquí
    this.getResiduos();
    this.subscribeResiduosChanges();
  }
  subscribeResiduosChanges(): void {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
    residuosArray.controls.forEach(control => {
      control.get('ctd_residuo')?.valueChanges.subscribe(() => {
        this.updateCtdResCeciclaodsTon();
      });
      control.get('fac_emi_tipo_res')?.valueChanges.subscribe(()=>{
        this.updateCtdResCeciclaodsTon();
      });
      
    });
  }

  updateCtdResCeciclaodsTon(): void {
    const totalCantidad = this.calculoTotalCantidad();
    this.dataForm.get('ctd_res_ceciclaods_ton')?.setValue(totalCantidad.toFixed(0));
    const totalCalculo = this.calculoTotal();
    this.dataForm.get('emi_gei_evi')?.setValue(totalCalculo);

  }
  calculoTotalCantidad(): number {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
    let total = 0;
    let calculoTotal=0;
    
    residuosArray.controls.forEach(control => {
      const cantidad = control.get('ctd_residuo')?.value;
      console.log(this.montoCreditoMn)
      if (cantidad) {

        if ((parseFloat(this.dataForm.get('patri_uni_prod')?.value)) <= 0 || this.dataForm.get('patri_uni_prod')?.value==='') {
          this.toastr.error('Debes intorducir monto de patrimonio de unidad productiva');
          return; // Detener el submit si la validación falla
        }
        total += (Number(cantidad)*(this.montoCreditoMn/(parseFloat(this.dataForm.get('patri_uni_prod')?.value)+ this.montoCreditoMn)));
        //patri_uni_prod
        
        
      }
    });
  
    return total;
  }

  calculoTotal(): number {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
    
    let calculoTotal=0;
    
    residuosArray.controls.forEach(control => {
      const cantidad = control.get('ctd_residuo')?.value;
      const valor = control.get('fac_emi_tipo_res')?.value;
      if (cantidad) {
        
        calculoTotal += (Number(cantidad)* Number(valor));
      }
    });
  
    return calculoTotal;
  }

  initializeResiduos() {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
    residuosArray.clear(); // Limpia el array existente
    for (let i = 0; i < this.maxRows; i++) {
      residuosArray.push(this.fb.group({
        clase: [''],
        fac_emi_tipo_res: [''],
        ctd_residuo: ['', [ Validators.min(0)]],
      }));

      this.facEmiTipoResList.push([]);// Inicializa el array para cada fila
    }
  }

  getResiduos() {

    this.residuoService.getResiduo().subscribe({
      next: (data) => {
        
        console.log(data);
        this.residuoList = data.map((item: { id: number; clase: string }) => ({
          value: item.id,
          name: item.clase
        }));
      },
      error: () => {
        this.toastr.error('Error al cargar las subcategorías');
      }
    });
  }



  onSubmit() {
    console.log(this.dataForm.valid)
    console.log(this.dataForm.value)
    if(this.dataForm.valid)
    {
      
     if (!this.validateResiduos()) {
        this.toastr.error('Debes seleccionar al menos un residuo y asegurarte de que su cantidad sea mayor a cero.');
        return; // Detener el submit si la validación falla
      }

      this.dataForm.patchValue({
        regionId: this.regionId,
        agenciaId: this.agenciaId,
        nro_solicitud: this.nroSolicitud,
        respaldo: this.respaldo,
        caedecId: this.caedecId,
        objetivo_operacion: this.objetivoOperacion,
        tipos_tecnologia: this.dataForm.get('tipo_inv')?.value,
        metodo_estimacion: this.dataForm.get('metodo_est')?.value,
        destino_cap_inv_ope: this.destinoCapInvOpe,
        tipo_empresa: this.tipoEmpresa,
        ctd_empleos_gen: this.cantidadEmpleosGen,
        monto_credito_mn: this.montoCreditoMn,
        monto_credito_me: this.montoCreditoMe,
        ctd_residuos_rec: this.dataForm.get('ctd_res_ceciclaods_ton')?.value,
        emision_gei_evi: this.dataForm.get('emi_gei_evi')?.value,
  
  
      });
      console.log(this.dataForm.value)

      this.ecoCirService.crearEconomiaCircular(this.dataForm.value).subscribe({
        next: (response: any) => {
          this.resetForm();
          this.toastr.success('Registrado con exito!');
    
          this.dataOds!.ecoCircularId = response
          console.log(this.dataOds)
          this.odsService.crearOds(this.dataOds!).subscribe({
            next: () => { this.toastr.success('ODS Registrados'); }
          })
          
          if (this.selectedFile) {
            this.ducService.crearDocumentoAuxCal(this.fileName!, this.selectedFile, response).subscribe({
              next: () => { this.toastr.success('Doc. calculos auxiliares guardados'); }
            })
          }
        },
        error: (err: any) => {
          
          console.error('Error al actualizar Ecoeficiencia:', err);
          this.toastr.error('No se pudo registrar Ecoeficiencia. Inténtelo nuevamente más tarde.');
        }
      });


    }
    else
    {
      this.dataForm.markAllAsTouched();
    }

  }

  onClose() {

    this.dataForm.reset({
      metodo_est:'',
      tipo_inv:''
    });
    this.initializeResiduos(); 
    this.onCloseModalCIP.emit(false);
  }
  resetForm(): void {
    /*this.dataForm.reset({
      metodo_est:'',
      tipo_inv:''
    });
    this.initializeResiduos(); // Reinicia el array de residuos*/
    this.onClose();
  }

  onFileSelected(event: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];

      // Verificar si el archivo es un PDF
      if (file.type === 'application/pdf') {
        this.fileName = file.name; // Guardar el nombre del archivo
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedFile = new Blob([reader.result as ArrayBuffer], { type: file.type });
          console.log('Archivo convertido a Blob:', this.selectedFile);

        };
        reader.readAsArrayBuffer(file);
      } else {
        //console.error('Por favor, seleccione un archivo PDF.');
        this.fileName = null; // Reiniciar el nombre del archivo si no es PDF
        this.dataForm.get('contenido')?.setErrors({ invalidFileType: true }); // Establece un error en el control
      }
    }
  }

  onTipoResiduoChange(event: Event, index:number) {
    const selectElement = event.target as HTMLSelectElement;
    const residuoId = +selectElement.value;
    if (residuoId) {
      this.getFacEmiTipoRes(residuoId, index);
    } else {
      this.facEmiTipoResList[index] = [];
    }
  }

  getFacEmiTipoRes(residuoId: number, index:number): void {

    this.fetrService.getFacEmiTipoResiduo(residuoId).subscribe({
      next: (data) => {

        this.facEmiTipoResList[index] = data.map((item: { id: number; nombre: string; valor:number }) => ({
          value: item.valor,
          name: item.nombre
        }));
      },
      error: () => {
        this.toastr.error('Error al cargar fac. emi tipo residuo');
      }
    });

  }

  validateResiduos(): boolean {
    const residuosArray = this.dataForm.get('residuos') as FormArray;

    // Verificamos si al menos una fila tiene un residuo seleccionado y cantidad mayor a cero
    return residuosArray.controls.some(control => {
      const ctdResiduo = control.get('ctd_residuo')?.value;
      const facEmiTipoRes = control.get('fac_emi_tipo_res')?.value;
      return facEmiTipoRes && ctdResiduo > 0;
    });
  }

}
