import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0e1b4d] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-[#ffc31d] text-sm mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to KUANA
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffc31d]/20 flex items-center justify-center">
              <Shield size={24} className="text-[#ffc31d]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-white/60 text-sm mt-1">Last updated: July 16, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <div className="bg-[#0e1b4d]/5 border border-[#0e1b4d]/10 rounded-2xl p-6 text-sm">
            <strong className="text-[#0e1b4d]">Summary:</strong> KUANA collects personal information solely to
            serve the KU alumni community — for reunion coordination, alumni directory, and donation records.
            We do not sell or share your data with third parties for commercial purposes.
          </div>

          <Section title="1. Who We Are">
            <p>
              Kathmandu University Alumni North America (<strong>KUANA</strong>) is a non-profit organization
              representing graduates of Kathmandu University living in the United States and Canada. Our website
              is located at <strong>kuana.org</strong>.
            </p>
            <p className="mt-3">
              For privacy-related questions, contact us at:{' '}
              <a href="mailto:info@kuana.org" className="text-[#0e1b4d] font-medium hover:underline">
                info@kuana.org
              </a>
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p className="mb-3">We collect the following personal information when you use our website:</p>
            <Table rows={[
              ['Alumni Registration', 'First & last name, email, phone number, graduation year, degree, department, city, state/province, country, LinkedIn URL, bio'],
              ['Contact Form', 'Name, email address, subject, message content'],
              ['Donations', 'Donor name, email address, donation amount, purpose, optional message'],
              ['Website Usage', 'IP address, browser type, pages visited (via server logs)'],
            ]} />
            <p className="mt-4">
              We do <strong>not</strong> collect payment card details. Any financial transactions are processed
              through third-party payment processors subject to their own privacy policies.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li>To maintain the KUANA alumni directory and facilitate alumni connections</li>
              <li>To communicate reunion event details, registration information, and KUANA news</li>
              <li>To process and acknowledge donations to KUANA</li>
              <li>To respond to your inquiries submitted via the Contact Us form</li>
              <li>To administer and improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-4">
              We will <strong>never</strong> sell your personal information to third parties or use it for
              commercial advertising.
            </p>
          </Section>

          <Section title="4. How We Share Your Information">
            <p className="mb-3">
              We do not sell, trade, or rent your personal information. We may share information only in
              these limited circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>KUANA volunteers and board members</strong> — who need access to coordinate events
                and communicate with alumni, under confidentiality obligations.
              </li>
              <li>
                <strong>Service providers</strong> — such as our web hosting provider (Render.com) who
                process data on our behalf under strict data processing agreements.
              </li>
              <li>
                <strong>Legal requirements</strong> — if required by law, court order, or government authority.
              </li>
            </ul>
          </Section>

          <Section title="5. Data Storage & Security">
            <p className="mb-3">
              Your data is stored in a secure PostgreSQL database hosted on Render.com in the United States.
              We implement the following security measures:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>All connections are encrypted via HTTPS/TLS</li>
              <li>Passwords are hashed using bcrypt with a high cost factor</li>
              <li>Admin access is protected by JWT authentication and rate limiting</li>
              <li>Security headers are enforced on all responses (via Helmet.js)</li>
              <li>Input validation and rate limiting protect all public-facing forms</li>
            </ul>
            <p className="mt-4">
              While we take reasonable precautions, no method of transmission over the internet is 100% secure.
              We cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Cookies & Tracking">
            <p>
              KUANA does not use tracking cookies or third-party analytics tools. We do not use Google
              Analytics, Facebook Pixel, or similar services. Our server may log basic access information
              (IP address, browser, pages visited) for security and debugging purposes only. These logs
              are not shared with third parties.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <Table rows={[
              ['Access', 'Request a copy of the personal data we hold about you'],
              ['Correction', 'Request correction of inaccurate or incomplete information'],
              ['Deletion', 'Request deletion of your personal data ("right to be forgotten")'],
              ['Objection', 'Object to certain processing of your data'],
              ['Portability', 'Request your data in a portable format'],
            ]} />
            <p className="mt-4">
              <strong>California residents (CCPA):</strong> You have the right to know what personal
              information we collect, to opt out of the sale of personal information (we do not sell data),
              and to request deletion of your information.
            </p>
            <p className="mt-3">
              To exercise any of these rights, email us at{' '}
              <a href="mailto:info@kuana.org" className="text-[#0e1b4d] font-medium hover:underline">
                info@kuana.org
              </a>{' '}
              with the subject line <em>"Privacy Request"</em>. We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Data Retention">
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes described
              in this policy or as required by law. Alumni directory entries are retained indefinitely unless
              you request deletion. Contact form messages are retained for 2 years. Donation records are
              retained for 7 years for accounting and legal compliance.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              KUANA is intended for university alumni (adults 18 and older). We do not knowingly collect
              personal information from children under 13. If you believe we have inadvertently collected
              such information, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              "Last updated" date at the top of this page. We encourage you to review this policy
              periodically. Continued use of our website after changes constitutes acceptance of the
              updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy or how we handle your data,
              please contact us:
            </p>
            <div className="mt-4 bg-gray-50 rounded-xl p-5 text-sm">
              <div className="font-bold text-gray-900 mb-1">KUANA — Kathmandu University Alumni North America</div>
              <div>Email: <a href="mailto:info@kuana.org" className="text-[#0e1b4d] hover:underline">info@kuana.org</a></div>
              <div>Website: <a href="https://kuana.org" className="text-[#0e1b4d] hover:underline">kuana.org</a></div>
            </div>
          </Section>

        </div>
      </div>

      {/* Footer strip */}
      <div className="bg-[#040919] text-white/40 py-6 text-center text-xs">
        &copy; {new Date().getFullYear()} KUANA &bull; Kathmandu University Alumni North America &bull; kuana.org
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#0e1b4d] mb-3 pb-2 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  );
}

function Table({ rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value], i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-3 font-semibold text-gray-900 w-44 align-top">{label}</td>
              <td className="px-4 py-3 text-gray-600">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
