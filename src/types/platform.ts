// Define the base platform type
export type Platform = 'whatsapp' | 'telegram' | 'signal' | 'discord' | 'slack' | 'imessage' | 'other';

export type PlatformFilter = Platform | 'all';

export interface PlatformOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export const PLATFORM_OPTIONS: PlatformOption<Platform>[] = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'signal', label: 'Signal' },
  { value: 'discord', label: 'Discord' },
  { value: 'slack', label: 'Slack' },
  { value: 'imessage', label: 'iMessage' },
  { value: 'other', label: 'Other' }
];

export const PLATFORM_FILTER_OPTIONS: PlatformOption<PlatformFilter>[] = [
  { value: 'all', label: 'All Platforms' },
  ...PLATFORM_OPTIONS
];
