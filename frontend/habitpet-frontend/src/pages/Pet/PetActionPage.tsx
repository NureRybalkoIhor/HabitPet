import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CircularProgress, Typography } from '@mui/material';
import {
  RestaurantOutlined as FoodIcon,
  SportsEsportsOutlined as PlayIcon,
  ArrowBack as BackIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';
import { feedPet, playWithPet } from '../../api/petApi';

const authFont = "'Inter', Arial, sans-serif";

const PetActionPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const [status, setStatus] = useState<'animating' | 'success' | 'error'>('animating');
  const [errorMessage, setErrorMessage] = useState('');
  const [apiDone, setApiDone] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let apiPromise;
    if (type === 'feed') {
      apiPromise = feedPet(userId);
    } else if (type === 'play') {
      apiPromise = playWithPet(userId);
    } else {
      setErrorMessage('Invalid action type.');
      setStatus('error');
      return;
    }

    const timer = setTimeout(() => {
      setAnimationDone(true);
    }, 2500);

    apiPromise
      .then(() => {
        setApiDone(true);
      })
      .catch((err: any) => {
        const msg = err.response?.data || 'Failed to complete action.';
        setErrorMessage(typeof msg === 'string' ? msg : 'Failed to complete action.');
        setStatus('error');
      });

    return () => {
      clearTimeout(timer);
    };
  }, [userId, type]);

  useEffect(() => {
    if (apiDone && animationDone) {
      setStatus('success');
    }
  }, [apiDone, animationDone]);

  const getHamsterImage = () => {
    const publicUrl = process.env.PUBLIC_URL || '';
    if (status === 'error') {
      return `${publicUrl}/hamster_sad.png`;
    }
    if (status === 'success') {
      return `${publicUrl}/hamster_happy.png`;
    }
    if (type === 'feed') {
      return `${publicUrl}/hamster_eating.png`;
    }
    return `${publicUrl}/hamster_playing.png`;
  };

  const getTitle = () => {
    if (status === 'error') return 'Action Failed';
    if (status === 'success') return type === 'feed' ? 'Pet Fed!' : 'Played with Pet!';
    return type === 'feed' ? 'Feeding Hamster...' : 'Playing with Hamster...';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, #fffdfa 0%, #fff0e2 100%)',
        p: 3,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @keyframes chewing {
          0% { transform: scale(1) translateY(0); }
          25% { transform: scale(1.08, 0.92) translateY(5px); }
          50% { transform: scale(0.92, 1.08) translateY(-5px); }
          75% { transform: scale(1.04, 0.96) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes playing {
          0% { transform: scale(1) translateY(0) rotate(0deg); }
          20% { transform: scale(1.1, 0.9) translateY(0) rotate(0deg); }
          40% { transform: scale(0.9, 1.1) translateY(-50px) rotate(180deg); }
          60% { transform: scale(1.05, 0.95) translateY(0) rotate(360deg); }
          80% { transform: scale(0.95, 1.05) translateY(-10px) rotate(360deg); }
          100% { transform: scale(1) translateY(0) rotate(360deg); }
        }
        @keyframes floatUpLeft {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(-60px, -100px); opacity: 0; }
        }
        @keyframes floatUpRight {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(60px, -100px); opacity: 0; }
        }
        @keyframes floatUpCenter {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(0, -120px); opacity: 0; }
        }
        @keyframes pulseHappy {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <Card
        sx={{
          p: 6,
          maxWidth: 480,
          width: '100%',
          border: '1.5px solid #e6e3dd',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(255,134,36,0.08)',
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: authFont,
            fontWeight: 900,
            fontSize: '26px',
            color: '#161616',
            mb: 1.5,
          }}
        >
          {getTitle()}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: authFont,
            fontWeight: 700,
            fontSize: '13px',
            color: '#8c8881',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            mb: 5,
          }}
        >
          {type === 'feed' ? 'Hamster Feeding Sanctuary' : 'Hamster Recreation Area'}
        </Typography>

        {/* Large animation container */}
        <Box
          sx={{
            position: 'relative',
            width: 220,
            height: 220,
            borderRadius: '50%',
            bgcolor: '#ffd1a7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 5,
            border: '3px solid #ff8624',
            boxShadow: '0 12px 36px rgba(255,134,36,0.25)',
          }}
        >
          <Box
            component="img"
            src={getHamsterImage()}
            alt="Pet Action Animation"
            sx={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              animation:
                status === 'animating'
                  ? type === 'feed'
                    ? 'chewing 0.5s infinite ease-in-out'
                    : 'playing 0.8s infinite ease-in-out'
                  : status === 'success'
                  ? 'pulseHappy 1.5s infinite ease-in-out'
                  : 'none',
            }}
          />

          {/* Floating Indicators */}
          {status === 'animating' && type === 'feed' && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  color: '#437F70',
                  fontWeight: 900,
                  fontFamily: authFont,
                  fontSize: '18px',
                  animation: 'floatUpLeft 2.5s forwards ease-out',
                }}
              >
                Hunger -30%
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  color: '#ff8624',
                  fontWeight: 900,
                  fontFamily: authFont,
                  fontSize: '18px',
                  animation: 'floatUpRight 2.5s forwards ease-out',
                  animationDelay: '0.3s',
                  opacity: 0,
                }}
              >
                Happiness +10%
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  color: '#d71920',
                  fontWeight: 900,
                  fontFamily: authFont,
                  fontSize: '20px',
                  animation: 'floatUpCenter 2.5s forwards ease-out',
                  animationDelay: '0.6s',
                  opacity: 0,
                }}
              >
                -10 XP
              </Box>
            </>
          )}

          {status === 'animating' && type === 'play' && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  color: '#ff8624',
                  fontWeight: 900,
                  fontFamily: authFont,
                  fontSize: '18px',
                  animation: 'floatUpLeft 2.5s forwards ease-out',
                }}
              >
                Happiness +20%
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  color: '#437F70',
                  fontWeight: 900,
                  fontFamily: authFont,
                  fontSize: '18px',
                  animation: 'floatUpRight 2.5s forwards ease-out',
                  animationDelay: '0.3s',
                  opacity: 0,
                }}
              >
                Mood +15%
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  color: '#d71920',
                  fontWeight: 900,
                  fontFamily: authFont,
                  fontSize: '20px',
                  animation: 'floatUpCenter 2.5s forwards ease-out',
                  animationDelay: '0.6s',
                  opacity: 0,
                }}
              >
                -15 XP
              </Box>
            </>
          )}
        </Box>

        {/* Action Details & Status Indicators */}
        {status === 'animating' && (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <CircularProgress size={16} sx={{ color: '#ff8624' }} />
              <Typography sx={{ fontFamily: authFont, fontSize: '14px', fontWeight: 600, color: '#4A6070' }}>
                Updating companion status...
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2.5, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {type === 'feed' ? <FoodIcon sx={{ color: '#ff8624', fontSize: 16 }} /> : <PlayIcon sx={{ color: '#437F70', fontSize: 16 }} />}
                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#161616' }}>
                  {type === 'feed' ? '-10 XP' : '-15 XP'}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {status === 'success' && (
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#437F70', mb: 2 }}>
              <SuccessIcon sx={{ fontSize: 28 }} />
              <Typography sx={{ fontFamily: authFont, fontSize: '18px', fontWeight: 800 }}>
                Successfully completed!
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: authFont, fontSize: '14px', color: '#8c8881', px: 2 }}>
              {type === 'feed'
                ? 'Your companion is well-fed now. Hunger decreased by 30% and Happiness increased by 10%.'
                : 'Your companion is delighted! Happiness increased by 20% and Mood increased by 15%.'}
            </Typography>
          </Box>
        )}

        {status === 'error' && (
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#d71920', mb: 2 }}>
              <ErrorIcon sx={{ fontSize: 28 }} />
              <Typography sx={{ fontFamily: authFont, fontSize: '18px', fontWeight: 800 }}>
                Action Failed
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: authFont, fontSize: '14px', color: '#8c8881', px: 2 }}>
              {errorMessage || 'Something went wrong during the companion interaction.'}
            </Typography>
          </Box>
        )}

        {/* Control Button */}
        {status !== 'animating' && (
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            startIcon={<BackIcon />}
            sx={{
              py: 1.6,
              px: 4,
              fontFamily: authFont,
              fontSize: '13px',
              fontWeight: 800,
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              boxShadow: 'none',
              bgcolor: status === 'success' ? '#437F70' : '#8c8881',
              color: '#fff',
              width: '100%',
              transition: 'all 200ms ease',
              '&:hover': {
                bgcolor: status === 'success' ? '#356559' : '#736f68',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Back to Dashboard
          </Button>
        )}
      </Card>
    </Box>
  );
};

export default PetActionPage;
