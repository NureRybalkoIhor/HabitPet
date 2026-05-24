import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  CheckOutlined as CheckIcon,
  CloseOutlined as CloseIcon,
  FavoriteBorderOutlined as HeartIcon,
  HelpOutlineOutlined as HelpIcon,
} from '@mui/icons-material';
import { PetInfo, PetActionInfo } from '../../../api/petApi';
import { UserProfile } from '../../../api/userApi';
import { validatePersonName } from '../../../utils/validation';

interface PetProfileCardProps {
  pet: PetInfo;
  profile: UserProfile | null;
  actions: PetActionInfo[];
  totalXpSpent: number;
  daysActive: number;
  careScore: number;
  dialogue: string;
  getHamsterImage: () => string;
  onNameUpdate: (newName: string) => Promise<void>;
  formatTimeAgo: (dateStr?: string) => string;
  formatDateTime: (dateStr?: string) => string;
}

const PetProfileCard = ({
  pet,
  profile,
  actions,
  totalXpSpent,
  daysActive,
  careScore,
  dialogue,
  getHamsterImage,
  onNameUpdate,
  formatTimeAgo,
  formatDateTime,
}: PetProfileCardProps) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(pet.name);
  const [saveLoading, setSaveLoading] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleNameChange = (val: string) => {
    setNewName(val);
    const err = validatePersonName(val, 'Companion name');
    setNameError(err);
  };

  const handleSave = async () => {
    const err = validatePersonName(newName, 'Companion name');
    if (err) {
      setNameError(err);
      return;
    }
    setSaveLoading(true);
    try {
      await onNameUpdate(newName.trim());
      setEditMode(false);
      setNameError('');
    } catch {
      // Parent handles toast display
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fffafa',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 3.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          bgcolor: '#ffffff',
          border: '1.5px solid #e6e3dd',
          borderRadius: '12px',
          p: 2,
          mb: 2.5,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 14,
            height: 14,
            bgcolor: '#ffffff',
            borderRight: '1.5px solid #e6e3dd',
            borderBottom: '1.5px solid #e6e3dd',
          },
        }}
      >
        <Typography
          sx={{
            fontStyle: 'italic',
            fontSize: '13px',
            color: '#4A6070',
            lineHeight: 1.4,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          "{dialogue}"
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 0.5, minHeight: '8px' }} />

      <Box
        sx={{
          position: 'relative',
          width: { xs: 140, md: 165 },
          height: { xs: 140, md: 165 },
          borderRadius: '50%',
          bgcolor: '#ffd1a7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          overflow: 'hidden',
          border: '2px solid #e6e3dd',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.04) rotate(1deg)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          },
        }}
      >
        <Box
          component="img"
          src={getHamsterImage()}
          alt="Companion Hamster"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {editMode ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', maxWidth: '240px', mb: 1.5 }}>
          <TextField
            size="small"
            value={newName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter companion name"
            disabled={saveLoading}
            error={Boolean(nameError)}
            helperText={nameError}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                height: '32px',
                '& fieldset': { borderColor: nameError ? '#d71920' : '#e6e3dd', borderWidth: '1.5px' },
                '&:hover fieldset': { borderColor: nameError ? '#d71920' : '#c8c4bc' },
                '&.Mui-focused fieldset': { borderColor: nameError ? '#d71920' : '#ff8624', borderWidth: '2px' },
              },
              '& input': { fontWeight: 850, fontSize: '14.5px', py: 0, textAlign: 'center' },
              '& .MuiFormHelperText-root': {
                fontSize: '9px',
                mt: 0.5,
                textAlign: 'center',
                fontWeight: 600,
              }
            }}
          />
          <IconButton
            onClick={handleSave}
            disabled={saveLoading || !newName.trim() || Boolean(nameError)}
            sx={{ color: '#437F70', border: '1px solid #e6e3dd', borderRadius: '6px', p: '5px' }}
          >
            <CheckIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            onClick={() => {
              setNewName(pet.name);
              setEditMode(false);
              setNameError('');
            }}
            disabled={saveLoading}
            sx={{ color: '#d71920', border: '1px solid #e6e3dd', borderRadius: '6px', p: '5px' }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em', fontSize: '18px' }}>
            {pet.name}
          </Typography>
          <IconButton
            onClick={() => setEditMode(true)}
            size="small"
            sx={{ color: '#4A6070', '&:hover': { color: '#ff8624', bgcolor: 'transparent' } }}
          >
            <EditIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>
      )}

      <Box sx={{ flexGrow: 0.5, minHeight: '10px' }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1.5,
          width: '100%',
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            gridColumn: 'span 2',
            p: 1.2,
            borderRadius: '10px',
            border: '1px solid #e6e3dd',
            bgcolor: '#fffafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <HeartIcon sx={{ color: '#d71920', fontSize: 16 }} />
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#d71920' }}>
            {careScore}% Harmony Care Score
          </Typography>
          <Tooltip title="Care Score represents the harmony between your companion's Health (80%) and Happiness (20%). Keep both high to maintain maximum harmony." arrow>
            <IconButton size="small" sx={{ p: 0.2, color: '#888' }}>
              <HelpIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 1.2,
            borderRadius: '10px',
            border: '1px solid #e6e3dd',
            bgcolor: '#ffffff',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#888', letterSpacing: '0.05em', mb: 0.2 }}>
            LAST FED
          </Typography>
          <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#ff8624', mb: 0.2 }}>
            {formatTimeAgo(pet.lastFedAt)}
          </Typography>
          <Typography sx={{ fontSize: '8.5px', color: '#888', fontWeight: 600 }}>
            {formatDateTime(pet.lastFedAt)}
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 1.2,
            borderRadius: '10px',
            border: '1px solid #e6e3dd',
            bgcolor: '#ffffff',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#888', letterSpacing: '0.05em', mb: 0.2 }}>
            LAST PLAYED
          </Typography>
          <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: '#437F70', mb: 0.2 }}>
            {formatTimeAgo(pet.lastPlayedAt)}
          </Typography>
          <Typography sx={{ fontSize: '8.5px', color: '#888', fontWeight: 600 }}>
            {formatDateTime(pet.lastPlayedAt)}
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 1.2,
            borderRadius: '10px',
            border: '1px solid #e6e3dd',
            bgcolor: '#ffffff',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#888', letterSpacing: '0.05em', mb: 0.2 }}>
            TOTAL XP SPENT
          </Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#111', mb: 0.2 }}>
            {totalXpSpent} XP
          </Typography>
          <Typography sx={{ fontSize: '8.5px', color: '#888', fontWeight: 600 }}>
            Spent on actions
          </Typography>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 1.2,
            borderRadius: '10px',
            border: '1px solid #e6e3dd',
            bgcolor: '#ffffff',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '8px', fontWeight: 800, color: '#888', letterSpacing: '0.05em', mb: 0.2 }}>
            DAYS TOGETHER
          </Typography>
          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#111', mb: 0.2 }}>
            {daysActive} {daysActive === 1 ? 'day' : 'days'}
          </Typography>
          <Typography sx={{ fontSize: '8.5px', color: '#888', fontWeight: 600 }}>
            Active journey
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 0.5, minHeight: '10px' }} />

      <Box sx={{ width: '100%', pt: 2.5, borderTop: '1px solid #e6e3dd', display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: '10.5px', fontWeight: 800, color: '#888', letterSpacing: '0.05em' }}>
              HEALTH
            </Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>
              {pet.health}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet.health}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#d71920' },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: '10.5px', fontWeight: 800, color: '#888', letterSpacing: '0.05em' }}>
              HUNGER
            </Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>
              {pet.hunger}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet.hunger}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#ff8624' },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: '10.5px', fontWeight: 800, color: '#888', letterSpacing: '0.05em' }}>
              HAPPINESS
            </Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>
              {pet.happiness}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet.happiness}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#ffd1a7' },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
            <Typography sx={{ fontSize: '10.5px', fontWeight: 800, color: '#888', letterSpacing: '0.05em' }}>
              MOOD
            </Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#111' }}>
              {pet.mood}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pet.mood}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: '#f0ede9',
              '& .MuiLinearProgress-bar': { bgcolor: '#437F70' },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PetProfileCard;
