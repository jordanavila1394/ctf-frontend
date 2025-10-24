import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ValidationService {

  static minDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // parse control value to Date
      const date = new Date(control.value);
      // check if control value is superior to date given in parameter
      if (minDate.getTime() < date.getTime()) {
        return null;
      } else {
        return { 'min': { value: control.value, expected: minDate } };

      }
    };
  }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config: any = {
      required: 'Required',
      invalidCreditCard: 'Is invalid credit card number',
      invalidEmailAddress: 'Invalid email address',
      invalidPassword:
        'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `Minimum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }

  static creditCardValidator(control: { value: string; }) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static emailValidator(control: { value: string; }) {
    // RFC 2822 compliant regex
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

  static passwordValidator(control: { value: string; }) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static sameDayValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const checkIn = group.get('checkInTime')?.value;
      const checkOut = group.get('checkOutTime')?.value;

      if (!checkIn || !checkOut) return null;

      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      const sameDay =
        inDate.getFullYear() === outDate.getFullYear() &&
        inDate.getMonth() === outDate.getMonth() &&
        inDate.getDate() === outDate.getDate();

      return sameDay ? null : { dateMismatch: true };
    };
  }


}
