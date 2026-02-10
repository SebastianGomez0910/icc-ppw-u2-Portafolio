import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { environment } from '../../../../enviroments/environment';
import { AppointmentService } from '../../../core/models/appointment';

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  templateUrl: './programmer-dashboard.html'
})
export class ProgrammerDashboardComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService
  ) {}


  resumen = {
    PENDIENTE: 0,
    ACEPTADO: 0,
    RECHAZADO: 0
  };

  ngOnInit(): void {
    this.appointmentService.getAppointmentSummary().subscribe(data => {
      this.resumen = data;
      this.renderBarChart();
    });
  }

  renderBarChart(): void {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
        datasets: [{
          label: 'Citas',
          data: [
            this.resumen.PENDIENTE,
            this.resumen.ACEPTADO,
            this.resumen.RECHAZADO
          ],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  renderPieChart(): void {
    new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
        datasets: [{
          data: [
            this.resumen.PENDIENTE,
            this.resumen.ACEPTADO,
            this.resumen.RECHAZADO
          ],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444']
        }]
      }
    });
  }

  descargarPdf() {
    window.open(environment.apiUrl + '/programmer/dashboard/reporte/pdf');
  }

  descargarExcel() {
    window.open(environment.apiUrl + '/programmer/dashboard/reporte/excel');
  }
}
