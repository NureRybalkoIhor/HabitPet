import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useAuth } from '../../store/AuthContext';
import { getUser, UserProfile } from '../../api/userApi';
import { getPet, getPetActions, updatePetName, PetInfo, PetActionInfo } from '../../api/petApi';
import SideToast from '../../components/SideToast';
import PetProfileCard from './components/PetProfileCard';
import PetStatsChart from './components/PetStatsChart';
import PetActionHistory from './components/PetActionHistory';

const badQuotes = [
  "My tummy is rumbling... A little snack would be nice.",
  "I'm feeling a bit weak. Let's take a small step of care today.",
  "Taking care of your companion helps us stay in balance."
];

const goodQuotes = [
  "I'm happy to walk this path with you!",
  "Let's focus and build our habits today.",
  "Remember to breathe and stretch during your work."
];

const normalQuotes = [
  "Is it time for a short break?",
  "A quiet step is still a step forward.",
  "I'm keeping watch over your temple."
];

const parseUtcDate = (dateStr?: string) => {
  if (!dateStr || dateStr.startsWith('0001-01-01')) return null;
  let formatted = dateStr;
  if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !/-\d{2}:\d{2}$/.test(dateStr)) {
    formatted = dateStr + 'Z';
  }
  return new Date(formatted);
};

const formatDateTime = (dateStr?: string) => {
  const date = parseUtcDate(dateStr);
  if (!date) return 'Never';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTimeAgo = (dateStr?: string) => {
  const date = parseUtcDate(dateStr);
  if (!date) return 'Never';
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface ChartDataPoint {
  dayName: string;
  dateStr: string;
  health: number;
  hunger: number;
  happiness: number;
}

const generateHistoricalData = (pet: PetInfo, actionsList: PetActionInfo[]): ChartDataPoint[] => {
  const points: ChartDataPoint[] = [];
  
  let h = pet.health;
  let hunger = pet.hunger;
  let hap = pet.happiness;
  let m = pet.mood;
  
  const now = new Date();
  
  const sortedActions = [...actionsList].sort((a, b) => {
    const timeA = parseUtcDate(a.actionTime)?.getTime() || 0;
    const timeB = parseUtcDate(b.actionTime)?.getTime() || 0;
    return timeB - timeA;
  });
  
  let actionIdx = 0;
  const hoursCount = 7 * 24;
  let simTime = new Date(now.getTime());
  
  for (let hr = 0; hr < hoursCount; hr++) {
    const nextSimTime = new Date(simTime.getTime() - 60 * 60 * 1000);
    
    while (actionIdx < sortedActions.length) {
      const act = sortedActions[actionIdx];
      const actTime = parseUtcDate(act.actionTime);
      if (!actTime) {
        actionIdx++;
        continue;
      }
      
      if (actTime.getTime() > simTime.getTime()) {
        actionIdx++;
        continue;
      }
      
      if (actTime.getTime() <= nextSimTime.getTime()) {
        break;
      }
      
      const isFeed = act.actionType.toLowerCase() === 'feed';
      if (isFeed) {
        hunger = Math.min(100, hunger + 30);
        hap = Math.max(0, hap - 10);
      } else {
        hap = Math.max(0, hap - 20);
        m = Math.max(0, m - 15);
      }
      actionIdx++;
    }
    
    if (hunger > 80) {
      h = Math.min(100, h + 5);
    }
    hunger = Math.max(0, hunger - 2);
    hap = Math.min(100, hap + 1);
    
    simTime = nextSimTime;
    
    if ((hr + 1) % 24 === 0) {
      const dayName = simTime.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = simTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      points.unshift({
        dayName,
        dateStr,
        health: h,
        hunger,
        happiness: hap,
      });
    }
  }
  
  const todayName = now.toLocaleDateString('en-US', { weekday: 'short' });
  const todayDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  points.push({
    dayName: todayName,
    dateStr: todayDateStr,
    health: pet.health,
    hunger: pet.hunger,
    happiness: pet.happiness,
  });
  
  return points.slice(-7);
};

const PetPage = () => {
  const { userId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pet, setPet] = useState<PetInfo | null>(null);
  const [actions, setActions] = useState<PetActionInfo[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [visibleActionsCount, setVisibleActionsCount] = useState(5);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const [uData, pData, aData] = await Promise.all([
        getUser(userId),
        getPet(userId),
        getPetActions(userId),
      ]);
      setProfile(uData);
      setPet(pData);
      setActions(aData);
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to synchronize companion details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNameUpdate = async (newName: string) => {
    if (!pet) return;
    try {
      await updatePetName(pet.petId, newName);
      setToast({ message: `Companion renamed to ${newName}.`, type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to update companion name.', type: 'error' });
      throw error;
    }
  };

  const getPetDialogue = () => {
    if (!pet) return "Greeting, seeker.";
    
    const isBad = pet.health <= 30 || pet.hunger >= 80;
    const isGood = pet.happiness >= 75 && pet.mood >= 75;

    let quotes = normalQuotes;
    if (isBad) quotes = badQuotes;
    else if (isGood) quotes = goodQuotes;

    const index = new Date().getDate() % quotes.length;
    return quotes[index];
  };

  const getHamsterImage = () => {
    const publicUrl = process.env.PUBLIC_URL || '';
    if (pet) {
      if (pet.health <= 30 || pet.hunger >= 80) {
        return `${publicUrl}/hamster_sad.png`;
      }
      if (pet.happiness >= 75 && pet.mood >= 75) {
        return `${publicUrl}/hamster_happy.png`;
      }
    }
    return `${publicUrl}/hamster_normal.png`;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#ff8624' }} />
      </Box>
    );
  }

  const totalXpSpent = actions.reduce((sum, item) => sum + item.xpSpent, 0);
  const dialogue = getPetDialogue();
  const daysActive = profile?.stats?.totalDaysActive || 1;
  const careScore = pet ? Math.min(100, Math.round(pet.health * 0.8 + pet.happiness * 0.2)) : 100;
  const chartData = pet ? generateHistoricalData(pet, actions) : [];

  return (
    <Box
      sx={{
        color: '#111111',
        fontFamily: "'Inter', Arial, sans-serif",
        p: { xs: 2, md: 3.5 },
        width: '100%',
        boxSizing: 'border-box',
        minHeight: { xs: 'auto', md: 'calc(100vh - 56px)' },
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
          PET COMPANION
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
          PET PROFILE & LOGS
        </Typography>
      </Box>

      {pet ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '4.5fr 7.5fr' },
            gap: 3.5,
            width: '100%',
            alignItems: 'stretch',
            flexGrow: 1,
          }}
        >
          <Box sx={{ width: '100%' }}>
            <PetProfileCard
              pet={pet}
              profile={profile}
              actions={actions}
              totalXpSpent={totalXpSpent}
              daysActive={daysActive}
              careScore={careScore}
              dialogue={dialogue}
              getHamsterImage={getHamsterImage}
              onNameUpdate={handleNameUpdate}
              formatTimeAgo={formatTimeAgo}
              formatDateTime={formatDateTime}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, width: '100%', height: '100%' }}>
            <PetStatsChart chartData={chartData} />
            <PetActionHistory
              actions={actions}
              visibleActionsCount={visibleActionsCount}
              onLoadMore={() => setVisibleActionsCount((prev) => prev + 5)}
              formatDateTime={formatDateTime}
            />
          </Box>
        </Box>
      ) : (
        <Typography sx={{ fontStyle: 'italic', textAlign: 'center', color: '#888', py: 4 }}>
          No companion found in the sanctuary database.
        </Typography>
      )}
    </Box>
  );
};

export default PetPage;
