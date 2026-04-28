import { THEME } from './theme';

export const BUTTON_STYLES = {
  positive:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.positive}`,

  danger:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.danger}`,

  login:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.login}`,

  profile:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.profile}`,

  ghost:
    `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${THEME.button.ghost}`,
};

export const INPUT_STYLES =
  `w-full rounded-md border px-4 py-3 ${THEME.form.input}`;

export const FLASH_MESSAGE_STYLES = {
  success: THEME.flash.success,
  error: THEME.flash.error,
};

export const TEXT_STYLES = {
  sectionTitle:
    `text-3xl md:text-4xl font-bold tracking-tight ${THEME.text.title}`,

  sectionSubtitle:
    `mt-3 text-base ${THEME.text.subtitle}`,

  cardTitle:
    `text-xl font-semibold ${THEME.card.title}`,

  cardText:
    `text-sm ${THEME.card.text}`,

  muted:
    `text-sm ${THEME.text.muted}`,
};

export const CARD_STYLES = {
  base:
    `rounded-xl border p-6 ${THEME.card.base}`,
};

export const PAGE_STYLES = {
  body:
    `min-h-screen ${THEME.layout.background} ${THEME.text.body}`,

  container:
    'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',

  section:
    'py-20',
};
