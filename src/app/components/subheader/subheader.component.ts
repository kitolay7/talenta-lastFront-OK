import { Component, OnInit, Input } from '@angular/core';
import { OffreService } from '../../../../src/app/services/offre.service';
import { environment } from '../../../../src/environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { UserService } from '../../../../src/app/services/user.service';



@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent implements OnInit {
  @Input() title: string;
  defaultLogoPath = 'assets/img/10.jpg';

  blobLogo: any;
  blobLogoObject: any;
  blobUrl: any;
  url = environment.baseUrl;
  isHomeR: boolean = false;
  infoNotifications = [];
  currentUser: any;


  constructor(
    private sanitizer: DomSanitizer,
    private offre: OffreService,
    private location: Location,
    private userS: UserService,
  ) {

    // si il n'y pas de logo
    this.userS.currentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
      console.log(this.currentUser);
      console.log("Mail User : "+this.currentUser.email);
      fetch(this.currentUser?.profile_photo_path ? this.url + this.currentUser?.profile_photo_path : this.defaultLogoPath)
        .then(res => res.blob())
        .then(blob => {
          this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
        })
    })
    this.infoNotifications = [...Array(10).keys()].map(i => i + 1);
  }

  ngOnInit(): void {
    this.location.onUrlChange(x => { this.isHomeR = (x === '/myaccount') });
  }

}
