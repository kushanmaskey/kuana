import { useState, useEffect, useRef } from 'react';
import { LogOut, Users, Calendar, MessageCircle, Heart, Plus, Trash2, Eye, EyeOff, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toPng } from 'html-to-image';
import { Link } from 'react-router-dom';
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
          <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA Logo" className="h-16 mx-auto mb-4 object-contain" />
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

const CHART_VIEWS = [
  { value: 'month',      label: 'Registrations by Month' },
  { value: 'grad_year',  label: 'By Graduation Year' },
  { value: 'state',      label: 'By State / Province' },
  { value: 'city',       label: 'By City' },
  { value: 'school',     label: 'By School' },
  { value: 'department', label: 'By Department' },
  { value: 'interest',   label: 'By Reunion Interest' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getChartData(alumni, view) {
  if (view === 'month') {
    const counts = Array(12).fill(0);
    alumni.forEach((a) => { counts[new Date(a.created_at).getMonth()]++; });
    return MONTHS.map((label, i) => ({ label, value: counts[i] }));
  }
  const keyFns = {
    grad_year:  (a) => a.graduation_year?.toString(),
    state:      (a) => a.state_province,
    city:       (a) => a.city,
    school:     (a) => parseBioField(a.bio, 'School'),
    department: (a) => parseBioField(a.bio, 'Department'),
    interest:   (a) => parseBioField(a.bio, 'Interested in KUANA Reunion 2027'),
  };
  let rows = tally(alumni, keyFns[view]);
  if (view === 'grad_year') rows = [...rows].sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  else rows = rows.slice(0, 15);
  return rows.map(([label, value]) => ({ label: label || 'Unknown', value }));
}

function ControlChart({ data }) {
  if (data.length < 2) return <div className="text-center text-gray-400 text-xs py-4">Not enough data</div>;

  const values = data.map((d) => d.value);
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sigma = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const ucl = mean + 3 * sigma;
  const lcl = Math.max(0, mean - 3 * sigma);
  const yMin = 0;
  const yMax = Math.max(ucl * 1.18, mean + 1, 1);

  const W = 320, H = 180;
  const padL = 26, padR = 36, padT = 12, padB = 38;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xPos = (i) => padL + (n === 1 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yPos = (v) => padT + chartH - ((Math.min(Math.max(v, yMin), yMax) - yMin) / (yMax - yMin)) * chartH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(' ');

  const yTicks = [0, Math.round(mean * 10) / 10, Math.round(ucl * 10) / 10];
  if (lcl > 0) yTicks.push(Math.round(lcl * 10) / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Background */}
      <rect x={padL} y={padT} width={chartW} height={chartH} fill="white" />

      {/* Horizontal grid lines */}
      {yTicks.map((t) => (
        <line key={t} x1={padL} y1={yPos(t)} x2={padL + chartW} y2={yPos(t)} stroke="#f3f4f6" strokeWidth={1} />
      ))}

      {/* UCL line */}
      <line x1={padL} y1={yPos(ucl)} x2={padL + chartW} y2={yPos(ucl)} stroke="#ef4444" strokeWidth={1} strokeDasharray="4,3" />
      <text x={padL + chartW + 3} y={yPos(ucl) + 3} fontSize={7} fill="#ef4444" fontWeight="bold">UCL</text>
      <text x={padL + chartW + 3} y={yPos(ucl) + 10} fontSize={6} fill="#ef4444">{ucl.toFixed(1)}</text>

      {/* CL (mean) line */}
      <line x1={padL} y1={yPos(mean)} x2={padL + chartW} y2={yPos(mean)} stroke="#6b7280" strokeWidth={1} />
      <text x={padL + chartW + 3} y={yPos(mean) + 3} fontSize={7} fill="#6b7280" fontWeight="bold">CL</text>
      <text x={padL + chartW + 3} y={yPos(mean) + 10} fontSize={6} fill="#6b7280">{mean.toFixed(1)}</text>

      {/* LCL line */}
      {lcl > 0 && (
        <>
          <line x1={padL} y1={yPos(lcl)} x2={padL + chartW} y2={yPos(lcl)} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,3" />
          <text x={padL + chartW + 3} y={yPos(lcl) + 3} fontSize={7} fill="#3b82f6" fontWeight="bold">LCL</text>
          <text x={padL + chartW + 3} y={yPos(lcl) + 10} fontSize={6} fill="#3b82f6">{lcl.toFixed(1)}</text>
        </>
      )}

      {/* Data line */}
      <path d={linePath} fill="none" stroke="#dc143c" strokeWidth={1.5} strokeLinejoin="round" />

      {/* Data points */}
      {data.map((d, i) => {
        const out = d.value > ucl || (lcl > 0 && d.value < lcl);
        return (
          <circle key={i} cx={xPos(i)} cy={yPos(d.value)} r={2.5}
            fill={out ? '#ef4444' : '#dc143c'} stroke="white" strokeWidth={0.8} />
        );
      })}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />

      {/* Y axis ticks */}
      {yTicks.map((t) => (
        <text key={t} x={padL - 3} y={yPos(t) + 3} textAnchor="end" fontSize={7} fill="#9ca3af">{t}</text>
      ))}

      {/* X axis labels — every other label to avoid crowding */}
      {data.map((d, i) => {
        if (n > 8 && i % 2 !== 0) return null;
        const short = d.label.length > 5 ? d.label.slice(0, 4) + '…' : d.label;
        return (
          <text key={i} x={xPos(i)} y={padT + chartH + 10} textAnchor="middle" fontSize={7} fill="#6b7280">{short}</text>
        );
      })}
    </svg>
  );
}

function AlumniTab() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [exportField, setExportField] = useState('name');
  const [exportError, setExportError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const chartRef = useRef(null);

  const EXPORT_TO_CHART = {
    name:       'month',
    email:      'month',
    phone:      'month',
    grad_year:  'grad_year',
    school:     'school',
    department: 'department',
    city_state: 'state',
  };
  const chartView = EXPORT_TO_CHART[exportField] ?? 'month';

  useEffect(() => {
    getAlumni({ search }).then((r) => {
      setAlumni(r.data);
      setSelected(new Set(r.data.map((a) => a.id)));
    }).catch(() => {});
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

    const getSchool     = (a) => parseBioField(a.bio, 'School') ?? '';
    const getDept       = (a) => parseBioField(a.bio, 'Department') ?? '';

    const colDefs = {
      name:       { headers: ['Name'],                    row: (a) => [`${a.first_name} ${a.last_name}`] },
      email:      { headers: ['Name', 'Email'],           row: (a) => [`${a.first_name} ${a.last_name}`, a.email ?? ''] },
      phone:      { headers: ['Name', 'Phone'],           row: (a) => [`${a.first_name} ${a.last_name}`, a.phone ?? ''] },
      grad_year:  { headers: ['Name', 'Graduation Year'], row: (a) => [`${a.first_name} ${a.last_name}`, a.graduation_year ?? ''] },
      school:     { headers: ['Name', 'School'],          row: (a) => [`${a.first_name} ${a.last_name}`, getSchool(a)] },
      department: { headers: ['Name', 'Department'],      row: (a) => [`${a.first_name} ${a.last_name}`, getDept(a)] },
      city_state: { headers: ['Name', 'City', 'State'],  row: (a) => [`${a.first_name} ${a.last_name}`, a.city ?? '', a.state_province ?? ''] },
    };

    const { headers, row } = colDefs[exportField];
    const alumniSheet = XLSX.utils.aoa_to_sheet([headers, ...rows.map(row)]);

    const chartData = getChartData(alumni, chartView);
    const chartViewLabel = CHART_VIEWS.find((v) => v.value === chartView)?.label ?? chartView;
    const chartSheet = XLSX.utils.aoa_to_sheet(
      [['Label', 'Count'], ...chartData.map(({ label, value }) => [label, value])]
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, alumniSheet, 'Alumni');
    XLSX.utils.book_append_sheet(wb, chartSheet, chartViewLabel.slice(0, 31));

    XLSX.writeFile(wb, `kuana-alumni-${exportField}-${timestamp()}.xlsx`);
  };

  const downloadChartImage = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { pixelRatio: 2, backgroundColor: '#f9fafb' });
      const link = document.createElement('a');
      link.download = `kuana-chart-${chartView}-${timestamp()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('Could not download chart image. Please try again.');
    }
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
        <div ref={chartRef} className="mt-6 bg-gray-50 rounded-xl px-4 pt-3 pb-2 w-1/4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              {CHART_VIEWS.find((v) => v.value === chartView)?.label}
            </p>
            <button
              onClick={downloadChartImage}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#dc143c] transition-colors cursor-pointer"
            >
              <Download size={12} /> Save Image
            </button>
          </div>
          <ControlChart data={getChartData(alumni, chartView)} />
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
          <Link to="/">
            <div className="bg-white rounded-lg px-2 py-1">
              <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA Logo" className="h-7 w-auto object-contain" />
            </div>
          </Link>
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
