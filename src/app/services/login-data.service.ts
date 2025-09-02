import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  private institutionId = signal<string | null>(
    localStorage.getItem('institutionId')
  );
  save() {
    localStorage.setItem(
      'institutionId',
      this.institutionId()?.toString() || ''
    );
  }

  setInstitutionId(id: string | null) {
    this.institutionId.set(id);
  }
  load() {
    const id = localStorage.getItem('institutionId');
    this.institutionId.set(id ? id : null);
  }
  getInstitutionId() {
    return this.institutionId();
  }
}
