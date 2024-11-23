 
package ma.projet.graph.controllers;

import lombok.AllArgsConstructor;
import ma.projet.graph.dto.TransactionRequest;
import ma.projet.graph.entities.Transaction;
import ma.projet.graph.entities.TypeTransaction;
import ma.projet.graph.entities.Compte;
import ma.projet.graph.repositories.TransactionRepository;
import ma.projet.graph.repositories.CompteRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.Date;
import java.util.List;

@Controller
@AllArgsConstructor
public class TransactionControllerGraphQL {
    private TransactionRepository transactionRepository;
    private CompteRepository compteRepository;

    @MutationMapping
    public Transaction saveTransaction(@Argument("transaction") TransactionRequest request) {
        if (request == null) {
            throw new RuntimeException("La requête de transaction ne peut pas être nulle");
        }
        if (request.getCompteId() == null) {
            throw new RuntimeException("L'ID du compte est requis");
        }
        if (request.getMontant() == null || request.getMontant() <= 0) {
            throw new RuntimeException("Le montant doit être supérieur à 0");
        }
        if (request.getType() == null) {
            throw new RuntimeException("Le type de transaction est requis");
        }

        Compte compte = compteRepository.findById(request.getCompteId())
            .orElseThrow(() -> new RuntimeException("Compte non trouvé: " + request.getCompteId()));
        
        Transaction transaction = new Transaction();
        transaction.setMontant(request.getMontant());
        transaction.setType(request.getType());
        transaction.setCompte(compte);
        transaction.setDateTransaction(new Date());
        
        if (request.getType() == TypeTransaction.CREDIT) {
            compte.setSolde(compte.getSolde() + request.getMontant());
        } else {
            if (compte.getSolde() < request.getMontant()) {
                throw new RuntimeException("Solde insuffisant");
            }
            compte.setSolde(compte.getSolde() - request.getMontant());
        }
        
        compteRepository.save(compte);
        return transactionRepository.save(transaction);
    }

    @QueryMapping
    public List<Transaction> allTransactions() {
        return transactionRepository.findAll();
    }

    @QueryMapping
    public List<Transaction> transactionsByCompte(@Argument Long compteId) {
        return transactionRepository.findByCompteId(compteId);
    }
}