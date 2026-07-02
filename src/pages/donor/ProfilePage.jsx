import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Loader from '../../components/Loader';


// Icons
function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );
}

function IconCamera() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}

function IconEmail() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
}

function IconPhone() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path></svg>;
}

function IconLocation() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
}

function IconCalendar() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
}

function IconPerson() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
}

function IconGender() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="10" r="4"></circle><path d="M12 14v7"></path><path d="M9 18h6"></path></svg>;
}

function IconDrop() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>;
}

function IconLock() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
}

function IconShield() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
}

function IconUsers() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
}

function IconLogOut() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
}

function IconBookOpen() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
}

function IconHelpCircle() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
}

function IconInfo() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
}

function IconMail() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
}

function ListItem({ icon, label, value, onClick, to }) {
  const inner = (
    <>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className={`text-sm ${label === 'Blood Group' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{value}</span>}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-xl">
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors text-left px-2 -mx-2 rounded-xl">
        {inner}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 px-2">
      {inner}
    </div>
  );
}

function getInitials(name) {
  return (name || '').split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase() || '?';
}

function Toggle({ checked, onChange }) {
  return (
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Privacy Modal State
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [privacyForm, setPrivacyForm] = useState({ share_phone: true, is_available: true });
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api.get('/donor/profile')
      .then(res => {
        setDonor(res.data.donor);
        setPrivacyForm({
          share_phone: res.data.donor.share_phone,
          is_available: res.data.donor.is_available,
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/donor/login');
    } catch (e) {
      navigate('/donor/login');
    }
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      await api.put('/donor/profile', privacyForm);
      setDonor(prev => ({ ...prev, ...privacyForm }));
      setPrivacyModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save settings');
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setSavingPassword(true);

    try {
      await api.put('/donor/password', passwordForm);
      setPasswordSuccess('Password successfully updated!');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordSuccess('');
        setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      }, 1500);
    } catch (err) {
      const d = err.response?.data;
      if (d?.errors) {
        setPasswordError(Object.values(d.errors)[0][0]);
      } else {
        setPasswordError('An error occurred. Please try again.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading || !donor) {
    return <Loader />;
  }

  const memberSince = donor.created_at ? new Date(donor.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown';
  const location = [donor.upazila, donor.district].filter(Boolean).join(', ') || 'Not Provided';
  const address = [donor.address, location].filter(Boolean).join(', ') || 'Not Provided';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── HEADER - mobile only ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm pt-4 pb-3 px-4 flex items-center justify-between md:hidden">
        <div className="w-16"></div> {/* Spacer to center title */}
        <h1 className="text-lg font-bold text-gray-900 absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          My Profile
        </h1>
        <Link to="/donor/profile/edit" className="flex items-center gap-1.5 text-red-600 font-semibold text-sm hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors">
          <IconEdit />
          Edit
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        
        {/* ── PROFILE CARD ── */}
        <div className="bg-[#FFF5F5] rounded-3xl p-5 relative overflow-hidden">
          {/* Watermark Drop SVG */}
          <div className="absolute right-0 top-4 text-red-100 pointer-events-none" style={{ transform: 'scale(1.5) translate(20%, 0)' }}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
            </svg>
          </div>

          <div className="relative z-10 flex gap-4 items-start">
            <div className="relative flex-shrink-0">
              <div className="w-[84px] h-[84px] bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 overflow-hidden shadow-sm border-2 border-white">
                {donor.photo_url ? (
                  <img src={donor.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(donor.name)
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600">
                <IconCamera />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-gray-900 mb-2 leading-none">{donor.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-100 text-red-600 font-extrabold text-[11px] px-2 py-0.5 rounded shadow-sm">
                  {donor.blood_type}
                </span>
                <span className="flex items-center gap-1 bg-green-50 text-green-600 font-bold text-[10px] px-2 py-0.5 rounded border border-green-100 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Verified
                </span>
              </div>
              
              <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <IconEmail />
                  <span className="truncate">{donor.email}</span>
                </div>
                {donor.phone && (
                  <div className="flex items-center gap-2">
                    <IconPhone />
                    <span className="truncate">{donor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IconLocation />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCalendar />
                  <span className="truncate">Member since: {memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PERSONAL INFORMATION ── */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Personal Information</h3>
          <div className="space-y-1">
            <ListItem icon={<IconPerson />} label="Full Name" value={donor.name} />
            <ListItem icon={<IconEmail />} label="Email Address" value={donor.email} />
            <ListItem icon={<IconPhone />} label="Phone Number" value={donor.phone || 'Not Provided'} />
            <ListItem icon={<IconGender />} label="Gender" value={donor.gender ? donor.gender.charAt(0).toUpperCase() + donor.gender.slice(1) : 'Not Provided'} />
            <ListItem icon={<IconDrop />} label="Blood Group" value={donor.blood_type} />
            <ListItem icon={<IconCalendar />} label="Age" value={donor.age ? `${donor.age} Years` : 'Not Provided'} />
            <ListItem icon={<IconLocation />} label="Address" value={address} />
          </div>
        </div>

        {/* ── ACCOUNT & SECURITY ── */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Account & Security</h3>
          <div className="space-y-1">
            <ListItem 
              icon={<IconLock />} 
              label="Change Password" 
              onClick={() => {
                setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
                setPasswordError('');
                setPasswordSuccess('');
                setPasswordModalOpen(true);
              }}
            />
            <ListItem 
              icon={<IconShield />} 
              label="Privacy Settings" 
              onClick={() => {
                setPrivacyForm({ share_phone: donor.share_phone, is_available: donor.is_available });
                setPrivacyModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* ── EXPLORE ── */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Explore</h3>
          <div className="space-y-1">
            <ListItem icon={<IconBookOpen />} label="Blog" to="/blog" />
            <ListItem icon={<IconHelpCircle />} label="FAQ" to="/faq" />
            <ListItem icon={<IconInfo />} label="About Us" to="/about" />
            <ListItem icon={<IconMail />} label="Contact Us" to="/contact" />
          </div>
        </div>

        {/* ── LOG OUT ── */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm py-4 rounded-2xl transition-colors shadow-sm mt-6"
        >
          <IconLogOut />
          Log Out
        </button>

      </div>

      {/* ── PASSWORD MODAL ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500 mt-1">Update your account password securely.</p>
            </div>
            
            <form onSubmit={handleSavePassword} className="p-5 space-y-4">
              {passwordSuccess && (
                <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100 text-center">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
                  {passwordError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={passwordForm.current_password}
                  onChange={e => setPasswordForm(f => ({ ...f, current_password: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={passwordForm.new_password}
                  onChange={e => setPasswordForm(f => ({ ...f, new_password: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                  value={passwordForm.new_password_confirmation}
                  onChange={e => setPasswordForm(f => ({ ...f, new_password_confirmation: e.target.value }))}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingPassword}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-70 transition-colors"
                >
                  {savingPassword ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRIVACY MODAL ── */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your visibility and availability.</p>
            </div>
            
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-gray-900 text-[15px]">Share Phone Number</div>
                  <div className="text-xs text-gray-500 mt-0.5">Requesters can call you directly</div>
                </div>
                <Toggle 
                  checked={privacyForm.share_phone} 
                  onChange={(v) => setPrivacyForm(f => ({ ...f, share_phone: v }))} 
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-gray-900 text-[15px]">Available to Donate</div>
                  <div className="text-xs text-gray-500 mt-0.5">Show as available on your profile</div>
                </div>
                <Toggle 
                  checked={privacyForm.is_available} 
                  onChange={(v) => setPrivacyForm(f => ({ ...f, is_available: v }))} 
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setPrivacyModalOpen(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePrivacy}
                disabled={savingPrivacy}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-70 transition-colors"
              >
                {savingPrivacy ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
