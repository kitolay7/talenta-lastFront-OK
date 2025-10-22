import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {


  loading = false;

  constructor(
  	private userS: UserService,
    private toastS: ToastrService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
  	 this.loading = false;
    const token = this.activeRouter.snapshot.params.token;
    this.userS.confirmation(token).subscribe((data: any) => {
      if (data.error === false) {
      	localStorage.clear();
		this.toastS.success('Votre compte a été confirmé. Vous pouvez vous connecter maintenant', 'Compte confirmé', {
			positionClass: 'toast-center-center',
			timeOut: 5000
		});

        if (data.role.includes('ROLE_RECRUTEUR')) {
          this.router.navigateByUrl('/');
        } else {
          this.router.navigateByUrl('/candidat/registration');
        }
      	this.loading = true;
      } else {
      	this.loading = true;
        this.toastr.error("Il y a eu une erreur. Revérifiez le lien dans votre boite email", 'Erreur', {
          timeOut: 4000
        });
      	this.router.navigateByUrl('/')
      }
    })
  }

  ngOnInit(): void {
  }

}
