/** Company contact details: the single source for ui.ts text and tel:/mailto: links. */
export const CONTACT = {
  phone: '010-8525-7025',
  email: 'sales@gvac.co.kr',
} as const;

/** `tel:` link with everything but digits and `+` stripped. */
export const telHref = (number: string) => 'tel:' + number.replace(/[^0-9+]/g, '');

export const mailHref = (email: string) => 'mailto:' + email;
