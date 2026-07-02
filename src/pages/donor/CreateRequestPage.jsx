import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernHeader from '../../components/ModernHeader';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import MapPicker from '../../components/MapPicker';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function DonorCreateRequestPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    disease:           '',
    blood_type:        '',
    blood_quantity:    1,
    is_emergency:      false,
    needed_date:       '',
    hospital_name:     '',
    hospital_location: '',
    district:          '',
    upazila:           '',
    contact_number:    user?.phone ?? '',
    additional_notes:  '',
  });

  const [allDistricts, setAllDistricts] = useState([]);
  const [upazilas, setUpazilas]         = useState([]);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [showMap, setShowMap]           = useState(false);

  useEffect(() => {
    api.get('/locations/districts')
      .then(({ data }) => setAllDistricts([...data].sort()))
      .catch(() => {});
  }, []);

  const onDistrictChange = async (val) => {
    setForm(f => ({ ...f, district: val, upazila: '' }));
    setUpazilas([]);
    if (val) {
      const { data } = await api.get(`/locations/upazilas/${val}`);
      setUpazilas(data);
    }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await api.post('/donor/blood-requests', {
        patient_name:      user?.name || 'Patient',
        disease:           form.disease,
        blood_type:        form.blood_type,
        blood_quantity:    Number(form.blood_quantity),
        is_emergency:      form.is_emergency,
        needed_date:       form.is_emergency ? undefined : form.needed_date || undefined,
        hospital_name:     form.hospital_name,
        hospital_location: form.hospital_location,
        district:          form.district,
        upazila:           form.upazila,
        contact_number:    form.contact_number,
        additional_notes:  form.additional_notes || undefined,
      });
      navigate('/donor/my-requests');
    } catch (err) {
      const d = err.response?.data;
      if (d?.errors) setErrors(d.errors);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key) =>
    `w-full border rounded-xl py-3 px-4 text-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${errors[key] ? 'border-red-400' : 'border-gray-200'}`;

  const selectCls = (key) =>
    `w-full border rounded-xl py-3 px-3 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition ${errors[key] ? 'border-red-400' : 'border-gray-200'}`;

  const Field = ({ label, error, children, required = true }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <ModernHeader title="Request Blood" />
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pb-10">

        <form onSubmit={handleSubmit} className="px-5 pt-5 space-y-3">

          {/* Emergency toggle */}
          <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-colors ${form.is_emergency ? 'bg-red-600 border-red-600' : 'bg-white border-gray-200'}`}>
            <input type="checkbox" checked={form.is_emergency} onChange={e => setForm(f => ({ ...f, is_emergency: e.target.checked }))} className="sr-only" />
            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 ${form.is_emergency ? 'bg-white border-white' : 'border-gray-300'}`}>
              {form.is_emergency && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-sm font-bold ${form.is_emergency ? 'text-white' : 'text-gray-800'}`}>Emergency Request</p>
              <p className={`text-xs ${form.is_emergency ? 'text-red-100' : 'text-gray-400'}`}>Needed immediately — donors notified urgently</p>
            </div>
          </label>

          {/* Blood */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
            <Field label="Blood Group" error={errors.blood_type}>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {BLOOD_TYPES.map(bt => (
                  <button key={bt} type="button" onClick={() => setForm(f => ({ ...f, blood_type: bt }))}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${form.blood_type === bt ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-red-300'}`}>
                    {bt}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Units Needed" error={errors.blood_quantity}>
              <div className="relative">
                <select className={selectCls('blood_quantity')} value={form.blood_quantity} onChange={e => setForm(f => ({ ...f, blood_quantity: parseInt(e.target.value) }))} required>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'unit' : 'units'}</option>)}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400"><ChevronDown /></span>
              </div>
            </Field>
          </div>

          {/* Condition */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <Field label="Disease / Condition" error={errors.disease}>
              <input type="text" className={inputCls('disease')} placeholder="e.g. Surgery, Accident, Thalassemia" value={form.disease} onChange={set('disease')} required />
            </Field>
          </div>

          {/* Hospital */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hospital</p>

            <Field label="Hospital Name" error={errors.hospital_name}>
              <input type="text" className={inputCls('hospital_name')} placeholder="Enter hospital name" value={form.hospital_name} onChange={set('hospital_name')} required />
            </Field>

            <Field label="Hospital Location" error={errors.hospital_location}>
              <div className="flex gap-2">
                <input type="text" className={`${inputCls('hospital_location')} flex-1`} placeholder="e.g. Road 5, Mirpur, Dhaka" value={form.hospital_location} onChange={set('hospital_location')} required />
                <button type="button" onClick={() => setShowMap(true)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Map
                </button>
              </div>
            </Field>

            {/* District + Upazila only */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">District<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                  <select
                    className={`${selectCls('district')} text-xs px-2 pr-6`}
                    value={form.district}
                    onChange={e => onDistrictChange(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <span className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Upazila<span className="text-red-500 ml-0.5">*</span></label>
                <div className="relative">
                  <select
                    className={`${selectCls('upazila')} text-xs px-2 pr-6`}
                    value={form.upazila}
                    onChange={set('upazila')}
                    disabled={!form.district}
                    required
                  >
                    <option value="">Select</option>
                    {upazilas.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <span className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
                {errors.upazila && <p className="text-red-500 text-xs mt-1">{errors.upazila[0]}</p>}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact & Schedule</p>

            <Field label="Contact Number" error={errors.contact_number}>
              <input type="tel" className={inputCls('contact_number')} placeholder="01XXXXXXXXX" value={form.contact_number} onChange={set('contact_number')} required />
            </Field>

            {!form.is_emergency && (
              <Field label="Need By" error={errors.needed_date}>
                <input type="date" className={inputCls('needed_date')} value={form.needed_date} onChange={set('needed_date')} min={new Date().toISOString().split('T')[0]} />
              </Field>
            )}

            <Field label="Additional Notes" error={errors.additional_notes} required={false}>
              <textarea className={`${inputCls('additional_notes')} resize-none`} rows={2} placeholder="Any other info for the donor..." value={form.additional_notes} onChange={set('additional_notes')} />
            </Field>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || !form.blood_type}
            className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white font-bold py-4 rounded-xl transition-colors text-base flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {loading ? 'Posting request...' : 'Post Request'}
          </button>

          <div className="pb-4" />
        </form>
      </div>

      {showMap && (
        <MapPicker
          initialAddress={form.hospital_location}
          onConfirm={(address) => {
            setForm(f => ({ ...f, hospital_location: address }));
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}
      </div>
    </div>
  );
}
