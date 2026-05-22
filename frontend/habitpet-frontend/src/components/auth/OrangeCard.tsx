import { FormEventHandler, ReactNode } from 'react';
import { Box } from '@mui/material';
import { authColors } from './authTheme';

interface OrangeCardProps {
  children: ReactNode;
  component?: 'div' | 'form';
  onSubmit?: FormEventHandler<HTMLFormElement>;
  dense?: boolean;
}

const OrangeCard = ({ children, component = 'div', onSubmit, dense = false }: OrangeCardProps) => (
  <Box
    component={component}
    onSubmit={onSubmit}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: component === 'form' ? 'stretch' : 'center',
      gap: dense ? 3.2 : 3.2,
      width: '100%',
      borderRadius: 5,
      bgcolor: authColors.orange,
      p: dense ? 2.3 : 4.2,
      boxShadow: '0 18px 36px rgba(255, 134, 36, 0.18)',
    }}
  >
    {children}
  </Box>
);

export default OrangeCard;
