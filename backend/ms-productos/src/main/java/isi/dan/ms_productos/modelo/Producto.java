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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "MS_PRD_PRODUCTO")
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name ="NOMBRE")
    @NotBlank(message = "El nombre no puede estar vacio")
    private String nombre;

    @Column(name ="DESCRIPCION")
    private String descripcion;

    @Column(name ="STOCK_ACTUAL")
    @NotNull
    @Min(value = 0, message = "El stock actual no puede ser menor a 0")
    private Integer stockActual = 0;

    @Column(name ="STOCK_MINIMO")
    @NotNull
    @Min(value = 0, message = "El stock minimo no puede ser menor a 0")
    private Integer stockMinimo;

    @Column(name ="PRECIO")
    @Min(value = 0, message = "El stock actual no puede ser menor a 0")
    private BigDecimal precio;

    @Column(name ="CATEGORIA")
    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    @Min(value = 0, message = "El descuento promocional no puede ser menor a 0")
    private Integer descuentoPromocional = 0;

}
