import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-body',
  standalone: true,
  imports: [],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export default class BodyComponent {
  public chart: any;
  public energyChart: any;

  ngOnInit(): void {
    this.createReduccionEmisionChart();
    this.createProduccionEnergiaChart();
  }

  createReduccionEmisionChart(): void {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Sistemas fotovoltaicos', 'Sistema de bombeo solar', 'Calefones o colectores solares'],
        datasets: [{
          label: 'Emisiones anuales evitadas por medida (tonCO2eq/año)',
          data: [65, 590, 350],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createProduccionEnergiaChart(): void {
    this.energyChart = new Chart('energyChart', {
      type: 'bar',
      data: {
        labels: ['Sistemas fotovoltaicos', 'Sistema de bombeo solar', 'Calefones o colectores solares'],
        datasets: [{
          label: 'Producción de energía anual (MWh/año)',
          data: [500, 200, 150], // Ejemplo de datos
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
