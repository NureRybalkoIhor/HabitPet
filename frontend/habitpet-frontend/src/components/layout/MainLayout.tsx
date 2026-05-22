import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  DashboardOutlined as DashboardIcon,
  FormatListBulletedOutlined as HabitsIcon,
  PetsOutlined as PetIcon,
  EmojiEventsOutlined as AchievementsIcon,
  PersonOutlineOutlined as ProfileIcon,
  SettingsOutlined as SettingsIcon,
  ExitToAppOutlined as LogoutIcon,
  MenuOutlined as MenuIcon,
  CloseOutlined as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Habits', icon: <HabitsIcon />, path: '/habits' },
    { text: 'Pet Companion', icon: <PetIcon />, path: '/pet' },
    { text: 'Achievements', icon: <AchievementsIcon />, path: '/achievements' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fffafa',
        borderRight: '1px solid #e6e3dd',
        p: 3,
        width: 250,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pb: 3,
          mb: 4,
          borderBottom: '1px solid #f2effa',
        }}
      >
        <Box
          component="img"
          src={`${process.env.PUBLIC_URL || ''}/Logo.png`}
          alt="HabitPet Logo"
          sx={{ width: 34, height: 34, borderRadius: '6px' }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '21px',
            letterSpacing: '0.05em',
            color: '#111',
          }}
        >
          HabitPet
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, p: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: '8px',
                py: 1.2,
                px: 2,
                bgcolor: isActive ? '#fff5ec' : 'transparent',
                color: isActive ? '#ff8624' : '#4A6070',
                borderLeft: isActive ? '3px solid #ff8624' : '3px solid transparent',
                transition: 'all 160ms ease',
                '&:hover': {
                  bgcolor: isActive ? '#fff5ec' : '#f7f5f0',
                  color: isActive ? '#ff8624' : '#111',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive ? '#ff8624' : '#4A6070',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '16.5px', fontWeight: isActive ? 700 : 500 }}>
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>

      <ListItemButton
        onClick={handleLogout}
        sx={{
          borderRadius: '8px',
          py: 1.2,
          px: 2,
          color: '#4A6070',
          transition: 'all 160ms ease',
          '&:hover': {
            bgcolor: '#fff0f0',
            color: '#d71920',
            '& .logout-icon': { color: '#d71920' },
          },
        }}
      >
        <ListItemIcon className="logout-icon" sx={{ minWidth: 36, color: '#4A6070', transition: 'color 160ms' }}>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={{ fontSize: '16.5px', fontWeight: 600 }}>
              Leave HabitPet
            </Typography>
          }
        />
      </ListItemButton>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAF8F5' }}>
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            bgcolor: '#fffafa',
            borderBottom: '1px solid #e6e3dd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            zIndex: 1100,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={`${process.env.PUBLIC_URL || ''}/Logo.png`}
              alt="HabitPet Logo"
              sx={{ width: 28, height: 28 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '16px', color: '#111' }}>
              HabitPet
            </Typography>
          </Box>
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              color: '#4A6070',
              border: '1px solid #e6e3dd',
              borderRadius: '8px',
              p: '6px',
            }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

      {!isMobile && (
        <Box sx={{ width: 250, flexShrink: 0, position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 1200 }}>
          {sidebarContent}
        </Box>
      )}

      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
              bgcolor: 'transparent',
              border: 'none',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: { xs: 0, md: '250px' },
          pt: { xs: '64px', md: 0 },
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
