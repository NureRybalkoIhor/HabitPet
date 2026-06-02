import { Box, Button, Card, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { XpTransaction } from '../../../api/userApi';
import { getReasonDetails, formatDate, authFont } from './profileHelpers';

interface XpActionsHistoryProps {
  transactions: XpTransaction[];
  visibleTxCount: number;
  onLoadMore: () => void;
}

const XpActionsHistory = ({
  transactions,
  visibleTxCount,
  onLoadMore,
}: XpActionsHistoryProps) => {
  return (
    <Card
      sx={{
        p: { xs: 4, md: 4.5 },
        border: '1.5px solid #e6e3dd',
        borderRadius: '16px',
        boxShadow: 'none',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          mb: 3,
          pb: 1.5,
          borderBottom: '1.5px solid #f2effa',
        }}
      >
        <HistoryIcon sx={{ color: '#4A6070', fontSize: 18 }} />
        <Typography
          sx={{
            fontFamily: authFont,
            fontWeight: 900,
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: '#4A6070',
            textTransform: 'uppercase',
          }}
        >
          XP Actions History
        </Typography>
      </Box>

      {transactions.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#fffbf9',
            border: '1.5px dashed #ff8624',
            borderRadius: 3,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: authFont,
              color: '#ff8624',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            No activity recorded yet. Complete habits to start earning experience!
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, width: '100%' }}>
          <Box
            sx={{
              maxHeight: '700px',
              overflowY: 'auto',
              pr: 0.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
              width: '100%',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#e6e3dd', borderRadius: '4px' },
            }}
          >
            {transactions.slice(0, visibleTxCount).map((tx) => {
              const reason = getReasonDetails(tx.typeReason, tx.xpAmount, tx.habitTitle);
              return (
                <Box
                  key={tx.xpTransactionId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '8px',
                    border: '1.5px solid #e6e3dd',
                    bgcolor: reason.bgColor,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        flexShrink: 0,
                      }}
                    >
                      {reason.icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        noWrap
                        sx={{
                          fontFamily: authFont,
                          fontSize: 12.5,
                          fontWeight: 800,
                          color: '#161616',
                          mb: 0.2,
                        }}
                      >
                        {reason.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: authFont,
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#8c8881',
                        }}
                      >
                        {formatDate(tx.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flexShrink: 0, pl: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: authFont,
                        fontSize: 12.5,
                        fontWeight: 900,
                        color: tx.xpAmount >= 0 ? '#437F70' : '#d71920',
                      }}
                    >
                      {tx.xpAmount >= 0 ? `+${tx.xpAmount}` : tx.xpAmount} XP
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {transactions.length > visibleTxCount && (
            <Button
              onClick={onLoadMore}
              fullWidth
              sx={{
                py: 1,
                border: '1.5px solid #ff8624',
                borderRadius: '8px',
                color: '#ff8624',
                fontFamily: authFont,
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: 'none',
                mt: 'auto',
                '&:hover': {
                  bgcolor: '#fff5ec',
                  borderColor: '#ff8624',
                },
              }}
            >
              Load more entries...
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
};

export default XpActionsHistory;
