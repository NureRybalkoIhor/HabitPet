import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Tabs, Tab, CircularProgress, Select, MenuItem } from '@mui/material';

import { useAuth } from '../../store/AuthContext';
import { getAchievements, AchievementInfo } from '../../api/achievementsApi';
import SideToast from '../../components/SideToast';
import AchievementsStats from './components/AchievementsStats';
import AchievementCard from './components/AchievementCard';
import { difficultyOrder } from './components/achievementsHelpers';

const AchievementsPage = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<AchievementInfo[]>([]);
  const [filterTab, setFilterTab] = useState('ALL');
  const [sortBy, setSortBy] = useState<'default' | 'difficultyAsc' | 'difficultyDesc' | 'xpDesc' | 'unlockedFirst' | 'lockedFirst'>('default');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchAchievements = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getAchievements(userId);
      setAchievements(data);
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to synchronize achievements database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#ff8624' }} />
      </Box>
    );
  }

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const unlockedXp = achievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  const getDifficultyStats = (diff: string) => {
    const unlocked = achievements.filter((a) => a.rarity === diff && a.isUnlocked).length;
    const total = achievements.filter((a) => a.rarity === diff).length;
    return { unlocked, total };
  };

  const filteredAchievements = achievements.filter((a) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'RITUALS') return a.category.toLowerCase() === 'ritual';
    if (filterTab === 'COMPANION') return a.category.toLowerCase() === 'companion';
    if (filterTab === 'JOURNEY') return a.category.toLowerCase() === 'journey';
    return true;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === 'difficultyAsc') {
      return (difficultyOrder[a.rarity] || 0) - (difficultyOrder[b.rarity] || 0);
    }
    if (sortBy === 'difficultyDesc') {
      return (difficultyOrder[b.rarity] || 0) - (difficultyOrder[a.rarity] || 0);
    }
    if (sortBy === 'xpDesc') {
      return b.xpReward - a.xpReward;
    }
    if (sortBy === 'unlockedFirst') {
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      return 0;
    }
    if (sortBy === 'lockedFirst') {
      if (!a.isUnlocked && b.isUnlocked) return -1;
      if (a.isUnlocked && !b.isUnlocked) return 1;
      return 0;
    }
    return 0;
  });

  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <Box
      sx={{
        color: '#111111',
        fontFamily: "'Inter', Arial, sans-serif",
        p: { xs: 2, md: 3.5 },
        width: '100%',
        boxSizing: 'border-box',
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {toast && (
        <SideToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Box
        component="header"
        sx={{
          pb: 2,
          borderBottom: '1px solid #e6e3dd',
          mb: 3.5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: '22px',
            letterSpacing: '0.15em',
            color: '#111',
          }}
        >
          ACHIEVEMENTS
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '11px',
            color: '#4A6070',
            letterSpacing: '0.15em',
            mt: 0.5,
          }}
        >
          ACCOMPLISHMENTS & JOURNEY CHECKLIST
        </Typography>
      </Box>

      <AchievementsStats
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        unlockedXp={unlockedXp}
        completionPercentage={completionPercentage}
        getDifficultyStats={getDifficultyStats}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e6e3dd',
          mb: 4.5,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Tabs
          value={filterTab}
          onChange={(_, val) => setFilterTab(val)}
          sx={{
            minHeight: 'auto',
            '& .MuiTabs-indicator': {
              bgcolor: '#ff8624',
              height: '2px',
            },
          }}
        >
          {['ALL', 'RITUALS', 'COMPANION', 'JOURNEY'].map((tab) => (
            <Tab
              key={tab}
              value={tab}
              label={tab === 'RITUALS' ? 'RITUALS & HABITS' : tab}
              sx={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                px: 3,
                py: 1.5,
                minHeight: 'auto',
                color: '#4A6070',
                '&.Mui-selected': {
                  color: '#ff8624',
                },
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ pb: { xs: 1.5, sm: 0 } }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            size="small"
            sx={{
              fontSize: '11px',
              fontFamily: "'Inter', sans-serif",
              height: '28px',
              borderColor: '#e6e3dd',
              bgcolor: 'transparent',
              fontWeight: 700,
              color: '#4A6070',
            }}
          >
            <MenuItem value="default">Sort: Default</MenuItem>
            <MenuItem value="difficultyAsc">Sort: Difficulty (Easy first)</MenuItem>
            <MenuItem value="difficultyDesc">Sort: Difficulty (Hard first)</MenuItem>
            <MenuItem value="xpDesc">Sort: XP Reward</MenuItem>
            <MenuItem value="unlockedFirst">Sort: Unlocked First</MenuItem>
            <MenuItem value="lockedFirst">Sort: Locked First</MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {sortedAchievements.map((ach) => (
          <Grid item xs={12} sm={6} lg={4} key={ach.achievementId} sx={{ display: 'flex' }}>
            <AchievementCard ach={ach} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AchievementsPage;
