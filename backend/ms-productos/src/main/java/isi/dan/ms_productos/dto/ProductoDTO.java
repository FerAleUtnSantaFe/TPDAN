package isi.dan.ms_productos.dto;

import lombok.Data;

@Data
public class ProductoDTO {
    private Integer id;
    private Integer cantidad;

    @Override
    public String toString() {
        return "ProductoDTO{" +
                "productoId=" + id +
                ", cantidad=" + cantidad +
                '}';
    }
}
