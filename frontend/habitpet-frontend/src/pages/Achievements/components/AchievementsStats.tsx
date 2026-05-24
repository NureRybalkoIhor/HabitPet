import { Fragment } from 'react';
import { Box, Typography, Grid, Paper, LinearProgress } from '@mui/material';
import { getDifficultyStyle } from './achievementsHelpers';

interface AchievementsStatsProps {
  unlockedCount: number;
  totalCount: number;
  unlockedXp: number;
  completionPercentage: number;
  getDifficultyStats: (diff: string) => { unlocked: number; total: number };
}

const AchievementsStats = ({
  unlockedCount,
  totalCount,
  unlockedXp,
  completionPercentage,
  getDifficultyStats,
}: AchievementsStatsProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3.5,
        borderRadius: '16px',
        border: '1px solid #e6e3dd',
        bgcolor: '#fffafa',
        mb: 4.5,
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{
          '--Grid-columnSpacing': {
            xs: '24px',
            md: 'clamp(24px, calc((100vw - 250px) * 0.07), 120px)',
          },
        }}
      >
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pl: { xs: 0, md: 18 },
          }}
        >
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', letterSpacing: '0.08em', mb: 1.2 }}>
            UNLOCKED ACHIEVEMENTS
          </Typography>
          <Typography sx={{ fontSize: '36px', fontWeight: 900, mb: 1.2, lineHeight: 1 }}>
            {unlockedCount} / {totalCount}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#437F70' },
              mb: 0.8,
              width: '100%',
              maxWidth: '220px',
            }}
          />
          <Typography sx={{ fontSize: '10.5px', color: '#666', fontWeight: 700 }}>
            {completionPercentage}% Completed
          </Typography>
        </Grid>

        <Grid item xs={12} md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Box sx={{ width: '1px', height: '80px', bgcolor: '#e6e3dd' }} />
        </Grid>

        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', letterSpacing: '0.08em', mb: 1.2 }}>
            TOTAL REWARD XP EARNED
          </Typography>
          <Typography sx={{ fontSize: '36px', fontWeight: 900, color: '#ff8624', mb: 1.2, lineHeight: 1 }}>
            +{unlockedXp} XP
          </Typography>
          <Typography sx={{ fontSize: '11px', color: '#888', fontWeight: 600, mt: 0.8 }}>
            Awarded directly to stats
          </Typography>
        </Grid>

        <Grid item xs={12} md={0.5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Box sx={{ width: '1px', height: '80px', bgcolor: '#e6e3dd' }} />
        </Grid>

        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#888', letterSpacing: '0.08em', mb: 2, textAlign: 'center' }}>
            DIFFICULTY LEVEL UNLOCKS
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {['Very Easy', 'Easy', 'Medium', 'Hard', 'Super Hard'].map((diff, idx) => {
              const stats = getDifficultyStats(diff);
              const style = getDifficultyStyle(diff);
              return (
                <Fragment key={diff}>
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mr: idx < 4 ? { xs: 1.5, md: 3 } : 0,
                    }}
                  >
                    <Typography sx={{ fontSize: '26px', fontWeight: 900, color: stats.unlocked > 0 ? style.text : '#a8a296', lineHeight: 1 }}>
                      {stats.unlocked}
                      <Box component="span" sx={{ fontSize: '15px', color: '#888', fontWeight: 700, ml: 0.4 }}>
                        / {stats.total}
                      </Box>
                    </Typography>
                    <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#888', letterSpacing: '0.05em', mt: 1 }}>
                      {diff === 'Super Hard' ? 'S. HARD' : diff.toUpperCase()}
                    </Typography>
                    <Box sx={{ width: 12, height: 3, borderRadius: 1.5, bgcolor: style.border, mt: 1 }} />
                  </Box>
                  {idx < 4 && (
                    <Box
                      sx={{
                        width: '1px',
                        height: '40px',
                        bgcolor: '#e6e3dd',
                        mr: { xs: 1.5, md: 3 },
                      }}
                    />
                  )}
                </Fragment>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AchievementsStats;
