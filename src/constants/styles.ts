import { THEME } from './theme';

export const NAVIGATION_STYLES = {
  menuLanguageDropdown:
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${THEME.navigation.menuLanguageDropdown}`,
};

export const INPUT_STYLES =
  `w-full rounded-md border px-4 py-3 ${THEME.form.input} autofill:shadow-[inset_0_0_0px_1000px_#000] autofill:[-webkit-text-fill-color:#f3f4f6] autofill:[caret-color:#f3f4f6] autofill:[transition:background-color_9999s_ease-in-out_0s]`;


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

  faqCandidate:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.faq.buttonCandidate}`,

  faqRecruiter:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.faq.buttonRecruiter}`,
};

export const BUTTON_VARIANT_ALIASES = {
  positive: 'green',
  danger: 'red',
  login: 'blue',
  profile: 'gray',
  ghost: 'ghost',
} as const;


export const FLASH_MESSAGE_STYLES = {
  success: THEME.flash.success,
  error: THEME.flash.error,
};

export const TEXT_STYLES = {
  pageTitle:
    `text-3xl md:text-4xl font-bold tracking-tight mt-8 ${THEME.pages.title}`,
  pageSubtitle:
    `mt-3 text-base ${THEME.pages.subtitle}`,
  
  jobCardTitle:
    `text-md font-semibold ${THEME.card.job.title}`,
  jobCardText:
    `text-sm ${THEME.card.job.text}`,
  
  
  
  
    sectionTitle:
    `text-3xl md:text-4xl font-bold tracking-tight mt-8 ${THEME.text.sectionTitle}`,

  sectionSubtitle:
    `mt-3 text-base ${THEME.text.sectionSubtitle}`,

  featureTitle:
    `text-xl font-semibold ${THEME.card.featureTitle}`,
  featureText:
    `text-sm ${THEME.card.featureText}`,


  jobDetailTitle:
    `text-3xl font-bold ${THEME.card.jobDetailTitle}`,
  jobDetailText:
    `${THEME.card.jobDetailText}`,

  profileCardTitle:
    `text-xl font-semibold ${THEME.card.profileCardTitle}`,
  profileCardText:
    `text-sm ${THEME.card.profileCardText}`,

  muted:
    `text-sm ${THEME.text.muted}`,
  
  card: {
    profile: {
      title: `text-2xl font-bold text-red-900`,
    }
  }
};

export const CARD_STYLES = {
  featureIcon:
    `h-8 w-8 ${THEME.card.featureIcon}`,
  featureBox:
    `${THEME.card.featureBox} ${THEME.card.featureBorder} ${THEME.card.featureBackground}`,
  jobDetailBox:
    `${THEME.card.jobDetailBox} ${THEME.card.jobDetailBorder} ${THEME.card.jobDetailBackground}`,
 
  jobCard:
    `${THEME.card.job.card} ${THEME.card.job.border} ${THEME.card.job.background}`,
  profileCard:
    `${THEME.card.profile.card} ${THEME.card.profile.border} ${THEME.card.profile.background}`,
};

export const FAQ_STYLES = {
  sectionTitle:
    `text-3xl md:text-4xl font-bold tracking-tight ${THEME.faq.sectionTitle}`,
  sectionSubtitle:
    `mt-3 text-base ${THEME.faq.sectionSubtitle}`,
  box:
    `rounded-xl border p-5 ${THEME.faq.boxBorder} ${THEME.faq.boxBackground}`,
  boxTitle:
    `text-xl font-semibold ${THEME.faq.boxTitle}`,
  boxText:
    `text-sm ${THEME.faq.boxText}`,
};

export const PAGE_STYLES = {
  body:
    `min-h-screen ${THEME.layout.background} ${THEME.text.body}`,

  container:
    'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',

  section:
    'py-20',
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
