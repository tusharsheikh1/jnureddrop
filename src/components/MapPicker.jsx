import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons broken by Vite's asset pipeline
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
});

const DEFAULT_CENTER = [23.8103, 90.4125]; // Dhaka
const DEFAULT_ZOOM   = 12;

function PinDropper({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng) });
  return null;
}

async function reverseGeocode(lat, lng) {
  try {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

async function searchPlaces(query) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=bd`,
      { headers: { 'Accept-Language': 'en' } }
    );
    return await res.json();
  } catch {
    return [];
  }
}

export default function MapPicker({ onConfirm, onClose, initialAddress = '' }) {
  const [pin, setPin]                 = useState(null);
  const [address, setAddress]         = useState('');
  const [resolving, setResolving]     = useState(false);
  const [query, setQuery]             = useState(initialAddress);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching]     = useState(false);
  const mapRef    = useRef(null);
  const debounce  = useRef(null);
  const searchRef = useRef(null);

  // Try to get user's current location on mount
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        const latlng = { lat: coords.latitude, lng: coords.longitude };
        handlePick(latlng);
        mapRef.current?.setView([latlng.lat, latlng.lng], 15);
      },
      () => {}
    );
  }, []);

  // Close suggestions when clicking outside search area
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePick = async (latlng) => {
    setPin(latlng);
    setResolving(true);
    setSuggestions([]);
    const addr = await reverseGeocode(latlng.lat, latlng.lng);
    setAddress(addr);
    setQuery(addr);
    setResolving(false);
  };

  const handleSearch = (val) => {
    setQuery(val);
    clearTimeout(debounce.current);
    if (!val.trim()) { setSuggestions([]); return; }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchPlaces(val);
      setSuggestions(results);
      setSearching(false);
    }, 500);
  };

  const pickSuggestion = (place) => {
    const latlng = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    setPin(latlng);
    setAddress(place.display_name);
    setQuery(place.display_name);
    setSuggestions([]);
    mapRef.current?.setView([latlng.lat, latlng.lng], 15);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white" style={{ zIndex: 9999 }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-3 border-b border-gray-100 bg-white flex-shrink-0">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-base font-bold text-gray-900">Select Location</h2>
      </div>

      {/* Search bar — sits above map via z-index */}
      <div
        ref={searchRef}
        className="px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0"
        style={{ position: 'relative', zIndex: 1000 }}
      >
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-20 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            placeholder="Search hospital or address..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />
          {searching && (
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">Searching…</span>
          )}
          {query && !searching && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Suggestions — rendered inside search wrapper, above map */}
        {suggestions.length > 0 && (
          <div
            className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden mt-1"
            style={{ position: 'absolute', left: 16, right: 16, zIndex: 1001 }}
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => pickSuggestion(s)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 border-b border-gray-100 last:border-0 flex items-start gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">{s.display_name.split(',')[0]}</p>
                  <p className="text-xs text-gray-400 truncate">{s.display_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hint bar */}
      <div className="bg-red-50 px-4 py-2 flex items-center gap-2 flex-shrink-0" style={{ zIndex: 999 }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-red-600">Tap anywhere on the map to drop a pin</p>
      </div>

      {/* Map — takes remaining space */}
      <div className="flex-1 relative" style={{ zIndex: 1 }}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <PinDropper onPick={handlePick} />
          {pin && <Marker position={[pin.lat, pin.lng]} />}
        </MapContainer>
      </div>

      {/* Bottom confirm panel */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 flex-shrink-0" style={{ zIndex: 999 }}>
        {pin ? (
          <>
            <div className="flex items-start gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xs text-gray-600 leading-relaxed">
                {resolving ? 'Getting address…' : address}
              </p>
            </div>
            <button
              type="button"
              disabled={resolving}
              onClick={() => onConfirm(address)}
              className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
            >
              {resolving ? 'Resolving…' : 'Use This Location'}
            </button>
          </>
        ) : (
          <p className="text-center text-sm text-gray-400 py-1">Tap the map to select a location</p>
        )}
      </div>
    </div>
  );
}
