import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  images:string[]=[
    'img/polloPP.jpg',
    'img/doraemon.webp',
    'img/chilly-willy.jpg'
  ];

  imgDesplazada=0;

  siguienteImg(){
    this.imgDesplazada=(this.imgDesplazada+1)%this.images.length;
  }

  imgPrevia(){
    this.imgDesplazada=(this.imgDesplazada-1+this.images.length)%this.images.length;
  }

  mostrarBotonArriba=false;

  @HostListener('window:scroll',[])
  desplazoVentana(){
    if(window.scrollY>100){
      this.mostrarBotonArriba=true;
    }
    else{
      this.mostrarBotonArriba=false;
    }
  }

  volverArriba(){
    window.scrollTo({top:0, behavior:'smooth'});
  }
}
