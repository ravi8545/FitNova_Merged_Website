import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Flame,
  Dumbbell,
  Droplets,
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle2,
  AlertCircle,
  Moon,
  Utensils,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  REPORT_TABS,
  TIME_PERIODS,
  KPI_METRICS,
  CALORIE_INTAKE_VS_BURN,
  MACRONUTRIENT_DISTRIBUTION,
  WEIGHT_PROGRESS,
  BODY_COMPOSITION,
  TOP_PERFORMING_DAYS,
  AREAS_FOR_IMPROVEMENT,
  REPORT_SUMMARY,
  REPORT_GOALS,
  RECENT_ACTIVITY,
} from '../services/reportsData';
import InteractiveBarChart from '../components/charts/InteractiveBarChart';
import MacronutrientDonut from '../components/charts/MacronutrientDonut';
import WeightProgressChart from '../components/charts/WeightProgressChart';
import BodyCompositionChart from '../components/charts/BodyCompositionChart';
import Sparkline from '../components/charts/Sparkline';
import heroBg from '../assets/images/reports-hero.svg';
import { useAppNav } from '../context/NavContext';

export default function ReportsPage() {
  const navigate = useAppNav();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedDateRange, setSelectedDateRange] = useState('1 Jun 2025 - 10 Jun 2025');
  const [summaryFilter, setSummaryFilter] = useState('This Week');

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title */}
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2BAF34] bg-[#2BAF34]/10 border border-[#2BAF34]/20 px-2 py-0.5 rounded-md inline-block mb-1">
            Analytics
          </span>
          <h1 className="page-title">
            Reports
          </h1>
          <p className="page-subtitle">
            Get detailed insights into your fitness journey and track your progress over time.
          </p>
        </div>

        {/* Date Range Picker & Duration Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Picker Button */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#0D141C] border border-[#1E2D42] rounded-xl text-xs font-semibold text-white hover:border-[#2BAF34] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedDateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>
          </div>

          {/* Duration Pills: 7D, 30D, 3M, 1Y */}
          <div className="flex items-center p-1 bg-[#0D141C] border border-[#162230] rounded-xl">
            {TIME_PERIODS.map((period) => {
              const isActive = selectedPeriod === period.id;
              return (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#2BAF34] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#162230]/70">
        {REPORT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#2BAF34] text-black font-bold shadow-md shadow-[#2BAF34]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#0D141C]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Hero Banner with Gym Silhouette & Motivational Glow */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1E2D42] bg-gradient-to-r from-[#090D16] via-[#0B111A] to-[#090D16] min-h-[140px] flex items-center p-6 shadow-xl">
        <div className="absolute inset-0 pointer-events-none opacity-85">
          <img
            src={heroBg}
            alt="Reports Hero Banner"
            className="w-full h-full object-cover object-right"
          />
        </div>

        <div className="relative z-10 max-w-md space-y-1">
          <div className="flex items-center gap-1.5 text-[#2BAF34] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Performance Report</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Consistency is up <span className="text-[#2BAF34]">18.4%</span> this week
          </h3>
          <p className="text-xs text-slate-300">
            You hit 6 out of 8 planned workout sessions with optimal macronutrient balance.
          </p>
        </div>
      </div>

      {/* 4 KPI Metric Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_METRICS.map((kpi) => {
          let IconComponent = Flame;
          let iconColor = 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20';

          if (kpi.type === 'protein') {
            IconComponent = Dumbbell;
            iconColor = 'text-[#2BAF34] bg-[#2BAF34]/10 border-[#2BAF34]/20';
          } else if (kpi.type === 'water') {
            IconComponent = Droplets;
            iconColor = 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20';
          } else if (kpi.type === 'workouts') {
            IconComponent = Dumbbell;
            iconColor = 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20';
          }

          return (
            <div
              key={kpi.id}
              className="bg-[#0D141C] border border-[#162230] rounded-2xl p-4 flex flex-col justify-between hover:border-[#2BAF34]/40 transition-all duration-300 shadow-lg"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">
                  {kpi.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${iconColor}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Numbers */}
              <div className="space-y-1 mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white tracking-tight">
                    {kpi.value}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    / {kpi.target}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {kpi.isPositive ? (
                    <span className="flex items-center text-[#2BAF34]">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      {kpi.change}
                    </span>
                  ) : (
                    <span className="flex items-center text-[#EF4444]">
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      {kpi.change}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {kpi.comparisonText}
                  </span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="pt-2 flex justify-end">
                <Sparkline
                  data={kpi.sparklineData}
                  isPositive={kpi.isPositive}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left Charts (8 cols) + Right Summary Panel (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left / Center Charts Section */}
        <div className="xl:col-span-8 space-y-6">
          {/* Top Charts Row: Calorie Intake vs Burn + Macronutrient Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveBarChart
              data={CALORIE_INTAKE_VS_BURN}
              title="Calorie Intake vs Burn"
            />
            <MacronutrientDonut distribution={MACRONUTRIENT_DISTRIBUTION} />
          </div>

          {/* Bottom Charts Row: Weight Progress + Body Composition Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightProgressChart weightData={WEIGHT_PROGRESS} />
            <BodyCompositionChart data={BODY_COMPOSITION} />
          </div>

          {/* Bottom Highlight Cards Row: Top Performing Days + Areas for Improvement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Days */}
            <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Top Performing Days</h3>
                  <p className="text-[11px] text-slate-400">Your best days based on goals completion</p>
                </div>
                <button onClick={() => navigate("calendar")} className="text-xs font-semibold text-[#2BAF34] hover:underline">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {TOP_PERFORMING_DAYS.map((day) => (
                  <div
                    key={day.date}
                    className="p-3 rounded-xl bg-[#121B26] border border-[#1E2D42] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#2BAF34]/15 border-2 border-[#2BAF34] flex items-center justify-center font-black text-xs text-[#2BAF34]">
                        {day.percentage}%
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{day.date}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-[#F59E0B]" />
                            {day.calories}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-3 h-3 text-[#2BAF34]" />
                            {day.protein}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-300 bg-[#162230] px-2 py-1 rounded-md border border-white/5">
                      {day.extra}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Areas for Improvement</h3>
                <button onClick={() => navigate("progress")} className="text-xs font-semibold text-[#2BAF34] hover:underline">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {AREAS_FOR_IMPROVEMENT.map((area) => {
                  let Icon = Droplets;
                  let iconColor = 'text-[#3B82F6] bg-[#3B82F6]/15';
                  if (area.icon === 'sleep') {
                    Icon = Moon;
                    iconColor = 'text-[#8B5CF6] bg-[#8B5CF6]/15';
                  } else if (area.icon === 'strength') {
                    Icon = Dumbbell;
                    iconColor = 'text-[#F59E0B] bg-[#F59E0B]/15';
                  }

                  return (
                    <div
                      key={area.id}
                      className="p-3 rounded-xl bg-[#121B26] border border-[#1E2D42] flex items-start gap-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{area.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Panel */}
        <div className="xl:col-span-4 space-y-6">
          {/* Report Summary */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Report Summary</h3>
              <div className="relative">
                <select
                  value={summaryFilter}
                  onChange={(e) => setSummaryFilter(e.target.value)}
                  className="bg-[#121B26] border border-[#1E2D42] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 pr-6 appearance-none focus:outline-none focus:border-[#2BAF34] cursor-pointer"
                >
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              {REPORT_SUMMARY.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#121B26] border border-[#1E2D42]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#121B26] flex items-center justify-center text-slate-300">
                      {item.label.includes('Calories') && <Flame className="w-4 h-4 text-[#F59E0B]" />}
                      {item.label.includes('Protein') && <Dumbbell className="w-4 h-4 text-[#2BAF34]" />}
                      {item.label.includes('Water') && <Droplets className="w-4 h-4 text-[#3B82F6]" />}
                      {item.label.includes('Workouts') && <Award className="w-4 h-4 text-[#8B5CF6]" />}
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">{item.label}</span>
                      <span className="text-xs font-bold text-white">{item.value}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold flex items-center ${
                      item.positive ? 'text-[#2BAF34]' : 'text-[#EF4444]'
                    }`}
                  >
                    {item.positive ? '+' : ''}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Progress */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Goal Progress</h3>
              <button onClick={() => navigate("goals")} className="text-xs font-semibold text-[#2BAF34] hover:underline">
                View Goals &rarr;
              </button>
            </div>

            <div className="space-y-4">
              {REPORT_GOALS.map((goal) => (
                <div key={goal.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{goal.title}</span>
                    <span className="text-slate-400 font-medium">
                      <span className="text-white font-bold">{goal.current}</span> / {goal.target}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-[#162230] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${goal.percentage}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white w-8 text-right">
                      {goal.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0D141C] border border-[#162230] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
              <button onClick={() => navigate("dashboard")} className="text-xs font-semibold text-[#2BAF34] hover:underline">
                View All &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {RECENT_ACTIVITY.map((act) => {
                let Icon = Dumbbell;
                let iconColor = 'text-[#3B82F6] bg-[#3B82F6]/10';

                if (act.icon === 'water') {
                  Icon = Droplets;
                  iconColor = 'text-[#06B6D4] bg-[#06B6D4]/10';
                } else if (act.icon === 'food') {
                  Icon = Utensils;
                  iconColor = 'text-[#F59E0B] bg-[#F59E0B]/10';
                }

                return (
                  <div
                    key={act.title}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#121B26] border border-[#1E2D42]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{act.title}</h4>
                        <span className="text-[10px] text-slate-400">{act.meta}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{act.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
