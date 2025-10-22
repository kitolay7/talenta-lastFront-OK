import { Component, OnInit} from '@angular/core';
import { OffreService } from 'src/app/services/offre.service';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.scss']
})
export class TesterComponent implements OnInit {


	idOffer: any;
	
  constructor(
    private offre: OffreService,) {}

  ngOnInit(): void {
    this.offre.getOffreId().subscribe((data: any) => {
      this.idOffer = data;
      console.log(this.idOffer)
    })
  }
}
