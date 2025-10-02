import { LoginResponseDto } from './login-response.dto';
import { OtpChallengeDto } from './otp-challenge.dto';

export type LoginAttemptResultDto =
  | { type: 'otp'; challenge: OtpChallengeDto }
  | { type: 'authenticated'; tokens: LoginResponseDto };
