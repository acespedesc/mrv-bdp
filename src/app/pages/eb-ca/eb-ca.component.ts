import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ecoeficiencia } from 'app/models/ecoeficiencia.interface';
import { LineaBase } from 'app/models/linea-base.interface';
import { Ods } from 'app/models/ods.interface';
import { PrecioFactorTasa } from 'app/models/precio-factor-tasa.interface';
import { RegionesInstalacion } from 'app/models/regiones-instalacion.interface';
import { AuthService } from 'app/services/auth.services';
import { EcoeficienciaService } from 'app/services/ecoeficiencia.services';
import { LineaBaseService } from 'app/services/linea-base.services';
import { OdsService } from 'app/services/ods.services';
import { PrecioFactorTasaService } from 'app/services/precio-factor-tasa.services';
import { RegionesInstalacionService } from 'app/services/regiones-instalacion.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eb-ca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './eb-ca.component.html',
  styleUrl: './eb-ca.component.scss'
})
export class EbCaComponent {
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

 
  @Output() onCloseModalEbCa = new EventEmitter();
  dataForm!: FormGroup;
  lbService = inject(LineaBaseService)
  regInstService = inject(RegionesInstalacionService);
  pftService = inject(PrecioFactorTasaService)
  regionesInstList: { value: number; name: string; ghi: number }[] = [];
  segmentoClienteList: { value: string, name: string; unidad: string; valor: number }[] = [];
  tipoServicioList: { value: string, name: string; unidad: string; valor: number }[] = [];
  tecnologiaList: { value: number, name: string; unidad: string; valor: number }[] = [];
  private readonly authService = inject(AuthService);
  private toastr = inject(ToastrService);
  SegCliAuxList: PrecioFactorTasa[] = [];
  lineaBaseAux: LineaBase[] = [];
  regionesInst: RegionesInstalacion[] = [];
  factorOcupacionF10!: number
  regionSelecGhi!: number
  nroCamaSegF9!: number
  @Input() data: Ecoeficiencia | null = null;
  private odsService= inject (OdsService)


  constructor(private fb: FormBuilder, private ecoService: EcoeficienciaService) {
    this.dataForm = this.fb.group({
      usuarioId: new FormControl(0),
      regionId: new FormControl(0),
      agenciaId: new FormControl(0),
      nro_solicitud: new FormControl(''),
      caedecId: new FormControl(0),
      respaldo: new FormControl(''),
      subcategoriaId : new FormControl(0),
      inversionElegibleId: new FormControl(0),
      monto_inv_mn: new FormControl(0),
      monto_inv_me: new FormControl(0),
      produccion_energia_anual: new FormControl(0),
      reduccion_emisiones_anual: new FormControl(0),
      potencia_inst_sis: new FormControl(0),
      vida_util: new FormControl(0),

      seg_cli: new FormControl('', [Validators.required]),
      tipo_ser: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      nro_camas: new FormControl(''),
      factor_ocu: new FormControl(''),
      nro_col_sol: new FormControl({ value: '', disabled: true }, [Validators.required]),
      temp_ini_agua: new FormControl({ value: '', disabled: true }, [Validators.required]),
      temp_fin_agua: new FormControl({ value: '', disabled: true }, [Validators.required]),
      area_col_sol: new FormControl({ value: '', disabled: true }, [Validators.required]),
      calor_esp_agua: new FormControl({ value: '', disabled: true }, [Validators.required]),
      vida_util_c: new FormControl({ value: '', disabled: true }, [Validators.required]),
      tecnologia: new FormControl('', [Validators.required]),
      efi_reg_elec: new FormControl({ value: '', disabled: true }, [Validators.required]),
      con_ener_anual: new FormControl({ value: '', disabled: true }, [Validators.required]),
      por_aho_anual: new FormControl({ value: '', disabled: true }, [Validators.required]),
      aho_ener_anual: new FormControl({ value: '', disabled: true }, [Validators.required]),
      aho_ener_total: new FormControl({ value: '', disabled: true }, [Validators.required]),
      red_emi_anual: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });

  }


  ngOnChanges() {
    if (this.montoInvMe) {

      console.log(this.montoInvMe)

    }
  }

  onSubmit() {
    
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
          produccion_energia_anual: this.dataForm.get('aho_ener_anual')?.value | 0,
          reduccion_emisiones_anual: this.dataForm.get('red_emi_anual')?.value | 0,
          potencia_inst_sis: this.dataForm.get('pot_inst_sis')?.value | 0,
          vida_util :this.dataForm.get('vida_util_c')?.value | 0

        });
        console.log(this.dataForm.value)

        this.ecoService.crearEcoeficiencia(this.dataForm.value).subscribe({
          next:(response:any)=>{
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
              
              this.toastr.error('No se pudo registrar Ecoeficiencia. Inténtelo nuevamente más tarde.');
          }
        });
      }


    }
    else {
      this.dataForm.markAllAsTouched();
    }

  }

  ngOnInit(): void {
    //obtener usuario
    this.authService.userId$.subscribe(userId => {

      //console.log('El id de usuario es  :',userId)
      //set a usuario
      this.dataForm.patchValue({
        usuarioId: parseInt(userId[0])
      });

    });

    this.Regiones()
    this.SegmentoCliente()
    this.TipoServicio()
    this.tecnologia()

    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        this.lineaBaseAux = data;
        //obteniendo calor especifico del agua F7 
        const filteredDataF7 = this.lineaBaseAux.filter(record => record.proyecto.trim() === 'EBCA_LBG_CS_CEA');
        const calorEspecificoAgua = filteredDataF7.length > 0 ? filteredDataF7[0].medida : 0;
        this.dataForm.get('calor_esp_agua')?.setValue(calorEspecificoAgua, { emitEvent: false });
        //obteniedo vida util F8 EBCA_LBG_CS_VU
        const filteredDataF8 = this.lineaBaseAux.filter(record => record.proyecto.trim() === 'EBCA_LBG_CS_VU');
        const vidaUtil = filteredDataF8.length > 0 ? filteredDataF8[0].medida : 0;
        this.dataForm.get('vida_util_c')?.setValue(vidaUtil, { emitEvent: false });
      },
      error: (err) => {
        this.toastr.warning('Error al cargar Linea Base', err);
      },

    })

    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {
        this.SegCliAuxList = data;

        //Obteniedo Temperatura final del agua F17
        const filteredDataF17 = this.SegCliAuxList.filter(record => record.tipo.trim() === 'EBCA_CAC_TFA');
        const temperaturaFinal = filteredDataF17.length > 0 ? filteredDataF17[0].valor : 0;
        console.log(temperaturaFinal)
        this.dataForm.get('temp_fin_agua')?.setValue(temperaturaFinal, { emitEvent: false });

        //Obteniedo Temperatura inicial del agua F16
        const filteredDataF16 = this.SegCliAuxList.filter(record => record.tipo.trim() === 'EBCA_CAC_TIA');
        const temperaturaInicial = filteredDataF16.length > 0 ? filteredDataF16[0].valor : 0;
        console.log(temperaturaInicial)
        this.dataForm.get('temp_ini_agua')?.setValue(temperaturaInicial, { emitEvent: false });

        //Obteniedo Area de  Colector Solar m2 F11 
        const filteredDataF11 = this.SegCliAuxList.filter(record => record.tipo.trim() === 'EBCA_ACSDR_CAC');
        const areaColectorSolar = filteredDataF11.length > 0 ? filteredDataF11[0].valor : 0;
        console.log(areaColectorSolar)
        this.dataForm.get('area_col_sol')?.setValue(areaColectorSolar, { emitEvent: false });
      },
      error: (err) => {
        this.toastr.warning('Error al cargar EBCA_NCPS(Precios factot Tasa):', err);
      },
    });
  }

  tecnologia() {
    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {

        this.tecnologiaList = data
          .filter((item: { id: number; descripcion: string, tipo: string; unidad: string; valor: number }) => item.tipo === 'EBCA_TLB_EC')
          .map((item: { id: number; descripcion: string; unidad: string; valor: number }) => ({
            value: item.id,
            name: item.descripcion,
            unidad: item.unidad,
            valor: item.valor
          }));
      },
      error: (err) => {
        this.toastr.warning('Error al cargartecnologia):', err);
      },
    });
  }
  TipoServicio() {
    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {

        this.tipoServicioList = data
          .filter((item: { id: number; descripcion: string, tipo: string; unidad: string; valor: number }) => item.tipo === 'EBCA_FOTU')
          .map((item: { id: number; descripcion: string; unidad: string; valor: number }) => ({
            value: item.id,
            name: item.descripcion,
            unidad: item.unidad,
            valor: item.valor
          }));
      },
      error: (err) => {
        this.toastr.warning('Error al cargar EBCA_FOTU(Precios factot Tasa):', err);
      },
    });
  }
  SegmentoCliente() {

    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {
        //this.SegCliAuxList = data
        this.segmentoClienteList = data
          .filter((item: { id: number; descripcion: string, tipo: string; unidad: string; valor: number }) => item.tipo === 'EBCA_NCPS')
          .map((item: { id: number; descripcion: string; unidad: string; valor: number }) => ({
            value: item.id,
            name: item.descripcion,
            unidad: item.unidad,
            valor: item.valor
          }));
      },
      error: (err) => {
        this.toastr.warning('Error al cargar EBCA_NCPS(Precios factot Tasa):', err);
      },
    });



  }

  Regiones(): void {

    this.regInstService.getRegionesInstalacion().subscribe({
      next: (data) => {
        this.regionesInst = data
        this.regionesInstList = data.map((item: { id: number; region: string, ghi: number }) => ({
          value: item.id,
          name: item.region,
          ghi: item.ghi
        }));
      },
      error: (err) => {
        this.toastr.warning('Error al cargar Regiones Instalacion:', err);
      },
    });

  }

  

  onRegionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const regInstId = +selectElement.value;
    console.log(regInstId)
    console.log(this.regionesInst)
    //valor ghi obtenido de selecion de region
    const filteredData = this.regionesInst.filter(record => record.id === regInstId);
    this.regionSelecGhi = filteredData.length > 0 ? filteredData[0].ghi : 0;


  }
  onTipoServicioChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tipoSerId = +selectElement.value;
    const factorOcupacion = this.dataForm.get('factor_ocu')?.value;

    if (factorOcupacion) {

      this.factorOcupacionF10 = (factorOcupacion)

    }
    else {
      const filteredData = this.SegCliAuxList.filter(record => record.id === tipoSerId);

      this.factorOcupacionF10 = filteredData.length > 0 ? filteredData[0].valor : 0;

    }

    this.NroColectoresSolares()

  }
  onSegCliChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const segmentoCliId = +selectElement.value;
    const nroCamas = this.dataForm.get('nro_camas')?.value;
    if (nroCamas) {

      this.nroCamaSegF9 = nroCamas

    }
    else {
      const filteredData = this.SegCliAuxList.filter(record => record.id === segmentoCliId);

      this.nroCamaSegF9 = filteredData.length > 0 ? filteredData[0].valor : 0;

    }
    this.NroColectoresSolares()
  }


  selectedValor: number = 0;
  onTecnologiaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tecnologiaId = +selectElement.value;
    //obteniedo eficiencia tecnologica F21
    const filteredData = this.SegCliAuxList.filter(record => record.id === tecnologiaId);
    const eficienciaTec = filteredData.length > 0 ? filteredData[0].valor : 0;
    this.dataForm.get('efi_reg_elec')?.setValue(eficienciaTec, { emitEvent: false });

    //obtener Reducción de emisiones anuales red_emi_anual
    /* const selectedItem = this.tecnologiaList.find(item => item.value === +tecnologiaId);
     if (selectedItem) {
       this.selectedValor = selectedItem.valor;
 
       switch (selectedItem?.name) {
         case 'Regaderas eléctricas':
           this.dataForm.get('red_emi_anual')?.setValue(proAnualEner * selectedItem.valor, { emitEvent: false });
           break;
         case 'Diesel':
           this.dataForm.get('red_emi_anu')?.setValue(proAnualEner * (selectedItem.valor/10.03)*(1/0.35), { emitEvent: false });
           break;
           case 'Gasolina':
             this.dataForm.get('red_emi_anu')?.setValue(proAnualEner * (selectedItem.valor/9.11)*(1/0.35), { emitEvent: false });
           break;
       }
     } else {
       this.selectedValor = 0;
 
     }*/

  }

  NroColectoresSolares() {
    console.log(this.SegCliAuxList)
    console.log('Fcator Ocupacion F10', this.factorOcupacionF10)
    console.log('Nro Camas por seg.. F9', this.nroCamaSegF9)

    //obteniedo Consumo diario de ACS por persona F14
    const filteredData = this.SegCliAuxList.filter(record => record.tipo === 'EBCA_CACPLD');
    const consumoDiario = filteredData.length > 0 ? filteredData[0].valor : 0;

    //obteniedo eficiencia e colector Solar F15 EBCA_ECS
    const filteredDataF15 = this.SegCliAuxList.filter(record => record.tipo === 'EBCA_ECS');
    const eficienciaColectorSolar = filteredDataF15.length > 0 ? filteredDataF15[0].valor : 0;

    //obteniendo Calor específico del agua F7 
    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        const filteredData = data.filter((item: { proyecto: string }) => item.proyecto.trim() === 'EBCA_LBG_CS_CEA')
        const calorEspecificoAgua = filteredData.length > 0 ? filteredData[0].medida : 0;
        //console.log(calorEspecificoAgua)

        //obteniedo F17 y F16 
        const difF17F16 = this.dataForm.get('temp_fin_agua')?.value - this.dataForm.get('temp_ini_agua')?.value;
        //Obteniendo F21 efi_reg_elec
        const F21 = this.dataForm.get('efi_reg_elec')?.value

        //obteniedo Cconsumo de enrgia anual F23
        this.dataForm.get('con_ener_anual')?.setValue(((consumoDiario * (calorEspecificoAgua / 3.6 / 1000) * difF17F16 * 365 * this.nroCamaSegF9 * this.factorOcupacionF10) / F21).toFixed(0), { emitEvent: false });
        //console.log(this.regionSelecGhi)
        //console.log(eficienciaColectorSolar)
        //obtener area de colecto solar F11 area_col_sol
        const areaColectoSolF11 = this.dataForm.get('area_col_sol')?.value
        //console.log(areaColectoSolF11)
        //obteniedo Unidades de colectore F12 nro_col_sol
        this.dataForm.get('nro_col_sol')?.setValue(Math.ceil(((consumoDiario * (calorEspecificoAgua / 3.6 / 1000) * difF17F16 * 365 * this.nroCamaSegF9 * this.factorOcupacionF10) / F21) / (this.regionSelecGhi * (eficienciaColectorSolar / 100)) / areaColectoSolF11), { emitEvent: false });

        //f24= f23-f20 aho_ener_anual
        const F24 = ((consumoDiario * (calorEspecificoAgua / 3.6 / 1000) * difF17F16 * 365 * this.nroCamaSegF9 * this.factorOcupacionF10) / F21) - ((consumoDiario * (calorEspecificoAgua / 3.6 / 1000) * difF17F16 * 365 * this.nroCamaSegF9 * (this.factorOcupacionF10 / 100)) * 0.2)
        this.dataForm.get('aho_ener_anual')?.setValue(F24.toFixed(0), { emitEvent: false });

        //Obteniedo Porcentajede ahorro anual f24/f23  
        this.dataForm.get('por_aho_anual')?.setValue(((F24 / ((consumoDiario * (calorEspecificoAgua / 3.6 / 1000) * difF17F16 * 365 * this.nroCamaSegF9 * this.factorOcupacionF10) / F21)) * 100).toFixed(0), { emitEvent: false });

        //obteniendo ahorro de energhia total F25 aho_ener_total
        //obtebiendo F8 vida_util
        const vidaUtilF8 = this.dataForm.get('vida_util_c')?.value
        this.dataForm.get('aho_ener_total')?.setValue((F24 * vidaUtilF8).toFixed(0), { emitEvent: false });

        //obteniendo nombre de tecnologia
        const tecId = this.dataForm.get('tecnologia')?.value
        console.log(tecId)
        const selectedItem = this.tecnologiaList.find(item => item.value === +tecId);
        if (selectedItem) {
          this.selectedValor = selectedItem.valor;

          switch (selectedItem?.name) {
            case 'Regaderas eléctricas':
              this.dataForm.get('red_emi_anual')?.setValue((F24 * 0.604).toFixed(0) , { emitEvent: false });
              break;
            case 'Calefón a GLP':
              this.dataForm.get('red_emi_anual')?.setValue((F24 * 0.227).toFixed(0), { emitEvent: false });
              break;
            case 'Calefón a Diésel':
              this.dataForm.get('red_emi_anual')?.setValue((F24 * (0.604 / 10.03)).toFixed(0), { emitEvent: false });
              break;
            case 'Calefón a Gas natural':
              this.dataForm.get('red_emi_anual')?.setValue((F24 * (0.202)).toFixed(0), { emitEvent: false });
              break;
          }
        } else {
          this.selectedValor = 0;

        }



      },
      error: (err) => {
        this.toastr.warning('Error al cargar datos de linea base:', err);
      },

    });

  }

  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }
  onClose() {
    this.onCloseModalEbCa.emit(false);

  }
}
