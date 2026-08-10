import { useState, useEffect, useRef } from 'react';
import { LogOut, Users, Calendar, MessageCircle, Heart, Plus, Trash2, Eye, EyeOff, Download, LayoutDashboard, Star, KeyRound } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toPng } from 'html-to-image';
import { Link } from 'react-router-dom';
import { login, changePassword, getAlumni, getEvents, getMessages, getDonations, getDonationStats, createEvent, deleteEvent, toggleEventFeatured, markMessageRead, markMessageUnread } from '../api';

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
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d]"
          />
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0e1b4d] pr-10"
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
            className="w-full py-3 bg-[#0e1b4d] text-white font-bold rounded-lg hover:bg-[#060c22] transition-colors disabled:opacity-60 cursor-pointer"
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
  const [page, setPage] = useState(1);
  const { sortField: evSortField, sortDir: evSortDir, handleSort: evHandleSort } = useSort('date', 'desc');

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

  const handleToggleFeatured = async (ev) => {
    if (ev.is_featured) return;
    try {
      const res = await toggleEventFeatured(ev.id, true);
      setEvents((prev) => prev.map((e) => e.id === ev.id ? res.data : { ...e, is_featured: false }));
    } catch { alert('Could not update featured event. Please try again.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Events <PageBadge page={page} total={events.length} /></h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0e1b4d] text-white rounded-lg text-sm font-semibold hover:bg-[#060c22] transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d]" />
            <input required type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d]" />
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d]" />
            <input placeholder="State/Province" value={form.state_province} onChange={(e) => setForm({ ...form, state_province: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d]" />
            <input placeholder="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d] sm:col-span-2" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d] resize-none mb-4" />
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
            <button type="submit" className="px-5 py-2 bg-[#0e1b4d] text-white rounded-lg text-sm font-semibold hover:bg-[#060c22] cursor-pointer">Save Event</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      {(() => {
        const sortedEvents = [...events].sort((a, b) => {
          let vA, vB;
          if (evSortField === 'title') { vA = a.title.toLowerCase(); vB = b.title.toLowerCase(); }
          if (evSortField === 'date')  { vA = new Date(a.event_date); vB = new Date(b.event_date); }
          if (evSortField === 'city')  { vA = (a.city ?? '').toLowerCase(); vB = (b.city ?? '').toLowerCase(); }
          if (vA < vB) return evSortDir === 'asc' ? -1 : 1;
          if (vA > vB) return evSortDir === 'asc' ? 1 : -1;
          return 0;
        });
        const totalPages = Math.ceil(sortedEvents.length / PAGE_SIZE);
        const pageEvents = sortedEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
        return (
          <>
            <div className="flex items-center gap-1 mb-3 text-xs text-gray-400">
              <span className="mr-1 font-semibold uppercase tracking-wide">Sort:</span>
              {[['title','Title'],['date','Date'],['city','City']].map(([f, l]) => (
                <button key={f} onClick={() => evHandleSort(f)}
                  className={`flex items-center gap-0.5 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${evSortField === f ? 'border-[#0e1b4d] text-[#0e1b4d] font-semibold' : 'border-gray-200 hover:border-gray-300'}`}>
                  {l}
                  {evSortField === f && <span>{evSortDir === 'asc' ? ' ▲' : ' ▼'}</span>}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {pageEvents.map((ev) => (
                <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{ev.title}</span>
                      {ev.is_featured && <span className="bg-[#ffc31d]/20 text-[#0e1b4d] text-xs px-2 py-0.5 rounded-full font-medium">Featured</span>}
                      {!ev.is_published && <span className="bg-gray-100 text-gray-400 text-xs px-2 py-0.5 rounded-full">Draft</span>}
                    </div>
                    <div className="text-gray-400 text-xs">{ev.city}, {ev.state_province} &bull; {new Date(ev.event_date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggleFeatured(ev)} title={ev.is_featured ? 'Featured' : 'Set as featured'} className={`transition-colors ${ev.is_featured ? 'cursor-default' : 'cursor-pointer'}`}>
                      <Star size={16} className={ev.is_featured ? 'text-[#ffc31d]' : 'text-gray-300 hover:text-[#ffc31d]'} fill={ev.is_featured ? '#ffc31d' : 'none'} />
                    </button>
                    <button onClick={() => handleDelete(ev.id)} className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {events.length === 0 && <div className="text-gray-400 text-sm text-center py-8">No events yet.</div>}
            </div>
            <Pagination page={page} totalPages={totalPages} total={sortedEvents.length}
              onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
          </>
        );
      })()}
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

const COLUMNS = [
  { value: 'email',      label: 'Email',        th: 'Email',        exportKey: 'Email',           val: (a) => a.email ?? '',                                                   sortVal: (a) => (a.email ?? '').toLowerCase() },
  { value: 'phone',      label: 'Phone',        th: 'Phone',        exportKey: 'Phone',           val: (a) => a.phone ?? '',                                                   sortVal: (a) => a.phone ?? '' },
  { value: 'grad_year',  label: 'Grad Year',    th: 'Grad Year',    exportKey: 'Graduation Year', val: (a) => a.graduation_year ?? '',                                         sortVal: (a) => a.graduation_year ?? 0 },
  { value: 'school',     label: 'School',       th: 'School',       exportKey: 'School',          val: (a) => parseBioField(a.bio, 'School') ?? '',                            sortVal: (a) => (parseBioField(a.bio, 'School') ?? '').toLowerCase() },
  { value: 'department', label: 'Department',   th: 'Department',   exportKey: 'Department',      val: (a) => parseBioField(a.bio, 'Department') ?? '',                        sortVal: (a) => (parseBioField(a.bio, 'Department') ?? '').toLowerCase() },
  { value: 'location',   label: 'City / State', th: 'City / State', exportKey: 'City / State',    val: (a) => a.city ? `${a.city}, ${a.state_province ?? ''}` : '',           sortVal: (a) => (a.city ?? '').toLowerCase() },
  { value: 'interest',   label: 'Reunion 2027', th: 'Reunion 2027', exportKey: 'Reunion 2027',    val: (a) => parseBioField(a.bio, 'Interested in KUANA Reunion 2027') ?? '', sortVal: (a) => (parseBioField(a.bio, 'Interested in KUANA Reunion 2027') ?? '').toLowerCase() },
  { value: 'registered', label: 'Registered',   th: 'Registered',   exportKey: 'Registered',      val: (a) => new Date(a.created_at).toLocaleString(),                         sortVal: (a) => new Date(a.created_at) },
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
                  <div className="h-full bg-[#0e1b4d] rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PAGE_SIZE = 20;

function PageBadge({ page, total }) {
  if (total === 0) return null;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  return (
    <span className="text-xs font-normal text-gray-400 ml-2">
      {from}–{to} of {total}
    </span>
  );
}

function Pagination({ page, totalPages, total, onPrev, onNext }) {
  if (total <= PAGE_SIZE) return null;
  return (
    <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} disabled={page === 1}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
          ← Prev
        </button>
        <span className="text-xs text-gray-500 w-16 text-center">{page} / {totalPages}</span>
        <button onClick={onNext} disabled={page === totalPages}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
          Next →
        </button>
      </div>
    </div>
  );
}

function useSort(defaultField, defaultDir = 'asc') {
  const [sortField, setSortField] = useState(defaultField);
  const [sortDir, setSortDir] = useState(defaultDir);
  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };
  return { sortField, sortDir, handleSort };
}

function SortTh({ field, label, sortField, sortDir, onSort, className = '' }) {
  return (
    <th className={`text-left py-3 px-2 text-xs uppercase ${className}`}>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 font-semibold text-gray-500 hover:text-gray-700 cursor-pointer select-none whitespace-nowrap"
      >
        {label}
        <span className="flex flex-col leading-none text-gray-300 text-[8px]">
          <span className={sortField === field && sortDir === 'asc' ? 'text-[#0e1b4d]' : ''}>▲</span>
          <span className={sortField === field && sortDir === 'desc' ? 'text-[#0e1b4d]' : ''}>▼</span>
        </span>
      </button>
    </th>
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
  const [tooltip, setTooltip] = useState(null);

  if (!data.length) return <div className="text-center text-gray-400 text-xs py-4">No data</div>;

  const values = data.map((d) => d.value);
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sigma = n > 1 ? Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / n) : mean * 0.3;
  const ucl = mean + 3 * sigma;
  const lcl = Math.max(0, mean - 3 * sigma);
  const yMin = 0;
  const yMax = Math.max(ucl * 1.18, mean + 1, 1);

  const W = 320, H = 180;
  const padL = 26, padR = 36, padT = 12, padB = 20;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xPos = (i) => padL + (n === 1 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yPos = (v) => padT + chartH - ((Math.min(Math.max(v, yMin), yMax) - yMin) / (yMax - yMin)) * chartH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(d.value).toFixed(1)}`).join(' ');

  const yTicks = [0, Math.round(mean * 10) / 10, Math.round(ucl * 10) / 10];
  if (lcl > 0) yTicks.push(Math.round(lcl * 10) / 10);

  const TIP_W = 120, TIP_H = 26;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setTooltip(null)}>
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
      <path d={linePath} fill="none" stroke="#0e1b4d" strokeWidth={1.5} strokeLinejoin="round" />

      {/* Data points with hover target */}
      {data.map((d, i) => {
        const out = d.value > ucl || (lcl > 0 && d.value < lcl);
        const cx = xPos(i), cy = yPos(d.value);
        return (
          <g key={i}
            onMouseEnter={() => setTooltip({ cx, cy, label: d.label, value: d.value })}
            onMouseLeave={() => setTooltip(null)}
          >
            <circle cx={cx} cy={cy} r={6} fill="transparent" />
            <circle cx={cx} cy={cy} r={2.5}
              fill={out ? '#ef4444' : '#0e1b4d'} stroke="white" strokeWidth={0.8} />
          </g>
        );
      })}

      {/* Axes */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />
      <line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="#d1d5db" strokeWidth={1} />

      {/* Y axis ticks */}
      {yTicks.map((t) => (
        <text key={t} x={padL - 3} y={yPos(t) + 3} textAnchor="end" fontSize={7} fill="#9ca3af">{t}</text>
      ))}


      {/* Tooltip */}
      {tooltip && (() => {
        const tx = Math.min(Math.max(tooltip.cx - TIP_W / 2, 2), W - TIP_W - 2);
        const ty = tooltip.cy - TIP_H - 6 < padT ? tooltip.cy + 8 : tooltip.cy - TIP_H - 6;
        return (
          <g pointerEvents="none">
            <rect x={tx} y={ty} width={TIP_W} height={TIP_H} rx={3} fill="#1f2937" opacity={0.9} />
            <text x={tx + TIP_W / 2} y={ty + 10} textAnchor="middle" fontSize={7} fill="white" fontWeight="bold">
              {tooltip.label}
            </text>
            <text x={tx + TIP_W / 2} y={ty + 20} textAnchor="middle" fontSize={7} fill="#fca5a5">
              {tooltip.value}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

function AlumniTab() {
  const [alumni, setAlumni] = useState([]);
  const [search, setSearch] = useState('');
  const [interestFilter, setInterestFilter] = useState('All');
  const [selected, setSelected] = useState(new Set());
  const [visibleCols, setVisibleCols] = useState(new Set(COLUMNS.map((c) => c.value)));
  const [chartView, setChartView] = useState('month');
  const [exportError, setExportError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const { sortField, sortDir, handleSort } = useSort('name', 'asc');

  useEffect(() => { setPage(1); }, [search, interestFilter, sortField, sortDir]);

  useEffect(() => {
    getAlumni({ search }).then((r) => {
      setAlumni(r.data);
      setSelected(new Set(r.data.map((a) => a.id)));
    }).catch(() => {});
  }, [search]);

  const filteredAlumni = (interestFilter === 'All'
    ? alumni
    : alumni.filter((a) => {
        const v = parseBioField(a.bio, 'Interested in KUANA Reunion 2027');
        return interestFilter === 'Unknown' ? !v : v === interestFilter;
      })
  ).slice().sort((a, b) => {
    let vA, vB;
    if (sortField === 'name') { vA = `${a.first_name} ${a.last_name}`.toLowerCase(); vB = `${b.first_name} ${b.last_name}`.toLowerCase(); }
    else {
      const col = COLUMNS.find((c) => c.value === sortField);
      if (col) { vA = col.sortVal(a); vB = col.sortVal(b); }
    }
    if (vA == null) return 1;
    if (vB == null) return -1;
    if (vA < vB) return sortDir === 'asc' ? -1 : 1;
    if (vA > vB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const allChecked = filteredAlumni.length > 0 && filteredAlumni.every((a) => selected.has(a.id));

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(filteredAlumni.map((a) => a.id)));
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

  const toggleCol = (value) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const activeCols = COLUMNS.filter((c) => visibleCols.has(c.value));

  const handleExport = () => {
    if (selected.size === 0) { setExportError('Please select at least one alumni to export.'); return; }
    if (activeCols.length === 0) { setExportError('Please select at least one column to export.'); return; }
    setExportError('');
    const rows = filteredAlumni.filter((a) => selected.has(a.id));
    const headers = ['Name', ...activeCols.map((c) => c.exportKey)];
    const sheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...rows.map((a) => [`${a.first_name} ${a.last_name}`, ...activeCols.map((c) => c.val(a))]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Alumni');
    XLSX.writeFile(wb, `kuana-alumni-${timestamp()}.xlsx`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">Alumni Directory <PageBadge page={page} total={filteredAlumni.length} /></h2>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d] w-52"
          />
          <select
            value={interestFilter}
            onChange={(e) => setInterestFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0e1b4d] bg-white"
          >
            <option value="All">Interest</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Maybe">Maybe</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Column visibility checkboxes */}
      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap mb-4 bg-gray-50 rounded-xl px-4 py-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">Columns:</span>
        {COLUMNS.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={visibleCols.has(value)}
              onChange={() => toggleCol(value)}
              className="accent-[#0e1b4d] cursor-pointer"
            />
            {label}
          </label>
        ))}
      </div>

      {exportError && <p className="text-red-500 text-sm mb-3">{exportError}</p>}
      {selected.size > 0 && <p className="text-xs text-gray-500 mb-3">{selected.size} alumni selected</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 px-2 w-8">
                <input type="checkbox" checked={allChecked} onChange={toggleAll} className="accent-[#0e1b4d] cursor-pointer" />
              </th>
              <SortTh field="name" label="Name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              {activeCols.map((c) => (
                <SortTh key={c.value} field={c.value} label={c.th} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAlumni.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((a) => {
              const interest = parseBioField(a.bio, 'Interested in KUANA Reunion 2027');
              const comment  = parseBioField(a.bio, 'Comment');
              const isSelected = selected.has(a.id);
              const colSpan = 2 + activeCols.length;
              return (
                <>
                  <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 ${isSelected ? 'bg-blue-50/40' : ''}`}>
                    <td className="py-3 px-2">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(a.id)} className="accent-[#0e1b4d] cursor-pointer" />
                    </td>
                    <td className="py-3 px-2 font-medium text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
                      {a.first_name} {a.last_name}
                    </td>
                    {visibleCols.has('email')      && <td className="py-3 px-2 text-gray-500">{a.email ?? '—'}</td>}
                    {visibleCols.has('phone')      && <td className="py-3 px-2 text-gray-500 whitespace-nowrap">{a.phone ?? '—'}</td>}
                    {visibleCols.has('grad_year')  && <td className="py-3 px-2 text-gray-500 text-center">{a.graduation_year ?? '—'}</td>}
                    {visibleCols.has('school')     && <td className="py-3 px-2 text-gray-500">{parseBioField(a.bio, 'School') ?? '—'}</td>}
                    {visibleCols.has('department') && <td className="py-3 px-2 text-gray-500">{parseBioField(a.bio, 'Department') ?? '—'}</td>}
                    {visibleCols.has('location')   && <td className="py-3 px-2 text-gray-500 whitespace-nowrap">{a.city ? `${a.city}, ${a.state_province ?? ''}` : '—'}</td>}
                    {visibleCols.has('interest')   && (
                      <td className="py-3 px-2">
                        {interest ? (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${REUNION_BADGE[interest] ?? 'bg-gray-100 text-gray-500'}`}>
                            {interest}
                          </span>
                        ) : '—'}
                      </td>
                    )}
                    {visibleCols.has('registered') && <td className="py-3 px-2 text-gray-400 text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleString()}</td>}
                  </tr>
                  {expanded === a.id && comment && (
                    <tr key={`${a.id}-comment`} className="bg-gray-50 border-b border-gray-100">
                      <td colSpan={colSpan} className="px-4 py-3 text-sm text-gray-600 italic">
                        <span className="font-semibold text-gray-500 not-italic">Comment: </span>{comment}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filteredAlumni.length === 0 && (
              <tr><td colSpan={2 + activeCols.length} className="text-center py-8 text-gray-400">No alumni found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={Math.ceil(filteredAlumni.length / PAGE_SIZE)} total={filteredAlumni.length}
        onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
    </div>
  );
}

function MessageModal({ message, onClose, onToggleRead }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {!message.is_read && <div className="w-2 h-2 rounded-full bg-[#0e1b4d] flex-shrink-0" />}
              <h3 className={`text-lg text-gray-900 ${message.is_read ? 'font-semibold' : 'font-bold'}`}>
                {message.name}
              </h3>
            </div>
            <a href={`mailto:${message.email}`} className="text-sm text-[#0e1b4d] hover:underline">
              {message.email}
            </a>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0 mt-1">
            ✕
          </button>
        </div>

        {/* Subject */}
        {message.subject && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Subject</span>
            <p className="text-gray-800 text-sm mt-0.5 font-medium">{message.subject}</p>
          </div>
        )}

        {/* Message body */}
        <div className="mb-5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Message</span>
          <p className="text-gray-700 text-sm mt-1 leading-relaxed whitespace-pre-wrap">{message.message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-gray-400 text-xs">{new Date(message.created_at).toLocaleString()}</span>
          <button
            onClick={() => onToggleRead(message)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              message.is_read
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-[#0e1b4d]/10 text-[#0e1b4d] hover:bg-[#060c22]/20'
            }`}
          >
            <Eye size={13} />
            {message.is_read ? 'Mark as Unread' : 'Mark as Read'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const { sortField, sortDir, handleSort } = useSort('time', 'desc');
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [sortField, sortDir]);

  useEffect(() => {
    getMessages().then((r) => setMessages(r.data)).catch(() => {});
  }, []);

  const sorted = [...messages].sort((a, b) => {
    let valA, valB;
    if (sortField === 'name')    { valA = a.name.toLowerCase();          valB = b.name.toLowerCase(); }
    if (sortField === 'subject') { valA = (a.subject ?? '').toLowerCase(); valB = (b.subject ?? '').toLowerCase(); }
    if (sortField === 'time')    { valA = new Date(a.created_at);        valB = new Date(b.created_at); }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const openMessage = async (m) => {
    setSelected(m);
    if (!m.is_read) {
      try {
        await markMessageRead(m.id);
        setMessages((prev) => prev.map((x) => x.id === m.id ? { ...x, is_read: true } : x));
        setSelected((prev) => prev ? { ...prev, is_read: true } : prev);
      } catch {}
    }
  };

  const handleToggleRead = async (m) => {
    try {
      if (m.is_read) {
        await markMessageUnread(m.id);
        setMessages((prev) => prev.map((x) => x.id === m.id ? { ...x, is_read: false } : x));
        setSelected((prev) => prev ? { ...prev, is_read: false } : prev);
      } else {
        await markMessageRead(m.id);
        setMessages((prev) => prev.map((x) => x.id === m.id ? { ...x, is_read: true } : x));
        setSelected((prev) => prev ? { ...prev, is_read: true } : prev);
      }
    } catch {}
  };


  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Messages <PageBadge page={page} total={sorted.length} /></h2>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 mb-1">
        <div className="w-2 flex-shrink-0" />
        <div className="flex-shrink-0 w-36">
          <SortTh field="name" label="Name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
        </div>
        <div className="flex-1">
          <SortTh field="subject" label="Subject" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
        </div>
        <SortTh field="time" label="Time" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
      </div>

      <div className="space-y-1">
        {sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((m) => (
          <div
            key={m.id}
            onClick={() => openMessage(m)}
            className={`rounded-xl border px-4 py-3 cursor-pointer transition-colors hover:border-[#0e1b4d]/30 hover:bg-[#060c22]/5 flex items-center gap-3 ${
              m.is_read ? 'border-gray-100 bg-white' : 'border-[#0e1b4d]/20 bg-[#0e1b4d]/5'
            }`}
          >
            {!m.is_read
              ? <div className="w-2 h-2 rounded-full bg-[#0e1b4d] flex-shrink-0" />
              : <div className="w-2 flex-shrink-0" />}
            <span className={`text-sm text-gray-900 flex-shrink-0 w-36 truncate ${m.is_read ? 'font-medium' : 'font-bold'}`}>
              {m.name}
            </span>
            <span className={`text-sm flex-1 truncate ${m.is_read ? 'text-gray-400' : 'text-gray-700 font-semibold'}`}>
              {m.subject ?? '(no subject)'}
            </span>
            <span className="text-gray-400 text-xs whitespace-nowrap flex-shrink-0">
              {new Date(m.created_at).toLocaleString()}
            </span>
          </div>
        ))}
        {sorted.length === 0 && <div className="text-gray-400 text-sm text-center py-8">No messages yet.</div>}
      </div>
      <Pagination page={page} totalPages={Math.ceil(sorted.length / PAGE_SIZE)} total={sorted.length}
        onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />

      {selected && (
        <MessageModal
          message={selected}
          onClose={() => setSelected(null)}
          onToggleRead={handleToggleRead}
        />
      )}
    </div>
  );
}

function DonationsTab() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const { sortField, sortDir, handleSort } = useSort('date', 'desc');

  useEffect(() => { setPage(1); }, [sortField, sortDir]);

  useEffect(() => {
    getDonations().then((r) => setDonations(r.data)).catch(() => {});
    getDonationStats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Donations <PageBadge page={page} total={donations.length} /></h2>
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Donations', value: stats.total_donations },
            { label: 'Total Amount', value: `$${parseFloat(stats.total_amount || 0).toLocaleString()}` },
            { label: 'Avg Donation', value: `$${parseFloat(stats.average_amount || 0).toFixed(0)}` },
            { label: 'Unique Donors', value: stats.unique_donors },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#0e1b4d]/5 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-[#0e1b4d]">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <SortTh field="donor"   label="Donor"   sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortTh field="amount"  label="Amount"  sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortTh field="purpose" label="Purpose" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              <SortTh field="date"    label="Date"    sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {[...donations].sort((a, b) => {
              let vA, vB;
              if (sortField === 'donor')   { vA = a.donor_name.toLowerCase();   vB = b.donor_name.toLowerCase(); }
              if (sortField === 'amount')  { vA = parseFloat(a.amount);          vB = parseFloat(b.amount); }
              if (sortField === 'purpose') { vA = (a.purpose ?? '').toLowerCase(); vB = (b.purpose ?? '').toLowerCase(); }
              if (sortField === 'date')    { vA = new Date(a.donated_at);        vB = new Date(b.donated_at); }
              if (vA < vB) return sortDir === 'asc' ? -1 : 1;
              if (vA > vB) return sortDir === 'asc' ? 1 : -1;
              return 0;
            }).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((d) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-2">
                  <div className="font-medium text-gray-900">{d.donor_name}</div>
                  <div className="text-gray-400 text-xs">{d.donor_email}</div>
                </td>
                <td className="py-3 px-2 font-bold text-[#0e1b4d]">${parseFloat(d.amount).toLocaleString()}</td>
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
      <Pagination page={page} totalPages={Math.ceil(donations.length / PAGE_SIZE)} total={donations.length}
        onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
    </div>
  );
}

function SummaryTab() {
  const [alumni, setAlumni] = useState([]);
  const [messages, setMessages] = useState([]);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [chartView, setChartView] = useState('month');
  const chartRef = useRef(null);

  useEffect(() => {
    getAlumni({}).then((r) => setAlumni(r.data)).catch(() => {});
    getMessages().then((r) => setMessages(r.data)).catch(() => {});
    getDonations().then((r) => setDonations(r.data)).catch(() => {});
    getEvents().then((r) => setEvents(r.data)).catch(() => {});
  }, []);

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

  const handleToggleFeatured = async (ev) => {
    if (ev.is_featured) return;
    try {
      const res = await toggleEventFeatured(ev.id, true);
      setEvents((prev) => prev.map((e) => e.id === ev.id ? res.data : { ...e, is_featured: false }));
    } catch { alert('Could not update featured event. Please try again.'); }
  };

  const latestMessages  = [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const latestDonations = [...donations].sort((a, b) => new Date(b.donated_at) - new Date(a.donated_at)).slice(0, 5);
  const latestEvents    = [...events].sort((a, b) => new Date(b.event_date) - new Date(a.event_date)).slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

      {/* Alumni Chart */}
      <div ref={chartRef} className="bg-gray-50 rounded-xl px-4 pt-3 pb-3 w-3/4">
        <div className="flex items-center justify-between mb-2">
          <select
            value={chartView}
            onChange={(e) => setChartView(e.target.value)}
            className="text-xs font-bold text-gray-500 uppercase tracking-wide bg-transparent border-none outline-none cursor-pointer"
          >
            {CHART_VIEWS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={downloadChartImage}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0e1b4d] transition-colors cursor-pointer"
          >
            <Download size={12} /> Save Image
          </button>
        </div>
        <ControlChart data={getChartData(alumni, chartView)} />
      </div>

      {/* Latest 5 panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Latest Events */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Latest Events</h3>
          <div className="space-y-2">
            {latestEvents.length === 0 && <p className="text-gray-400 text-sm">No events yet.</p>}
            {latestEvents.map((ev) => (
              <div key={ev.id} className="bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 leading-snug">{ev.title}</span>
                  <button
                    onClick={() => handleToggleFeatured(ev)}
                    title={ev.is_featured ? 'Featured' : 'Set as featured'}
                    className={`flex-shrink-0 transition-colors mt-0.5 ${ev.is_featured ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <Star
                      size={15}
                      className={ev.is_featured ? 'text-[#ffc31d]' : 'text-gray-300 hover:text-[#ffc31d]'}
                      fill={ev.is_featured ? '#ffc31d' : 'none'}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{ev.city}{ev.state_province ? `, ${ev.state_province}` : ''}</p>
                <p className="text-xs text-gray-300 mt-0.5">{new Date(ev.event_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Messages */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Latest Messages</h3>
          <div className="space-y-2">
            {latestMessages.length === 0 && <p className="text-gray-400 text-sm">No messages yet.</p>}
            {latestMessages.map((m) => (
              <div key={m.id} className="bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {!m.is_read && <div className="w-1.5 h-1.5 rounded-full bg-[#0e1b4d] flex-shrink-0" />}
                  <span className={`text-sm text-gray-900 truncate ${m.is_read ? 'font-medium' : 'font-bold'}`}>{m.name}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{m.subject ?? '(no subject)'}</p>
                <p className="text-xs text-gray-300 mt-0.5">{new Date(m.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Donations */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Latest Donations</h3>
          <div className="space-y-2">
            {latestDonations.length === 0 && <p className="text-gray-400 text-sm">No donations yet.</p>}
            {latestDonations.map((d) => (
              <div key={d.id} className="bg-white rounded-lg px-3 py-2.5 border border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">{d.donor_name}</span>
                  <span className="text-sm font-bold text-[#0e1b4d] flex-shrink-0">${parseFloat(d.amount).toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">{new Date(d.donated_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match');
      return;
    }
    if (form.new_password.length < 10) {
      setError('New password must be at least 10 characters');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ current_password: form.current_password, new_password: form.new_password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold mb-2">Password changed successfully!</div>
            <button onClick={onClose} className="mt-2 px-5 py-2 bg-[#0e1b4d] text-white rounded-lg text-sm font-semibold hover:bg-[#060c22] cursor-pointer">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={form.current_password}
                  onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0e1b4d] pr-10"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">New Password <span className="text-gray-400 font-normal">(min 10 chars)</span></label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0e1b4d] pr-10"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={form.confirm_password}
                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0e1b4d]"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#0e1b4d] text-white font-semibold rounded-lg text-sm hover:bg-[#060c22] disabled:opacity-60 cursor-pointer">
                {loading ? 'Saving...' : 'Change Password'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: 'summary',   label: 'Summary',   icon: LayoutDashboard },
  { id: 'alumni',    label: 'Alumni',    icon: Users },
  { id: 'events',    label: 'Events',    icon: Calendar },
  { id: 'messages',  label: 'Messages',  icon: MessageCircle },
  { id: 'donations', label: 'Donations', icon: Heart },
];

export default function Admin() {
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState('summary');
  const [showChangePw, setShowChangePw] = useState(false);

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
    <>
    {showChangePw && <ChangePasswordModal onClose={() => setShowChangePw(false)} />}
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-[#0e1b4d] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="https://kuana.org/assets/img/KUANA.png" alt="KUANA Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">{admin.email}</span>
          <button onClick={() => setShowChangePw(true)} className="flex items-center gap-1 text-white/70 hover:text-white text-sm cursor-pointer transition-colors">
            <KeyRound size={15} /> Change Password
          </button>
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
                tab === id ? 'bg-[#0e1b4d] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {tab === 'summary'   && <SummaryTab />}
          {tab === 'events'    && <EventsTab />}
          {tab === 'alumni'    && <AlumniTab />}
          {tab === 'messages'  && <MessagesTab />}
          {tab === 'donations' && <DonationsTab />}
        </div>
      </div>
    </div>
    </>
  );
}
