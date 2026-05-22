export const authColors = {
  black: '#111',
  orange: '#ff8624',
  orangeHover: '#ff9438',
  peach: '#ffd1a7',
  peachHover: '#ffd6b2',
  white: '#fffafa',
};

export const authFont = "'Inter', Arial, sans-serif";

export const sharedTitleStyles = {
  mb: 3.6,
  fontFamily: authFont,
  fontSize: 22,
  fontWeight: 600,
  color: authColors.black,
  textAlign: 'center',
};

export const sharedCardInputStyles = {
  minHeight: 64,
  borderRadius: 2,
  bgcolor: authColors.white,
  color: authColors.black,
  fontFamily: authFont,
  fontSize: 16,
  fontWeight: 600,
  px: 2.2,
  transition: 'box-shadow 160ms ease, transform 160ms ease',
  '&:hover': {
    boxShadow: '0 10px 22px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-1px)',
  },
  '& input::placeholder': {
    opacity: 1,
    color: authColors.black,
    fontWeight: 500,
  },
};

export const sharedErrorStyles = {
  mt: 1.2,
  borderRadius: 1,
  bgcolor: '#fff4f4',
  color: '#d71920',
  fontFamily: authFont,
  fontSize: 13.5,
  fontWeight: 700,
  px: 1.3,
  py: 0.8,
};
