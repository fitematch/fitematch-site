export function onlyDigits(value?: string) {
  return value?.replace(/\D/g, '') || '';
}

export function removeDialCodeFromPhone(value: string, dialCode: string) {
  const phoneDigits = onlyDigits(value);
  const dialCodeDigits = onlyDigits(dialCode);

  if (phoneDigits.startsWith(dialCodeDigits)) {
    return phoneDigits.slice(dialCodeDigits.length);
  }

  return phoneDigits;
}

export function applyPhoneMask(value: string, mask?: string) {
  const digits = onlyDigits(value);

  if (!mask || !digits) {
    return digits;
  }

  let digitIndex = 0;
  let maskedValue = '';

  for (const char of mask) {
    if (char !== '#') {
      maskedValue += char;
      continue;
    }

    const digit = digits[digitIndex];

    if (!digit) {
      break;
    }

    maskedValue += digit;
    digitIndex += 1;
  }

  return maskedValue.trim();
}

export function formatPhoneWithDialCode(
  number: string,
  dialCode: string,
  mask?: string,
) {
  const maskedNumber = applyPhoneMask(number, mask);

  if (!maskedNumber) {
    return dialCode;
  }

  return `${dialCode} ${maskedNumber}`;
}
