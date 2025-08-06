// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import NavBar from './components/NavBar';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { getUserInfo } from './utils/cookie';
import Error from './pages/Error';
import { IUser } from './components/User';


function App() {
  const theme = useTheme();
  const user = useMemo(() => {
    try {
      return getUserInfo();
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!user && !isLoading) {
    window.location.href = '/auth/login';
  }

  if (!user) {
    return (
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Box sx={{ mb: 2 }}>
          <CircularProgress />
        </Box>
        <Box>
          <Typography>Welcome to Banking App</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Router>

      <Box sx={{ display: 'flex', background: theme.palette.background.default, flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <NavBar user={user as IUser} />
        <Routes>
          {user && (
            <>
              <Route path="/" element={<Accounts />} />
              <Route path="/transactions" element={<Transactions />} />
            </>
          )}
          <Route path="/error" element={<Error type='auth' />} />
          <Route path="*" element={<Error type='404' />} />
        </Routes>
        <Box component="footer" sx={{ mt: 'auto', py: 1, textAlign: 'center', background: theme.palette.background.paper, borderTop: `1px solid #eee` }}> 
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Banking App. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}
export default App;
