package isi.dan.ms_productos.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
// import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import isi.dan.ms_productos.modelo.Categoria;
import isi.dan.ms_productos.modelo.Producto;
import isi.dan.ms_productos.security.JwTokenProvider;
import isi.dan.ms_productos.security.JwtAuthenticationFilter;
import isi.dan.ms_productos.servicio.ProductoService;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(ProductoController.class)
public class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    Producto producto;

    @MockBean
    private ProductoService productoService;

    @MockBean
    private JwTokenProvider jwTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    public void setup() {
        producto = new Producto();
        producto.setNombre("Producto1");
        producto.setCategoria(Categoria.CEMENTOS);
        producto.setPrecio(new Double("100.00"));
        producto.setStockActual(10);
        producto.setStockMinimo(1);
        producto.setDescripcion("Descripcion");
    }

    @Test
    void testGetAll() throws Exception {
        Mockito.when(productoService.getAllProductos()).thenReturn(Collections.singletonList(producto));

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].descripcion").value("Descripcion"));
    }

    @Test
    void testGetById() throws Exception {
        Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.of(producto));

        mockMvc.perform(get("/api/productos/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.descripcion").value("Descripcion"));
    }

    @Test
    void testCreate() throws Exception {
        Mockito.when(productoService.saveProducto(Mockito.any(Producto.class))).thenReturn(producto);

        ObjectMapper objectMapper = new ObjectMapper();
        String productoJson = objectMapper.writeValueAsString(producto);

        mockMvc.perform(post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Producto1"))
                .andExpect(jsonPath("$.categoria").value("CEMENTOS"))
                .andExpect(jsonPath("$.precio").value(100.00))
                .andExpect(jsonPath("$.descripcion").value("Descripcion"));
    }

    @Test
    void testCreateProductoNombreVacio() throws Exception {
        producto.setNombre(""); // Nombre vacío, debería fallar la validación

        ObjectMapper objectMapper = new ObjectMapper();
        String productoJson = objectMapper.writeValueAsString(producto);

        mockMvc.perform(post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(productoJson))
                .andExpect(status().isBadRequest()); // O 400 si el validador funciona bien
    }

    @Test
    void testGetByIdNoExiste() throws Exception {
        Mockito.when(productoService.getProductoById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/productos/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdate() throws Exception {
        Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.of(producto));
        Mockito.when(productoService.updateProducto(Mockito.any(Producto.class))).thenReturn(producto);

        producto.setDescripcion("Descripcion Updated");
        mockMvc.perform(put("/api/productos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(producto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descripcion").value("Descripcion Updated"));
    }

    @Test
    void testDelete() throws Exception {
        Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.of(producto));
        Mockito.doNothing().when(productoService).deleteProducto(1);

        mockMvc.perform(delete("/api/productos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetByCategoria() throws Exception {
        Mockito.when(productoService.getProductosByCategoria(Categoria.CEMENTOS))
                .thenReturn(Collections.singletonList(producto));

        mockMvc.perform(get("/api/productos/categoria/CEMENTOS"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descripcion").value("Descripcion"));
    }

    @Test
    void testGetByCategoriaInvalida() throws Exception {
        mockMvc.perform(get("/api/productos/categoria/INVALIDA"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("Categoria INVALIDA no existente."));
    }

    @Test
    void testDeleteByCategoriaInvalida() throws Exception {
        mockMvc.perform(delete("/api/productos/categoria/INVALIDA"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("Categoria INVALIDA no existente."));
    }

    @Test
    void testUpdateProductoNoExiste() throws Exception {
        Mockito.when(productoService.getProductoById(99)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/productos/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(producto)))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("Producto 99 no encontrado"));
        ;
    }

    @Test
    void testProvisionStockProductoNoExiste() throws Exception {
        Mockito.when(productoService.getProductoById(123)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/productos/123/provision")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                            {
                                "stock": 10,
                                "precio": "150.00"
                            }
                        """))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("Producto 123 no encontrado"));
    }

    // @Test
    // void testActualizarStockProductoNoEncontrado() throws Exception {
    //     Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.empty());

    //     String requestBody = """
    //                 [
    //                     {"id": 1, "cantidad": 2}
    //                 ]
    //             """;

    //     mockMvc.perform(put("/api/productos/actualizar-stock")
    //             .contentType(MediaType.APPLICATION_JSON)
    //             .content(requestBody))
    //             .andExpect(status().isNotFound()) // Si tu método sigue igual
    //             .andExpect(content().string("false"));
    // }

    @Test
    void testDeleteByCategoria() throws Exception {
        Mockito.doNothing().when(productoService).deleteByCategoria(Categoria.CEMENTOS);

        mockMvc.perform(delete("/api/productos/categoria/CEMENTOS"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testBatchCreate() throws Exception {
        Mockito.when(productoService.saveAll(Mockito.anyList()))
                .thenReturn(Collections.singletonList(producto));

        mockMvc.perform(post("/api/productos/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(Collections.singletonList(producto))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].descripcion").value("Descripcion"));
    }

    @Test
    void testProvisionStock() throws Exception {
        Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.of(producto));
        Mockito.when(productoService.updateProducto(Mockito.any(Producto.class))).thenReturn(producto);

        String requestBody = """
                    {
                        "stock": 5,
                        "precio": "150.00"
                    }
                """;

        mockMvc.perform(put("/api/productos/1/provision")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }

    // @Test
    // void testActualizarStock() throws Exception {
    //     producto.setStockActual(10);
    //     Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.of(producto));
    //     Mockito.when(productoService.updateProducto(Mockito.any())).thenReturn(producto);

    //     String requestBody = """
    //                 [
    //                     {"id": 1, "cantidad": 2}
    //                 ]
    //             """;

    //     mockMvc.perform(put("/api/productos/actualizar-stock")
    //             .contentType(MediaType.APPLICATION_JSON)
    //             .content(requestBody))
    //             .andExpect(status().isOk())
    //             .andExpect(content().string("true"));
    // }

    // // Test de rabbitmq
    // @Test
    void testActualizarStockEndpoint_viaMockMvc() throws Exception {
        List<Map<String, Object>> productos = List.of(Map.of("id", 1, "cantidad", 5));

        Producto p = new Producto();
        p.setId(1);
        p.setStockActual(10);

        Mockito.when(productoService.getProductoById(1)).thenReturn(Optional.of(p));
        Mockito.when(productoService.updateProducto(Mockito.any(Producto.class))).thenReturn(p);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(productos);

        mockMvc.perform(put("/api/productos/actualizar-stock")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        // Esperamos que reste 5 → 10 - 5 = 5
        Mockito.verify(productoService).updateProducto(Mockito.argThat(prod -> prod.getStockActual() == 5));
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}