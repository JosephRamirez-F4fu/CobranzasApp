export interface OtpChallengeDto {
  challengeId: string;
  expiresInSeconds: number | null;
  expiresAt: number | null;
}
