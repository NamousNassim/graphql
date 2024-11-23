// src/main/java/ma/projet/graph/dto/TransactionRequest.java
package ma.projet.graph.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.projet.graph.entities.TypeTransaction;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    private Double montant;
    private TypeTransaction type;
    private Long compteId;
}