package isi.dan.ms_productos.dto;

import java.util.List;

public class PedidoDTO {
    private String id;
    private String cliente;
    private List<ProductoDTO> listaProductos;

    public static class ProductoDTO {
        private Integer id;
        private Integer cantidad;

        // Getters y setters
        public Integer getId() {
            return id;
        }

        public void setId(Integer productoId) {
            this.id = productoId;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }

        @Override
        public String toString() {
            return "ProductoDTO{" +
                    "productoId=" + id +
                    ", cantidad=" + cantidad +
                    '}';
        }
    }

    // Getters y setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public List<ProductoDTO> getListaProductos() {
        return listaProductos;
    }

    public void setListaProductos(List<ProductoDTO> listaProductos) {
        this.listaProductos = listaProductos;
    }

    @Override
    public String toString() {
        return "PedidoDTO{" +
                "id='" + id + '\'' +
                ", cliente='" + cliente + '\'' +
                ", listaProductos=" + listaProductos +
                '}';
    }
}
