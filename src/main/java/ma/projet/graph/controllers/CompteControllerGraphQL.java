package ma.projet.graph.controllers;

import lombok.AllArgsConstructor;
import ma.projet.graph.entities.Compte;
import ma.projet.graph.repositories.CompteRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class CompteControllerGraphQL {
    private CompteRepository compteRepository;
    private static final ThreadLocal<SimpleDateFormat> dateFormat = 
        ThreadLocal.withInitial(() -> new SimpleDateFormat("dd/MM/yyyy"));

    @QueryMapping
    public List<Compte> allComptes() {
        return compteRepository.findAll();
    }

    @QueryMapping
    public Compte compteById(@Argument Long id) {
        return compteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(String.format("Compte %s introuvable", id)));
    }

    @MutationMapping
    public Compte saveCompte(@Argument Compte compte) {
        try {
            validateCompte(compte);
            formatAndSetDate(compte);
            return compteRepository.save(compte);
        } catch (ParseException e) {
            throw new RuntimeException("Format de date invalide. Utilisez dd/MM/yyyy", e);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création du compte: " + e.getMessage(), e);
        }
    }

    @QueryMapping
    public Map<String, Object> totalSolde() {
        long count = compteRepository.count();
        double sum = compteRepository.sumSoldes();
        double average = count > 0 ? sum / count : 0;
        return Map.of(
            "count", count,
            "sum", sum,
            "average", average
        );
    }

    private void validateCompte(Compte compte) {
        if (compte.getSolde() < 0) {
            throw new IllegalArgumentException("Le solde ne peut pas être négatif");
        }
        if (compte.getType() == null) {
            throw new IllegalArgumentException("Le type de compte est obligatoire");
        }
    }

    private void formatAndSetDate(Compte compte) throws ParseException {
        SimpleDateFormat formatter = dateFormat.get();
        String dateStr = compte.getDateCreation() != null ? 
            formatter.format(compte.getDateCreation()) : 
            formatter.format(new Date());
        compte.setDateCreation(formatter.parse(dateStr));
    }
}