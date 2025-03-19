package isi.dan.ms.pedidos.modelo;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Document(collection = "pedidos")
@Data
public class Pedido {
    @Id
    private String id;
    private Instant fecha;
    private Integer numeroPedido;
    private String usuario;
    private String observaciones;
    private BigDecimal total;
    private Obra obra;
    private Cliente cliente;

    @Field("detalle")
    private ArrayList<Producto> listaProductos;
    private ArrayList<HistorialEstado> estadosPedido;


    public void agregarEstado(Estado estado) {
        HistorialEstado nuevo = new HistorialEstado();
        nuevo.setEstado(estado);

        estadosPedido.add(nuevo);
    }


    

}

