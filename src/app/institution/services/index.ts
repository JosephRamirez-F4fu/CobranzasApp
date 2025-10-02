import { Provider } from '@angular/core';

import { InstitutionAccountStatementService } from './institution-account-statement.service';
import { InstitutionEnrollmentSchedulesService } from './institution-enrollment-schedules.service';
import { InstitutionStudentsService } from './institution-students.service';
import { InstitutionUsersService } from './institution-users.service';

export const INSTITUTION_SHARED_SERVICES: Provider[] = [
  InstitutionAccountStatementService,
  InstitutionEnrollmentSchedulesService,
  InstitutionStudentsService,
  InstitutionUsersService,
];

export * from './institution-account-statement.service';
export * from './institution-enrollment-schedules.service';
export * from './institution-students.service';
export * from './institution-users.service';
