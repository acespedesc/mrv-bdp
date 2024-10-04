import { Component, OnInit, EventEmitter, Output, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResiduoService } from 'app/services/residuo.services';
import { ToastrService } from 'ngx-toastr';
import { FacEmiTipoResiduoService } from 'app/services/fac-emi-tipo-residuo.services';
import { AuthService } from 'app/services/auth.services';
import { Ods } from 'app/models/ods.interface';
import { EcoCircularService } from 'app/services/eco-circular.services';
import { OdsService } from 'app/services/ods.services';
import { DocumentoAuxCal } from 'app/models/doc-aux-cal.interface';
import { DocAuxCalService } from 'app/services/documento-aux-cal.services';

@Component({
  selector: 'app-capital-operacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './capital-operacion.component.html',
  styleUrls: ['./capital-operacion.component.scss']
})
export class CapitalOperacionComponent implements OnInit {
  @Output() onCloseModalCO = new EventEmitter<boolean>();
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
  
  dataForm!: FormGroup;
  private residuoService = inject(ResiduoService)
  private fetrService = inject(FacEmiTipoResiduoService)
  private toastr = inject(ToastrService)
  residuoList: { value: number; name: string }[] = [];
  facEmiTipoResList: { value: number; name: string }[][] = [];
  private readonly authService = inject(AuthService);
  private ecoCirService= inject(EcoCircularService);
  private odsService= inject (OdsService) 
  maxRows: number = 5;

  //datos y servicio para documento auxliar
  private ducService = inject(DocAuxCalService)
  selectedFile: Blob | null = null;
  fileName: string | null = null; 
  docAuxCal!:DocumentoAuxCal

  constructor(private fb: FormBuilder) {
    this.dataForm = this.fb.group({

      usuarioId: new FormControl(0),
      regionId: new FormControl(0),
      agenciaId: new FormControl(0),
      nro_solicitud: new FormControl(''),
      respaldo: new FormControl(''),
      caedecId: new FormControl(0),
      objetivo_operacion: new FormControl(0),
      destino_cap_inv_ope: new FormControl(0),
      tipo_empresa: new FormControl(0),
      ctd_empleos_gen: new FormControl(0),
      monto_credito_mn: new FormControl(0),
      monto_credito_me: new FormControl(0),
      ctd_residuos_rec: new FormControl(0),
      emision_gei_evi: new FormControl(0),



      clase: new FormControl(''),
      fac_emi_tipo_res: new FormControl(''),
      ctd_residuo: new FormControl(''),
      ctd_res_ceciclaods_ton: new FormControl({ value: '', disabled: true }, [Validators.required]),
      emi_gei_evi: new FormControl({ value: '', disabled: true }, [Validators.required]),
      //ctd_emp_gen: new FormControl({ value: '', disabled: true }, [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      residuos: this.fb.array([]),
     
    });
  }


  get residuos(): FormArray {
    return this.dataForm.get('residuos') as FormArray;
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
    this.dataForm.get('ctd_res_ceciclaods_ton')?.setValue(totalCantidad);
    const totalCalculo = this.calculoTotal();
    this.dataForm.get('emi_gei_evi')?.setValue(totalCalculo);

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

  initializeResiduos() {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
    residuosArray.clear(); // Limpia el array existente
    for (let i = 0; i < this.maxRows; i++) {
      residuosArray.push(this.fb.group({
        clase: ['', Validators.required],
        fac_emi_tipo_res: ['', Validators.required],
        ctd_residuo: ['', [Validators.required, Validators.min(0)]],
      }));

      this.facEmiTipoResList.push([]);// Inicializa el array para cada fila
    }
  }

 

  onSubmit() {
    /*const totalCantidad = this.calculoTotalCantidad();
    const totalCalculo = this.calculoTotal();
    console.log('Total Cantidad de Residuos:', totalCantidad);
    console.log('Total Calculo de Residuos:', totalCalculo);
    console.log(this.dataForm.value); */
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
            next:()=>{ this.toastr.success('ODS Registrados'); }
          })
          //si existe documento guardar
          if(this.selectedFile)
          {
            this.ducService.crearDocumentoAuxCal (this.fileName!, this.selectedFile,response).subscribe({  
              next:()=>{ this.toastr.success('Doc. calculos auxiliares guardados'); }
            })
          }
      },
      error: (err: any) => {
        // Manejar el error
        console.error('Error al actualizar Ecoeficiencia:', err);
        this.toastr.error('No se pudo registrar Ecoeficiencia. Inténtelo nuevamente más tarde.');
      }
    });




  }

  resetForm(): void {
    this.dataForm.reset();
    this.initializeResiduos(); // Reinicia el array de residuos
    this.onClose();
  }
  
  onClose() {
   // this.resetForm(); // Resetea el formulario antes de cerrar el modal
   this.dataForm.reset();
   this.initializeResiduos(); // Reinicia el array de residuos
    this.onCloseModalCO.emit(false);
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

  calculoTotalCantidad(): number {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
    let total = 0;
    let calculoTotal=0;
    
    residuosArray.controls.forEach(control => {
      const cantidad = control.get('ctd_residuo')?.value;
      const valor = control.get('fac_emi_tipo_res')?.value;
      if (cantidad) {
        total += Number(cantidad);
        
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


  validateResiduos(): boolean {
    const residuosArray = this.dataForm.get('residuos') as FormArray;
  
    // Verificamos si al menos una fila tiene un residuo seleccionado y cantidad mayor a cero
    return residuosArray.controls.some(control => {
      const ctdResiduo = control.get('ctd_residuo')?.value;
      const facEmiTipoRes = control.get('fac_emi_tipo_res')?.value;
      return facEmiTipoRes && ctdResiduo > 0;
    });
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
}