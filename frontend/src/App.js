// App.js
import { ApolloProvider } from '@apollo/client';
import { TransactionCompte } from './components/TransactionCompte';
import client from './apollo/client';
import { ListeComptes } from './components/ListComptes';
import { NouveauCompte } from './components/NouveauCompte';
import { 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Container, 
  Box,
  Typography,
  Divider,
  Paper
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" color="primary" gutterBottom>
                 NAMOUS NASSIM x)
              </Typography>
            </Paper>
            
            <Paper elevation={3} sx={{ p: 3 }}>
              <NouveauCompte />
            </Paper>
            
            <Divider />
            
            <Paper elevation={3} sx={{ p: 3 }}>
              <ListeComptes />
            </Paper>
             
            <Paper elevation={3} sx={{ p: 3 }}>
              <TransactionCompte />
            </Paper>
          </Box>
        </Container>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;