import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import ModernHeader from '../../components/ModernHeader';
import Loader from '../../components/Loader';
import SearchableSelect from '../../components/SearchableSelect';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// Icons
function IconCamera() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}
function IconEmail() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>; }
function IconPhone() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>; }
function IconLocation() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>; }
function IconCalendar() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>; }
function IconPerson() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>; }
function IconGender() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="10" r="4"></circle><path d="M12 14v7"></path><path d="M9 18h6"></path></svg>; }
function IconDrop() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>; }
function IconSave() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>; }

function getInitials(name) {
  return (name || '').split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase() || '?';
}

function Toggle({ checked, onChange }) {
  return (
    <button 
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// Custom Input Row Component
const FormRow = ({ icon, label, children, error }) => (
  <div className="flex flex-col mb-1 py-1.5 border-b border-gray-50 last:border-0">
    <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-2 md:gap-4">
      <div className="flex items-center gap-3 w-40 flex-shrink-0 pt-2 md:pt-0">
        {icon}
        <span className="text-sm text-gray-700 font-medium whitespace-nowrap">{label}</span>
      </div>
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
    {error && <p className="text-red-500 text-xs mt-1 md:ml-[172px]">{error[0]}</p>}
  </div>
);

export default function DonorEditProfilePage() {
  const { refreshUser } = useAuth();
  const navigate        = useNavigate();
  const locationState   = useLocation();
  const isNewUser       = !!locationState.state?.newUser;

  const [form, setForm]           = useState(null);
  const [donorData, setDonorData] = useState(null); // original data for display header
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas]   = useState([]);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState('');
  
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const compressedBlob = await compressImage(file);
      const formData = new FormData();
      formData.append('photo', compressedBlob, file.name);

      const { data } = await api.post('/donor/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setDonorData(d => ({ ...d, photo_url: data.photo_url }));
      setForm(f => ({ ...f, photo_url: data.photo_url }));
      await refreshUser();
    } catch (err) {
      console.error(err);
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  useEffect(() => {
    Promise.all([
      api.get('/donor/profile'),
      api.get('/locations/districts') // Fetch all districts on load
    ]).then(([profileRes, districtsRes]) => {
      const donor = profileRes.data.donor;
      setDonorData(donor);
      let height_feet = '';
      let height_inches = '';
      if (donor.height_cm) {
        height_feet = Math.floor(donor.height_cm / 30.48);
        height_inches = Math.round((donor.height_cm % 30.48) / 2.54);
        if (height_inches === 12) {
          height_feet += 1;
          height_inches = 0;
        }
      }
      setForm({ ...donor, height_feet, height_inches });
      setDistricts(districtsRes.data ?? []);

      if (donor.district) {
        api.get(`/locations/upazilas/${donor.district}`).then(r2 => setUpazilas(r2.data));
      }
    }).finally(() => setLoading(false));
  }, []);

  const onDistrictChange = async (val) => {
    setForm(f => ({ ...f, district: val, upazila: '' }));
    setUpazilas([]);
    if (val) {
      const { data } = await api.get(`/locations/upazilas/${val}`);
      setUpazilas(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');
    setSaving(true);
    try {
      const feet = parseInt(form.height_feet) || 0;
      const inches = parseInt(form.height_inches) || 0;
      const payload = {
        name:               form.name               || null,
        phone:              form.phone              || null,
        address:            form.address            || null,
        district:           form.district           || null,
        upazila:            form.upazila            || null,
        blood_type:         form.blood_type         || null,
        gender:             form.gender             || null,
        weight_kg:          form.weight_kg          || null,
        age:                form.age                || null,
        is_available:       form.is_available       ?? false,
        share_phone:        form.share_phone        ?? true,
        last_donation_date: form.last_donation_date
          ? form.last_donation_date.split('T')[0]
          : null,
        height_cm: (feet || inches)
          ? Math.round(feet * 30.48 + inches * 2.54) || null
          : null,
      };

      const { data } = await api.put('/donor/profile', payload);

      // If last_donation_date was set or changed, log it as a donation record too
      const originalDate = donorData.last_donation_date?.split('T')[0];
      if (payload.last_donation_date && payload.last_donation_date !== originalDate) {
        await api.post('/donor/donations', { donation_date: payload.last_donation_date }).catch(() => {});
      }

      setSuccess(data.message);
      await refreshUser();

      setTimeout(() => navigate(isNewUser ? '/donor/getting-started' : '/donor/profile'), 1000);
    } catch (err) {
      const d = err.response?.data;
      if (d?.errors) setErrors(d.errors);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form || !donorData) {
    return <Loader />;
  }

  const memberSince = donorData.created_at ? new Date(donorData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown';
  const displayLocation = [donorData.upazila, donorData.district].filter(Boolean).join(', ') || 'Not Provided';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <ModernHeader
        title={isNewUser ? 'Complete Profile' : 'Edit Profile'}
        rightNode={
          !isNewUser && (
            <button onClick={() => navigate('/donor/profile')} className="text-red-600 font-bold text-sm px-2 py-1">
              Cancel
            </button>
          )
        }
      />

      {isNewUser && (
        <div className="bg-blue-50 text-blue-800 p-4 mx-4 mt-4 rounded-xl shadow-sm border border-blue-100">
          <h2 className="font-bold mb-1 text-lg">Welcome! Please complete your profile.</h2>
          <p className="text-sm">We need your full location and details to match you with blood requests.</p>
        </div>
      )}

      {locationState.state?.message && !isNewUser && !success && (
        <div className="bg-blue-50 text-blue-700 p-4 mx-4 mt-4 rounded-xl shadow-sm border border-blue-100 font-medium text-center">
          {locationState.state.message}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 mx-4 mt-4 rounded-xl shadow-sm border border-green-100 font-medium text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto p-4 pb-20 md:pb-4 space-y-4">
          
          {/* ── PROFILE CARD HEADER ── */}
          <div className="bg-[#FFF5F5] rounded-3xl p-5 relative overflow-hidden">
            {/* Watermark Drop SVG */}
            <div className="absolute right-0 top-4 text-red-100 pointer-events-none" style={{ transform: 'scale(1.5) translate(20%, 0)' }}>
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
              </svg>
            </div>

            <div className="relative z-10 flex gap-4 items-start">
              <div className="relative flex-shrink-0 cursor-pointer group" onClick={() => !uploadingPhoto && fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="w-[84px] h-[84px] bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden shadow-sm border-2 border-white group-hover:opacity-90 transition-opacity">
                  {uploadingPhoto ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  ) : donorData.photo_url ? (
                    <img src={donorData.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(donorData.name)
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 group-hover:text-red-600 transition-colors">
                  <IconCamera />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-gray-900 mb-2 leading-none">{donorData.name}</h2>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-100 text-red-600 font-extrabold text-[11px] px-2 py-0.5 rounded shadow-sm">
                    {donorData.blood_type || 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1 bg-green-50 text-green-600 font-bold text-[10px] px-2 py-0.5 rounded border border-green-100 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Verified
                  </span>
                </div>
                
                <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-2">
                    <IconEmail />
                    <span className="truncate">{donorData.email}</span>
                  </div>
                  {donorData.phone && (
                    <div className="flex items-center gap-2">
                      <IconPhone />
                      <span className="truncate">{donorData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <IconLocation />
                    <span className="truncate">{displayLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCalendar />
                    <span className="truncate">Member since: {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── PERSONAL INFORMATION FORM ── */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="space-y-1">
              <FormRow icon={<IconPerson />} label="Full Name" error={errors.name}>
                <input type="text" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                  value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter your name" />
              </FormRow>

              <FormRow icon={<IconEmail />} label="Email Address">
                <input type="email" className="w-full text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 outline-none cursor-not-allowed"
                  value={form.email ?? ''} readOnly />
              </FormRow>

              <FormRow icon={<IconPhone />} label="Phone Number" error={errors.phone}>
                <input type="text" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                  value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="01XXX-XXXXXX" />
              </FormRow>

              <FormRow icon={<IconGender />} label="Gender" error={errors.gender}>
                <select className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all appearance-none bg-no-repeat" 
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                  value={form.gender ?? ''} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FormRow>

              <FormRow icon={<IconDrop />} label="Blood Group" error={errors.blood_type}>
                <select className="w-full text-sm font-semibold text-red-600 bg-red-50/50 border border-red-100 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all appearance-none bg-no-repeat" 
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23DC2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                  value={form.blood_type ?? ''} onChange={e => setForm(f => ({ ...f, blood_type: e.target.value }))}>
                  <option value="">Select</option>
                  {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </FormRow>

              <FormRow icon={<IconCalendar />} label="Age" error={errors.age}>
                <input type="number" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                  value={form.age ?? ''} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Years" />
              </FormRow>

              <FormRow icon={<IconPerson />} label="Weight (kg)" error={errors.weight_kg}>
                <input type="number" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                  value={form.weight_kg ?? ''} onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))} placeholder="kg" />
              </FormRow>

              <FormRow icon={<IconPerson />} label="Height" error={errors.height_cm}>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input type="number" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                      value={form.height_feet ?? ''} onChange={e => setForm(f => ({ ...f, height_feet: e.target.value }))} placeholder="Feet" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">ft</span>
                  </div>
                  <div className="flex-1 relative">
                    <input type="number" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all" 
                      value={form.height_inches ?? ''} onChange={e => setForm(f => ({ ...f, height_inches: e.target.value }))} placeholder="Inches" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">in</span>
                  </div>
                </div>
              </FormRow>

              <FormRow icon={<IconCalendar />} label="Last Donation" error={errors.last_donation_date}>
                <input type="date" className="w-full text-sm text-gray-800 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                  value={form.last_donation_date ? form.last_donation_date.split('T')[0] : ''} onChange={e => setForm(f => ({ ...f, last_donation_date: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1.5">Changing this adds an entry to your donation history.</p>
              </FormRow>
            </div>
          </div>

          {/* ── LOCATION FORM ── */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Location</h3>
            
            <div className="space-y-1">
              <FormRow icon={<IconLocation />} label="District" error={errors.district}>
                <SearchableSelect
                  value={form.district ?? ''}
                  onChange={onDistrictChange}
                  options={districts}
                  placeholder="Select District"
                  searchPlaceholder="Search district..."
                />
              </FormRow>

              <FormRow icon={<IconLocation />} label="Upazila" error={errors.upazila}>
                <SearchableSelect
                  value={form.upazila ?? ''}
                  onChange={val => setForm(f => ({ ...f, upazila: val }))}
                  options={upazilas}
                  placeholder="Select Upazila"
                  searchPlaceholder="Search upazila..."
                  disabled={!form.district}
                />
              </FormRow>
            </div>
          </div>

          {/* ── PRIVACY TOGGLES ── */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Privacy & Availability</h3>
            <div className="space-y-3">
              
              <div 
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${form.is_available ? 'border-green-200 bg-green-50/30 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                onClick={() => setForm(f => ({ ...f, is_available: !f.is_available }))}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${form.is_available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Available to Donate</div>
                    <div className="text-xs text-gray-500 mt-0.5">Appear in donor searches</div>
                  </div>
                </div>
                <Toggle checked={form.is_available ?? true} onChange={(val) => setForm(f => ({ ...f, is_available: val }))} />
              </div>

              <div 
                className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${form.share_phone ? 'border-green-200 bg-green-50/30 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                onClick={() => setForm(f => ({ ...f, share_phone: !f.share_phone }))}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${form.share_phone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <IconPhone />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Share Phone Number</div>
                    <div className="text-xs text-gray-500 mt-0.5">Let requesters call you</div>
                  </div>
                </div>
                <Toggle checked={form.share_phone ?? true} onChange={(val) => setForm(f => ({ ...f, share_phone: val }))} />
              </div>

            </div>
          </div>

        </div>

        {/* ── SAVE BUTTON ── */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 md:static md:bottom-auto md:left-auto md:right-auto md:border-0 md:bg-transparent md:backdrop-blur-none md:p-0 md:mt-4">
          <div className="max-w-2xl mx-auto">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#B91C1C] hover:bg-red-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-[0_4px_14px_0_rgba(185,28,28,0.39)] disabled:opacity-70 text-[15px]"
            >
              <IconSave />
              {saving
                ? (isNewUser ? 'Completing Profile...' : 'Saving Changes...')
                : (isNewUser ? 'Complete Profile' : 'Save Changes')
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
