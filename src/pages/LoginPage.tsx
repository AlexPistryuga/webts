import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Container,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/LoginPageStyles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
interface LoginPageProps {
  onLogin: () => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(8),
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8096/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...loginData, username:loginData.username.trim() }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      console.log('Login successful', data);

      localStorage.setItem('authorized', 'true');
      onLogin(); // Notify App to update routing
      navigate('/main');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Ошибка входа: проверьте логин и пароль');
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8096/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
        }),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      console.log('Registration successful', data);

      setTabValue(0); // Switch to login tab
      setRegisterData({ username: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error registering:', error);
      alert('Ошибка регистрации. Попробуйте другое имя пользователя.');
    }
  };

  return (
    <Container component="main" maxWidth={styles.container.maxWidth}>
      <StyledPaper elevation={3}>
        <Box sx={styles.tabs}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleLogin}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Имя пользователя"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.formButton}
            >
              Войти
            </Button>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleRegister}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Имя пользователя"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Подтвердите пароль"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.formButton}
            >
              Зарегистрироваться
            </Button>
          </form>
        </TabPanel>
      </StyledPaper>
    </Container>
  );
}
