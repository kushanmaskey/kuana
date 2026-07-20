import { useState } from 'react';
import { Mail, MapPin, MessageCircle, CheckCircle } from 'lucide-react';

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0e1b4d" />
    </svg>
  );
}
import { submitContact } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0e1b4d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto mb-6 rounded" />
          <p className="text-white/70 max-w-xl mx-auto">
            Questions about KUANA, the next reunion, or membership? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                icon: Mail,
                label: 'Email',
                value: 'info@kuana.org',
                href: 'mailto:info@kuana.org',
              },
              {
                icon: MapPin,
                label: 'Based In',
                value: 'United States & Canada',
                href: null,
              },
              {
                icon: MessageCircle,
                label: 'Response Time',
                value: 'Within 2–3 business days',
                href: null,
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#ffc31d]" />
                </div>
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-0.5">{label}</div>
                  {href ? (
                    <a href={href} className="text-white font-medium hover:text-[#ffc31d] transition-colors">
                      {value}
                    </a>
                  ) : (
                    <div className="text-white font-medium">{value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="pt-4">
              <div className="text-white/50 text-xs uppercase tracking-wide mb-4">Follow KUANA</div>
              <div className="flex gap-3">
                {[
                  { icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/kualumnina' },
                  { icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/kuanadallas/' },
                  { icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/company/ku-alumni-na/' },
                  { icon: YouTubeIcon, label: 'YouTube', href: 'https://www.youtube.com/@KUALUMNA' },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#ffc31d] hover:text-[#0e1b4d] text-white transition-all"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Alumni registration CTA */}
            <div className="mt-6 bg-white/10 rounded-2xl p-6">
              <div className="text-[#ffc31d] font-bold mb-2">Are you a KU Alumnus?</div>
              <p className="text-white/70 text-sm mb-4">
                Register in our alumni directory to stay connected with the KUANA community.
              </p>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact-form')?.focus(); }}
                className="text-[#ffc31d] text-sm font-semibold hover:underline"
              >
                Register as Alumni →
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-xl"
            id="contact-form"
          >
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">We'll get back to you within 2–3 business days.</p>
                <button
                  type="button"
                  onClick={() => setStatus(null)}
                  className="px-5 py-2 bg-[#dc143c] text-white rounded-lg text-sm font-semibold hover:bg-[#0e1b4d] transition-colors cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#dc143c] transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#dc143c] transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#dc143c] transition-colors mb-4"
                />
                <textarea
                  required
                  rows={5}
                  placeholder="Your message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#dc143c] transition-colors resize-none mb-4"
                />
                {status === 'error' && (
                  <p className="text-red-500 text-sm mb-4">Coming soon. Try again later.</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#dc143c] text-white font-bold rounded-lg hover:bg-[#0e1b4d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
