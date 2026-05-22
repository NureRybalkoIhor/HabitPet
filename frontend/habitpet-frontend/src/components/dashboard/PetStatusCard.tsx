import { Box, Typography, LinearProgress, IconButton, Tooltip, CircularProgress } from '@mui/material';
import {
  RestaurantOutlined as FoodIcon,
  SportsEsportsOutlined as PlayIcon,
} from '@mui/icons-material';
import { PetInfo } from '../../api/petApi';

interface PetStatusCardProps {
  pet: PetInfo | null;
  currentXp: number;
  actionLoading: string | null;
  onFeed: () => void;
  onPlay: () => void;
}

const PetStatusCard = ({ pet, currentXp, actionLoading, onFeed, onPlay }: PetStatusCardProps) => {
  const getHamsterImage = () => {
    const publicUrl = process.env.PUBLIC_URL || '';
    if (actionLoading === 'feed') {
      return `${publicUrl}/hamster_eating.png`;
    }
    if (actionLoading === 'play') {
      return `${publicUrl}/hamster_playing.png`;
    }
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

  const fullness = pet ? Math.max(0, 100 - pet.hunger) : 0;

  return (
    <Box
      sx={{
        bgcolor: '#fffafa',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%', mb: 3, pb: 1.5, borderBottom: '1px solid #f2effa' }}>
        <Typography sx={{ fontWeight: 800, fontSize: '13px', letterSpacing: '0.15em', color: '#4A6070' }}>
          PET COMPANION
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: 170,
          height: 170,
          borderRadius: '50%',
          bgcolor: '#ffd1a7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          overflow: 'hidden',
          border: '2px solid #e6e3dd',
        }}
      >
        <Box
          component="img"
          src={getHamsterImage()}
          alt="Hamster Companion"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '0.05em' }}>
        {pet?.name || 'Unnamed Pet'}
      </Typography>

      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#437F70',
          bgcolor: '#effaf3',
          px: 1.6,
          py: 0.5,
          borderRadius: '20px',
          letterSpacing: '0.08em',
          mb: 4,
        }}
      >
        TEMPLE GUARDIAN
      </Typography>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              HEALTH
            </Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#111' }}>
              {pet?.health || 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet?.health || 0}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#d71920' },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              FULLNESS
            </Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#111' }}>
              {fullness}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={fullness}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#ff8624' },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              HAPPINESS
            </Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#111' }}>
              {pet?.happiness || 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet?.happiness || 0}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#ffd1a7' },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#4A6070', letterSpacing: '0.05em' }}>
              MOOD
            </Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#111' }}>
              {pet?.mood || 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet?.mood || 0}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#437F70' },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <Tooltip title="Feed your hamster (Consumes 10 XP)" arrow>
            <span>
              <IconButton
                disabled={actionLoading !== null || currentXp < 10}
                onClick={onFeed}
                sx={{
                  width: '100%',
                  py: 1.5,
                  border: '1px solid #e6e3dd',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff8624',
                  transition: 'all 150ms ease',
                  '&:hover': {
                    bgcolor: '#fff5ec',
                    borderColor: '#ff8624',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    borderColor: '#f2f0ec',
                    color: '#d0cac0',
                  },
                }}
              >
                {actionLoading === 'feed' ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <>
                    <FoodIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>
                      FEED (-10)
                    </Typography>
                  </>
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Tooltip title="Play with your hamster (Consumes 15 XP)" arrow>
            <span>
              <IconButton
                disabled={actionLoading !== null || currentXp < 15}
                onClick={onPlay}
                sx={{
                  width: '100%',
                  py: 1.5,
                  border: '1px solid #e6e3dd',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#437F70',
                  transition: 'all 150ms ease',
                  '&:hover': {
                    bgcolor: '#effaf3',
                    borderColor: '#437F70',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    borderColor: '#f2f0ec',
                    color: '#d0cac0',
                  },
                }}
              >
                {actionLoading === 'play' ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <>
                    <PlayIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>
                      PLAY (-15)
                    </Typography>
                  </>
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default PetStatusCard;
