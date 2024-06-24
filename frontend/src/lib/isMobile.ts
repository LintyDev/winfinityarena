import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export const isMobile = () => {
  if (typeof process === 'undefined') {
    throw new Error('Impliment this in server method');
  }

  const { get } = headers();
  const userAgent = get('user-agent');
  const devise = new UAParser(userAgent || '').getDevice();
  return devise.type === 'mobile';
};
