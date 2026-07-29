const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const URL_REGEX = /^https?:\/\/.{3,}/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_MEDIA_TYPES = ['photo', 'video'];

function isValidId(id) {
  const n = parseInt(id, 10);
  return !isNaN(n) && n > 0 && String(n) === String(id);
}

function isValidUrl(url) {
  if (!url) return true;
  return URL_REGEX.test(url);
}

function isValidDate(date) {
  if (!date) return true;
  if (!DATE_REGEX.test(date)) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

module.exports = { EMAIL_REGEX, ALLOWED_MEDIA_TYPES, isValidId, isValidUrl, isValidDate, escapeHtml };
