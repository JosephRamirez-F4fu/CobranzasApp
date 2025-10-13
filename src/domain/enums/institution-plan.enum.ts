export type InstitutionPlan = 'BASICO' | 'AVANZADO' | 'PREMIUM';

export const INSTITUTION_PLANS: InstitutionPlan[] = ['BASICO', 'AVANZADO', 'PREMIUM'];

export const INSTITUTION_PLAN_LABELS: Record<InstitutionPlan, string> = {
  BASICO: 'Basico',
  AVANZADO: 'Avanzado',
  PREMIUM: 'Premium',
};
