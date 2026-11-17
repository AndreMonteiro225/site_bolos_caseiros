import crypto from 'crypto';

const sign = (payload) =>
  crypto.createHmac('sha256', process.env.SESSION_SECRET).update(payload).digest('hex');

export function createSessionToken() {
  const exp = String(Date.now() + 12 * 60 * 60 * 1000); // 12h
  return `${exp}.${sign(exp)}`;
}

export function isAdmin(request) {
  const token = request.cookies.get('admin_session')?.value;
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig) return false;
  const expected = sign(exp);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}