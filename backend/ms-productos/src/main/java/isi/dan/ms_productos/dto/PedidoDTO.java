package isi.dan.ms_productos.dto;

import java.util.List;

import lombok.Data;

@Data
public class PedidoDTO {
    private String id;
    private String cliente;
    private List<ProductoDTO> listaProductos;

    @Override
    public String toString() {
        return "PedidoDTO{" +
                "id='" + id + '\'' +
                ", cliente='" + cliente + '\'' +
                ", listaProductos=" + listaProductos +
                '}';
    }
}
