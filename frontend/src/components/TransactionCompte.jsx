// src/components/TransactionCompte.jsx
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TRANSACTIONS, SAVE_TRANSACTION, GET_COMPTES } from '../apollo/queries';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Snackbar,
  Stack
} from '@mui/material';

export const TransactionCompte = () => {
  const [montant, setMontant] = useState('');
  const [compteId, setCompteId] = useState('');
  const [type, setType] = useState('CREDIT');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const { data: comptesData } = useQuery(GET_COMPTES);
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  const [saveTransaction] = useMutation(SAVE_TRANSACTION, {
    refetchQueries: [
      { query: GET_TRANSACTIONS },
      { query: GET_COMPTES }
    ],
    onCompleted: () => {
      setSnackbarMessage('Transaction effectuée avec succès');
      setSeverity('success');
      setOpenSnackbar(true);
      setMontant('');
    },
    onError: (error) => {
      setSnackbarMessage(error.message);
      setSeverity('error');
      setOpenSnackbar(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTransaction({
      variables: {
        transaction: {
          montant: parseFloat(montant),
          type,
          compteId
        }
      }
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Erreur: {error.message}</Alert>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Nouvelle Transaction
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              select
              label="Compte"
              value={compteId}
              onChange={(e) => setCompteId(e.target.value)}
              required
              fullWidth
            >
              {comptesData?.allComptes.map((compte) => (
                <MenuItem key={compte.id} value={compte.id}>
                  Compte {compte.id} - Solde: {compte.solde}€
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Montant"
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
              fullWidth
              inputProps={{ min: "0", step: "0.01" }}
            />

            <TextField
              select
              label="Type de transaction"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="CREDIT">Crédit</MenuItem>
              <MenuItem value="DEBIT">Débit</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Effectuer la transaction
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Historique des Transactions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Compte</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.allTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.compte.id}</TableCell>
                  <TableCell>{transaction.montant.toFixed(2)}€</TableCell>
                  <TableCell>
                    {transaction.type === 'CREDIT' ? 'Crédit' : 'Débit'}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.dateTransaction).toLocaleString('fr-FR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
    </Box>
  );
};