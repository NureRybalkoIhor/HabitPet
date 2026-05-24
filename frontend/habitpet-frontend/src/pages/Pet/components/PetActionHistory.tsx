import { Box, Typography, Button } from '@mui/material';
import { HistoryOutlined as HistoryIcon } from '@mui/icons-material';
import { PetActionInfo } from '../../../api/petApi';

interface PetActionHistoryProps {
  actions: PetActionInfo[];
  visibleActionsCount: number;
  onLoadMore: () => void;
  formatDateTime: (dateStr?: string) => string;
}

const PetActionHistory = ({
  actions,
  visibleActionsCount,
  onLoadMore,
  formatDateTime,
}: PetActionHistoryProps) => {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e6e3dd',
        borderRadius: '16px',
        p: 3,
        width: '100%',
        boxSizing: 'border-box',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2, pb: 1, borderBottom: '1px solid #f2effa' }}>
        <HistoryIcon sx={{ color: '#4A6070', fontSize: 18 }} />
        <Typography sx={{ fontWeight: 800, fontSize: '11px', letterSpacing: '0.15em', color: '#4A6070' }}>
          CARE ACTION HISTORY
        </Typography>
      </Box>

      {actions.length === 0 ? (
        <Typography sx={{ fontSize: '12px', color: '#888', fontStyle: 'italic', textAlign: 'center', py: 1.5 }}>
          No care actions recorded. Open dashboard to feed or play.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, maxHeight: { xs: '260px', lg: '34vh', xl: '40vh' }, flexGrow: 1, overflowY: 'auto', pr: 0.5, width: '100%' }}>
            {actions.slice(0, visibleActionsCount).map((act) => {
              const isFeed = act.actionType.toLowerCase() === 'feed';
              return (
                <Box
                  key={act.petActionId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.2,
                    px: 2,
                    borderRadius: '8px',
                    border: '1.5px solid #e6e3dd',
                    bgcolor: isFeed ? '#fff9e6' : '#effaf3',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '11.5px', fontWeight: 800, color: isFeed ? '#ff8624' : '#437F70' }}>
                      {act.actionType.toUpperCase()} COMPANION
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#888', mt: 0.3 }}>
                      {formatDateTime(act.actionTime)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#4A6070' }}>
                    -{act.xpSpent} XP
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {actions.length > visibleActionsCount && (
            <Button
              onClick={onLoadMore}
              sx={{
                mt: 1,
                alignSelf: 'center',
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#ff8624',
                textTransform: 'none',
                border: '1.5px solid #ff8624',
                borderRadius: '6px',
                px: 2.5,
                py: 0.6,
                '&:hover': {
                  bgcolor: '#fff5ec',
                },
              }}
            >
              Load more previous actions...
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PetActionHistory;
