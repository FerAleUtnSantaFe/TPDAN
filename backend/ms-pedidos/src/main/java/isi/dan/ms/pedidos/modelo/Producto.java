package isi.dan.ms.pedidos.modelo;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Producto {
    @Id
    private Integer id;
    private String nombre;
    private String descripcion;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal descuento;
    private BigDecimal precioFinal;

}
