package com.backend.servicio_clientes.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "SRVCLI - CLIENTE")
@Data
public class Cliente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Column(name = "CORREO_ELECTRONICO")
    @Email(message = "El email debe ser valido")
    @NotBlank(message = "Es obligatorio proveer un email")
    private String correoElectronico;

    private String cuit;

    @Column(name = "MAXIMO_DESCUBIERTO")
    @Min(value = 10000, message = "El descubierto maximo debe ser al menos 10000")
    private BigDecimal maximoDescubierto;

    private Integer maxCantEnEjecucion;
    
}
