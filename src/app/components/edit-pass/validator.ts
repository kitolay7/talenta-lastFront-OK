
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class OldPwdValidators {
  static matchPwds(control: AbstractControl) {
    const newPwd2 = control.get('newPwd');
    const confirmPwd2 = control.get('confirmPwd');
    if (newPwd2.value !== confirmPwd2.value){
      return { pwdsDontMatch: true };
    }
    return null;
  }
}
