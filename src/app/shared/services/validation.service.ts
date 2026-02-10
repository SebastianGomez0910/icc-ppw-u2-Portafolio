import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  static urlValidatorValue(value: string | undefined | null): boolean {
    if (!value) return true; 
    const pattern = /^(http:\/\/|https:\/\/).+/i;
    return pattern.test(value.trim());
  }


  static onlyLettersValue(value: string | undefined | null): boolean {
    if (!value) return false;
    const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/;
    return regex.test(value.trim());
  }


  static noNumbersValue(value: string | undefined | null): boolean {
    if (!value) return false;
    return !/\d/.test(value);
  }


  static minLengthValue(value: string | undefined | null, min: number): boolean {
    if (!value) return false;
    return value.trim().length >= min;
  }
}
