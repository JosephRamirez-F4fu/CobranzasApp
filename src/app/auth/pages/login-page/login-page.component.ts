import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { InstitutionInfoComponent } from './components/InstitutionInfo/InstitutionInfo.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginDto } from '@domain/dtos/login.dto';
import { LoginPageService } from './login-page.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [LoginFormComponent, InstitutionInfoComponent],
  templateUrl: './login-page.component.html',
  providers: [LoginPageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block text-slate-100',
  },
})
export class LoginPageComponent implements OnInit {
  protected readonly pageService = inject(LoginPageService);

  ngOnInit(): void {
    this.pageService.initialize();
  }

  onLoginOutput(credentials: LoginDto) {
    this.pageService.submitLogin(credentials);
  }
}
