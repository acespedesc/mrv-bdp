import { DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { EcoCircularService } from 'app/services/eco-circular.services';
import { OdsService } from 'app/services/ods.services';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { DocAuxCalService } from 'app/services/documento-aux-cal.services';
import { PDFDocument } from 'pdf-lib';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


interface OdsItem {
  imagen: string;
  descripcion: string;
}

@Component({
  selector: 'app-eco-circular-reporte',
  standalone: true,
  imports: [PdfViewerModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './eco-circular-reporte.component.html',
  styleUrl: './eco-circular-reporte.component.scss'
})
export class EcoCircularReporteComponent {
  @Output() onCloseDocModal = new EventEmitter<void>();
  @Input() ecoCircularId: number | null = null;
  private ecoCirServices = inject(EcoCircularService);
  private odsServices = inject(OdsService)
  private datePipe: DatePipe = inject(DatePipe);
  dataSet!: any
  dataSetDocAux!:any
  dataSetOds: { imagen: string; descripcion: string }[] = [];
  pdfSrc: string | null = null; // La URL del Blob generado
  private pdfBlobUrl: string | null = null;
  private ducService = inject (DocAuxCalService)

  pdfUrl: SafeResourceUrl | undefined;
  pdfUrld: SafeResourceUrl | undefined;

  ngOnChanges() {
    console.log(this.ecoCircularId)
    if (this.ecoCircularId) {
      this.getEcoCircularById(this.ecoCircularId);
      //traer ods mediante id
      this.getOdsById(this.ecoCircularId);

      this.getDocumentoAuxCal(this.ecoCircularId);

    }

  }
  getDocumentoAuxCal(id: number | null){


    this.ducService.getDocumentoAuxCal(id).subscribe({
      next:(data)=>{
          console.log(data)
          this.dataSetDocAux= data;

          if (this.dataSetDocAux[0].contenidoB64) {
            this.createPdfUrl();
          }
      }
    });
  }
  constructor(private sanitizer: DomSanitizer) {}
  private createPdfUrl() {
    // Asegúrate de que pdfbase64 esté en el formato adecuado
    const pdfData = this.dataSetDocAux[0].contenidoB64.startsWith('data:application/pdf;base64,')
      ? this.dataSetDocAux[0].contenidoB64
      : `data:application/pdf;base64,${this.dataSetDocAux[0].contenidoB64}`;

    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfData); // Sanitiza la URL
  }

  getOdsById(id: number | null) {
    this.odsServices.getCircularOds(id).subscribe({
      next: (data) => {
        this.dataSetOds = data.map((item: OdsItem) => ({
          imagen: item.imagen,
          descripcion: item.descripcion
        }));
       // console.log(this.dataSetOds); // Verifica que los datos están presentes

        // Generar el PDF solo si hay datos
        /*if (this.dataSet) {
          console.log('Datos recibidos:', this.dataSet);
          this.generatePdf();
        } else {
          console.log('No hay datos para generar el PDF');
        }*/
      },
      error: (err) => {
        console.error('Error al obtener ods:', err);
      }
    });
  }
  getEcoCircularById(id: number | null) {
    this.ecoCirServices.getEcoCircularById(id).subscribe({
      next: (data) => {
        this.dataSet = data;
        //console.log(this.dataSet); // Verifica que los datos están presentes
        this.dataSet.fecha_registro_formatted = this.formatFechaRegistro(this.dataSet.fecha_registro);
        // Generar el PDF solo si hay datos
        if (this.dataSet) {
          //console.log('Datos recibidos:', this.dataSet);
          this.generatePdf();
        } else {
          console.log('No hay datos para generar el PDF');
        }
      },
      error: (err) => {
        console.error('Error al obtener ecoeficiencia:', err);
      }
    });
  }
  formatFechaRegistro(fechaRegistro: string | null): string | null {
    if (!fechaRegistro) return null;
    const date = new Date(fechaRegistro);
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  generatePdf() {
    if (!this.dataSet) {
      console.log(this.dataSet)
      return;
    }

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 297]
    });

    const logoDerecho = 'assets/bdp.png';
    const imgDerecho = new Image();
    imgDerecho.src = logoDerecho;

    Promise.all([
      //new Promise((resolve) => { imgIzquierdo.onload = resolve; }),
      new Promise((resolve) => { imgDerecho.onload = resolve; })
    ]).then(() => {
      doc.addImage(imgDerecho, 'PNG', 165, 6, 20, 20);

      
      doc.setFontSize(10);
      const titulo = [
        'Formulación de Validación de Proyectos',
        'Medición Economía Circular',
        'Reporte Final'
      ];

      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      titulo.forEach((titulo, index) => {
        const textWidth = doc.getTextWidth(titulo);
        const xPosition = (pageWidth - textWidth) / 2;
        const yPosition = 5 + index * 5;
        doc.text(titulo, xPosition, yPosition + 6);
        doc.setFont('Helvetica', 'bold');
      });

      doc.setFont('Helvetica', 'normal');
      let yPosition = 30;

      // Sección 1: ID y Nro Solicitud
      doc.setFont('Helvetica', 'bold');
      doc.text('1 Información General', margin, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += 3; // Espaciado después del subtítulo

      const generalData = [
        { label: 'Insttución Financiera:', value: 'Banco de Desarrollo Productivo S.A.M.' },
        { label: 'Región:', value: this.dataSet?.region.nombreRegion },
        { label: 'Agencia:', value: this.dataSet?.agencium?.nombreAgencia },
        { label: 'Analista:', value: this.dataSet?.usuario?.nombre_completo },
        { label: 'Fecha de Reporte:', value: this.dataSet.fecha_registro_formatted }

      ];

      generalData.forEach((item) => {
        const cellHeight = 6; // Altura de la celda
        const firstColWidth = (pageWidth - 2 * margin) / 2;
        const secondColWidth = (pageWidth - 2 * margin) / 2;

        // Dibuja las celdas
        doc.rect(margin, yPosition, firstColWidth, cellHeight);
        doc.rect(margin + firstColWidth, yPosition, secondColWidth, cellHeight);

        // Texto de la primera columna
        doc.text(item.label, margin + 2, yPosition + 5);

        // Texto de la segunda columna, centrado
        const textValue = (item.value ?? 'n/a').toString();
        const textWidth = doc.getTextWidth(textValue);
        const xPosition = margin + firstColWidth + (secondColWidth - textWidth) / 2; // Centrado
        doc.text(textValue, xPosition, yPosition + 5);

        yPosition += cellHeight; // Incrementar la posición Y
      });

      yPosition += 10;
     
      doc.setFont('Helvetica', 'bold');
      doc.text('2 Información del Cliente', margin, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += 3;

      const clienteData = [
        { label: 'Caedec - Código Subcteg :', value: this.dataSet?.caedec?.actividad },
        { label: 'Caedec - Descripcion Subcteg :', value: this.dataSet?.caedec?.nombreCaedec },
        { label: 'Nro Solicitud:', value: this.dataSet?.nro_solicitud },
        { label: 'Objetivo de la Operación (KO/KI):', value: this.dataSet?.objetivo_operacion },
        { label: 'Destino del capital de inversión y/o Operación:', value: this.dataSet?.destino_cap_inv_ope },
        { label: 'Tipo de empresa:', value: this.dataSet?.tipo_empresa },

      ];

      clienteData.forEach((item) => {
        const baseCellHeight = 6; // Altura base de la celda
        const firstColWidth = (pageWidth - 2 * margin) / 2;
        const secondColWidth = (pageWidth - 2 * margin) / 2;
      
        // Texto de la segunda columna, centrado y envuelto
        const textValue = (item.value ?? 'n/a').toString();
        const wrappedText = doc.splitTextToSize(textValue, secondColWidth); // Divide el texto
      
        const numberOfLines = wrappedText.length; // Número de líneas generadas
        const cellHeight = baseCellHeight * numberOfLines; // Altura total de la celda
      
        // Dibuja las celdas con la altura ajustada
        doc.rect(margin, yPosition, firstColWidth, cellHeight);
        doc.rect(margin + firstColWidth, yPosition, secondColWidth, cellHeight);
      
        // Texto de la primera columna
        doc.text(item.label, margin + 2, yPosition + 5);
      
        const xPosition = margin + firstColWidth + 2; // Margen para el texto
        wrappedText.forEach((line: string, index: number) => {
          doc.text(line, xPosition, yPosition + 5 + index * (baseCellHeight-2)); // Dibuja cada línea
        });
      
        // Actualiza la posición Y según cuántas líneas se dibujaron
        yPosition += cellHeight ; // Incrementa yPosition con un pequeño margen adicional
      });

      yPosition += 10;
      // Sección 3: Monto Inv y Ahorro
      doc.setFont('Helvetica', 'bold');
      doc.text('4 Información del Proyecto', margin, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += 3;

      const proyectoData = [
        { label: 'Monto del crédito (Bs.)', value: this.formatNumero(this.dataSet?.monto_credito_mn )},
        { label: 'Respaldo de inversión elegible:', value: this.dataSet?.respaldo },
        { label: 'Objetivo de la Operación (KO/KI):', value: this.dataSet?.objetivo_operacion },
        { label: 'Destino del capital de inversión y/o Operación:', value: this.dataSet?.destino_cap_inv_ope },
        { label: 'Cantidad de residuos reciclados (t)', value: this.dataSet?.ctd_residuos_rec},
        { label: 'Emisiones de GEI evitadas (t CO2eq):', value: this.formatNumero( this.dataSet?.emision_gei_evi )},
        { label: 'Cantidad de empleos generados:', value: this.dataSet?.ctd_empleos_gen },
        

      ];

      proyectoData.forEach((item) => {
        const cellHeight = 6; // Altura de la celda
        const firstColWidth = (pageWidth - 2 * margin) / 2;
        const secondColWidth = (pageWidth - 2 * margin) / 2;

        // Dibuja las celdas
        doc.rect(margin, yPosition, firstColWidth, cellHeight);
        doc.rect(margin + firstColWidth, yPosition, secondColWidth, cellHeight);

        // Texto de la primera columna
        doc.text(item.label, margin + 2, yPosition + 5);

        // Texto de la segunda columna, centrado
        const textValue = (item.value ?? 'n/a').toString();
        const textWidth = doc.getTextWidth(textValue);
        const xPosition = margin + firstColWidth + (secondColWidth - textWidth) / 2; // Centrado
        doc.text(textValue, xPosition, yPosition + 5);

        yPosition += cellHeight; // Incrementar la posición Y
      });
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.text('Objetivos de Desarrollo Sostenible (ODS) a los que aporta :', margin, yPosition);
      yPosition += 5; // Espaciado después del título

      const imageWidth = 10; // Ancho de cada imagen
      const imageHeight = 10; // Altura de cada imagen
      const descriptionOffset = 2; // Espacio para la descripción
      const rowHeight = Math.max(imageHeight, 10); // Altura de la fila
      this.dataSetOds.forEach((objetivo, index) => {
        const xPosition = margin + (index % 3) * (imageWidth + descriptionOffset + 55); // Posición en X
        const yOffset = Math.floor(index / 3) * (rowHeight + 1); // Calcula la posición en Y

        // Agrega la imagen
        doc.addImage(objetivo.imagen, 'PNG', xPosition, yPosition + yOffset, imageWidth, imageHeight);

        // Agrega la descripción al lado de la imagen
        doc.setFontSize(8);
        doc.setFont('Helvetica', 'normal');
        const descriptionXPosition = xPosition + imageWidth + 1; // Posición X de la descripción
        doc.text(objetivo.descripcion, descriptionXPosition, yPosition + yOffset + (imageHeight / 2)); // Centrado verticalmente
      });


      


      const pdfBlob = doc.output('blob');
      if (this.pdfBlobUrl) {
        URL.revokeObjectURL(this.pdfBlobUrl);
      }
     // this.pdfBlobUrl = URL.createObjectURL(pdfBlob);
     // this.pdfSrc = this.pdfBlobUrl;
     // Crea un objeto URL a partir del Blob y sanitiza
  this.pdfBlobUrl = URL.createObjectURL(pdfBlob);
  this.pdfUrld = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfBlobUrl);
  this.pdfSrc = this.pdfUrld as string; // Asegúrate de asignar a pdfSrc como string


    });//promesa


    

  }

  

  downloadPdf() {
    if (this.pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = this.pdfBlobUrl;
      link.download = 'reporte-ecoeficiencia.pdf'; // Nombre del archivo de descarga
      link.click();
    }
  }

  closeModal() {
    this.onCloseDocModal.emit();
    this.dataSet = null;

  }

  ngOnDestroy() {
    // Libera el objeto URL cuando el componente se destruya
    if (this.pdfBlobUrl) {
      URL.revokeObjectURL(this.pdfBlobUrl);
    }
  }

  formatNumero(value: number | null): string {
    if (value === null) return 'n/a';
    
    // Convierte el número a cadena y lo divide en partes
    const parts = value.toString().split('.');
    // Agrega el separador de miles usando una expresión regular
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // Formatea la parte decimal
    const decimalPart = parts[1] ? ',' + parts[1] : '';
  
    return integerPart + decimalPart;
  }

}
