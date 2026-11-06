import React, { useState } from 'react';
import { ChevronDown, TrendingDown } from 'lucide-react';

export default function WeightProgressChart({ weightData }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [period, setPeriod] = useState('This Month');

  const { currentWeight, change, comparison, data } = weightData;
  const minY = 78;
  const maxY = 86;
  const rangeY = maxY - minY;

  // SVG Chart Coordinates
  const width = 450;
  const height = 150;
  const paddingX = 35;
  const paddingY = 20;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const normalizedY = (d.weight - minY) / rangeY;
    const y = height - paddingY - normalizedY * (height - 2 * paddingY);
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Weight Progress</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{currentWeight}</span>
            <span className="flex items-center text-xs font-bold text-[#2BAF34]">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {change}
            </span>
            <span className="text-[11px] text-slate-400">{comparison}</span>
          </div>
        </div>

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

      {/* Line Chart Graphic */}
      <div className="relative w-full overflow-hidden">
        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute z-20 bg-[#090D16] border border-[#2BAF34] rounded-lg px-2.5 py-1 text-[11px] font-bold text-white pointer-events-none transform -translate-x-1/2 shadow-xl"
            style={{
              left: `${(points[hoveredIdx].x / width) * 100}%`,
              top: `${points[hoveredIdx].y - 25}px`,
            }}
          >
            {points[hoveredIdx].weight} kg
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          <defs>
            <linearGradient id="weightAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#2BAF34" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#2BAF34" stop-opacity="0.0" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines and Y axis text */}
          {[86, 84, 82, 80, 78].map((val) => {
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

          {/* Area under curve */}
          <path d={areaD} fill="url(#weightAreaGrad)" />

          {/* Glowing Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2BAF34"
            strokeWidth="3"
            filter="url(#lineGlow)"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g
              key={p.day}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === idx ? 6 : 4}
                fill={hoveredIdx === idx ? '#FFFFFF' : '#2BAF34'}
                stroke="#090D16"
                strokeWidth="2"
                className="transition-all duration-200"
              />
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
