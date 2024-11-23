// NouveauCompte.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE, GET_COMPTES } from '../apollo/queries';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  Typography,
  Snackbar,
  Alert,
  Stack,
  Paper
} from '@mui/material';

export const NouveauCompte = () => {
  const [solde, setSolde] = useState('');
  const [dateCreation, setDateCreation] = useState('');
  const [type, setType] = useState('COURANT');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [{ query: GET_COMPTES }],
    onCompleted: () => {
      setSnackbarMessage('Le compte a été créé avec succès');
      setSeverity('success');
      setOpenSnackbar(true);
      setSolde('');
      setDateCreation('');
    },
    onError: (error) => {
      setSnackbarMessage(error.message);
      setSeverity('error');
      setOpenSnackbar(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const [day, month, year] = dateCreation.split('-').reverse();
    const formattedDate = `${day}/${month}/${year}`;
    
    saveCompte({
      variables: {
        compte: {
          solde: parseFloat(solde),
          dateCreation: formattedDate,
          type
        }
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h4" color="primary" gutterBottom>
              Créer un nouveau compte
            </Typography>

            <TextField
              label="Solde initial"
              type="number"
              value={solde}
              onChange={(e) => setSolde(e.target.value)}
              required
              fullWidth
              inputProps={{ step: "0.01", min: "0" }}
            />

            <TextField
              label="Date de création"
              type="date"
              value={dateCreation}
              onChange={(e) => setDateCreation(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0]
              }}
            />

            <TextField
              select
              label="Type de compte"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="COURANT">Courant</MenuItem>
              <MenuItem value="EPARGNE">Épargne</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer le compte'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={severity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};