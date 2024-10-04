import { Component, EventEmitter, Input, Output, OnDestroy, OnChanges, inject } from '@angular/core';
import { Ecoeficiencia } from 'app/models/ecoeficiencia.interface';
import jsPDF from 'jspdf';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { EcoeficienciaService } from 'app/services/ecoeficiencia.services';
import { DatePipe } from '@angular/common';
import { OdsService } from 'app/services/ods.services';
interface OdsItem {
  imagen: string;
  descripcion: string;
}

@Component({
  selector: 'app-inicio-datos-reporte-eco',
  standalone: true,
  imports: [PdfViewerModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './inicio-datos-reporte-eco.component.html',
  styleUrls: ['./inicio-datos-reporte-eco.component.scss']
})
export class InicioDatosReporteEcoComponent implements OnDestroy, OnChanges {
  @Input() ecoeficienciaId: number | null = null;
  @Output() onCloseDocModal = new EventEmitter<void>();
  private ecoServices = inject(EcoeficienciaService);
  private odsServices = inject(OdsService)
  private datePipe: DatePipe = inject(DatePipe);


  pdfSrc: string | null = null; // La URL del Blob generado
  private pdfBlobUrl: string | null = null;
  dataSet!: any
  //dataSetOds!:any

  dataSetOds: { imagen: string; descripcion: string }[] = [];

  ngOnChanges() {
    console.log(this.ecoeficienciaId)
    if (this.ecoeficienciaId) {
      this.getEcoeficienciaById(this.ecoeficienciaId);
      //traer ods mediante id
      this.getOdsById(this.ecoeficienciaId);

    }

  }
  getEcoeficienciaById(id: number | null) {
    this.ecoServices.getEcoeficienciaById(id).subscribe({
      next: (data) => {
        this.dataSet = data;
        console.log(this.dataSet); // Verifica que los datos están presentes
        this.dataSet.fecha_registro_formatted = this.formatFechaRegistro(this.dataSet.fecha_registro);
        // Generar el PDF solo si hay datos
        if (this.dataSet) {
          console.log('Datos recibidos:', this.dataSet);
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

  getOdsById(id: number | null) {
    this.odsServices.getOds(id).subscribe({
      next: (data) => {
        this.dataSetOds = data.map((item: OdsItem) => ({
          imagen: item.imagen,
          descripcion: item.descripcion
        }));
        console.log(this.dataSetOds); // Verifica que los datos están presentes

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

  formatFechaRegistro(fechaRegistro: string | null): string | null {
    if (!fechaRegistro) return null;
    const date = new Date(fechaRegistro);
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }


  generatePdf() {
    if (!this.dataSet) {
      return;
    }

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 297]
    });

    //const logoIzquierdo = 'assets/kaf.png';
    const logoDerecho = 'assets/bdp.png';

    //const imgIzquierdo = new Image();
    const imgDerecho = new Image();
    // imgIzquierdo.src = logoIzquierdo;
    imgDerecho.src = logoDerecho;

    Promise.all([
      //new Promise((resolve) => { imgIzquierdo.onload = resolve; }),
      new Promise((resolve) => { imgDerecho.onload = resolve; })
    ]).then(() => {
      // doc.addImage(imgIzquierdo, 'PNG', 15, 9, 30, 15);
      doc.addImage(imgDerecho, 'PNG', 165, 6, 20, 20);

      doc.setFontSize(10);
      const titulo = [
        'Formulación de Validación de Proyectos',
        'Medida Estándar en Bolivia',
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
      // Sección 2: Agencia y Respaldo
      doc.setFont('Helvetica', 'bold');
      doc.text('2 Información del Cliente', margin, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += 3;

      const additionalData = [
        { label: 'Caedec - Código Subcteg :', value: this.dataSet?.caedec?.actividad },
        { label: 'Caedec - Descripcion Subcteg :', value: this.dataSet?.caedec?.nombreCaedec },
        { label: 'Nro Solicitud:', value: this.dataSet?.nro_solicitud }
      ];

      additionalData.forEach((item) => {
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
          doc.text(line, xPosition, yPosition + 5 + index * (baseCellHeight - 2)); // Dibuja cada línea
        });

        // Actualiza la posición Y según cuántas líneas se dibujaron
        yPosition += cellHeight; // Incrementa yPosition con un pequeño margen adicional
      });

      yPosition += 10;
      // Sección 3: Monto Inv y Ahorro
      doc.setFont('Helvetica', 'bold');
      doc.text('4 Información del Proyecto', margin, yPosition);
      doc.setFont('Helvetica', 'normal');
      yPosition += 3;

      const proyectoData = [
        { label: 'Respaldo de  inversion elegible', value: this.dataSet?.respaldo },
        { label: 'Categoria:', value: this.dataSet?.inv_elegible.categoria },
        { label: 'Subcategoria:', value: this.dataSet?.subcategorium.nombreSubcategoria },
        { label: 'Inversión Elegible:', value: this.dataSet?.inv_elegible.nombreInvElegible },
      ];
      // Agregar potencia_inst_sis solo si inv_elegible es "Paneles solares (on grid)"
      if (this.dataSet?.inv_elegible.nombreInvElegible === 'Paneles solares (on grid)' || this.dataSet?.inv_elegible.nombreInvElegible === 'Paneles solares (off grid)') {
        proyectoData.push({ label: 'Potencia instalada del sistema (KWp):', value: this.dataSet?.potencia_inst_sis });
      }

      proyectoData.push(
      { label: 'Producción Energia Anual (MWh/año):', value: this.formatNumero(this.dataSet?.produccion_energia_anual/1000) },
      { label: 'Reducción Emisiones Anual (t CO2eq/año):', value: this.formatNumero(this.dataSet?.reduccion_emisiones_anual/1000) },
      { label: 'Vida útil de la tecnología (años):', value: this.dataSet?.vida_util },
      { label: 'Monto de crédito (Bs):', value: this.formatNumero(this.dataSet?.monto_inv_mn) },
     // { label: 'Monto de crédito (USD):', value: this.formatNumero(this.dataSet?.monto_inv_me) },

    );

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

      //const margin = 10;
      //yPosition = doc.internal.pageSize.getHeight() - 30; // Espacio desde abajo

      // Agrega un título para las imágenes de los ODS
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      doc.text('Objetivos de Desarrollo Sostenible (ODS) a los que aporta :', margin, yPosition);
      yPosition += 5; // Espaciado después del título

      // Configura el ancho y la altura de las imágenes
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
      this.pdfBlobUrl = URL.createObjectURL(pdfBlob);
      this.pdfSrc = this.pdfBlobUrl;
    });
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