import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpPageService } from './otp-page.service';

@Component({
  selector: 'app-otp-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-page.component.html',
  providers: [OtpPageService],
})
export class OtpPageComponent implements OnInit {
  protected readonly pageService = inject(OtpPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onSubmit() {
    this.pageService.submitOtp();
  }

  onCancel() {
    this.pageService.cancel();
  }

  get otpControl() {
    return this.pageService.otpForm.controls.otp;
  }
}
