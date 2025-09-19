import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  private institutionCode = signal<string | null>(
    localStorage.getItem('institutionCode')
  );
  save() {
    localStorage.setItem(
      'institutionCode',
      this.institutionCode()?.toString() || ''
    );
  }

  setInstitutionCode(id: string | null) {
    this.institutionCode.set(id);
    this.save();
  }
  load() {
    const code = localStorage.getItem('institutionCode');
    this.institutionCode.set(code ? code : null);
  }
  getInstitutionCode() {
    return this.institutionCode();
  }
}
