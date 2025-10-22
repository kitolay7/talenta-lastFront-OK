import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

	formContact: FormGroup;
	
  constructor(
    private userS: UserService,
    private toastr: ToastrService,
    private router: Router,
  ) {
  	this.createformRegisterUserCandidat();
  }

  ngOnInit(): void {
  }

  createformRegisterUserCandidat() {
    this.formContact = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      objet: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    });
    
  }
  
  sendContact() {
  	
  	console.log(this.formContact.controls);
  	const mail = {
      nom: this.formContact.controls.name.value,
      email: this.formContact.controls.email.value,
      objet: this.formContact.controls.objet.value,
      message: this.formContact.controls.message.value,
  	}
  	console.log(mail)
  	this.userS.contact(mail).subscribe((response: any) => {
      if (response.error === false) {
        this.toastr.success('Votre message a bien été envoyé', '', {
          timeOut: 5000
        });
        this.router.navigateByUrl('/');

      } else {
        this.toastr.error(response.message, '', {
          timeOut: 4000
        });
      }
    });
    
  }

}
