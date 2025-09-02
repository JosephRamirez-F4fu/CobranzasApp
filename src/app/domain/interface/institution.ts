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
  instituionId: string;
}
