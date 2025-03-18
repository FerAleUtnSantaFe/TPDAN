package isi.dan.msclientes.model;

import java.math.BigDecimal;

import jakarta.persistence.EnumType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "MS_CLI_OBRA")
@Data
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne()
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(name = "DIRECCION")
    @NotNull(message = "La direccion es obligatoria")
    private String direccion;

    @Column(name = "ES_REMODELACION")
    private Boolean esRemodelacion = false;
    
    @Column(name = "LATITUD")
    private double lat;
    
    @Column(name = "LONGITUD")
    private double lng;
    
    @Column(name = "PRESUPUESTO")
    @NotNull(message = "El presupuesto es obligatorio")
    @Min(value=0, message = "El presupuesto debe ser positivo")
    private BigDecimal presupuesto;

    @Column(name = "ESTADO")
    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.PENDIENTE;

}
