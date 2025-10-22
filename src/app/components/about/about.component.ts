import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    window.scroll(0,0);
  }
  
  
  partenaires = [
    {
      name: "Telma",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '51.png',
      link: 'https://www.telma.mg/'
    },
    {
      name: "Group Basan",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '52.png',
      link: 'http://www.basan.mg/'
    },
    {
      name: "Madajob",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '53.png',
      link: 'https://www.madajob.mg/'
    },
    {
      name: "Portaljob Madagascar",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '54.png',
      link: 'https://www.portaljob-madagascar.com/'
    },
    {
      name: "Ambatovy",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '55.png',
      link: 'http://www.ambatovy.com/'
    },
    {
      name: "LinkedIn",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '56.png',
      link: 'https://fr.linkedin.com/'
    },
    {
      name: "Indeed",
      desc: "Donec interdum scelerisque auctor. Nulla id lorem auctor, bibendum lectus elementum, porta felis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      img: '57.png',
      link: 'https://www.indeed.com/'
    },
  ];
  
  
  goToPartenaire(link: string) {
  	const dwldLink = document.createElement('a');
  	dwldLink.setAttribute('target', '_blank');
    dwldLink.setAttribute('href', link);
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  
  

}
