import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ecoeficiencia } from 'app/models/ecoeficiencia.interface';
import { LineaBase } from 'app/models/linea-base.interface';
import { Ods } from 'app/models/ods.interface';
import { PrecioFactorTasa } from 'app/models/precio-factor-tasa.interface';
import { AuthService } from 'app/services/auth.services';
import { EcoeficienciaService } from 'app/services/ecoeficiencia.services';
import { LineaBaseService } from 'app/services/linea-base.services';
import { OdsService } from 'app/services/ods.services';
import { PrecioFactorTasaService } from 'app/services/precio-factor-tasa.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eb-sb',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './eb-sb.component.html',
  styleUrl: './eb-sb.component.scss'
})
export class EbSbComponent {
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

  // @Input() montoInvMe!: number;
  @Input() data: Ecoeficiencia | null = null;
  @Output() onCloseModalEbSb = new EventEmitter();
  lbService = inject(LineaBaseService);
  pftService = inject(PrecioFactorTasaService);
  private toastr = inject(ToastrService);
  lbPotencia: LineaBase[] = [];
  lbCostoUniW: LineaBase[] = [];
  lbCostoPorcentual: PrecioFactorTasa[] = [];
  lbConElecTot: LineaBase[] = [];
  lbVidaUtil: LineaBase[] = [];
  factoEmisionKwh: PrecioFactorTasa[] = [];
  selectedCostoUnitario!: number
  private readonly authService = inject(AuthService);
  private odsService = inject(OdsService)

  potenciaNominalBomba!: number;

  dataForm!: FormGroup;

  constructor(private fb: FormBuilder, private ecoService: EcoeficienciaService) {
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


      pot_nomi_bom: new FormControl({ value: '', disabled: true }, [Validators.required]),
      unidades: new FormControl({ value: '', disabled: true }, [Validators.required]),
      con_elec_total: new FormControl({ value: '', disabled: true }, [Validators.required]),
      pre_equi_ins: new FormControl({ value: '', disabled: true }, [Validators.required]),
      hrs_ope_anual: new FormControl({ value: '', disabled: true }, [Validators.required]),
      vida_util_c: new FormControl({ value: '', disabled: true }, [Validators.required]),
      aho_ene_total: new FormControl({ value: '', disabled: true }, [Validators.required]),
      red_emi_anual: new FormControl({ value: '', disabled: true }, [Validators.required])
    });

  }
  montoMe: number = 0;
  ngOnChanges(changes: SimpleChanges) {
    if (changes["montoInvMe"] && this.montoInvMe) {

      this.montoMe = this.montoInvMe
      console.log(this.montoMe)
      this.getPotenciaNominalBomba()
      
    }
  }
  ngOnInit(): void {
    this.authService.userId$.subscribe(userId => {

      console.log('El id de usuario es  :', userId)
      //set a usuario
      this.dataForm.patchValue({
        usuarioId: parseInt(userId[0])
      });

    });



  }
 
  getPrecioEquipoMasInstalacion() {

    this.lbService.getLineaBase().subscribe({
      next: (data) => {

        this.lbCostoUniW = data;
        const filteredData = this.lbCostoUniW.filter((record: { proyecto: string }) =>
          record.proyecto === 'EBSB_CUKWP'
        );
        //costo unitario por instalacion por W
        this.selectedCostoUnitario = filteredData[0].medida;
        console.log(this.selectedCostoUnitario)
        //this.dataForm.get('pot_nomi_bom')?.setValue(selectedRecord, { emitEvent: false });
        //console.log(this.selectedCostoUnitario)
      }
    });
    this.pftService.getPrecioFactorTasa().subscribe({
      next: (data) => {
        //console.log(data)
        this.lbCostoPorcentual = data;
        const filteredData = this.lbCostoPorcentual.filter((record: { parametro: string; tipo: string; unidad: string; }) =>
          record.tipo === 'EBSB_COS_INTS'
        );
        const potenciaNomiBomba = this.dataForm.get('pot_nomi_bom')?.value;


        this.dataForm.get('pre_equi_ins')?.setValue(this.selectedCostoUnitario * (1 + (filteredData[0].valor / 100)) * (potenciaNomiBomba * 1000), { emitEvent: false });
      }
    });

  }
  getConsumoElectricidadTotal() {
    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        console.log(data)
        this.lbConElecTot = data;
        const filteredData = this.lbConElecTot.filter((record: { proyecto: string }) =>
          record.proyecto === "EBSB_CET"
        );

        const selectedConElecTot = filteredData[0].medida;
        const potenciaNomiBomba = this.dataForm.get('pot_nomi_bom')?.value;
        const unidadesEquipoRep = this.dataForm.get('unidades')?.value;

        this.dataForm.get('con_elec_total')?.setValue((selectedConElecTot * potenciaNomiBomba) * unidadesEquipoRep, { emitEvent: false });
        this.dataForm.get('hrs_ope_anual')?.setValue(selectedConElecTot, { emitEvent: false });

      }
    });



  }

 

  getPotenciaNominalBomba() {
    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        //console.log(data)
        this.lbPotencia = data;
        const filteredData = this.lbPotencia.filter((record: { proyecto: string; }) =>
          record.proyecto.trim() === 'EBSB_PER'
        );
        //console.log(filteredData)
        // Si necesitas solo un registro, puedes usar el método `find` en lugar de `filter`
        this.potenciaNominalBomba = filteredData[0].medida
        //console.log(selectedRecord)
        this.dataForm.get('pot_nomi_bom')?.setValue(this.potenciaNominalBomba, { emitEvent: false });



      }
    });

    this.lbService.getLineaBase().subscribe({
      next: (data) => {
        // console.log(data)
        this.lbCostoUniW = data;
        const filteredData = this.lbCostoUniW.filter((record: { proyecto: string }) =>
          record.proyecto === 'EBSB_CUKWP'
        );
        //costo unitario por instalacion por W
        this.selectedCostoUnitario = filteredData[0].medida;

        console.log(this.selectedCostoUnitario)


        this.pftService.getPrecioFactorTasa().subscribe({
          next: (data) => {

            this.lbCostoPorcentual = data;
            const filteredData = this.lbCostoPorcentual.filter((record: { parametro: string; tipo: string; unidad: string; }) =>
              record.tipo === 'EBSB_COS_INTS'
            );
            console.log(filteredData)
            const potenciaNomiBomba = parseFloat(this.dataForm.get('pot_nomi_bom')?.value);
            const selectedCostoPorcentual = filteredData[0].valor;
            console.log(selectedCostoPorcentual);
            console.log(this.potenciaNominalBomba);
            console.log(this.montoMe);
            console.log(this.selectedCostoUnitario);
            console.log((1 + (selectedCostoPorcentual / 100)));
            console.log((this.montoMe * (1 / (this.selectedCostoUnitario * (1 + (selectedCostoPorcentual / 100)))) / 1000))
            this.dataForm.get('unidades')?.setValue(Math.floor((this.montoMe * (1 / (this.selectedCostoUnitario * (1 + (selectedCostoPorcentual / 100)))) / 1000) / this.potenciaNominalBomba), { emitEvent: false });

            //costo total de energia
            this.lbService.getLineaBase().subscribe({
              next: (data) => {
                console.log(data)
                this.lbConElecTot = data;
                const filteredData = this.lbConElecTot.filter((record: { proyecto: string }) =>
                  record.proyecto === "EBSB_CET"
                );

                const selectedConElecTot = filteredData[0].medida;

                this.dataForm.get('con_elec_total')?.setValue((selectedConElecTot * this.potenciaNominalBomba) * (Math.floor((this.montoMe * (1 / (this.selectedCostoUnitario * (1 + (selectedCostoPorcentual / 100)))) / 1000) / this.potenciaNominalBomba)), { emitEvent: false });
                this.dataForm.get('hrs_ope_anual')?.setValue(selectedConElecTot, { emitEvent: false });


                this.lbService.getLineaBase().subscribe({
                  next: (data) => {
                    //console.log(data)
                    this.lbVidaUtil = data;
                    const filteredData = this.lbVidaUtil.filter((record: { proyecto: string }) =>
                      record.proyecto === 'EBSB_VUT'

                    );
                    //console.log(filteredData)
                    // Si necesitas solo un registro, puedes usar el método `find` en lugar de `filter`
                    const selectedRecord = filteredData.length > 0 ? filteredData[0].medida : null;
                    //console.log(selectedRecord)
                    this.dataForm.get('vida_util_c')?.setValue(selectedRecord, { emitEvent: false });
                   
                    this.dataForm.get('aho_ene_total')?.setValue(((selectedConElecTot * this.potenciaNominalBomba) * (Math.floor((this.montoMe * (1 / (this.selectedCostoUnitario * (1 + (selectedCostoPorcentual / 100)))) / 1000) / this.potenciaNominalBomba))) * filteredData[0].medida, { emitEvent: false });
                  }
                });


                this.pftService.getPrecioFactorTasa().subscribe({
                  next: (data) => {

                    this.factoEmisionKwh = data;
                    const filteredData = this.factoEmisionKwh.filter((record: { parametro: string; tipo: string; unidad: string; }) =>
                      record.tipo === 'EBSB_FE_KW'
                    );
                    
                    const selectedFactEmi = filteredData[0].valor;
                    this.dataForm.get('red_emi_anual')?.setValue( ((  (selectedConElecTot * this.potenciaNominalBomba) * (Math.floor((this.montoMe * (1 / (this.selectedCostoUnitario * (1 + (selectedCostoPorcentual / 100)))) / 1000) / this.potenciaNominalBomba))  ) * selectedFactEmi).toFixed(0), { emitEvent: false });


                  }
                });


              }
            });


            this.pftService.getPrecioFactorTasa().subscribe({
              next: (data) => {
                //console.log(data)
                this.lbCostoPorcentual = data;
                const filteredData = this.lbCostoPorcentual.filter((record: { parametro: string; tipo: string; unidad: string; }) =>
                  record.tipo === 'EBSB_COS_INTS'
                );
               
                this.dataForm.get('pre_equi_ins')?.setValue(this.selectedCostoUnitario * (1 + (filteredData[0].valor / 100)) * (this.potenciaNominalBomba * 1000), { emitEvent: false });
              }
            });

          }
        });

      }
    });

  }





  onSubmit() {
    console.log(this.dataForm.value)
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
          produccion_energia_anual: this.dataForm.get('con_elec_total')?.value | 0,
          reduccion_emisiones_anual: this.dataForm.get('red_emi_anual')?.value | 0,
          potencia_inst_sis: this.dataForm.get('pot_inst_sis')?.value | 0,
          vida_util: this.dataForm.get('vida_util_c')?.value | 0

        });
        //console.log(this.dataForm.value)

        this.ecoService.crearEcoeficiencia(this.dataForm.value).subscribe({
          next: (response: any) => {
            this.resetdataForm();
            this.toastr.success('Ecoeficiencia registrada con exito!');

            this.dataOds!.ecoId = response
            console.log(this.dataOds)
            this.odsService.crearOds(this.dataOds!).subscribe({
              next: () => {
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
      }


    }
    else {
      this.dataForm.markAllAsTouched();
    }

  }

  resetdataForm() {
    this.dataForm.reset();
    this.onClose();
  }
  onClose() {
    this.onCloseModalEbSb.emit(false);
    this.dataForm.reset();
    this.montoMe = 0;
    this.montoInvMe = 0

  }

}
