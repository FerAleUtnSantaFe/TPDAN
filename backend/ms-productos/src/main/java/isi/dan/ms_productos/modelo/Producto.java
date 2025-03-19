package isi.dan.ms_productos.modelo;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "MS_PRD_PRODUCTO")
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name ="NOMBRE")
    @NotNull
    private String nombre;

    @Column(name ="DESCRIPCION")
    private String descripcion;

    @Column(name ="STOCK_ACTUAL")
    private Integer stockActual = 0;

    @Column(name ="STOCK_MINIMO")
    private Integer stockMinimo;

    @Column(name ="PRECIO")
    private BigDecimal precio;
    
    @Column(name ="CATEGORIA")
    @Enumerated(EnumType.STRING)
    private Categoria categoria;

}
