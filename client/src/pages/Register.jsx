import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { registerAlumni } from '../api';

const ALPHA_REGEX    = /^[A-Za-z\s'-]+$/;
const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALPHANUM_REGEX = /^[A-Za-z0-9\s,.-]+$/;

const INITIAL = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  city: '',
  state_province: '',
  reunion_interest: '',
  comment: '',
};

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    const firstName = form.first_name.trim();
    const lastName  = form.last_name.trim();
    const email     = form.email.trim();
    const phone     = form.phone.trim();
    const city      = form.city.trim();
    const state     = form.state_province.trim();

    if (!firstName) e.first_name = 'First name is required.';
    else if (!ALPHA_REGEX.test(firstName)) e.first_name = 'First name must contain letters only.';
    else if (firstName.length > 100) e.first_name = 'First name must be 100 characters or fewer.';

    if (!lastName) e.last_name = 'Last name is required.';
    else if (!ALPHA_REGEX.test(lastName)) e.last_name = 'Last name must contain letters only.';
    else if (lastName.length > 100) e.last_name = 'Last name must be 100 characters or fewer.';

    const digitsOnly = phone.replace(/\D/g, '');
    if (phone && digitsOnly.length !== 10) e.phone = 'Phone must be exactly 10 digits.';

    if (!email) e.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(email)) e.email = 'Enter a valid email address.';
    else if (email.length > 200) e.email = 'Email address is too long.';

    if (!city) e.city = 'City is required.';
    else if (!ALPHANUM_REGEX.test(city)) e.city = 'City contains invalid characters.';
    else if (city.length > 100) e.city = 'City must be 100 characters or fewer.';

    if (!state) e.state_province = 'State / Province is required.';
    else if (!ALPHANUM_REGEX.test(state)) e.state_province = 'State contains invalid characters.';
    else if (state.length > 100) e.state_province = 'State must be 100 characters or fewer.';

    if (!form.reunion_interest) e.reunion_interest = 'Please select an option.';

    if (form.comment.length > 500) e.comment = 'Comment must be 500 characters or fewer.';

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const bio = [
        `Interested in KUANA Reunion 2027: ${form.reunion_interest}`,
        form.comment.trim() ? `Comment: ${form.comment.trim()}` : '',
      ].filter(Boolean).join('\n');

      await registerAlumni({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.replace(/\D/g, '') || undefined,
        email: form.email.trim().toLowerCase(),
        city: form.city.trim(),
        state_province: form.state_province.trim(),
        bio,
      });
      setStatus('success');
    } catch (err) {
      const msg = err?.response?.data?.error;
      console.error('Registration error:', err?.response?.status, msg);
      if (msg?.toLowerCase().includes('already')) {
        setErrors({ email: 'This email is already registered.' });
      } else if (msg) {
        setStatus('error');
        setErrors({ _server: msg });
      } else {
        setStatus('error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0e1b4d] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to KUANA
          </Link>
          <p className="text-[#ffc31d] text-sm font-semibold uppercase tracking-widest mb-2">Alumni Directory</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Register as Alumni</h1>
          <p className="text-white/70 mt-3 text-sm max-w-lg">
            Join the KUANA alumni directory and stay connected with the Kathmandu University community in North America.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {status === 'success' ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
            <CheckCircle size={52} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're registered!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Welcome to the KUANA alumni directory. We'll be in touch with updates about upcoming events.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0e1b4d] text-white rounded-xl font-semibold text-sm hover:bg-[#060c22] transition-colors"
            >
              <ArrowLeft size={16} /> Back to KUANA
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">

            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={set('first_name')}
                  placeholder="Kushan"
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
                />
                <FieldError msg={errors.first_name} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={set('last_name')}
                  placeholder="Maskey"
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
                />
                <FieldError msg={errors.last_name} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+1 (555) 000-0000"
                maxLength={30}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
              />
              <FieldError msg={errors.phone} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                maxLength={200}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
              />
              <FieldError msg={errors.email} />
            </div>

            {/* City + State */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={set('city')}
                  placeholder="Dallas"
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
                />
                <FieldError msg={errors.city} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  State / Province <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.state_province}
                  onChange={set('state_province')}
                  placeholder="TX"
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
                />
                <FieldError msg={errors.state_province} />
              </div>
            </div>

            {/* Reunion interest */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Interested in joining the KUANA Reunion 2027? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {['Yes', 'No', 'Maybe'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="reunion_interest"
                      value={opt}
                      checked={form.reunion_interest === opt}
                      onChange={set('reunion_interest')}
                      className="accent-[#0e1b4d] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
              <FieldError msg={errors.reunion_interest} />
            </div>

            {/* Comment */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-gray-700">Comments / Message</label>
                <span className={`text-xs ${form.comment.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {form.comment.length}/500
                </span>
              </div>
              <textarea
                rows={4}
                value={form.comment}
                onChange={set('comment')}
                placeholder="Tell us anything else you'd like to share..."
                maxLength={500}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors resize-none"
              />
              <FieldError msg={errors.comment} />
            </div>

            {status === 'error' && (
              <p className="text-red-500 text-sm">
                {errors._server || 'Something went wrong. Please try again.'}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0e1b4d] text-white font-bold rounded-xl hover:bg-[#060c22] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {loading ? 'Submitting...' : 'Register as Alumni'}
            </button>

            <p className="text-center text-gray-400 text-xs">
              Fields marked <span className="text-red-500">*</span> are required.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
