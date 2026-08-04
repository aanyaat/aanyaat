import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Sparkles,
  Heart,
  Navigation,
  Maximize2,
  Minimize2,
  RotateCcw,
  Plane,
  Satellite,
  Crosshair,
} from 'lucide-react';
import { useConfetti } from '@/lib/useConfetti';

// Where they met — Godrej Royale Woods, Devanahalli, Bengaluru
const MEET_LAT = 13.2723;
const MEET_LNG = 77.6785;

// Where she lives now — Palam, New Delhi
const DELHI_LAT = 28.6092;
const DELHI_LNG = 77.0460;

const MEET = { lat: MEET_LAT, lng: MEET_LNG };
const DELHI = { lat: DELHI_LAT, lng: DELHI_LNG };

const MEET_NOTE = {
  name: 'Godrej Royale Woods',
  area: 'Devanahalli, Bengaluru, Karnataka 562110',
  note: 'This is where we met. Not in some grand romantic movie scene — just here, in this quiet corner of Devanahalli. You walked in and everything I thought I knew about timing, about luck, about "the right person" quietly rearranged itself around you. I took 3 hours to reply to your first message after we met, and I have been trying to make up for those 3 hours ever since. Every place I go now, I measure against this one. None of them come close.',
};

const DELHI_NOTE = {
  name: 'Palam, New Delhi',
  area: 'South West Delhi, 110045',
  note: 'And now you\'re here. Delhi. So many kilometres between us, but not a single one of them matters. Long distance is hard — you said it yourself, the anxiety of new things, the not-knowing. But here\'s what I know: every flight, every late-night call, every "good nighttt" across two cities is worth it. You\'re worth it. The distance is temporary. Us is not.',
};

// Haversine distance in km
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Generate a curved arc of points between two coordinates (slerp-ish)
function arcPoints(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  segments = 80
): L.LatLngExpression[] {
  const lat1 = (a.lat * Math.PI) / 180;
  const lng1 = (a.lng * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const lng2 = (b.lng * Math.PI) / 180;
  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2
    )
  );
  const pts: L.LatLngExpression[] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI;
    const lng = (Math.atan2(y, x) * 180) / Math.PI;
    pts.push([lat, lng]);
  }
  return pts;
}

function heartIcon(color: string, pulse = false) {
  const ring = pulse
    ? `<span style="position:absolute;inset:-6px;border-radius:50%;border:2px solid ${color};opacity:.6;animation:pulse-ring 2.4s ease-out infinite"></span>`
    : '';
  return L.divIcon({
    className: 'heart-marker',
    html: `<div style="position:relative;width:36px;height:36px;display:grid;place-items:center">${ring}<span style="position:relative;width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${color},#c02048);display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.45);border:2px solid #fff"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 21s-6.7-4.35-9.3-8.5C.9 9.4 2 6 5 5c2-.7 4 .3 5 2 1-1.7 3-2.7 5-2 3 1 4.1 4.4 2.3 7.5C18.7 16.65 12 21 12 21z"/></svg></span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function planeIcon(angle: number) {
  return L.divIcon({
    className: 'plane-marker',
    html: `<div style="transform:rotate(${angle}deg);width:32px;height:32px;display:grid;place-items:center;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))"><span style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#e8b62a,#d09a16);display:grid;place-items:center;box-shadow:0 0 16px rgba(232,182,42,.7);border:2px solid #fff"><svg width="15" height="15" viewBox="0 0 24 24" fill="white" style="transform:rotate(45deg)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

type Focus = 'meet' | 'delhi' | 'world';

export function InteractiveMap() {
  const { canvasRef, fire } = useConfetti(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const arcRef = useRef<L.Polyline | null>(null);
  const planeRef = useRef<L.Marker | null>(null);
  const [focus, setFocus] = useState<Focus>('world');
  const [flying, setFlying] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [showMeetNote, setShowMeetNote] = useState(false);
  const [showDelhiNote, setShowDelhiNote] = useState(false);

  const distanceKm = Math.round(haversineKm(MEET, DELHI));

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [(MEET.lat + DELHI.lat) / 2, (MEET.lng + DELHI.lng) / 2],
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 18,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel: 100,
    });

    // Esri World Imagery — real satellite tiles, no API key
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        crossOrigin: true,
      }
    ).addTo(map);

    // Place labels overlay (so city names still show on top of satellite)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, opacity: 0.9 }
    ).addTo(map);

    // Markers
    L.marker([MEET.lat, MEET.lng], { icon: heartIcon('#f94f73', true) })
      .addTo(map)
      .on('click', () => {
        map.flyTo([MEET.lat, MEET.lng], 15, { duration: 1.6 });
      });

    L.marker([DELHI.lat, DELHI.lng], { icon: heartIcon('#e8b62a', true) })
      .addTo(map)
      .on('click', () => {
        map.flyTo([DELHI.lat, DELHI.lng], 15, { duration: 1.6 });
      });

    // Arc between the two
    const arc = L.polyline(arcPoints(MEET, DELHI, 100), {
      color: '#f9e28a',
      weight: 2.5,
      opacity: 0.85,
      dashArray: '6 10',
    }).addTo(map);
    arcRef.current = arc;

    mapRef.current = map;

    const onZoom = () => setZoom(map.getZoom());
    map.on('zoomend', onZoom);

    // Fix tile rendering after layout settles
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.off('zoomend', onZoom);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Animate a plane travelling along the arc
  const animatePlane = useCallback(
    (onDone?: () => void) => {
      const map = mapRef.current;
      const arc = arcRef.current;
      if (!map || !arc) return;
      const latlngs = arc.getLatLngs() as L.LatLng[];
      if (planeRef.current) {
        map.removeLayer(planeRef.current);
        planeRef.current = null;
      }

      const total = latlngs.length;
      let i = 0;
      const step = () => {
        if (i >= total - 1) {
          if (planeRef.current) {
            map.removeLayer(planeRef.current);
            planeRef.current = null;
          }
          onDone?.();
          return;
        }
        const p = latlngs[i];
        const next = latlngs[i + 1];
        const angle =
          (Math.atan2(next.lng - p.lng, next.lat - p.lat) * 180) / Math.PI;
        if (planeRef.current) map.removeLayer(planeRef.current);
        planeRef.current = L.marker(p, { icon: planeIcon(angle) }).addTo(map);
        i += 1;
        setTimeout(step, 45);
      };
      step();
    },
    []
  );

  const flyToMeet = useCallback(() => {
    const map = mapRef.current;
    if (!map || flying) return;
    setFlying(true);
    setShowDelhiNote(false);
    map.flyTo([MEET.lat, MEET.lng], 16, { duration: 3.2 });
    map.once('moveend', () => {
      setFlying(false);
      setShowMeetNote(true);
      setFocus('meet');
      fire(120);
    });
  }, [flying, fire]);

  const flyToDelhi = useCallback(() => {
    const map = mapRef.current;
    if (!map || flying) return;
    setFlying(true);
    setShowMeetNote(false);
    // First zoom out a bit, then fly to Delhi, then zoom in
    map.flyTo([DELHI.lat, DELHI.lng], 15, { duration: 4.5 });
    animatePlane();
    map.once('moveend', () => {
      setFlying(false);
      setShowDelhiNote(true);
      setFocus('delhi');
      fire(120);
    });
  }, [flying, fire, animatePlane]);

  const flyToSpace = useCallback(() => {
    const map = mapRef.current;
    if (!map || flying) return;
    setFlying(true);
    setShowMeetNote(false);
    setShowDelhiNote(false);
    // Cinematic: zoom out to world, then fly down to meet location
    map.flyTo([(MEET.lat + DELHI.lat) / 2, (MEET.lng + DELHI.lng) / 2], 3, {
      duration: 2.5,
    });
    map.once('moveend', () => {
      setTimeout(() => {
        map.flyTo([MEET.lat, MEET.lng], 16, { duration: 3.5 });
        map.once('moveend', () => {
          setFlying(false);
          setShowMeetNote(true);
          setFocus('meet');
          fire(160);
        });
      }, 600);
    });
  }, [flying, fire]);

  const reset = useCallback(() => {
    const map = mapRef.current;
    if (!map || flying) return;
    setFlying(true);
    setShowMeetNote(false);
    setShowDelhiNote(false);
    map.flyTo(
      [(MEET.lat + DELHI.lat) / 2, (MEET.lng + DELHI.lng) / 2],
      5,
      { duration: 2 }
    );
    map.once('moveend', () => {
      setFlying(false);
      setFocus('world');
    });
  }, [flying]);

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    if (focus === 'meet') map.flyTo([MEET.lat, MEET.lng], 16, { duration: 1.2 });
    else if (focus === 'delhi')
      map.flyTo([DELHI.lat, DELHI.lng], 15, { duration: 1.2 });
    else flyToSpace();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
        aria-hidden="true"
      />

      <div className="reveal relative overflow-hidden rounded-[2rem] bg-wine-900 shadow-card">
        {/* Map container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
          <div ref={containerRef} className="absolute inset-0 z-0" />

          {/* HUD overlay — pointer-events-none so the map stays interactive */}
          <div className="pointer-events-none absolute inset-0 z-[400]">
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(100,200,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,200,255,0.12) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
            <CornerBrackets />

            {/* Scan line */}
            {!showMeetNote && !showDelhiNote && (
              <div
                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"
                style={{ animation: 'scan-line 3s linear infinite', top: 0 }}
              />
            )}

            {/* HUD label */}
            <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
              <div
                key={focus}
                className="animate-fade-in flex items-center gap-2 rounded-lg bg-black/55 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2.5"
              >
                <Navigation className="h-4 w-4 text-cyan-300" />
                <div>
                  <p className="font-display text-sm font-semibold text-white sm:text-base">
                    {focus === 'meet'
                      ? 'Where we met'
                      : focus === 'delhi'
                        ? 'Where you are now'
                        : 'Our two worlds'}
                  </p>
                  <p className="font-body text-[10px] text-cyan-200/70 sm:text-xs">
                    {focus === 'meet'
                      ? 'Devanahalli, Bengaluru'
                      : focus === 'delhi'
                        ? 'Palam, New Delhi'
                        : `${distanceKm} km apart — together anyway`}
                  </p>
                </div>
              </div>
            </div>

            {/* Zoom indicator */}
            <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
              <div className="rounded-lg bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-[10px] tracking-wider text-cyan-300/80">
                  ZOOM {zoom.toFixed(1)}x
                </span>
              </div>
            </div>
          </div>

          {/* Zoom buttons — these need pointer events */}
          <div className="absolute right-3 bottom-16 z-[410] flex flex-col gap-2 sm:bottom-20">
            <button
              onClick={zoomIn}
              className="grid h-10 w-10 place-items-center rounded-xl bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Zoom in"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={zoomOut}
              className="grid h-10 w-10 place-items-center rounded-xl bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Zoom out"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={recenter}
              className="grid h-10 w-10 place-items-center rounded-xl bg-black/55 text-cyan-300 backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Recenter"
            >
              <Crosshair className="h-4 w-4" />
            </button>
          </div>

          {/* Loading hint while flying */}
          {flying && (
            <div className="pointer-events-none absolute inset-0 z-[405] flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 animate-pulse text-cyan-300" />
                <span className="font-mono text-xs tracking-wider text-cyan-200">
                  FLYING…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="flex flex-col gap-4 bg-wine-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={flyToSpace}
              disabled={flying}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-gold-500 px-5 py-2.5 font-body text-sm font-medium text-white shadow-soft transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              <Satellite className="h-4 w-4" />
              Fly from space
            </button>
            <button
              onClick={flyToMeet}
              disabled={flying}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-body text-sm font-medium text-white transition-all duration-300 hover:bg-white/20 disabled:opacity-50"
            >
              <Heart className="h-4 w-4" fill="currentColor" />
              Where we met
            </button>
            <button
              onClick={flyToDelhi}
              disabled={flying}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/15 px-5 py-2.5 font-body text-sm font-medium text-gold-200 transition-all duration-300 hover:bg-gold-400/25 disabled:opacity-50"
            >
              <Plane className="h-4 w-4" />
              Fly to you in Delhi
            </button>
            <button
              onClick={reset}
              disabled={flying}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 font-body text-sm font-medium text-white transition-all duration-300 hover:bg-white/20 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meet note */}
      {showMeetNote && (
        <div className="reveal overflow-hidden rounded-[2rem] bg-white p-8 shadow-card sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-white shadow-soft">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-wine-700">
                {MEET_NOTE.name}
              </h3>
              <p className="font-body text-sm text-wine-500/70">
                {MEET_NOTE.area}
              </p>
            </div>
          </div>
          <p className="mt-6 font-body text-lg leading-relaxed text-wine-600">
            {MEET_NOTE.note}
          </p>
          <div className="mt-6 rounded-2xl bg-rose-50 p-5">
            <p className="font-body text-base italic text-rose-700">
              "It was nice meeting you."
            </p>
            <p className="mt-1 font-body text-sm text-wine-500/70">
              — your first message. The one I took 3 hours to reply to.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={flyToDelhi} className="btn-primary">
              <Plane className="h-4 w-4" />
              Now fly to you in Delhi
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Godrej Royale Woods, Devanahalli, Bengaluru')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MapPin className="h-4 w-4" />
              Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Delhi note */}
      {showDelhiNote && (
        <div className="reveal overflow-hidden rounded-[2rem] bg-white p-8 shadow-card sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-500 text-white shadow-soft">
              <Plane className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-wine-700">
                {DELHI_NOTE.name}
              </h3>
              <p className="font-body text-sm text-wine-500/70">
                {DELHI_NOTE.area}
              </p>
            </div>
          </div>
          <p className="mt-6 font-body text-lg leading-relaxed text-wine-600">
            {DELHI_NOTE.note}
          </p>
          <div className="mt-6 rounded-2xl bg-gold-50 p-5">
            <p className="font-body text-base italic text-gold-700">
              {distanceKm.toLocaleString()} km between us. Zero distance between our hearts.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={flyToMeet} className="btn-primary">
              <Heart className="h-4 w-4" fill="currentColor" />
              Back to where we met
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Palam, New Delhi')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MapPin className="h-4 w-4" />
              Google Maps
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .heart-marker, .plane-marker { background: transparent !important; border: none !important; }
        .leaflet-container { background: #0a0a14; font-family: inherit; }
        .leaflet-container a { color: #f94f73; }
      `}</style>
    </div>
  );
}

function CornerBrackets() {
  const base =
    'pointer-events-none absolute h-6 w-6 border-cyan-300/40 sm:h-8 sm:w-8';
  return (
    <>
      <span
        className={`${base} left-3 top-3 border-l-2 border-t-2 sm:left-5 sm:top-5`}
      />
      <span
        className={`${base} right-3 top-3 border-r-2 border-t-2 sm:right-5 sm:top-5`}
      />
      <span
        className={`${base} bottom-3 left-3 border-b-2 border-l-2 sm:bottom-5 sm:left-5`}
      />
      <span
        className={`${base} bottom-3 right-3 border-b-2 border-r-2 sm:bottom-5 sm:right-5`}
      />
    </>
  );
}
