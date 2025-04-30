import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Avatar,
  styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { fetchUserEspDevices } from '../graphql/query/fetchUserEspDevices.query';
import ControlPanel from '../shared/ControlPanel';
import { useNavigate } from 'react-router-dom';

const NavBar = styled(Box)(({ theme }) => ({
  width: '200px',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  height: '100vh',
  position: 'fixed',
  left: 0,
  top: 0,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '200px',
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1100,
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
}));

const DeviceBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '300px',
  height: '200px',
  marginTop: theme.spacing(8),
}));

const NavItem = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontWeight: 'bold',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: theme.shape.borderRadius,
  },
}));

const PageWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
});

// 👇 Accept the prop from App.tsx
interface MainPageProps {
  setIsAuthorized: (value: boolean) => void;
}

export default function MainPage({ setIsAuthorized }: MainPageProps) {
  const navigate = useNavigate();

  const retrieveUserEspDevices = async () => {
    const result = await fetchUserEspDevices('artur');
    console.log(result);
  };

  useEffect(() => {
    retrieveUserEspDevices();
  }, []);

  const handleLogout = () => {
    localStorage.setItem('authorized', 'false');
    setIsAuthorized(false);
    navigate('/login');
  };

  return (
    <PageWrapper>
      <ProfileSection>
        <ControlPanel onLogout={handleLogout} />
        <IconButton size="large">
          <Avatar sx={{ width: 40, height: 40 }} />
        </IconButton>
      </ProfileSection>

      <NavBar>
        <NavItem variant="h6">Устройства</NavItem>
      </NavBar>

      <MainContent>
        <DeviceBox elevation={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Устройств пока нет
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
            Добавить новое
          </Button>
        </DeviceBox>
      </MainContent>
    </PageWrapper>
  );
}
