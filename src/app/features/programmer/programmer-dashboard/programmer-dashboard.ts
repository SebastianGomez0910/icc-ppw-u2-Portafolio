import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { environment } from '../../../../enviroments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programmer-dashboard.html'
})
export class ProgrammerDashboardComponent implements OnInit, OnDestroy {

  resumen: any = { pendientes: 0, aprobadas: 0, rechazadas: 0 };
  
  private barChart: Chart | undefined;
  private pieChart: Chart | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destruirGraficos();
  }

  cargarDatos() {
    this.http.get<any>(`${environment.apiUrl}/programmer/dashboard/resumen`)
      .subscribe({
        next: (res) => {
          this.resumen = { ...res };
          setTimeout(() => this.renderCharts(), 50);
        },
        error: (err) => console.error("Error cargando resumen de dashboard:", err)
      });
  }

  private destruirGraficos() {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  renderCharts() {
    this.destruirGraficos();

    const ctxBar = document.getElementById('barChart') as HTMLCanvasElement;
    const ctxPie = document.getElementById('pieChart') as HTMLCanvasElement;

    if (!ctxBar || !ctxPie) return;

    this.barChart = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
        datasets: [{
          label: 'Total de Citas',
          data: [this.resumen.pendientes, this.resumen.aprobadas, this.resumen.rechazadas],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444'], 
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });

    this.pieChart = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
        datasets: [{
          data: [this.resumen.pendientes, this.resumen.aprobadas, this.resumen.rechazadas],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#9CA3AF' } }
        }
      }
    });
  }

  descargarPdf() {
    const token = localStorage.getItem('token');
    this.http.get(`${environment.apiUrl}/programmer/dashboard/reporte/pdf`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reporte_Asesorias_${new Date().toLocaleDateString()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error("Error al descargar PDF:", err)
    });
  }

  descargarExcel() {
    const token = localStorage.getItem('token');
    this.http.get(`${environment.apiUrl}/programmer/dashboard/reporte/excel`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Reporte_Asesorias_${new Date().toLocaleDateString()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error("Error al descargar Excel:", err)
    });
  }
}