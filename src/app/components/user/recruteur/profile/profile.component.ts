import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  formData: FormData = new FormData();
  logo = '';
  logoU = '';
  file: any;
  defaultLogoPath = 'assets/img/10.jpg';
  url = environment.baseUrl;
  progressImg: number;
  userInfo: any;
  blobUrl: SafeUrl;
  currentUser: any;
  formProfile = new FormGroup({
    username: new FormControl('', [
      Validators.required,
    ]),
    email: new FormControl('', [
      Validators.required,
    ]),
    codePostale: new FormControl('', [
      Validators.required,
    ]),
    phone: new FormControl('', [
      Validators.required,
    ]),
    pays: new FormControl('', [
      Validators.required,
    ]),
    enterprise: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  })
  countries = ['Madagascar', 'Canada', 'France'];

  constructor(
    private sanitizer: DomSanitizer,
    private userS: UserService,
    private toastr: ToastrService,
  ) {
    // load defaultLogo if LogoPath is empty
    this.userS.currentUser().subscribe(currentUser => {
      console.log(currentUser);
      this.currentUser = currentUser;
      // fill profile form
      this.formProfile.controls.username.setValue(this.currentUser.username);
      this.formProfile.controls.email.setValue(this.currentUser.email);
      this.formProfile.controls.phone.setValue(this.currentUser.numTel);
      this.formProfile.controls.codePostale.setValue(this.currentUser.codePostal);
      this.formProfile.controls.enterprise.setValue(this.currentUser.societe);
      this.formProfile.controls.pays.setValue(this.currentUser.pays);

      console.log("Photo path : "+this.url + this.currentUser?.profile_photo_path);
      fetch(this.currentUser?.profile_photo_path ? this.url + this.currentUser?.profile_photo_path : this.defaultLogoPath)
        .then(res => res.blob())
        .then(blob => {
          this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));;
          const reader = new FileReader();
          reader.onprogress = (evt: any) => {
            if (evt.lengthComputable) {
              this.progressImg = Math.round((evt.loaded / evt.total) * 100);
              //console.log(`Uploaded: ${this.progressImg}%`);
            }
          }
          reader.onload = (e: any) => {
            this.progressImg = 100;
            //console.log(`Upload completed`);
            this.logo = e.target.result;
            setTimeout(() => { this.progressImg = 0 }, 2000);
          };
          reader.readAsDataURL(blob);
        })
    })
  }

  onSelectedImg(fileInput: any) {
    if (fileInput !== null) {
      this.logoU = fileInput.target.files[0];
      this.file = this.logoU;
      const reader = new FileReader();
      if (fileInput.target.files[0].size / 1024 / 1024 < 5) {
        reader.onprogress = (evt: any) => {
          if (evt.lengthComputable) {
            this.progressImg = Math.round((evt.loaded / evt.total) * 100);
            //console.log(`Uploaded: ${this.progressImg}%`);
          }
        };
        reader.onload = (e: any) => {
          this.progressImg = 100;
          //console.log(`Upload completed`);
          this.logo = e.target.result;
          // this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e.target.result));
          // console.log(this.blobUrl);
          this.blobUrl = e.target.result;

          setTimeout(() => { this.progressImg = 0 }, 2000);
        };
        reader.readAsDataURL(fileInput.target.files[0]);
        this.formData.append('logo', this.file, this.file.name);
        console.log("Logo filename : "+this.file.name);
      } else {
        this.toastr.error('Taille maximale est de 5 Mo', '', {
          timeOut: 5000
        });
      }

    }
  }
  ngOnInit(): void {

  }

  saveProfile() {
    // let profileValueToUpdate = {
    //   id: this.currentUser.id,
    //   username: this.formProfile.controls.username.value,
    //   email: this.formProfile.controls.email.value,
    //   numTel: this.formProfile.controls.phone.value,
    //   codePostal: this.formProfile.controls.codePostale.value,
    //   societe: this.formProfile.controls.enterprise.value,
    //   pays: this.formProfile.controls.pays.value,
    //   password: this.formProfile.controls.password.value,
    //   profile_id: this.currentUser.profile.id
    // }

    this.formData.set('id', this.currentUser.id)
    this.formData.set('username', this.formProfile.controls.username.value)
    this.formData.set('email', this.formProfile.controls.email.value)
    this.formData.set('numTel', this.formProfile.controls.phone.value)
    this.formData.set('codePostal', this.formProfile.controls.codePostale.value)
    this.formData.set('societe', this.formProfile.controls.enterprise.value)
    this.formData.set('pays', this.formProfile.controls.pays.value)
    this.formData.set('password', this.formProfile.controls.password.value)
    this.formData.set('profile_id', this.currentUser.profile.id)

    this.userS.updateUserRecruteur(this.formData, this.currentUser.id).subscribe((response) => {
      this.toastr.success(response.message, '', {
        timeOut: 5000
      })
    },
      (error) => {
        if (error.error.password) {
          this.toastr.error(error.error.password, '', {
            timeOut: 10000
          })
        } else if (error.error.other) {
          this.toastr.error(`Un erreur est survenu`, '', {
            timeOut: 10000
          })
        }
      })

  }

}
