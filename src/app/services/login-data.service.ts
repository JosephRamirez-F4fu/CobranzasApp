import { Injectable, signal } from '@angular/core';
import { OtpChallengeDto } from '@domain/dtos/otp-challenge.dto';

function parseOtpChallenge(value: string | null): OtpChallengeDto | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<OtpChallengeDto> | null;
    if (!parsed || !parsed.challengeId) {
      return null;
    }

    return {
      challengeId: parsed.challengeId,
      expiresInSeconds:
        typeof parsed.expiresInSeconds === 'number'
          ? parsed.expiresInSeconds
          : null,
      expiresAt: typeof parsed.expiresAt === 'number' ? parsed.expiresAt : null,
    };
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class LoginDataService {
  private institutionCode = signal<string | null>(
    localStorage.getItem('institutionCode')
  );

  private otpChallenge = signal<OtpChallengeDto | null>(
    parseOtpChallenge(sessionStorage.getItem('otpChallenge'))
  );

  private postLoginRedirectUrl = signal<string | null>(
    sessionStorage.getItem('postLoginRedirectUrl')
  );

  private otpFallbackUrl = signal<string | null>(
    sessionStorage.getItem('otpFallbackUrl')
  );

  private persistInstitutionCode() {
    const value = this.institutionCode();
    if (value) {
      localStorage.setItem('institutionCode', value);
    } else {
      localStorage.removeItem('institutionCode');
    }
  }

  private persistOtpChallenge(challenge: OtpChallengeDto | null) {
    if (!challenge) {
      sessionStorage.removeItem('otpChallenge');
      return;
    }

    sessionStorage.setItem('otpChallenge', JSON.stringify(challenge));
  }

  private persistPostLoginRedirect(url: string | null) {
    if (!url) {
      sessionStorage.removeItem('postLoginRedirectUrl');
      return;
    }

    sessionStorage.setItem('postLoginRedirectUrl', url);
  }

  private persistOtpFallback(url: string | null) {
    if (!url) {
      sessionStorage.removeItem('otpFallbackUrl');
      return;
    }

    sessionStorage.setItem('otpFallbackUrl', url);
  }

  setInstitutionCode(id: string | null) {
    this.institutionCode.set(id);
    this.persistInstitutionCode();
  }

  load() {
    const code = localStorage.getItem('institutionCode');
    this.institutionCode.set(code ? code : null);
  }

  getInstitutionCode() {
    return this.institutionCode();
  }

  setOtpChallenge(challenge: OtpChallengeDto | null) {
    if (!challenge) {
      this.otpChallenge.set(null);
      this.persistOtpChallenge(null);
      return;
    }

    const normalized: OtpChallengeDto = {
      challengeId: challenge.challengeId,
      expiresInSeconds:
        typeof challenge.expiresInSeconds === 'number'
          ? challenge.expiresInSeconds
          : null,
      expiresAt:
        typeof challenge.expiresAt === 'number' ? challenge.expiresAt : null,
    };

    this.otpChallenge.set(normalized);
    this.persistOtpChallenge(normalized);
  }

  clearOtpChallenge() {
    this.setOtpChallenge(null);
  }

  getOtpChallenge() {
    return this.otpChallenge();
  }

  setPostLoginRedirectUrl(url: string | null) {
    this.postLoginRedirectUrl.set(url);
    this.persistPostLoginRedirect(url);
  }

  getPostLoginRedirectUrl() {
    return this.postLoginRedirectUrl();
  }

  setOtpFallbackUrl(url: string | null) {
    this.otpFallbackUrl.set(url);
    this.persistOtpFallback(url);
  }

  getOtpFallbackUrl() {
    return this.otpFallbackUrl();
  }
}
