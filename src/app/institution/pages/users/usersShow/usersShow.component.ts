import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './usersShow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersShowComponent {}
