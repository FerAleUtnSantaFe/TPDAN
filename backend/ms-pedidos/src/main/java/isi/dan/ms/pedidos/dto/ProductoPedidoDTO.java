package isi.dan.ms.pedidos.dto;

import java.io.Serializable;

import lombok.Data;

@Data
public class ProductoPedidoDTO implements Serializable{
    private Integer id;
    private Integer cantidad;
    private Double precio;


    public ProductoPedidoDTO(Integer id, Integer cantidad, Double precio) {
        this.id = id;
        this.cantidad = cantidad;
        this.precio = precio;
    }
}