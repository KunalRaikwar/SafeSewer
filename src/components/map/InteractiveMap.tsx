import React, { useState } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { Job, SafetyStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, 
  Layers, 
  Plus, 
  Minus, 
  RotateCcw, 
  Users, 
  Wind, 
  ExternalLink, 
  Activity, 
  Radio,
  Flame,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveMapProps {
  height?: string;
  selectedJobId?: string;
  onSelectJob?: (job: Job) => void;
  showFilters?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  height = 'h-[440px]',
  selectedJobId,
  onSelectJob,
  showFilters = true,
}) => {
  const { jobs, setSelectedJob, setSelectedWorker, workers } = useSafety();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [activePopupJob, setActivePopupJob] = useState<Job | null>(
    jobs.find(j => j.id === (selectedJobId || 'SS-127')) || jobs[0]
  );
  const [showPipelines, setShowPipelines] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'all') return true;
    return job.status === activeFilter;
  });

  // Map coordinates projection to SVG coordinates (Indore coordinate bounds: lat ~22.70 to 22.76, lng ~75.84 to 75.93)
  const mapCoordsToSvg = (lat: number, lng: number) => {
    const minLat = 22.695;
    const maxLat = 22.765;
    const minLng = 75.840;
    const maxLng = 75.935;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 40;

    return { x, y };
  };

  const handleMarkerClick = (job: Job) => {
    setActivePopupJob(job);
    setSelectedJob(job);
    if (onSelectJob) onSelectJob(job);
  };

  return (
    <div className={`relative w-full ${height} bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner select-none`}>
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="font-display">Indore Confined Network</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live GIS Telemetry
          </span>
        </div>

        {/* Filter controls */}
        {showFilters && (
          <div className="flex items-center gap-1 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg text-xs">
            {(['all', 'critical', 'warning', 'safe'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded font-semibold capitalize transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Map Controls on right */}
      <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/60 shadow-lg text-slate-300">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.45))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setShowPipelines(prev => !prev);
          }}
          className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
            showPipelines ? 'text-blue-400' : 'text-slate-500'
          }`}
          title="Toggle Drainage Pipelines"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Vector Geospatial Map Canvas */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 900 580"
          className="w-full h-full object-cover map-dark-grid"
          style={{ backgroundColor: '#070C1E' }}
        >
          {/* Subtle Waterbody / Khan River Vector Mock */}
          <path
            d="M 50 280 Q 200 320 380 260 T 680 210 T 890 240"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="14"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
          <text x="760" y="225" fill="#3B82F6" fontSize="10" fontWeight="bold" opacity="0.4" fontFamily="sans-serif">
            KHAN RIVER DRAINAGE CANAL
          </text>

          {/* Subterranean Sewer Pipeline Trunks */}
          {showPipelines && (
            <g className="transition-opacity duration-300">
              {/* Trunk 1: Rajwada to Vijay Nagar */}
              <path
                d="M 280 340 L 460 270 L 610 140"
                fill="none"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                strokeOpacity="0.6"
              />
              {/* Trunk 2: MG Road to Palasia & Bypass */}
              <path
                d="M 290 320 L 520 310 L 740 300"
                fill="none"
                stroke="#0284C7"
                strokeWidth="3"
                strokeDasharray="6 4"
                strokeOpacity="0.5"
              />
              {/* Trunk 3: Sapna Sangeeta interceptor */}
              <path
                d="M 390 460 L 460 270 L 520 310"
                fill="none"
                stroke="#0EA5E9"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeOpacity="0.4"
              />
            </g>
          )}

          {/* Road outlines for spatial grounding */}
          <path d="M 50 140 L 850 140" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 50 320 L 850 320" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 50 460 L 850 460" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 290 40 L 290 540" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 520 40 L 520 540" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 740 40 L 740 540" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Zone Labels */}
          <text x="140" y="90" fill="#475569" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            ZONE 1 • HERITAGE CORE
          </text>
          <text x="540" y="80" fill="#475569" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            ZONE 2 • VIJAY NAGAR NORTH
          </text>
          <text x="440" y="490" fill="#475569" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            ZONE 4 • CENTRAL SECTOR
          </text>
          <text x="710" y="470" fill="#475569" fontSize="11" fontWeight="600" fontFamily="sans-serif">
            ZONE 5 • BYPASS EAST
          </text>

          {/* Job Chamber Markers */}
          {filteredJobs.map(job => {
            const pos = mapCoordsToSvg(job.coordinates.lat, job.coordinates.lng);
            const isSelected = activePopupJob?.id === job.id;
            const isCritical = job.status === 'critical';
            const isWarning = job.status === 'warning';

            let markerColor = '#22C55E'; // Safe
            let pulseRingColor = 'rgba(34, 197, 94, 0.4)';
            if (isCritical) {
              markerColor = '#EF4444';
              pulseRingColor = 'rgba(239, 68, 68, 0.5)';
            } else if (isWarning) {
              markerColor = '#F59E0B';
              pulseRingColor = 'rgba(245, 158, 11, 0.4)';
            } else if (job.status === 'offline') {
              markerColor = '#64748B';
              pulseRingColor = 'transparent';
            }

            return (
              <g
                key={job.id}
                className="cursor-pointer group"
                onClick={() => handleMarkerClick(job)}
                transform={`translate(${pos.x}, ${pos.y})`}
              >
                {/* Outer animated radar ping ring for critical & warning */}
                {(isCritical || isWarning) && (
                  <circle
                    r={isCritical ? '24' : '18'}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="2"
                    className={isCritical ? 'animate-ping' : ''}
                    opacity="0.6"
                    style={{ transformOrigin: 'center', animationDuration: isCritical ? '1.5s' : '3s' }}
                  />
                )}

                {/* Selected Halo */}
                {isSelected && (
                  <circle
                    r="20"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Marker Outer Base */}
                <circle
                  r="12"
                  fill="#0B132B"
                  stroke={markerColor}
                  strokeWidth="3"
                  className="transition-transform group-hover:scale-125"
                />

                {/* Center dot */}
                <circle r="4.5" fill={markerColor} />

                {/* Text tag label */}
                <rect
                  x="-36"
                  y="-32"
                  width="72"
                  height="18"
                  rx="4"
                  fill="#0F172A"
                  stroke={isSelected ? '#3B82F6' : '#334155'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="-20"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {job.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Info Popup when a marker is clicked */}
      {activePopupJob && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-10 bg-slate-950/95 backdrop-blur-lg border border-slate-700/80 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-blue-400">
                  {activePopupJob.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activePopupJob.chamberNumber}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5 leading-snug line-clamp-1">
                {activePopupJob.location}
              </h4>
            </div>
            <StatusBadge status={activePopupJob.status} size="sm" pulse={activePopupJob.status === 'critical'} />
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 text-center border-b border-slate-800/80 my-1">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Workers</span>
              <span className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                {activePopupJob.assignedWorkerIds.length} Active
              </span>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">H₂S Level</span>
              <span className={`text-sm font-bold font-mono mt-0.5 block ${
                activePopupJob.sensorSummary.h2s > 10
                  ? 'text-red-400 font-extrabold'
                  : activePopupJob.sensorSummary.h2s > 5
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}>
                {activePopupJob.sensorSummary.h2s} ppm
              </span>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">O₂ Volume</span>
              <span className={`text-sm font-bold font-mono mt-0.5 block ${
                activePopupJob.sensorSummary.o2 < 19.5
                  ? 'text-red-400'
                  : 'text-emerald-400'
              }`}>
                {activePopupJob.sensorSummary.o2}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Depth: <span className="font-semibold text-slate-200">{activePopupJob.depthMeters}m</span> &bull; Synced {activePopupJob.sensorSummary.lastUpdated}
            </span>
            <button
              onClick={() => navigate(`/jobs/${activePopupJob.id}`)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-md shadow-blue-600/20"
            >
              Job Cockpit
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
