export function getFriendlySessionDevice(userAgent?: string) {
  if (!userAgent) {
    return 'Dispositivo desconhecido';
  }

  const normalizedUserAgent = userAgent.toLowerCase();

  if (normalizedUserAgent.includes('edg/')) {
    return 'Microsoft Edge';
  }

  if (normalizedUserAgent.includes('opr/') || normalizedUserAgent.includes('opera')) {
    return 'Opera';
  }

  if (normalizedUserAgent.includes('firefox/')) {
    return 'Mozilla Firefox';
  }

  if (
    normalizedUserAgent.includes('chrome/') &&
    !normalizedUserAgent.includes('edg/') &&
    !normalizedUserAgent.includes('opr/')
  ) {
    return 'Google Chrome';
  }

  if (
    normalizedUserAgent.includes('safari/') &&
    !normalizedUserAgent.includes('chrome/')
  ) {
    return 'Safari';
  }

  if (normalizedUserAgent.includes('android')) {
    return 'Android';
  }

  if (
    normalizedUserAgent.includes('iphone') ||
    normalizedUserAgent.includes('ipad') ||
    normalizedUserAgent.includes('ios')
  ) {
    return 'iPhone / iPad';
  }

  if (normalizedUserAgent.includes('windows')) {
    return 'Windows';
  }

  if (normalizedUserAgent.includes('mac os') || normalizedUserAgent.includes('macintosh')) {
    return 'macOS';
  }

  if (normalizedUserAgent.includes('linux')) {
    return 'Linux';
  }

  return userAgent;
}
