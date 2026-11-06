import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function MacronutrientDonut({ distribution }) {
  const [activeItem, setActiveItem] = useState(null);
  const [period, setPeriod] = useState('This Week');

  // SVG Circle Donut Calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const slices = distribution.items.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Macronutrient Distribution</h3>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[#121B26] border border-[#1E2D42] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 pr-6 appearance-none focus:outline-none focus:border-[#2BAF34] cursor-pointer"
          >
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Donut Body & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
        {/* SVG Donut Graphic */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#121B26"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Slices */}
            {slices.map((slice) => {
              const isHovered = activeItem?.name === slice.name;
              return (
                <circle
                  key={slice.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveItem(slice)}
                  onMouseLeave={() => setActiveItem(null)}
                />
              );
            })}
          </svg>

          {/* Donut Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-lg font-extrabold text-white tracking-tight">
              {activeItem ? activeItem.amount : distribution.totalCalories}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {activeItem ? activeItem.name : 'kcal'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          {distribution.items.map((item) => (
            <div
              key={item.name}
              className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                activeItem?.name === item.name
                  ? 'bg-[#162230]'
                  : 'hover:bg-[#121B26]'
              }`}
              onMouseEnter={() => setActiveItem(item)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-300 font-medium">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white">
                  {item.percentage}%
                </span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
                  ({item.amount})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
