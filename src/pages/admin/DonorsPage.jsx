import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import Loader from '../../components/Loader';

async function downloadCSV(params) {
  const res = await api.get('/admin/donors/export', {
    params,
    responseType: 'blob',
  });
  const url  = URL.createObjectURL(new Blob([res.data], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `donors_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const EMPTY_FILTERS = { blood_type: '', available: '', division: '', district: '', upazila: '', page: 1 };

function SortIcon({ active, dir }) {
  if (!active) {
    return (
      <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return dir === 'asc' ? (
    <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function SortableHeader({ label, field, sort, onSort, className = '' }) {
  const active = sort.by === field;
  return (
    <th
      className={`px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none group ${className}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className={active ? 'text-red-600' : 'group-hover:text-gray-700 transition-colors'}>{label}</span>
        <SortIcon active={active} dir={sort.dir} />
      </span>
    </th>
  );
}

function SelectFilter({ label, value, onChange, options, disabled, placeholder }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-0.5">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm text-gray-700 appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function AdminDonorsPage() {
  const [donors, setDonors]       = useState([]);
  const [meta, setMeta]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filters, setFilters]     = useState(EMPTY_FILTERS);
  const [sort, setSort]           = useState({ by: 'created_at', dir: 'desc' });

  // Location lists (cascading)
  const [divisions, setDivisions]   = useState([]);
  const [districts, setDistricts]   = useState([]);
  const [upazilas, setUpazilas]     = useState([]);
  const [locLoading, setLocLoading] = useState({ district: false, upazila: false });

  const [deletingId, setDeletingId] = useState(null);
  const [exporting, setExporting]   = useState(false);

  const buildParams = (f, s, srt) => ({
    ...f,
    search:   s,
    sort_by:  srt.by,
    sort_dir: srt.dir,
  });

  const load = (f = filters, s = search, srt = sort) => {
    setLoading(true);
    api.get('/admin/donors', { params: buildParams(f, s, srt) })
      .then(r => {
        setDonors(r.data.donors.data);
        setMeta(r.data.donors);
        if (r.data.divisions?.length && divisions.length === 0) {
          setDivisions(r.data.divisions);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // When division changes: load districts, clear district+upazila
  const handleDivisionChange = async (division) => {
    const f = { ...filters, division, district: '', upazila: '', page: 1 };
    setFilters(f);
    setDistricts([]);
    setUpazilas([]);

    if (division) {
      setLocLoading(l => ({ ...l, district: true }));
      try {
        const r = await api.get(`/locations/districts/${encodeURIComponent(division)}`);
        setDistricts(Array.isArray(r.data) ? r.data : []);
      } finally {
        setLocLoading(l => ({ ...l, district: false }));
      }
    }
    load(f, search, sort);
  };

  // When district changes: load upazilas, clear upazila
  const handleDistrictChange = async (district) => {
    const f = { ...filters, district, upazila: '', page: 1 };
    setFilters(f);
    setUpazilas([]);

    if (district) {
      setLocLoading(l => ({ ...l, upazila: true }));
      try {
        const r = await api.get(`/locations/upazilas/${encodeURIComponent(district)}`);
        setUpazilas(Array.isArray(r.data) ? r.data : []);
      } finally {
        setLocLoading(l => ({ ...l, upazila: false }));
      }
    }
    load(f, search, sort);
  };

  const handleUpazilaChange = (upazila) => {
    const f = { ...filters, upazila, page: 1 };
    setFilters(f);
    load(f, search, sort);
  };

  const handleSort = (field) => {
    const next = { by: field, dir: sort.by === field && sort.dir === 'asc' ? 'desc' : 'asc' };
    const f    = { ...filters, page: 1 };
    setSort(next);
    setFilters(f);
    load(f, search, next);
  };

  const deleteDonor = async (id) => {
    if (!window.confirm('Delete this donor? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/donors/${id}`);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilters(EMPTY_FILTERS);
    setDistricts([]);
    setUpazilas([]);
    const srt = { by: 'created_at', dir: 'desc' };
    setSort(srt);
    load(EMPTY_FILTERS, '', srt);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadCSV(buildParams(filters, search, sort));
    } finally {
      setExporting(false);
    }
  };

  const hasLocationFilter = filters.division || filters.district || filters.upazila;
  const hasAnyFilter      = search || filters.blood_type || filters.available || hasLocationFilter;
  const activeFilterCount = [search, filters.blood_type, filters.available, filters.division, filters.district, filters.upazila]
    .filter(Boolean).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Donors</h1>
          {meta && <p className="text-sm text-gray-500 mt-0.5">{meta.total} donors total</p>}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 border border-gray-200 bg-white hover:border-green-300 hover:text-green-700 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-60 flex-shrink-0"
          title="Export current results to CSV"
        >
          {exporting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </>
          )}
        </button>
      </div>

      {/* ── Filter panel ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 space-y-4">

        {/* Row 1: search + quick filters */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative flex-1 min-w-52">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load(filters, search)}
            />
          </div>

          <select
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm text-gray-700 appearance-none"
            value={filters.blood_type}
            onChange={e => { const f = { ...filters, blood_type: e.target.value, page: 1 }; setFilters(f); load(f, search, sort); }}
          >
            <option value="">All Blood Types</option>
            {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
          </select>

          <select
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm text-gray-700 appearance-none"
            value={filters.available}
            onChange={e => { const f = { ...filters, available: e.target.value, page: 1 }; setFilters(f); load(f, search, sort); }}
          >
            <option value="">All Status</option>
            <option value="1">Available</option>
            <option value="0">Unavailable</option>
          </select>

          <button
            onClick={() => load(filters, search)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Search
          </button>
          {hasAnyFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 font-medium px-3 py-2.5 rounded-xl text-sm transition-colors border border-gray-200 hover:border-gray-300"
            >
              Clear
              {activeFilterCount > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Row 2: location filters */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Filter by Location
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SelectFilter
              label="Division"
              value={filters.division}
              onChange={handleDivisionChange}
              options={divisions}
              placeholder="All Divisions"
            />
            <SelectFilter
              label="District"
              value={filters.district}
              onChange={handleDistrictChange}
              options={districts}
              disabled={!filters.division || locLoading.district}
              placeholder={
                !filters.division    ? 'Select division first'
                : locLoading.district ? 'Loading...'
                : districts.length === 0 ? 'No districts'
                : 'All Districts'
              }
            />
            <SelectFilter
              label="Upazila"
              value={filters.upazila}
              onChange={handleUpazilaChange}
              options={upazilas}
              disabled={!filters.district || locLoading.upazila}
              placeholder={
                !filters.district    ? 'Select district first'
                : locLoading.upazila  ? 'Loading...'
                : upazilas.length === 0 ? 'No upazilas'
                : 'All Upazilas'
              }
            />
          </div>

          {/* Active location breadcrumb */}
          {hasLocationFilter && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {[filters.division, filters.district, filters.upazila].filter(Boolean).map((loc, i, arr) => (
                <span key={loc} className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">{loc}</span>
                  {i < arr.length - 1 && <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Active sort indicator */}
        {sort.by !== 'created_at' && (
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
            <span className="text-xs text-gray-400">Sorted by</span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              {sort.by.replace('_', ' ')} ({sort.dir})
              <button onClick={clearFilters} className="ml-0.5 text-red-400 hover:text-red-600 transition-colors" title="Reset sort">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-16"><Loader fullPage={false} /></div>
        ) : donors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No donors found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <SortableHeader label="Donor"    field="name"         sort={sort} onSort={handleSort} className="px-5" />
                  <SortableHeader label="Blood"    field="blood_type"   sort={sort} onSort={handleSort} />
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Phone</th>
                  <SortableHeader label="Division" field="division"     sort={sort} onSort={handleSort} className="hidden lg:table-cell" />
                  <SortableHeader label="District" field="district"     sort={sort} onSort={handleSort} className="hidden md:table-cell" />
                  <SortableHeader label="Upazila"  field="upazila"      sort={sort} onSort={handleSort} className="hidden xl:table-cell" />
                  <SortableHeader label="Status"   field="is_available" sort={sort} onSort={handleSort} />
                  <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donors.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">
                            {d.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{d.name}</p>
                          <p className="text-xs text-gray-400">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-[10px] leading-none">{d.blood_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">{d.phone ?? '—'}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {d.division
                        ? <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">{d.division}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 hidden md:table-cell">{d.district ?? '—'}</td>
                    <td className="px-4 py-3.5 text-gray-500 hidden xl:table-cell">{d.upazila ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        d.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.is_available ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {d.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => deleteDonor(d.id)}
                        disabled={deletingId === d.id}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete donor"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-4 flex justify-center items-center gap-1.5">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { const f = { ...filters, page: p }; setFilters(f); load(f, search, sort); }}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                p === meta.current_page
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-200 hover:text-red-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
