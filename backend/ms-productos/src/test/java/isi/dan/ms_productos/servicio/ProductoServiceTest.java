package isi.dan.ms_productos.servicio;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import isi.dan.ms_productos.dao.ProductoRepository;
import isi.dan.ms_productos.exception.ProductoNotFoundException;
import isi.dan.ms_productos.modelo.Categoria;
import isi.dan.ms_productos.modelo.Producto;

class ProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto producto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        producto = new Producto();
        producto.setId(1);
        producto.setNombre("Yeso Profesional");
        producto.setDescripcion("Bolsa de 25kg");
        producto.setStockActual(50);
        producto.setStockMinimo(10);
        producto.setPrecio(new BigDecimal("1500.50"));
        producto.setCategoria(Categoria.YESERIA);
        producto.setDescuentoPromocional(5);
    }

    @Test
    void testSaveProducto() {
        when(productoRepository.save(producto)).thenReturn(producto);

        Producto saved = productoService.saveProducto(producto);
        assertEquals(producto, saved);
    }

    @Test
    void testGetAllProductos() {
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepository.findAll()).thenReturn(productos);

        List<Producto> result = productoService.getAllProductos();
        assertEquals(1, result.size());
        assertEquals(producto, result.get(0));
    }

    @Test
    void testGetProductoById() {
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto));

        Optional<Producto> result = productoService.getProductoById(1);
        assertTrue(result.isPresent());
        assertEquals(producto, result.get());
    }

    @Test
    void testGetProductosByCategoria() throws ProductoNotFoundException {
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepository.findByCategoria(Categoria.YESERIA)).thenReturn(productos);

        List<Producto> result = productoService.getProductosByCategoria(Categoria.YESERIA);
        assertEquals(productos, result);
    }

    @Test
    void testGetProductosByCategoriaThrowsException() {
        when(productoRepository.findByCategoria(Categoria.YESERIA)).thenReturn(null);

        assertThrows(ProductoNotFoundException.class, () -> {
            productoService.getProductosByCategoria(Categoria.YESERIA);
        });
    }

    @Test
    void testDeleteProducto() {
        doNothing().when(productoRepository).deleteById(1);

        productoService.deleteProducto(1);
        verify(productoRepository, times(1)).deleteById(1);
    }

    @Test
    void testDeleteByCategoria() {
        doNothing().when(productoRepository).deleteByCategoria(Categoria.YESERIA);

        productoService.deleteByCategoria(Categoria.YESERIA);
        verify(productoRepository, times(1)).deleteByCategoria(Categoria.YESERIA);
    }

    @Test
    void testUpdateProducto() {
        when(productoRepository.save(producto)).thenReturn(producto);

        Producto updated = productoService.updateProducto(producto);
        assertEquals(producto, updated);
    }

    @Test
    void testSaveAll() {
        List<Producto> productos = Arrays.asList(producto);
        when(productoRepository.saveAll(productos)).thenReturn(productos);

        List<Producto> result = productoService.saveAll(productos);
        assertEquals(productos, result);
    }
}
