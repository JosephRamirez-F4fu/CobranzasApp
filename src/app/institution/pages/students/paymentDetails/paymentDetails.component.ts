import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payment-details',
  imports: [],
  templateUrl: './paymentDetails.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PaymentDetailsComponent {}
