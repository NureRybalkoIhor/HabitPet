import { useState } from 'react';
import { Box, Typography, Tooltip, Button } from '@mui/material';
import { UserHabit } from '../../../api/habitsApi';

interface HabitHeatmapProps {
  habits: UserHabit[];
}

const getLocalDateString = (d: Date = new Date()) => {
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

const HabitHeatmap = ({ habits }: HabitHeatmapProps) => {
  const [selectedSeason, setSelectedSeason] = useState<'WINTER' | 'SPRING' | 'SUMMER' | 'AUTUMN'>('SPRING');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const getCompletionsForDate = (dateStr: string) => {
    let count = 0;
    habits.forEach((h) => {
      if (
        h.history?.some(
          (hist) => hist.actionDate === dateStr && hist.habitStatus === 1
        )
      ) {
        count++;
      }
    });
    return count;
  };

  const getHeatmapColor = (count: number) => {
    if (count === 0) return '#F3EFE9';
    if (count === 1) return '#c5d3cf';
    if (count === 2) return '#99b7b0';
    if (count === 3) return '#6b9b90';
    return '#437F70';
  };

  const getSeasonTheme = (season: string) => {
    switch (season) {
      case 'SPRING':
        return { color: '#437F70', bg: '#effaf3' };
      case 'SUMMER':
        return { color: '#ff8624', bg: '#fff5ec' };
      case 'AUTUMN':
        return { color: '#b35d38', bg: '#fbf5ef' };
      default:
        return { color: '#4A6070', bg: '#f0f4f8' };
    }
  };

  const getSeasonMonths = (season: string, year: number) => {
    if (season === 'WINTER') {
      return [
        { year: year - 1, monthIndex: 11, label: 'December' },
        { year: year, monthIndex: 0, label: 'January' },
        { year: year, monthIndex: 1, label: 'February' },
      ];
    } else if (season === 'SPRING') {
      return [
        { year, monthIndex: 2, label: 'March' },
        { year, monthIndex: 3, label: 'April' },
        { year, monthIndex: 4, label: 'May' },
      ];
    } else if (season === 'SUMMER') {
      return [
        { year, monthIndex: 5, label: 'June' },
        { year, monthIndex: 6, label: 'July' },
        { year, monthIndex: 7, label: 'August' },
      ];
    } else {
      return [
        { year, monthIndex: 8, label: 'September' },
        { year, monthIndex: 9, label: 'October' },
        { year, monthIndex: 10, label: 'November' },
      ];
    }
  };

  const getMonthDays = (year: number, monthIndex: number) => {
    const days: (Date | null)[] = [];
    const firstDay = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const jsDay = firstDay.getDay();
    const startPadding = jsDay === 0 ? 6 : jsDay - 1;

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, monthIndex, d));
    }

    const endPadding = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < endPadding; i++) {
      days.push(null);
    }

    return days;
  };

  const currentTheme = getSeasonTheme(selectedSeason);
  const seasonMonths = getSeasonMonths(selectedSeason, selectedYear);

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'start', lg: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '0.15em',
              color: '#4A6070',
            }}
          >
            SEASONAL RITUAL TIMELINE
          </Typography>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              color: currentTheme.color,
              mt: 0.5,
            }}
          >
            {selectedSeason} {selectedYear}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3EFE9', p: '3px', borderRadius: '8px' }}>
            {(['WINTER', 'SPRING', 'SUMMER', 'AUTUMN'] as const).map((s) => {
              const active = selectedSeason === s;
              const theme = getSeasonTheme(s);
              return (
                <Button
                  key={s}
                  onClick={() => setSelectedSeason(s)}
                  size="small"
                  sx={{
                    fontSize: '9px',
                    fontWeight: 800,
                    color: active ? '#ffffff' : '#4A6070',
                    bgcolor: active ? theme.color : 'transparent',
                    px: 1.8,
                    py: 0.6,
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    minWidth: 70,
                    '&:hover': {
                      bgcolor: active ? theme.color : '#e6e3dd',
                    },
                  }}
                >
                  {s}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3EFE9', p: '3px', borderRadius: '8px' }}>
            {[2024, 2025, 2026, 2027].map((y) => {
              const active = selectedYear === y;
              return (
                <Button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  size="small"
                  sx={{
                    fontSize: '9px',
                    fontWeight: 800,
                    color: active ? '#ffffff' : '#4A6070',
                    bgcolor: active ? currentTheme.color : 'transparent',
                    px: 1.8,
                    py: 0.6,
                    borderRadius: '6px',
                    letterSpacing: '0.05em',
                    minWidth: 50,
                    '&:hover': {
                      bgcolor: active ? currentTheme.color : '#e6e3dd',
                    },
                  }}
                >
                  {y}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <Typography sx={{ fontSize: '10px', color: '#4A6070', fontWeight: 800 }}>Less</Typography>
            <Box sx={{ display: 'flex', gap: '3px' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#F3EFE9' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#c5d3cf' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#99b7b0' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#6b9b90' }} />
              <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: '#437F70' }} />
            </Box>
            <Typography sx={{ fontSize: '10px', color: '#4A6070', fontWeight: 800 }}>More</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'repeat(3, 1fr)' },
          gap: 4.5,
        }}
      >
        {seasonMonths.map((mInfo) => {
          const days = getMonthDays(mInfo.year, mInfo.monthIndex);
          const colsCount = days.length / 7;

          return (
            <Box
              key={`${mInfo.year}-${mInfo.monthIndex}`}
              sx={{
                bgcolor: '#ffffff',
                border: '1px solid #e6e3dd',
                borderRadius: '12px',
                p: 3,
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '13px',
                  color: currentTheme.color,
                  letterSpacing: '0.05em',
                  mb: 2.5,
                  textTransform: 'uppercase',
                }}
              >
                {mInfo.label} {mInfo.year}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(7, 28px)',
                    gap: '6px',
                    width: '75px',
                    pr: 1,
                  }}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <Box key={day} sx={{ display: 'flex', alignItems: 'center', height: 28 }}>
                      <Typography
                        sx={{
                          fontSize: '8px',
                          fontWeight: 800,
                          color: '#888',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateRows: 'repeat(7, 28px)',
                    gridTemplateColumns: `repeat(${colsCount}, 28px)`,
                    gridAutoFlow: 'column',
                    gap: '6px',
                  }}
                >
                  {days.map((d, dIdx) => {
                    if (d === null) {
                      return <Box key={`empty-${dIdx}`} sx={{ width: 28, height: 28 }} />;
                    }

                    const dateStr = getLocalDateString(d);
                    const completions = getCompletionsForDate(dateStr);
                    const cellColor = getHeatmapColor(completions);

                    let textColor = '#4A6070';
                    if (completions >= 3) textColor = '#ffffff';
                    else if (completions > 0) textColor = '#111111';

                    return (
                      <Tooltip
                        key={dateStr}
                        title={`${dateStr}: ${completions} completions`}
                        arrow
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '6px',
                            bgcolor: cellColor,
                            color: textColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 100ms ease',
                            border: '1px solid #e6e3dd',
                            '&:hover': {
                              transform: 'scale(1.15)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              zIndex: 1,
                            },
                          }}
                        >
                          {d.getDate()}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default HabitHeatmap;
