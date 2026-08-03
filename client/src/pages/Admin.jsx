import { useState, useEffect } from 'react';
import { LogOut, Users, Calendar, MessageCircle, Heart, Plus, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import { login, getAlumni, getEvents, getMessages, getDonations, getDonationStats, createEvent, deleteEvent, markMessageRead } from '../api';

function LoginForm({ onLogin }) {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(creds);
      localStorage.setItem('kuana_token', res.data.token);
      onLogin(res.data.admin);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#dc143c] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            KU
          </div>
          <h1 className="text-2xl font-bold text-gray-900">KUANA Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your site</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Admin email"
            value={creds.email}
            onChange={(e) => setCreds({ ...creds, email: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#dc143c]"
          />
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#dc143c] pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#dc143c] text-white font-bold rounded-lg hover:bg-[#0e1b4d] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{value ?? '—'}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', city: '', state_province: '', venue: '', is_featured: false, is_published: true });

  useEffect(() => {
    getEvents().then((r) => setEvents(r.data)).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createEvent(form);
      setEvents([res.data, ...events]);
      setShowForm(false);
      setForm({ title: '', description: '', event_date: '', city: '', state_province: '', venue: '', is_featured: false, is_published: true });
    } catch (err) {
      alert('Error creating event');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch { alert('Error deleting event'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Events</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#dc143c] text-white rounded-lg text-sm font-semibold hover:bg-[#0e1b4d] transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c]" />
            <input required type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c]" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c]" />
            <input placeholder="State/Province" value={form.state_province} onChange={(e) => setForm({ ...form, state_province: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c]" />
            <input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c] sm:col-span-2" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c] resize-none mb-4" />
          <div className="flex items-center gap-6 mb-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Published
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 bg-[#dc143c] text-white rounded-lg text-sm font-semibold hover:bg-[#0e1b4d] cursor-pointer">Save Event</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">{ev.title}</span>
                {ev.is_featured && <span className="bg-[#ffc31d]/20 text-[#dc143c] text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>}
                {!ev.is_published && <span className="bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full">Draft</span>}
              </div>
              <div className="text-gray-400 text-xs">{ev.city}, {ev.state_province} &bull; {new Date(ev.event_date).toLocaleDateString()}</div>
            </div>
            <button onClick={() => handleDelete(ev.id)} className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {events.length === 0 && <div className="text-gray-400 text-sm text-center py-8">No events yet.</div>}
      </div>
    </div>
  );
}

function parseBioField(bio, key) {
  if (!bio) return null;
  const match = bio.match(new RegExp(`${key}: ([^\n]+)`));
  return match ? match[1].trim() : null;
}

const REUNION_BADGE = {
  Yes:   'bg-green-100 text-green-700',
  No:    'bg-gray-100 text-gray-500',
  Maybe: 'bg-yellow-100 text-yellow-700',
};

const EXPORT_FIELDS = [
  { value: 'name',       label: 'Name' },
  { value: 'email',      label: 'Email' },
  { value: 'phone',      label: 'Phone' },
  { value: 'grad_year',  label: 'Graduation Year' },
  { value: 'school',     label: 'School' },
  { value: 'department', label: 'Department' },
  { value: 'city_state', label: 'City / State' },
];

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
}

function tally(items, keyFn) {
  const map = {};
  for (const item of items) {
    const key = keyFn(item) || 'Unknown';
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function BreakdownTable({ title, rows }) {
  if (!rows.length) return null;
  const max = rows[0][1];
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{title}</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-2 px-1 text-xs font-semibold text-gray-400">Name</th>
            <th className="text-right pb-2 px-1 text-xs font-semibold text-gray-400 w-12">Count</th>
            <th className="pb-2 px-1 w-28"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, count]) => (
            <tr key={label} className="border-b border-gray-100 last:border-0">
              <td className="py-1.5 px-1 text-gray-700 text-xs">{label}</td>
              <td className="py-1.5 px-1 text-right font-bold text-gray-900 text-xs">{count}</td>
              <td className="py-1.5 px-1">
                <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-[#dc143c] rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function AlumniBarChart({ alumni }) {
  const counts = Array(12).fill(0);
  alumni.forEach((a) => {
    const m = new Date(a.created_at).getMonth();
    counts[m]++;
  });
  const data = MONTH_LABELS.map((label, i) => ({ label, value: counts[i] }));

  const maxVal = Math.max(...counts, 1);
  const yMax = Math.ceil(maxVal / 5) * 5 || 5;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * yMax));

  const W = 580, H = 150;
  const padL = 32, padR = 12, padT = 16, padB = 36;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const slotW = chartW / 12;
  const barW = slotW * 0.55;

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Registrations by Month</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {yTicks.map((tick) => {
          const y = padT + chartH - (tick / yMax) * chartH;
          return (
            <g key={tick}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={tick === 0 ? '#d1d5db' : '#f3f4f6'} strokeWidth={1} />
              <text x={padL - 5} y={y + 3.5} textAnchor="end" fontSize={9} fill="#9ca3af">{tick}</text>
            </g>
          );
        })}

        {data.map(({ label, value }, i) => {
          const barH = Math.max((value / yMax) * chartH, 0);
          const x = padL + i * slotW + (slotW - barW) / 2;
          const y = padT + chartH - barH;
          return (
            <g key={label}>
              {value > 0 && (
                <>
                  <rect x={x} y={y} width={barW} height={barH} fill="#dc143c" rx={3} />
                  <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#dc143c" fontWeight="bold">{value}</text>
                </>
              )}
              <text x={x + barW / 2} y={padT + chartH + 14} textAnchor="middle" fontSize={9} fill="#6b7280">{label}</text>
            </g>
          );
        })}

        <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />

        <text x={padL + chartW / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#9ca3af">Month</text>
        <text
          x={11}
          y={padT + chartH / 2}
          textAnchor="middle"
          fontSize={10}
          fill="#9ca3af"
          transform={`rotate(-90, 11, ${padT + chartH / 2})`}
        >
          Count
        </text>
      </svg>
    </div>
  );
}

function AlumniTab() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [exportField, setExportField] = useState('name');
  const [exportError, setExportError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getAlumni({ search }).then((r) => setAlumni(r.data)).catch(() => {});
  }, [search]);

  const allChecked = alumni.length > 0 && alumni.every((a) => selected.has(a.id));

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(alumni.map((a) => a.id)));
    setExportError('');
  };

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setExportError('');
  };

  const handleExport = () => {
    if (selected.size === 0) { setExportError('Please select at least one alumni to export.'); return; }
    setExportError('');
    const rows = alumni.filter((a) => selected.has(a.id));

    const school     = (a) => parseBioField(a.bio, 'School') ?? '—';
    const department = (a) => parseBioField(a.bio, 'Department') ?? '—';

    const configs = {
      name:       { header: 'Name',                      val: (a) => `${a.first_name} ${a.last_name}` },
      email:      { header: 'Name,Email',                val: (a) => `${a.first_name} ${a.last_name},${a.email ?? ''}` },
      phone:      { header: 'Name,Phone',                val: (a) => `${a.first_name} ${a.last_name},${a.phone ?? ''}` },
      grad_year:  { header: 'Name,Graduation Year',      val: (a) => `${a.first_name} ${a.last_name},${a.graduation_year ?? ''}` },
      school:     { header: 'Name,School',               val: (a) => `${a.first_name} ${a.last_name},${school(a)}` },
      department: { header: 'Name,Department',           val: (a) => `${a.first_name} ${a.last_name},${department(a)}` },
      city_state: { header: 'Name,City,State',           val: (a) => `${a.first_name} ${a.last_name},${a.city ?? ''},${a.state_province ?? ''}` },
    };

    const { header, val } = configs[exportField];
    const csv = [header, ...rows.map(val)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kuana-alumni-${exportField}-${timestamp()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const COLS = 10;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">Alumni Directory</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c] w-52"
          />
          <select
            value={exportField}
            onChange={(e) => setExportField(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#dc143c] bg-white"
          >
            {EXPORT_FIELDS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {exportError && <p className="text-red-500 text-sm mb-3">{exportError}</p>}
      {selected.size > 0 && <p className="text-xs text-gray-500 mb-3">{selected.size} alumni selected</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-2 w-8">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-[#dc143c] cursor-pointer" />
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Email</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Phone</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Grad Year</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">School</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Department</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">City / State</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Reunion 2027</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase whitespace-nowrap">Registered</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map((a) => {
              const interest   = parseBioField(a.bio, 'Interested in KUANA Reunion 2027');
              const school     = parseBioField(a.bio, 'School');
              const department = parseBioField(a.bio, 'Department');
              const comment    = parseBioField(a.bio, 'Comment');
              const isSelected = selected.has(a.id);
              return (
                <>
                  <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 ${isSelected ? 'bg-blue-50/40' : ''}`}>
                    <td className="py-3 px-2">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(a.id)} className="accent-[#dc143c] cursor-pointer" />
                    </td>
                    <td className="py-3 px-2 font-medium text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                      {a.first_name} {a.last_name}
                    </td>
                    <td className="py-3 px-2 text-gray-500">{a.email}</td>
                    <td className="py-3 px-2 text-gray-500 whitespace-nowrap">{a.phone ?? '—'}</td>
                    <td className="py-3 px-2 text-gray-500 text-center">{a.graduation_year ?? '—'}</td>
                    <td className="py-3 px-2 text-gray-500">{school ?? '—'}</td>
                    <td className="py-3 px-2 text-gray-500">{department ?? '—'}</td>
                    <td className="py-3 px-2 text-gray-500 whitespace-nowrap">{a.city ? `${a.city}, ${a.state_province ?? ''}` : '—'}</td>
                    <td className="py-3 px-2">
                      {interest ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${REUNION_BADGE[interest] ?? 'bg-gray-100 text-gray-500'}`}>
                          {interest}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>
                  </tr>
                  {expanded === a.id && comment && (
                    <tr key={`${a.id}-comment`} className="bg-gray-50 border-b border-gray-100">
                      <td colSpan={COLS} className="px-4 py-3 text-sm text-gray-600 italic">
                        <span className="font-semibold text-gray-500 not-italic">Comment: </span>{comment}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {alumni.length === 0 && (
              <tr><td colSpan={COLS} className="text-center py-8 text-gray-400">No alumni found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {alumni.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-bold text-gray-800">Alumni Breakdown</h3>
            <span className="text-xs text-gray-400 font-normal">({alumni.length} total)</span>
          </div>
          <div className="mb-4">
            <AlumniBarChart alumni={alumni} />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <BreakdownTable
              title="By Graduation Year"
              rows={tally(alumni, (a) => a.graduation_year?.toString())}
            />
            <BreakdownTable
              title="By State / Province"
              rows={tally(alumni, (a) => a.state_province)}
            />
            <BreakdownTable
              title="By City"
              rows={tally(alumni, (a) => a.city)}
            />
            <BreakdownTable
              title="By School"
              rows={tally(alumni, (a) => parseBioField(a.bio, 'School'))}
            />
            <BreakdownTable
              title="By Department"
              rows={tally(alumni, (a) => parseBioField(a.bio, 'Department'))}
            />
            <BreakdownTable
              title="By Reunion Interest"
              rows={tally(alumni, (a) => parseBioField(a.bio, 'Interested in KUANA Reunion 2027'))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages().then((r) => setMessages(r.data)).catch(() => {});
  }, []);

  const handleRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages(messages.map((m) => m.id === id ? { ...m, is_read: true } : m));
    } catch {}
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Messages</h2>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`rounded-xl border p-4 ${m.is_read ? 'border-gray-100 bg-white' : 'border-[#dc143c]/20 bg-[#dc143c]/5'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {!m.is_read && <div className="w-2 h-2 rounded-full bg-[#dc143c]" />}
                  <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                  <span className="text-gray-400 text-xs">&bull; {m.email}</span>
                </div>
                {m.subject && <div className="text-xs text-gray-500 mb-1 font-medium">{m.subject}</div>}
                <p className="text-gray-600 text-sm">{m.message}</p>
                <div className="text-gray-400 text-xs mt-2">{new Date(m.created_at).toLocaleString()}</div>
              </div>
              {!m.is_read && (
                <button onClick={() => handleRead(m.id)} className="text-gray-400 hover:text-[#dc143c] text-xs flex items-center gap-1 cursor-pointer flex-shrink-0">
                  <Eye size={14} /> Mark read
                </button>
              )}
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-gray-400 text-sm text-center py-8">No messages yet.</div>}
      </div>
    </div>
  );
}

function DonationsTab() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDonations().then((r) => setDonations(r.data)).catch(() => {});
    getDonationStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Donations</h2>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Donations', value: stats.total_donations },
            { label: 'Total Amount', value: `$${parseFloat(stats.total_amount || 0).toLocaleString()}` },
            { label: 'Avg Donation', value: `$${parseFloat(stats.average_amount || 0).toFixed(0)}` },
            { label: 'Unique Donors', value: stats.unique_donors },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#dc143c]/5 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-[#dc143c]">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase">Donor</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase">Amount</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase">Purpose</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-500 text-xs uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <div className="font-medium text-gray-900">{d.donor_name}</div>
                  <div className="text-gray-400 text-xs">{d.donor_email}</div>
                </td>
                <td className="py-3 px-2 font-bold text-[#dc143c]">${parseFloat(d.amount).toLocaleString()}</td>
                <td className="py-3 px-2 text-gray-500">{d.purpose ?? 'General Fund'}</td>
                <td className="py-3 px-2 text-gray-400 text-xs">{new Date(d.donated_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">No donations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'alumni', label: 'Alumni', icon: Users },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'donations', label: 'Donations', icon: Heart },
];

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState('events');

  useEffect(() => {
    const token = localStorage.getItem('kuana_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) setAdmin(payload);
        else localStorage.removeItem('kuana_token');
      } catch { localStorage.removeItem('kuana_token'); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kuana_token');
    setAdmin(null);
  };

  if (!admin) return <LoginForm onLogin={setAdmin} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-[#dc143c] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ffc31d] flex items-center justify-center text-[#dc143c] font-bold text-xs">KU</div>
          <span className="font-bold text-sm">KUANA Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">{admin.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1 text-white/70 hover:text-white text-sm cursor-pointer transition-colors">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1 mb-8 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                tab === id ? 'bg-[#dc143c] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {tab === 'events' && <EventsTab />}
          {tab === 'alumni' && <AlumniTab />}
          {tab === 'messages' && <MessagesTab />}
          {tab === 'donations' && <DonationsTab />}
        </div>
      </div>
    </div>
  );
}
