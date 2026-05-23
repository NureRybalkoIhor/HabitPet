import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { CloseOutlined as CloseIcon } from '@mui/icons-material';

interface HabitCompleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  habitTitle: string;
}

const HabitCompleteDialog = ({ open, onClose, onConfirm, habitTitle }: HabitCompleteDialogProps) => {
  const [note, setNote] = useState('');
  const DialogComponent = Dialog as any;
  const TextFieldComponent = TextField as any;

  useEffect(() => {
    if (open) {
      setNote('');
    }
  }, [open]);

  const handleSubmit = () => {
    onConfirm(note.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <DialogComponent
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          border: '1px solid #e6e3dd',
          boxShadow: 'none',
          bgcolor: '#ffffff',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '16px',
          borderBottom: '1px solid #e6e3dd',
          pb: 2,
          pt: 2.5,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fcfbfa',
        }}
      >
        <span>COMPLETE HABIT</span>
        <IconButton onClick={onClose} sx={{ color: '#4A6070', p: 0.5 }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3, pt: '24px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#888', mb: 0.5, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            HABIT TITLE
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>
            {habitTitle}
          </Typography>
        </Box>

        <TextFieldComponent
          fullWidth
          label="Journal Entry Note (Optional)"
          placeholder="What did you achieve? (e.g. Read 15 pages, Drank 2L water)"
          multiline
          rows={3}
          value={note}
          onChange={(e: any) => setNote(e.target.value.slice(0, 300))}
          onKeyDown={handleKeyDown}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ maxLength: 300 }}
          helperText={`${note.length}/300 characters`}
          FormHelperTextProps={{ sx: { textAlign: 'right', fontSize: '10px', fontWeight: 600, color: '#888' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderWidth: '2px',
                borderColor: '#e6e3dd',
              },
              '&:hover fieldset': {
                borderColor: '#c8c4bc',
                borderWidth: '2px',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff8624',
                borderWidth: '2.5px',
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, justifyContent: 'flex-end', gap: 1.5, backgroundColor: '#fcfbfa', borderTop: '1.5px solid #e6e3dd' }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#4A6070',
            fontWeight: 700,
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#ff8624',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '12px',
            px: 3,
            py: 1,
            borderRadius: '8px',
            textTransform: 'uppercase',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#e0721b',
              boxShadow: 'none',
            },
          }}
        >
          Complete
        </Button>
      </DialogActions>
    </DialogComponent>
  );
};

export default HabitCompleteDialog;
