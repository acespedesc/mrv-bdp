import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ecoeficiencia } from 'app/models/ecoeficiencia.interface';
import { LineaBase } from 'app/models/linea-base.interface';
import { Ods } from 'app/models/ods.interface';
import { AuthService } from 'app/services/auth.services';
import { EcoeficienciaService } from 'app/services/ecoeficiencia.services';
import { LineaBaseService } from 'app/services/linea-base.services';
import { OdsService } from 'app/services/ods.services';
import { PrecioFactorTasaService } from 'app/services/precio-factor-tasa.services';
import { RegionesInstalacionService } from 'app/services/regiones-instalacion.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eb-fv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './eb-fv.component.html',
  styleUrl: './eb-fv.component.scss'
})
export class EbFvComponent {
  @Input() dataOds: Ods | null = null;

  @Input() montoInvMe!: number;
  @Input() regionId!: number;
  @Input() agenciaId!: number;
  @Input() nroSolicitud!: string;
  @Input() caedecId!: number;
  @Input() respaldo!: string;
  @Input() subcategoriaId!: number;
  @Input() inversionElegibleId!: number;
  @Input() MontoInvBS!: number;

  @Output() onCloseModalEbFv = new EventEmitter();
  @Input() data: Ecoeficiencia | null = null;
  lbVidaUtil: LineaBase[] = [];
  lbPotInsSis: LineaBase[] = [];
  lbTipoSistema!: LineaBase;
  proAnualEner: number | null = null;
  ahoEnerTotal: number | null = null;

  private toastr = inject(ToastrService);
  regInstService = inject(RegionesInstalacionService);
  lbService = inject(LineaBaseService);
  pftService = inject(PrecioFactorTasaService);
  ecoService = inject(EcoeficienciaService);
  dataForm!: FormGroup;
  regionesInstList: { value: number; name: string; pvout: string }[] = [];
  tipoSistemaList: { value: number; name: string; medida: number; unidad: string }[] = [];
  tipoCombustibleList: { value: number; name: string; valor: number, unidad: string }[] = [];
  private readonly authService = inject(AuthService);
  private odsService= inject (OdsService)

  constructor(private fb: FormBuilder, private regService: RegionesInstalacionService) {
    this.dataForm = this.fb.group({
      usuarioId: new FormControl(0),
      regionId: new FormControl(0),
      agenciaId: new FormControl(0),
      nro_solicitud: new FormControl(''),
      caedecId: new FormControl(0),
      respaldo: new FormControl(''),
      subcategoriaId: new FormControl(0),
      inversionElegibleId: new FormControl(0),
      monto_inv_mn: new FormControl(0),
      monto_inv_me: new FormControl(0),
      produccion_energia_anual: new FormControl(0),
      reduccion_emisiones_anual: new FormControl(0),
      potencia_inst_sis: new FormControl(0),
      vida_util: new FormControl(0),

      region_inst: new FormControl('', [Validators.required]),
      ren_esp_sis: new FormControl({ value: '', disabled: true }, [Validators.required]),
      vida_util_c: new FormControl({ value: '', disabled: true }, [Validators.required]),
      tipo_sistema: new FormControl('', [Validators.required]),
      tipo_combustible: new FormControl('', [Validators.required]),
      pot_inst_sis: new FormControl({ value: '', disabled: true }, [Validators.required]),
      pro_anual_ener: new FormControl({ value: '', disabled: true }, [Validators.required]),
      aho_ener_total: new FormControl({ value: '', disabled: true }, [Validators.required]),
      red_emi_anu: new FormControl({ value: '', disabled: true }, [Validators.required]),
      red_emi_total: new FormControl({ value: '', disabled: true }, [Validators.required])
    });

  }
  montoMe: number = 0;
  ngOnChanges() {
    if (this.montoInvMe) {

      this.montoMe = this.montoInvMe

    }

    this.authService.userId$.subscribe(userId => {

      //console.log('El id de usuario es  :',userId)
      //set a usuario
      this.dataForm.patchValue({
        usuarioId: parseInt(userId[0])
      });

    });

  }

  ngOnInit(): void {
    
    this.getRegionesInstalacion()

    this.getTipoSistema()
    this.getTipoCombustible()
  }
  getTipoCombustible() {
    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {
        const fData = data.filter((record: { tipo: string }) =>
          record.tipo === 'FE_KGCO2KWH_E' || record.tipo === 'FE_KGCO2LT_D' || record.tipo === 'FE_KGCO2LT_G'
        )
        this.tipoCombustibleList = fData.map((item: { id: number; descripcion: string; valor: number; unidad: string }) => ({
          value: item.id,
          name: item.descripcion,
          valor: item.valor,
          unidad: item.unidad
        }));

      }
      ,
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },

    });
  }
  getTipoSistema() {

    this.lbService.getLineaBase().subscribe({
      next: (data) => {


        const fData = data.filter((record: { proyecto: string}) =>
          record.proyecto === 'EBFV_AB' ||
          record.proyecto === 'EBFV_GD'
        )
        console.log(fData)
        this.tipoSistemaList = fData.map((item: { id: number; tipo_tecnologia: string; medida: number; unidad_medida: string }) => ({
          value: item.id,
          name: item.tipo_tecnologia,
          medida: item.medida,
          unidad: item.unidad_medida
        }));



      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }
  getRegionesInstalacion(): void {

    this.regInstService.getRegionesInstalacion().subscribe({
      next: (data) => {
        //this.invEleg.set(data);
        // console.log(data);
        this.regionesInstList = data.map((item: { id: number; region: string, pvout: string }) => ({
          value: item.id,
          name: item.region,
          pvout: item.pvout
        }));
      },
      error: (err) => {
        console.error('Error al cargar regiones:', err);
      },
    });

  }
  getLineaBase() {
    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        //console.log('Datos linea base recibidos:', data); // Verifica que los datos llegan
        this.lbVidaUtil = data;
        this.lbPotInsSis = data;
        this.lbTipoSistema = data;
        //console.log(this.lbVidaUtil)
        // Filtra los datos según los criterios
        const filteredData = this.lbVidaUtil.filter((record: { proyecto: string }) =>
          record.proyecto === 'EBFV_GSEA'
        );

        // Si necesitas solo un registro, puedes usar el método `find` en lugar de `filter`
        const selectedRecord = filteredData.length > 0 ? filteredData[0].medida : null;

        //console.log('Registro seleccionado:', selectedRecord);
        this.dataForm.get('vida_util_c')?.setValue(selectedRecord, { emitEvent: false });

      },
      error: () => {
        this.toastr.error('Error al cargar los datos');
      },
    });
  }

ecoId!: number;
  onSubmit() {
    //console.log("MOnto en ME...................",this.montoInvMe)

    if (this.dataForm.valid) {

      if (this.data) {


      }
      else {
        this.dataForm.patchValue({
          regionId: this.regionId,
          agenciaId: this.agenciaId,
          nro_solicitud: this.nroSolicitud,
          respaldo: this.respaldo,
          caedecId: this.caedecId,
          subcategoriaId: this.subcategoriaId,
          inversionElegibleId: this.inversionElegibleId,
          monto_inv_mn: this.MontoInvBS,
          monto_inv_me: this.montoInvMe,
          produccion_energia_anual: this.dataForm.get('pro_anual_ener')?.value,
          reduccion_emisiones_anual: this.dataForm.get('red_emi_anu')?.value,
          potencia_inst_sis: this.dataForm.get('pot_inst_sis')?.value,
          vida_util: this.dataForm.get('vida_util_c')?.value

        });
        //console.log(this.dataForm.value)

        this.ecoService.crearEcoeficiencia(this.dataForm.value).subscribe({
          next: (response: any) => {
            this.resetdataForm();
            this.toastr.success('Ecoeficiencia registrada con exito!');

           
              
              this.dataOds!.ecoId = response
              console.log(this.dataOds)
              this.odsService.crearOds(this.dataOds!).subscribe({
                next:()=>{
                  this.toastr.success('Ods registrados');
                }
              })
            
          },
          error: (err: any) => {
            // Manejar el error
            console.error('Error al actualizar Ecoeficiencia:', err);
            this.toastr.error('No se pudo registrar Ecoeficiencia. Inténtelo nuevamente más tarde.');
          }
        });

        /*if (this.ecoId) {
          console.log('el id de ecoeficiencia es : ', this.ecoId)  
         this.dataOds!.ecoId = this.ecoId

          this.odsService.crearOds(this.dataOds!).subscribe({
            
          })

      }*/


      }


    }
    else {
      this.dataForm.markAllAsTouched();
    }

  }

  onRegionChange(event: Event): void {


    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    //console.log(event)
    const selectedItem = this.regionesInstList.find(item => item.value === +selectedValue);
    if (selectedItem) {
      this.dataForm.get('ren_esp_sis')?.setValue(selectedItem.pvout, { emitEvent: false });

    }
    this.getLineaBase()
  }




  selectedMedida: number = 0;
  onTipoSistemaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    const selectedItem = this.tipoSistemaList.find(item => item.value === +selectedValue);
    if (selectedItem) {
      this.selectedMedida = selectedItem.medida;
      this.montoMe
      this.dataForm.get('pot_inst_sis')?.setValue((this.montoMe / this.selectedMedida).toFixed(1), { emitEvent: false });

    } else {
      this.selectedMedida = 0;

    }

    const potInstSis = this.dataForm.get('pot_inst_sis')?.value;
    const rendimientoEspSis = this.dataForm.get('ren_esp_sis')?.value;
    if (potInstSis && rendimientoEspSis) {
      this.proAnualEner = potInstSis * rendimientoEspSis;
      this.dataForm.get('pro_anual_ener')?.setValue(((this.montoMe / this.selectedMedida) * rendimientoEspSis).toFixed(0), { emitEvent: false });
    } else {
      this.proAnualEner = null;
    }

    const proAnualEner = this.dataForm.get('pro_anual_ener')?.value;
    const vidaUtil = this.dataForm.get('vida_util_c')?.value;
    if (proAnualEner && vidaUtil) {
      this.ahoEnerTotal = proAnualEner * vidaUtil;
      this.dataForm.get('aho_ener_total')?.setValue(this.ahoEnerTotal, { emitEvent: false });
    } else {
      this.ahoEnerTotal = null;
    }


  }
  selectedValor: number = 0;
  onTipoEnergiaChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    const proAnualEner = this.dataForm.get('pro_anual_ener')?.value;

    const selectedItem = this.tipoCombustibleList.find(item => item.value === +selectedValue);




    if (selectedItem) {
      this.selectedValor = selectedItem.valor;

      switch (selectedItem?.name) {
        case 'Electricidad':
          this.dataForm.get('red_emi_anu')?.setValue((proAnualEner * selectedItem.valor).toFixed(0), { emitEvent: false });
          break;
        case 'Diesel':
          this.dataForm.get('red_emi_anu')?.setValue((proAnualEner * (selectedItem.valor / 10.03) * (1 / 0.35)).toFixed(0), { emitEvent: false });
          break;
        case 'Gasolina':
          this.dataForm.get('red_emi_anu')?.setValue((proAnualEner * (selectedItem.valor / 9.11) * (1 / 0.35)).toFixed(0), { emitEvent: false });
          break;
      }
    } else {
      this.selectedValor = 0;

    }

    const redEmiAnual = this.dataForm.get('red_emi_anu')?.value;
    const vidaUtil = this.dataForm.get('vida_util_c')?.value;
    this.dataForm.get('red_emi_total')?.setValue(vidaUtil * redEmiAnual, { emitEvent: false });

  }

  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }
  onClose() {
    this.onCloseModalEbFv.emit(false);

    this.dataForm.reset({
      region_inst: '', // Para que muestre la opción por defecto
      tipo_sistema: '',
      tipo_combustible: ''
    });
  }

}
