import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BodyCompositionChart({ data }) {
  const [period, setPeriod] = useState('This Month');
  const [activeMetric, setActiveMetric] = useState(null); // 'muscle' | 'fat' | 'water' | null

  const width = 450;
  const height = 150;
  const paddingX = 35;
  const paddingY = 20;

  // Scale: 0 to 80
  const minY = 0;
  const maxY = 80;
  const rangeY = maxY - minY;

  const getPoints = (key) => {
    return data.map((d, i) => {
      const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
      const normalizedY = (d[key] - minY) / rangeY;
      const y = height - paddingY - normalizedY * (height - 2 * paddingY);
      return { val: d[key], day: d.day, x, y };
    });
  };

  const musclePoints = getPoints('muscle');
  const fatPoints = getPoints('fat');
  const waterPoints = getPoints('water');

  const makePath = (pts) =>
    pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  return (
    <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white">Body Composition Trend</h3>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#121B26] border border-[#1E2D42] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 pr-6 appearance-none focus:outline-none focus:border-[#2BAF34] cursor-pointer"
          >
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs mb-3">
        <button
          onClick={() => setActiveMetric(activeMetric === 'muscle' ? null : 'muscle')}
          className={`flex items-center gap-1.5 transition-opacity ${
            activeMetric && activeMetric !== 'muscle' ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#2BAF34]" />
          <span className="text-slate-300 font-medium">Muscle</span>
        </button>

        <button
          onClick={() => setActiveMetric(activeMetric === 'fat' ? null : 'fat')}
          className={`flex items-center gap-1.5 transition-opacity ${
            activeMetric && activeMetric !== 'fat' ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="text-slate-300 font-medium">Fat</span>
        </button>

        <button
          onClick={() => setActiveMetric(activeMetric === 'water' ? null : 'water')}
          className={`flex items-center gap-1.5 transition-opacity ${
            activeMetric && activeMetric !== 'water' ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
          <span className="text-slate-300 font-medium">Water</span>
        </button>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          {/* Y Axis Grid & Labels */}
          {[80, 60, 40, 20, 0].map((val) => {
            const y = height - paddingY - ((val - minY) / rangeY) * (height - 2 * paddingY);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#162230"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  font-size="9"
                  fill="#64748B"
                  text-anchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Water Line */}
          <path
            d={makePath(waterPoints)}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={activeMetric === 'water' ? 3.5 : 2}
            opacity={activeMetric && activeMetric !== 'water' ? 0.3 : 1}
            strokeLinecap="round"
          />

          {/* Muscle Line */}
          <path
            d={makePath(musclePoints)}
            fill="none"
            stroke="#2BAF34"
            strokeWidth={activeMetric === 'muscle' ? 3.5 : 2}
            opacity={activeMetric && activeMetric !== 'muscle' ? 0.3 : 1}
            strokeLinecap="round"
          />

          {/* Fat Line */}
          <path
            d={makePath(fatPoints)}
            fill="none"
            stroke="#F59E0B"
            strokeWidth={activeMetric === 'fat' ? 3.5 : 2}
            opacity={activeMetric && activeMetric !== 'fat' ? 0.3 : 1}
            strokeLinecap="round"
          />

          {/* Points & X-Labels */}
          {musclePoints.map((p, i) => (
            <g key={p.day}>
              {/* Muscle dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#2BAF34"
                stroke="#090D16"
                strokeWidth="1.5"
              />
              {/* Fat dot */}
              <circle
                cx={fatPoints[i].x}
                cy={fatPoints[i].y}
                r="3.5"
                fill="#F59E0B"
                stroke="#090D16"
                strokeWidth="1.5"
              />
              {/* Water dot */}
              <circle
                cx={waterPoints[i].x}
                cy={waterPoints[i].y}
                r="3.5"
                fill="#3B82F6"
                stroke="#090D16"
                strokeWidth="1.5"
              />
              {/* X Axis Day Text */}
              <text
                x={p.x}
                y={height - 4}
                font-size="9"
                fill="#94A3B8"
                text-anchor="middle"
              >
                {p.day}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
