import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TimelineOutlined as ChartIcon } from '@mui/icons-material';

interface ChartDataPoint {
  dayName: string;
  dateStr: string;
  health: number;
  hunger: number;
  happiness: number;
}

interface PetStatsChartProps {
  chartData: ChartDataPoint[];
}

const PetStatsChart = ({ chartData }: PetStatsChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getPathD = (key: 'health' | 'hunger' | 'happiness') => {
    if (!chartData || chartData.length === 0) return '';
    return chartData.map((pt, idx) => {
      const x = 35 + idx * 85;
      const y = 15 + (100 - pt[key]) * 1.6;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 3,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '1px solid #f2effa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <ChartIcon sx={{ color: '#4A6070', fontSize: 18 }} />
          <Typography sx={{ fontWeight: 800, fontSize: '11px', letterSpacing: '0.15em', color: '#4A6070' }}>
            WEEKLY COMPANION METRICS
          </Typography>
        </Box>

        {hoveredIndex !== null ? (
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>
            <Box component="span" sx={{ color: '#4A6070', mr: 1 }}>
              [{chartData[hoveredIndex].dayName}, {chartData[hoveredIndex].dateStr}]
            </Box>
            <Box component="span" sx={{ color: '#d71920', mr: 1.5 }}>
              Health: {chartData[hoveredIndex].health}%
            </Box>
            <Box component="span" sx={{ color: '#ff8624', mr: 1.5 }}>
              Hunger: {chartData[hoveredIndex].hunger}%
            </Box>
            <Box component="span" sx={{ color: '#c59265' }}>
              Happiness: {chartData[hoveredIndex].happiness}%
            </Box>
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#d71920' }} />
              <Typography sx={{ fontSize: '9.5px', fontWeight: 800, color: '#888' }}>HEALTH</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff8624' }} />
              <Typography sx={{ fontSize: '9.5px', fontWeight: 800, color: '#888' }}>HUNGER</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#c59265' }} />
              <Typography sx={{ fontSize: '9.5px', fontWeight: 800, color: '#888' }}>HAPPINESS</Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 560 200"
          style={{ width: '100%', height: 'auto', maxHeight: '180px' }}
        >
          {[0, 25, 50, 75, 100].map((level) => {
            const y = 15 + (100 - level) * 1.6;
            return (
              <g key={level}>
                <line
                  x1={35}
                  y1={y}
                  x2={545}
                  y2={y}
                  stroke="#f2effa"
                  strokeWidth="1.2"
                  strokeDasharray={level === 0 || level === 100 ? 'none' : '4 4'}
                />
                <text
                  x={28}
                  y={y + 4}
                  textAnchor="end"
                  style={{ fill: '#888', fontSize: '9px', fontWeight: 700, fontFamily: 'Inter' }}
                >
                  {level}%
                </text>
              </g>
            );
          })}

          {chartData.map((pt, idx) => {
            const x = 35 + idx * 85;
            return (
              <text
                key={idx}
                x={x}
                y={192}
                textAnchor="middle"
                style={{ fill: '#888', fontSize: '9.5px', fontWeight: 700, fontFamily: 'Inter' }}
              >
                {pt.dayName}
              </text>
            );
          })}

          <path
            d={getPathD('health')}
            fill="none"
            stroke="#d71920"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.3s' }}
          />
          <path
            d={getPathD('hunger')}
            fill="none"
            stroke="#ff8624"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.3s' }}
          />
          <path
            d={getPathD('happiness')}
            fill="none"
            stroke="#c59265"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.3s' }}
          />

          {hoveredIndex !== null && (
            <>
              <line
                x1={35 + hoveredIndex * 85}
                y1={15}
                x2={35 + hoveredIndex * 85}
                y2={175}
                stroke="#c8c4bc"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx={35 + hoveredIndex * 85}
                cy={15 + (100 - chartData[hoveredIndex].health) * 1.6}
                r={4.5}
                fill="#d71920"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={35 + hoveredIndex * 85}
                cy={15 + (100 - chartData[hoveredIndex].hunger) * 1.6}
                r={4.5}
                fill="#ff8624"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx={35 + hoveredIndex * 85}
                cy={15 + (100 - chartData[hoveredIndex].happiness) * 1.6}
                r={4.5}
                fill="#c59265"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </>
          )}

          {chartData.map((pt, idx) => {
            const x = 35 + idx * 85;
            return (
              <rect
                key={idx}
                x={x - 42.5}
                y={15}
                width={85}
                height={160}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>
      </Box>
    </Box>
  );
};

export default PetStatsChart;
