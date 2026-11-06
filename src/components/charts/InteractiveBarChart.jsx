import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function InteractiveBarChart({ data, title = "Calorie Intake vs Burn" }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [period, setPeriod] = useState('This Week');

  const maxVal = 2500;
  const yTicks = [2500, 2000, 1500, 1000, 500, 0];

  return (
    <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2BAF34]" />
              <span className="text-slate-400">Intake</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#334155]" />
              <span className="text-slate-400">Burned</span>
            </div>
          </div>

          {/* Filter Dropdown */}
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
      </div>

      {/* Chart Canvas */}
      <div className="relative h-56 w-full flex">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between text-[10px] text-slate-500 pr-3 select-none pb-6">
          {yTicks.map((val) => (
            <span key={val} className="text-right w-8">{val.toLocaleString()}</span>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative flex-1 flex items-end justify-between border-b border-[#1E2D42] pb-6 gap-2 sm:gap-4">
          {/* Background Grid Lines */}
          <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none">
            {yTicks.map((val) => (
              <div key={val} className="w-full border-b border-[#162230]/70" />
            ))}
          </div>

          {/* Bar Groups */}
          {data.map((item, idx) => {
            const intakeHeight = (item.intake / maxVal) * 100;
            const burnedHeight = (item.burned / maxVal) * 100;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.day}
                className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-[#090D16] border border-[#2BAF34]/50 shadow-xl rounded-lg px-2.5 py-1 text-[11px] whitespace-nowrap pointer-events-none animate-fadeIn">
                    <span className="text-[#2BAF34] font-bold">{item.intake}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-slate-300 font-semibold">{item.burned} kcal</span>
                  </div>
                )}

                {/* Bars */}
                <div className="flex items-end gap-1 sm:gap-1.5 w-full max-w-[28px] h-full justify-center">
                  {/* Intake Bar (Green) */}
                  <div
                    style={{ height: `${intakeHeight}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isHovered
                        ? 'bg-[#35D440] shadow-glow-subtle'
                        : 'bg-[#2BAF34]'
                    }`}
                  />
                  {/* Burned Bar (Slate) */}
                  <div
                    style={{ height: `${burnedHeight}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isHovered
                        ? 'bg-[#475569]'
                        : 'bg-[#1E293B]'
                    }`}
                  />
                </div>

                {/* X Axis Label */}
                <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
