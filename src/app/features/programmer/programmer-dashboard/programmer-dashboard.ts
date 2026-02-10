import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  templateUrl: './programmer-dashboard.html'
})
export class ProgrammerDashboardComponent implements OnInit {

  resumen: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8080/api/programmer/dashboard/resumen')
      .subscribe(res => {
        this.resumen = res;
        setTimeout(() => {
          this.bar();
          this.pie();
        }, 50);
      });
  }

  bar() {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
        datasets: [{
          data: [
            this.resumen.pendientes,
            this.resumen.aprobadas,
            this.resumen.rechazadas
          ],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444']
        }]
      }
    });
  }

  pie() {
    new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
        datasets: [{
          data: [
            this.resumen.pendientes,
            this.resumen.aprobadas,
            this.resumen.rechazadas
          ],
          backgroundColor: ['#facc15', '#22c55e', '#ef4444']
        }]
      }
    });
  }

  descargarPdf() {
    window.open('http://localhost:8080/api/programmer/dashboard/reporte/pdf');
  }

  descargarExcel() {
    window.open('http://localhost:8080/api/programmer/dashboard/reporte/excel');
  }
}
