package isi.dan.ms_productos.dto;

import lombok.Data;

@Data
public class StockUpdateDTO {
    private Integer idProducto;
    private Integer cantidad;
}
