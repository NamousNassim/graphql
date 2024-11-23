
import { gql } from '@apollo/client';
export const GET_TRANSACTIONS = gql`
  query {
    allTransactions {
      id
      montant
      dateTransaction
      type
      compte {
        id
        solde
      }
    }
  }
`;

export const SAVE_TRANSACTION = gql`
  mutation SaveTransaction($transaction: TransactionRequest!) {
    saveTransaction(transaction: $transaction) {
      id
      montant
      dateTransaction
      type
      compte {
        id
        solde
      }
    }
  }
`;

export const GET_COMPTES = gql`
  query {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

export const SAVE_COMPTE = gql`
  mutation SaveCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
    }
  }
`;