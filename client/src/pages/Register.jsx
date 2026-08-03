import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { registerAlumni } from '../api';

const ALPHA_REGEX    = /^[A-Za-z\s'-]+$/;
const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALPHANUM_REGEX = /^[A-Za-z0-9\s,.-]+$/;

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'], ['DC', 'District of Columbia'],
];

const CA_PROVINCES = [
  ['AB', 'Alberta'], ['BC', 'British Columbia'], ['MB', 'Manitoba'],
  ['NB', 'New Brunswick'], ['NL', 'Newfoundland and Labrador'], ['NT', 'Northwest Territories'],
  ['NS', 'Nova Scotia'], ['NU', 'Nunavut'], ['ON', 'Ontario'],
  ['PE', 'Prince Edward Island'], ['QC', 'Quebec'], ['SK', 'Saskatchewan'], ['YT', 'Yukon'],
];

const KU_SCHOOLS_DEPARTMENTS = [
  {
    school: 'School of Arts',
    departments: [
      'Department of Arts and Design',
      'Department of Development Studies',
      'Department of Languages and Mass Communication',
      'Department of Music',
    ],
  },
  {
    school: 'School of Education',
    departments: [
      'Continuing and Professional Education Centre',
      'Department of Development Education',
      'Department of Educational Leadership',
      'Department of Inclusive Education, Early Childhood Development and Professional Studies',
      'Department of Language Education',
      'Department of STEAM Education',
    ],
  },
  {
    school: 'School of Engineering',
    departments: [
      'Department of Architecture',
      'Department of Artificial Intelligence',
      'Department of Chemical Science and Engineering',
      'Department of Civil Engineering',
      'Department of Computer Science and Engineering',
      'Department of Electrical and Electronics Engineering',
      'Department of Geomatics Engineering',
      'Department of Health Informatics',
      'Department of Mechanical Engineering',
    ],
  },
  {
    school: 'School of Law',
    departments: ['Not Available'],
  },
  {
    school: 'School of Management',
    departments: [
      'Department of Finance, Economics and Accounting',
      'Department of Human Resource and General Management',
      'Department of Management Informatics and Communication',
      'Department of Management Science and Information',
      'Department of Marketing and Entrepreneurship',
      'Department of Public Policy and Management',
    ],
  },
  {
    school: 'School of Medical Sciences',
    departments: ['Not Available'],
  },
  {
    school: 'School of Science',
    departments: [
      'Department of Agriculture',
      'Department of Biotechnology',
      'Department of Environmental Science and Engineering',
      'Department of Mathematics',
      'Department of Pharmacy',
      'Department of Physics',
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: CURRENT_YEAR - 1994 }, (_, i) => 1995 + i);

const INITIAL = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  school: '',
  graduation_year: '',
  department: '',
  city: '',
  state_province: '',
  reunion_interest: '',
  comment: '',
};

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

function validateField(name, value) {
  const trimmed = typeof value === 'string' ? value.trim() : value;
  switch (name) {
    case 'first_name':
      if (!trimmed) return 'First name is required.';
      if (!ALPHA_REGEX.test(trimmed)) return 'First name must contain letters only.';
      if (trimmed.length > 100) return 'First name must be 100 characters or fewer.';
      return '';
    case 'last_name':
      if (!trimmed) return 'Last name is required.';
      if (!ALPHA_REGEX.test(trimmed)) return 'Last name must contain letters only.';
      if (trimmed.length > 100) return 'Last name must be 100 characters or fewer.';
      return '';
    case 'phone': {
      const digits = trimmed.replace(/\D/g, '');
      if (trimmed && digits.length !== 10) return 'Phone must be exactly 10 digits.';
      return '';
    }
    case 'email':
      if (!trimmed) return 'Email is required.';
      if (!EMAIL_REGEX.test(trimmed)) return 'Enter a valid email address.';
      if (trimmed.length > 200) return 'Email address is too long.';
      return '';
    case 'city':
      if (!trimmed) return 'City is required.';
      if (!ALPHANUM_REGEX.test(trimmed)) return 'City contains invalid characters.';
      if (trimmed.length > 100) return 'City must be 100 characters or fewer.';
      return '';
    case 'state_province':
      if (!value) return 'Please select a state or province.';
      return '';
    case 'reunion_interest':
      if (!value) return 'Please select an option.';
      return '';
    case 'comment':
      if (value.length > 500) return 'Comment must be 500 characters or fewer.';
      return '';
    default:
      return '';
  }
}

export default function Register() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field] !== undefined) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const blur = (field) => () => {
    const err = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validate = () => {
    const e = {};
    Object.keys(INITIAL).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) e[key] = err;
    });
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
        form.school ? `School: ${form.school}` : '',
        form.department ? `Department: ${form.department}` : '',
        `Interested in KUANA Reunion 2027: ${form.reunion_interest}`,
        form.comment.trim() ? `Comment: ${form.comment.trim()}` : '',
      ].filter(Boolean).join('\n');

      await registerAlumni({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.replace(/\D/g, '') || undefined,
        email: form.email.trim().toLowerCase(),
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : undefined,
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
          <Link to="/#contact" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Contact Us
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
              to="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0e1b4d] text-white rounded-xl font-semibold text-sm hover:bg-[#060c22] transition-colors"
            >
              <ArrowLeft size={16} /> Back to Contact Us
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
                  onBlur={blur('first_name')}
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
                  onBlur={blur('last_name')}
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
                onBlur={blur('phone')}
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
                onBlur={blur('email')}
                placeholder="you@example.com"
                maxLength={200}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors"
              />
              <FieldError msg={errors.email} />
            </div>

            {/* Graduation Year + Schools + Departments */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Graduation Year</label>
                <select
                  value={form.graduation_year}
                  onChange={set('graduation_year')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors bg-white"
                >
                  <option value="">Select year</option>
                  {GRAD_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Schools</label>
                <select
                  value={form.school}
                  onChange={(e) => setForm((f) => ({ ...f, school: e.target.value, department: '' }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors bg-white"
                >
                  <option value="">Select school</option>
                  {KU_SCHOOLS_DEPARTMENTS.map(({ school }) => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Departments</label>
                <select
                  value={form.department}
                  onChange={set('department')}
                  disabled={!form.school}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{form.school ? 'Select department' : 'Select a school first'}</option>
                  {KU_SCHOOLS_DEPARTMENTS
                    .find(({ school }) => school === form.school)
                    ?.departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
              </div>
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
                  onBlur={blur('city')}
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
                <select
                  value={form.state_province}
                  onChange={set('state_province')}
                  onBlur={blur('state_province')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] transition-colors bg-white"
                >
                  <option value="">Select state / province</option>
                  <optgroup label="United States">
                    {US_STATES.map(([abbr, name]) => (
                      <option key={abbr} value={abbr}>{abbr} – {name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Canada">
                    {CA_PROVINCES.map(([abbr, name]) => (
                      <option key={abbr} value={abbr}>{abbr} – {name}</option>
                    ))}
                  </optgroup>
                </select>
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
                onBlur={blur('comment')}
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
