package isi.dan.ms_productos.controller;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import isi.dan.ms_productos.modelo.Categoria;
import isi.dan.ms_productos.modelo.Producto;
import isi.dan.ms_productos.servicio.ProductoService;

@WebMvcTest(ProductoController.class)
public class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;
    
    Producto producto;

    @MockBean
    private ProductoService productoService;

    @BeforeEach
    public void setup() {
        producto = new Producto();
        producto.setNombre("Producto1");
        producto.setCategoria(Categoria.CEMENTOS);
        producto.setPrecio(new BigDecimal("100.00"));
        producto.setStockActual(10);
        producto.setStockMinimo(1);
        producto.setDescripcion("Descripción del producto");
    }

    @Test
    void testGetAll() throws Exception {
        Mockito.when(productoService.getAllProductos()).thenReturn(Collections.singletonList(producto));

        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].direccion").value("Direccion Test Producto"));
    }

    @Test
    void testGetById() throws Exception {
        Mockito.when(productoService.getProductoById((long) 1)).thenReturn(Optional.of(producto));

        mockMvc.perform(get("/api/productos/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.direccion").value("Direccion Test Producto"));
    }

    @Test
    void testCreate() throws Exception {
        Mockito.when(productoService.saveProducto(Mockito.any(Producto.class))).thenReturn(producto);

        mockMvc.perform(post("/api/productos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(producto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.direccion").value("Direccion Test Producto"));
    }

    @Test
    void testUpdate() throws Exception {
        Mockito.when(productoService.getProductoById((long) 1)).thenReturn(Optional.of(producto));
        Mockito.when(productoService.updateProducto(Mockito.any(Producto.class))).thenReturn(producto);

        mockMvc.perform(put("/api/productos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(producto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.direccion").value("Direccion Test Producto"));
    }

    @Test
    void testDelete() throws Exception {
        Mockito.when(productoService.getProductoById((long) 1)).thenReturn(Optional.of(producto));
        Mockito.doNothing().when(productoService).deleteProducto((long) 1);

        mockMvc.perform(delete("/api/productos/1"))
                .andExpect(status().isNoContent());
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}