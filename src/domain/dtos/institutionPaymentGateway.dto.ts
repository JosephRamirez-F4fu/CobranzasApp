export enum PaymentGatewayType {
  CULQUI = 'CULQUI',
}

export interface InstitutionPaymentGateway {
  tipo: PaymentGatewayType;
  apiPublicKey: string;
  apiSecret: string;
  urlBase: string;
  urlWebhook: string;
  institutionId: number;
  activo: boolean;
}
