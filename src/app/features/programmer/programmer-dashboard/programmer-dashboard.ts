import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { AppointmentService } from '../../../core/models/appointment';

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programmer-dashboard.html'
})
export class ProgrammerDashboardComponent implements OnInit {

  private appointmentService = inject(AppointmentService);

  summary = {
    PENDIENTE: 0,
    ACEPTADO: 0,
    RECHAZADO: 0
  };

  ngOnInit() {
    this.appointmentService.getAppointmentSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.renderChart();
      },
      error: (err: any) => {
        console.error('Error cargando resumen', err);
      }
    });
  }

  renderChart() {
    const canvas = document.getElementById('dashboardChart') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
        datasets: [{
          data: [
            this.summary.PENDIENTE,
            this.summary.ACEPTADO,
            this.summary.RECHAZADO
          ],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444']
        }]
      }
    });
  }
}
