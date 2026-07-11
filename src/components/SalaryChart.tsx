import React from "react";
import { CareerProgression } from "../types";
import { TrendingUp, Coins } from "lucide-react";

interface SalaryChartProps {
  progression: CareerProgression[];
}

export default function SalaryChart({ progression }: SalaryChartProps) {
  // If empty or missing, provide robust defaults
  const data = progression && progression.length > 0 ? progression : [
    { level: "entry", title: "Junior", yearsExperience: "0-2y", avgSalaryUSD: 65000, keySkills: [] },
    { level: "mid", title: "Mid-Level", yearsExperience: "2-5y", avgSalaryUSD: 95000, keySkills: [] },
    { level: "senior", title: "Senior", yearsExperience: "5+y", avgSalaryUSD: 135000, keySkills: [] }
  ];

  const padding = 40;
  const width = 500;
  const height = 240;

  const minSalary = Math.min(...data.map(d => d.avgSalaryUSD)) * 0.85;
  const maxSalary = Math.max(...data.map(d => d.avgSalaryUSD)) * 1.15;

  const getX = (index: number) => {
    if (data.length <= 1) return width / 2;
    return padding + (index * (width - 2 * padding)) / (data.length - 1);
  };

  const getY = (salary: number) => {
    const scaleY = (height - 2 * padding) / (maxSalary - minSalary);
    return height - padding - (salary - minSalary) * scaleY;
  };

  // Generate SVG path for line
  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.avgSalaryUSD)}`)
    .join(" ");

  // Generate SVG path for filled area under line
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

  return (
    <div className="p-6 bg-brand-surface border border-white/5 rounded-2xl space-y-4 text-left">
      <div>
        <h5 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-secondary" /> Lifetime Salary Projection Curve
        </h5>
        <p className="text-xs text-brand-muted mt-1">
          Historical aggregate of base salaries mapped against typical industry career ladder durations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Line Chart */}
        <div className="md:col-span-8 bg-brand-bg/50 border border-white/5 p-4 rounded-xl flex items-center justify-center">
          <div className="relative w-full max-w-[500px]">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const s = minSalary + p * (maxSalary - minSalary);
                const y = getY(s);
                return (
                  <g key={idx}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={width - padding}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    <text
                      x={padding - 8}
                      y={y + 4}
                      fill="#a1a1aa"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      ${Math.round(s / 1000)}k
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#gradient-area)" opacity="0.15" />

              {/* Trend Line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#gradient-line)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {data.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={getX(i)}
                    cy={getY(d.avgSalaryUSD)}
                    r="5"
                    className="fill-brand-secondary stroke-brand-bg stroke-[2]"
                  />
                  <text
                    x={getX(i)}
                    y={getY(d.avgSalaryUSD) - 12}
                    fill="#FFFFFF"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    ${Math.round(d.avgSalaryUSD / 1000)}k
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {data.map((d, i) => (
                <text
                  key={i}
                  x={getX(i)}
                  y={height - padding + 18}
                  fill="#a1a1aa"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fontWeight="medium"
                  textAnchor="middle"
                >
                  {d.yearsExperience}
                </text>
              ))}

              {/* Definitions */}
              <defs>
                <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Side Progression ladder points */}
        <div className="md:col-span-4 space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {data.map((step, idx) => (
            <div key={idx} className="p-3 bg-brand-bg/50 border border-white/5 rounded-xl flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-secondary/15 border border-brand-secondary/25 flex items-center justify-center text-[10px] font-bold text-brand-secondary mt-0.5 shrink-0">
                {idx + 1}
              </div>
              <div>
                <h6 className="text-xs font-bold text-white capitalize leading-none">{step.title}</h6>
                <span className="block text-[10px] text-brand-muted mt-1 leading-normal font-mono">
                  {step.yearsExperience} experience • Avg: ${step.avgSalaryUSD.toLocaleString()}/yr
                </span>
                {step.keySkills && step.keySkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {step.keySkills.slice(0, 2).map((skill, sIdx) => (
                      <span key={sIdx} className="text-[8px] font-mono px-1 py-0.5 rounded bg-brand-surface border border-white/5 text-brand-muted">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
