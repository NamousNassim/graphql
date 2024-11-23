// src/components/ListComptes.jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPTES } from '../apollo/queries';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';

export const ListeComptes = () => {
  const { loading, error, data } = useQuery(GET_COMPTES);

  if (loading) return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ mt: 2 }}>
      Erreur : {error.message}
    </Alert>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 4 }}>
        Liste des Comptes
      </Typography>
      
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }} aria-label="table des comptes">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Solde</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.allComptes.map((compte) => (
              <TableRow
                key={compte.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{compte.id}</TableCell>
                <TableCell>{compte.solde.toFixed(2)}€</TableCell>
                <TableCell>
                  {new Date(compte.dateCreation).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  {compte.type === 'COURANT' ? 'Courant' : 'Épargne'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};