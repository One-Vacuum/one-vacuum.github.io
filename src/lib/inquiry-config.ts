/** One Vacuum's inquiry form settings, read by the shared ./inquiry.ts. */
import { CONTACT } from './contact';
import type { InquiryFieldDef } from './inquiry';

/** The form's fields, in display order (also the row order of the email). */
export const INQUIRY_FIELDS = [
  { name: 'company', required: false, maxLength: 100, emailLabel: '회사명', labelKey: 'inquiry.company', control: 'input', type: 'text', autocomplete: 'organization' },
  { name: 'name', required: true, maxLength: 50, emailLabel: '담당자/이름', labelKey: 'inquiry.name', control: 'input', type: 'text', autocomplete: 'name' },
  { name: 'phone', required: true, maxLength: 40, emailLabel: '연락처', labelKey: 'inquiry.phone', control: 'input', type: 'tel', autocomplete: 'tel' },
  { name: 'email', required: true, maxLength: 254, emailLabel: '이메일', labelKey: 'inquiry.email', control: 'input', type: 'email', autocomplete: 'email' },
  { name: 'product', required: false, maxLength: 200, emailLabel: '제품명 · 품번', labelKey: 'inquiry.product', control: 'input', type: 'text', placeholderKey: 'inquiry.productPlaceholder', wide: true },
  { name: 'message', required: true, maxLength: 5000, emailLabel: '문의 내용', labelKey: 'inquiry.message', control: 'textarea', wide: true },
] as const satisfies readonly InquiryFieldDef[];

export const SUBJECT_PREFIX = '[원베큠 홈페이지] 제품 문의';

/** Sales inbox (the public contact email). */
export const DEFAULT_RECIPIENT: string = CONTACT.email;

/** Hostnames where the form really sends. Anywhere else it only previews. */
export const PRODUCTION_HOSTS: readonly string[] = ['onevacuum.kr', 'www.onevacuum.kr'];
