import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TaxPayerList from './components/TaxPayerList';
import AddTaxPayer from './components/AddTaxPayer';
import EditTaxPayer from './components/EditTaxPayer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaxPayer Records Management
          </Typography>
          <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/add" style={{ color: 'white', textDecoration: 'none' }}>
            Add TaxPayer
          </Link>
        </Toolbar>
      </AppBar>
      <Container className="app-container">
        <img
          src="https://images.unsplash.com/photo-1546198632-9ef6368bef12?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ4Njk5NTh8&ixlib=rb-4.0.3"
          alt="Tax documents and calculator"
          className="header-image"
        />
        <Routes>
          <Route path="/" element={<TaxPayerList />} />
          <Route path="/add" element={<AddTaxPayer />} />
          <Route path="/edit/:tid" element={<EditTaxPayer />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}

export default App;
