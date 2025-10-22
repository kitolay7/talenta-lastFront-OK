import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { OldPwdValidators } from './validator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-pass',
  templateUrl: './edit-pass.component.html',
  styleUrls: ['./edit-pass.component.scss']
})
export class EditPassComponent implements OnInit {
  form1: FormGroup;

  constructor(fb: FormBuilder,
    private userS: UserService,
    private toastS: ToastrService,
    private router: Router,
    ) {
    this.form1 = fb.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      confirmPwd: ['', Validators.required]
    }, {
      validator: OldPwdValidators.matchPwds
    });
  }

  get oldPwd() {
    return this.form1.get('oldPwd');
  }

  get newPwd() {
    return this.form1.get('newPwd');
  }

  get confirmPwd() {
    return this.form1.get('confirmPwd');
  }
  valid() {
    const user = {
      id: localStorage.getItem('idUser'),
      password: this.oldPwd.value,
      newPw: this.newPwd.value
    }
    console.log(user)
    this.userS.editPw(user).subscribe((data: any) => {
      if (data.error !== false) {
        this.toastS.error('Le mot de passe est incorrecte', '', {
          timeOut: 4000
        });
      } else {
        this.toastS.success('Mot de passe modifié avec success. Veuillez vous reconnecter.', '', {
          timeOut: 4000
        });
        localStorage.clear();
        this.router.navigateByUrl('/candidat/registration');
        window.location.reload();
      }
    })
  }
  ngOnInit(): void {
  }
}
