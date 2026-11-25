// One Vacuum's inquiry settings, pinned so a copy edit cannot silently change
// where inquiries go or how they look.
import { describe, expect, it } from 'vitest';
import { DEFAULT_RECIPIENT, INQUIRY_FIELDS, PRODUCTION_HOSTS, SUBJECT_PREFIX } from './inquiry-config';

describe('One Vacuum inquiry config', () => {
  it('mails sales with the agreed subject, only from onevacuum.kr', () => {
    expect(DEFAULT_RECIPIENT).toBe('sales@gvac.co.kr');
    expect(SUBJECT_PREFIX).toBe('[원베큠 홈페이지] 제품 문의');
    expect(PRODUCTION_HOSTS).toEqual(['onevacuum.kr', 'www.onevacuum.kr']);
  });

  it('has the agreed fields: 회사명 optional, 담당자/이름, product optional', () => {
    expect(INQUIRY_FIELDS.map((f) => [f.name, f.emailLabel, f.required])).toEqual([
      ['company', '회사명', false],
      ['name', '담당자/이름', true],
      ['phone', '연락처', true],
      ['email', '이메일', true],
      ['product', '제품명 · 품번', false],
      ['message', '문의 내용', true],
    ]);
  });
});
