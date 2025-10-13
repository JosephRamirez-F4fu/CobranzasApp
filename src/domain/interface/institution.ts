import { InstitutionPlan } from '../enums/institution-plan.enum';

export interface Institution {
  id: number;
  ldapHost: string;
  ldapPort: string;
  ldapBaseDn: string;
  ldapUserDn: string;
  ldapPassword: string;
  useLdap: boolean;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  logoUrl: string;
  logoLoginUrl: string;
  code: string;
  plan: InstitutionPlan | null;
}
