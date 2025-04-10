package isi.dan.ms.pedidos.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class PedidoDTO implements Serializable{

    private String id;
    private Integer cliente;
    private List<ProductoPedidoDTO> listaProductos;
    private Double total;
}