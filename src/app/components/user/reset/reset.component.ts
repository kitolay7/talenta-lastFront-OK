import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OldPwdValidators } from './validator';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

	form1: FormGroup;
  hide: boolean = true;
	
  constructor(
  	fb: FormBuilder,
    private userS: UserService,
    private toastS: ToastrService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {
  	this.loading = false;
    const params = this.activeRouter.snapshot.params.token;
    console.log(params);
    this.userS.checkReset(params).subscribe((data: any) => {
      console.log(data)
      if (data.error === false) {
      	this.checked = true;
      	this.loading = true;
      	this.user = data.data.id;
        this.toastr.success('Vous pouvez modifier votre mot de passe ', '', {
          timeOut: 2000
        });
      } else {
      	this.checked = false;
      	this.loading = true;
        this.toastr.error('Erreur ', '', {
          timeOut: 4000
        });
      	setTimeout(() => {
      		this.router.navigateByUrl('/')
      	}, 5000);
      }
    })
    
    this.form1 = fb.group({
      newPwd: ['', Validators.required],
      confirmPwd: ['', Validators.required]
    }, {
      validator: OldPwdValidators.matchPwds
    });
    
  }

  ngOnInit(): void {
  
  }
  
  user: number;
  checked = false;
  loading = false;
	
	
  get newPwd() {
    return this.form1.get('newPwd');
  }

  get confirmPwd() {
    return this.form1.get('confirmPwd');
  }
  valid() {
    this.loading = false;
    const user = {
      id: this.user,
      newPw: this.newPwd.value
    }
    //console.log(user)
    this.userS.resetPw(user).subscribe((data: any) => {
      console.log(data);
      if (data.error !== false) {
        this.loading = true;
        this.toastS.error('Le mot de passe est incorrecte', '', {
          timeOut: 4000
        });
      } else {
        this.loading = true;
        if (data.role.includes('ROLE_RECRUTEUR')) {
          localStorage.clear();
          this.toastS.success('Nouveau mot de passe prise en compte. Veuillez vous reconnecter!', 'Mot de passe modifié avec succés', {
            positionClass: 'toast-center-center',
            timeOut: 5000
          });
          this.router.navigateByUrl('/');
        } else {
          localStorage.clear();
          this.toastS.success('Nouveau mot de passe prise en compte, vous pouvez vous reconnecter maintenant', 'Mot de passe modifié avec succés', {
            positionClass: 'toast-center-center',
            timeOut: 5000
          });
          this.router.navigateByUrl('/candidat/registration');
        }
      }
    })
  }

}
