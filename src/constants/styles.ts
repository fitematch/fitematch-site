import { THEME } from './theme';

export const BUTTON_STYLES = {
  green:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.green}`,

  red:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.red}`,

  blue:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.blue}`,

  gray:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.gray}`,

  ghost:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.ghost}`,
};

export const BUTTON_VARIANT_ALIASES = {
  positive: 'green',
  danger: 'red',
  login: 'blue',
  profile: 'gray',
  ghost: 'ghost',
} as const;

export const INPUT_STYLES =
  `w-full rounded-md border px-4 py-3 ${THEME.form.input} autofill:shadow-[inset_0_0_0px_1000px_#000] autofill:[-webkit-text-fill-color:#f3f4f6] autofill:[caret-color:#f3f4f6] autofill:[transition:background-color_9999s_ease-in-out_0s]`;

export const FLASH_MESSAGE_STYLES = {
  success: THEME.flash.success,
  error: THEME.flash.error,
};

export const TEXT_STYLES = {
  sectionTitle:
    `text-3xl md:text-4xl font-bold tracking-tight ${THEME.text.title}`,

  sectionSubtitle:
    `mt-3 text-base ${THEME.text.subtitle}`,

  featureTitle:
    `text-xl font-semibold ${THEME.card.featureTitle}`,

  featureText:
    `text-sm ${THEME.card.featureText}`,

  jobCardTitle:
    `text-xl font-semibold ${THEME.card.jobTitle}`,

  jobCardText:
    `text-sm ${THEME.card.jobText}`,

  jobDetailTitle:
    `text-3xl font-bold ${THEME.card.jobDetailTitle}`,

  jobDetailText:
    `${THEME.card.jobDetailText}`,

  muted:
    `text-sm ${THEME.text.muted}`,
};

export const CARD_STYLES = {
  featureBox:
    `${THEME.card.featureBox} ${THEME.card.featureBorder} ${THEME.card.featureBackground}`,
  jobBox:
    `${THEME.card.jobBox} ${THEME.card.jobBorder} ${THEME.card.jobBackground}`,
  jobDetailBox:
    `${THEME.card.jobDetailBox} ${THEME.card.jobDetailBorder} ${THEME.card.jobDetailBackground}`,
  featureIcon:
    `h-8 w-8 ${THEME.card.featureIcon}`,
};

export const PAGE_STYLES = {
  body:
    `min-h-screen ${THEME.layout.background} ${THEME.text.body}`,

  container:
    'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',

  section:
    'py-20',
};

export const NAVIGATION_STYLES = {
  dropdownTrigger:
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${THEME.navigation.dropdownTrigger}`,
};

export const FOOTER_STYLES = {
  title:
    `text-lg font-semibold ${THEME.footer.title}`,
  brand:
    `text-2xl font-bold lowercase ${THEME.footer.title}`,
  text:
    `text-sm ${THEME.footer.text}`,
  link:
    `${THEME.footer.link}`,
  socialFacebook:
    `${THEME.footer.socialFacebook}`,
  socialInstagram:
    `${THEME.footer.socialInstagram}`,
  socialX:
    `${THEME.footer.socialX}`,
  socialYoutube:
    `${THEME.footer.socialYoutube}`,
  socialLinkedin:
    `${THEME.footer.socialLinkedin}`,
};
