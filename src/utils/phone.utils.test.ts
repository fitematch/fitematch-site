import {
  applyPhoneMask,
  formatPhoneWithDialCode,
  onlyDigits,
  removeDialCodeFromPhone,
} from './phone.utils';

describe('phone.utils', () => {
  describe('onlyDigits', () => {
    it('keeps only digits from formatted values', () => {
      expect(onlyDigits('+55 (11) 99876-5432')).toBe('5511998765432');
    });

    it('returns an empty string for undefined', () => {
      expect(onlyDigits(undefined)).toBe('');
    });

    it('returns an empty string for empty input', () => {
      expect(onlyDigits('')).toBe('');
    });
  });

  describe('removeDialCodeFromPhone', () => {
    it('removes the dial code prefix when present', () => {
      expect(removeDialCodeFromPhone('+55 11 99876-5432', '+55')).toBe(
        '11998765432'
      );
    });

    it('returns phone digits unchanged when dial code is not present', () => {
      expect(removeDialCodeFromPhone('11998765432', '+44')).toBe('11998765432');
    });

    it('handles empty dial code without changing the phone', () => {
      expect(removeDialCodeFromPhone('(11) 99876-5432', '')).toBe('11998765432');
    });
  });

  describe('applyPhoneMask', () => {
    it('applies a phone mask to the provided digits', () => {
      expect(applyPhoneMask('11998765432', '(##) #####-####')).toBe(
        '(11) 99876-5432'
      );
    });

    it('stops when the input has fewer digits than the mask', () => {
      expect(applyPhoneMask('11998', '(##) #####-####')).toBe('(11) 998');
    });

    it('returns raw digits when no mask is provided', () => {
      expect(applyPhoneMask('(11) 99876-5432')).toBe('11998765432');
    });

    it('returns an empty string for empty values', () => {
      expect(applyPhoneMask('', '(##) #####-####')).toBe('');
    });
  });

  describe('formatPhoneWithDialCode', () => {
    it('combines dial code and masked phone', () => {
      expect(
        formatPhoneWithDialCode('11998765432', '+55', '(##) #####-####')
      ).toBe('+55 (11) 99876-5432');
    });

    it('returns only the dial code when number is empty', () => {
      expect(formatPhoneWithDialCode('', '+55', '(##) #####-####')).toBe('+55');
    });

    it('returns dial code plus raw digits when no mask is provided', () => {
      expect(formatPhoneWithDialCode('11998765432', '+55')).toBe(
        '+55 11998765432'
      );
    });
  });
});
