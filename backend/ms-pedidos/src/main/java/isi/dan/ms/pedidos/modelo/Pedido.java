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
    private String obra;
    private String cliente;

    // aca tengo si o si q hacer un producto, pq necesito saber cantidades y precio por c/u SIOSI

    @Field("Lista Productos")
    private ArrayList<Producto> listaProductos = new ArrayList<>();
    @Field("Lista Estados")
    private ArrayList<HistorialEstado> estadosPedido = new ArrayList<>();
    private Estado estado = Estado.EN_PREPARACION;

    public void agregarEstado(Estado estado) {
        HistorialEstado nuevo = new HistorialEstado();
        nuevo.setEstado(estado);
        estadosPedido.add(nuevo);
    }

}

