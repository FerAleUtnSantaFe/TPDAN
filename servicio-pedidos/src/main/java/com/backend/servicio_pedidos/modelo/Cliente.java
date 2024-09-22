package com.backend.servicio_pedidos.modelo;


import lombok.Data;

@Data
public class Cliente {
    
    private Integer id;
    private String nombre;
    private String correoElectronico;
    private String cuit;

}
