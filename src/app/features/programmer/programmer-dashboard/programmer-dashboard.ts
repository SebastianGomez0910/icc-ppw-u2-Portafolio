import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { environment } from '../../../../enviroments/environment';

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  templateUrl: './programmer-dashboard.html'
})
export class ProgrammerDashboardComponent implements OnInit {

  resumen: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(environment.apiUrl + '/programmer/dashboard/resumen')
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
    window.open(environment.apiUrl + '/programmer/dashboard/reporte/pdf');
  }

  descargarExcel() {
    window.open(environment.apiUrl + '/programmer/dashboard/reporte/excel');
  }
}