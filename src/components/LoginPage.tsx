import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Link,
} from '@mui/material';
import { StyledPaper, styles } from '../styles/LoginPageStyles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

export default function LoginPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь будет логика входа
    console.log('Login data:', loginData);
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    // Здесь будет логика регистрации
    console.log('Register data:', registerData);
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
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Подтвердите пароль"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
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