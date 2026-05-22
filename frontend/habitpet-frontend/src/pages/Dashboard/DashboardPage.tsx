import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  CloudUploadOutlined as UploadIcon,
} from '@mui/icons-material';

import { useAuth } from '../../store/AuthContext';
import { getUser, uploadAvatar, UserProfile } from '../../api/userApi';
import { getPet, feedPet, playWithPet, PetInfo } from '../../api/petApi';
import { getUserHabits, completeHabit, UserHabit } from '../../api/habitsApi';

import PetStatusCard from '../../components/dashboard/PetStatusCard';
import UserStatsCard from '../../components/dashboard/UserStatsCard';
import HabitsChecklist from '../../components/dashboard/HabitsChecklist';
import SideToast from '../../components/SideToast';

const getAvatarUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://localhost:7059${url}`;
};

const DashboardPage = () => {
  const { userId } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pet, setPet] = useState<PetInfo | null>(null);
  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [filterToday, setFilterToday] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    try {
      const [uData, pData, hData] = await Promise.all([
        getUser(userId),
        getPet(userId),
        getUserHabits(userId),
      ]);
      setUserProfile(uData);
      setPet(pData);
      setHabits(hData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setToast({ message: 'Failed to sync data with the temple database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#ff8624' }} />
      </Box>
    );
  }

  const handleFeed = async () => {
    if (!userId || !userProfile?.Stats) return;
    if (userProfile.Stats.currentXp < 10) {
      setToast({ message: 'You need at least 10 XP to feed your pet.', type: 'error' });
      return;
    }
    setActionLoading('feed');
    try {
      await feedPet(userId);
      setToast({ message: 'Your pet has been fed. Comfort +10, Hunger Reduced.', type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to feed pet.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlay = async () => {
    if (!userId || !userProfile?.Stats) return;
    if (userProfile.Stats.currentXp < 15) {
      setToast({ message: 'You need at least 15 XP to play with your pet.', type: 'error' });
      return;
    }
    setActionLoading('play');
    try {
      await playWithPet(userId);
      setToast({ message: 'You played with your pet. Happiness +20, Mood +15.', type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to play with pet.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteHabit = async (habitId: number, title: string) => {
    if (!userId) return;
    setActionLoading(`complete-${habitId}`);
    try {
      await completeHabit(habitId, userId);
      setToast({ message: `Ritual "${title}" completed successfully! XP gained.`, type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to mark habit as completed.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      await uploadAvatar(userId, file);
      setToast({ message: 'Avatar updated successfully.', type: 'success' });
      await fetchData();
    } catch (error) {
      setToast({ message: 'Failed to upload avatar. Limit to JPEG, PNG, or WebP.', type: 'error' });
    }
  };

  const handleCreatePlaceholder = () => {
    setToast({ message: 'Ritual creation will be unlocked in the next stage of training.', type: 'success' });
  };

  const handlePresetPlaceholder = () => {
    setToast({ message: 'Preset templates catalog will be unlocked in the next stage.', type: 'success' });
  };

  return (
    <Box
      sx={{
        color: '#111111',
        fontFamily: "'Inter', Arial, sans-serif",
        p: { xs: 2.5, md: 5 },
      }}
    >
      {toast && (
        <SideToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp"
      />

      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 3,
          borderBottom: '1px solid #e6e3dd',
          mb: 5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: '24px',
              letterSpacing: '0.1em',
              color: '#111',
            }}
          >
            HABITPET
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: '12px',
              color: '#4A6070',
              letterSpacing: '0.15em',
              mt: 0.5,
            }}
          >
            DASHBOARD
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>
              {userProfile?.fullName}
            </Typography>
            <Typography sx={{ fontSize: '14.5px', color: '#4A6070', fontWeight: 500 }}>
              @{userProfile?.username}
            </Typography>
          </Box>

          <Tooltip title="Upload portrait" arrow>
            <Box
              onClick={handleAvatarClick}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '50%',
                border: '1px solid #e6e3dd',
                p: '3px',
                transition: 'transform 180ms ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  '& .avatar-overlay': { opacity: 1 },
                },
              }}
            >
              <Avatar
                src={getAvatarUrl(userProfile?.avatarUrl)}
                sx={{
                  width: 53,
                  height: 53,
                  bgcolor: '#ffd1a7',
                  color: '#ff8624',
                  fontWeight: 800,
                  fontSize: '20px',
                }}
              >
                {userProfile?.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <Box
                className="avatar-overlay"
                sx={{
                  position: 'absolute',
                  inset: 3,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 180ms ease',
                  color: '#fff',
                }}
              >
                <UploadIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '4.5fr 7.5fr' },
          gap: 4,
          alignItems: 'start',
        }}
      >
        <PetStatusCard
          pet={pet}
          currentXp={userProfile?.Stats?.currentXp || 0}
          actionLoading={actionLoading}
          onFeed={handleFeed}
          onPlay={handlePlay}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <UserStatsCard
            currentLevel={userProfile?.Stats?.currentLevel || 1}
            totalXpEarned={userProfile?.Stats?.totalXpEarned || 0}
            currentXp={userProfile?.Stats?.currentXp || 0}
            totalHabitsDone={userProfile?.Stats?.totalHabitsDone || 0}
            totalDaysActive={userProfile?.Stats?.totalDaysActive || 0}
          />
          <HabitsChecklist
            habits={habits}
            filterToday={filterToday}
            setFilterToday={setFilterToday}
            actionLoading={actionLoading}
            onCompleteHabit={handleCompleteHabit}
            onCreatePlaceholder={handleCreatePlaceholder}
            onPresetPlaceholder={handlePresetPlaceholder}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
