package isi.dan.ms.pedidos.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import isi.dan.ms.pedidos.exception.PedidoNotFoundException;
import isi.dan.ms.pedidos.modelo.Estado;
import isi.dan.ms.pedidos.modelo.EstadoDTO;
import isi.dan.ms.pedidos.modelo.Pedido;
import isi.dan.ms.pedidos.modelo.Producto;
import isi.dan.ms.pedidos.servicio.PedidoService;

class PedidoControllerTest {

    @InjectMocks
    private PedidoController pedidoController;

    @Mock
    private PedidoService pedidoService;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private RabbitTemplate rabbitTemplate;

    private Pedido pedido;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        pedido = new Pedido();
        pedido.setId("1");
        pedido.setCliente(123);
        pedido.setTotal(1000.0);
        pedido.setListaProductos(new ArrayList<>(List.of(
                crearProducto(1, 2, 500.0))));
    }

    private Producto crearProducto(Integer id, Integer cantidad, Double precio) {
        Producto producto = new Producto();
        producto.setId(id);
        producto.setCantidad(cantidad);
        producto.setPrecio(precio);
        return producto;
    }

    @Test
    void testGetAllPedidos() {
        List<Pedido> pedidos = List.of(pedido);
        when(pedidoService.getAllPedidos()).thenReturn(pedidos);

        List<Pedido> result = pedidoController.getAllPedidos(null, null);

        assertEquals(1, result.size());
        assertEquals(pedido.getId(), result.get(0).getId());
    }

    @Test
    void testGetPedidoByIdFound() {
        when(pedidoService.getPedido("1")).thenReturn(pedido);

        ResponseEntity<Pedido> response = pedidoController.getPedidoById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pedido, response.getBody());
    }

    @Test
    void testGetPedidoByIdNotFound() {
        when(pedidoService.getPedido("2")).thenReturn(null);

        ResponseEntity<Pedido> response = pedidoController.getPedidoById("2");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreatePedidoConSaldoYStockSuficiente() {
        // Mock saldo suficiente
        when(pedidoService.getPedidos(pedido.getCliente())).thenReturn(Collections.emptyList());
        when(restTemplate.getForEntity(anyString(), eq(Boolean.class)))
                .thenReturn(new ResponseEntity<>(true, HttpStatus.OK));
        // Mock stock suficiente
        when(restTemplate.exchange(anyString(), eq(HttpMethod.PUT), any(HttpEntity.class), eq(Boolean.class)))
                .thenReturn(new ResponseEntity<>(true, HttpStatus.OK));
        when(pedidoService.savePedido(any(Pedido.class))).thenReturn(pedido);

        Pedido result = pedidoController.createPedido(pedido);

        assertEquals(Estado.EN_PREPARACION, result.getEstado());
        verify(pedidoService, times(1)).savePedido(any(Pedido.class));
    }

    @Test
    void testCreatePedidoSinSaldo() {
        when(pedidoService.getPedidos(pedido.getCliente())).thenReturn(Collections.emptyList());
        when(restTemplate.getForEntity(anyString(), eq(Boolean.class)))
                .thenReturn(new ResponseEntity<>(false, HttpStatus.OK));
        when(pedidoService.savePedido(any(Pedido.class))).thenReturn(pedido);

        Pedido result = pedidoController.createPedido(pedido);

        assertEquals(Estado.RECHAZADO, result.getEstado());
        verify(pedidoService, times(1)).savePedido(any(Pedido.class));
    }

    @Test
    void testUpdatePedidoEntregado() throws PedidoNotFoundException {
        when(pedidoService.getPedido("1")).thenReturn(pedido);
        when(pedidoService.savePedido(any(Pedido.class))).thenReturn(pedido);

        EstadoDTO estadoDTO = new EstadoDTO();
        estadoDTO.setEstado("ENTREGADO");

        ResponseEntity<Pedido> response = pedidoController.updatePedido("1", estadoDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Estado.ENTREGADO, response.getBody().getEstado());
    }

    // @Test
    // void testUpdatePedidoCanceladoEnPreparacion() throws PedidoNotFoundException {
    //     pedido.setEstado(Estado.EN_PREPARACION);
    //     when(pedidoService.getPedido("1")).thenReturn(pedido);
    //     when(pedidoService.savePedido(any(Pedido.class))).thenReturn(pedido);

    //     EstadoDTO estadoDTO = new EstadoDTO();
    //     estadoDTO.setEstado("CANCELADO");

    //     ResponseEntity<Pedido> response = pedidoController.updatePedido("1", estadoDTO);

    //     assertEquals(HttpStatus.OK, response.getStatusCode());
    //     assertEquals(Estado.CANCELADO, response.getBody().getEstado());
    //     verify(rabbitTemplate, times(1)).convertAndSend(eq("cola_actualizar-stock"), any());
    // }

    @Test
    void testUpdatePedidoNoEncontrado() {
        when(pedidoService.getPedido("999")).thenReturn(null);

        EstadoDTO estadoDTO = new EstadoDTO();
        estadoDTO.setEstado("CANCELADO");

        assertThrows(PedidoNotFoundException.class, () -> pedidoController.updatePedido("999", estadoDTO));
    }
}
