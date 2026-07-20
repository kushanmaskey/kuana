import { GraduationCap, Globe, Heart, Users } from 'lucide-react';

const BOARD = [
  { year: 'Reunion 2023', location: 'Trophy Club, TX',  m1: 'Kushan Maskey', m2: 'Dipendra Bantawa', m3: 'Rajan Rijal', m4: '',    m5: ''  },
  { year: 'Reunion 2025', location: 'Lewisville, TX',   m1: 'Kushan Maskey', m2: 'Dipendra Bantawa', m3: 'Rajan Rijal', m4: 'Keshab Simkhada', m5: 'Binam Acharya' },
  { year: 'Reunion 2027', location: 'Boston, MA',       m1: 'Bijay Dhungana', m2: 'Nirmal Karki', m3: 'Saurav Man Singh Basnet', m4: 'Projjwol Dhakal', m5: '' },
];

const VALUES = [
  { icon: GraduationCap, title: 'Academic Excellence', desc: 'Honoring the KU tradition of rigorous education and intellectual curiosity.' },
  { icon: Globe, title: 'Global Community', desc: 'Connecting Nepali engineers, scientists, and professionals from KU across North America.' },
  { icon: Heart, title: 'Give Back', desc: 'Supporting scholarships, mentorship, and development initiatives at KU.' },
  { icon: Users, title: 'Reunion & Fellowship', desc: 'Gathering every two years to celebrate our shared journey and strengthen bonds.' },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About KUANA</h2>
          <div className="w-16 h-1 bg-[#ffc31d] mx-auto mb-8 rounded" />
        </div>

        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-900 font-bold text-lg leading-relaxed mb-4">
              Honoring KU Spirit, Strengthening the Alumni Network
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              As we have branched out from the same trunk, it is high time we reconnect, re-network, rewind old
              memories and bring it back to life by joining hands together.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              A small group of friends seeded the idea to translate this vision into reality — bringing together
              Kathmandu University graduates living and working across the United States and Canada.
            </p>
            <p className="text-gray-600 leading-relaxed">
              KUANA organizes biennial reunions in different cities across North America, creating opportunities
              to reconnect, re-network, and celebrate the shared journey of being part of one of Nepal's
              premier universities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#0e1b4d] to-[#060c22] rounded-2xl p-8 text-white">
            <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA Logo" className="h-16 w-auto object-contain mb-4" />
            <div className="text-2xl font-bold mb-4">Kathmandu University Alumni, North America (KUANA)</div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Formed in 2023, is a non-profit organization of alumni of Kathmandu University, Nepal, located
              in North America. We are recognized by the IRS, under section 501(c)(3) code, as a Tax Exempt
              organization.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center bg-white/10 rounded-xl p-4">
                <div className="text-[#ffc31d] font-bold text-2xl">2023</div>
                <div className="text-white/70 text-xs mt-1">Founded</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl p-4">
                <div className="text-[#ffc31d] font-bold text-2xl">501(c)(3)</div>
                <div className="text-white/70 text-xs mt-1">IRS Tax Exempt</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Our Values</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-[#0e1b4d]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#0e1b4d]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Board */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Executive Board Members</h3>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#0e1b4d] to-[#060c22] text-white">
                  <th className="px-6 py-4 text-left font-semibold">Reunion Year</th>
                  <th className="px-6 py-4 text-center font-semibold">Executive Member 1</th>
                  <th className="px-6 py-4 text-center font-semibold">Executive Member 2</th>
                  <th className="px-6 py-4 text-center font-semibold">Executive Member 3</th>
                  <th className="px-6 py-4 text-center font-semibold">Executive Member 4</th>
                  <th className="px-6 py-4 text-center font-semibold">Executive Member 5</th>
                </tr>
              </thead>
              <tbody>
                {BOARD.map(({ year, location, m1, m2, m3, m4, m5 }, i) => (
                  <tr key={year} className={year === 'Reunion 2027' ? 'bg-[#ffc31d]/20' : i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0e1b4d]">{year}</span>
                        {year === 'Reunion 2027' && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Upcoming</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">{location}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700">{m1}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{m2}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{m3}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{m4}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{m5}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
