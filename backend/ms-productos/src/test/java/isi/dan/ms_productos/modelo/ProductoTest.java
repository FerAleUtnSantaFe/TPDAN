package isi.dan.ms_productos.modelo;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;

public class ProductoTest {

    @Test
    public void testCrearProductoConTodasLasCategorias() {
        for (Categoria categoria : Categoria.values()) {
            Producto producto = new Producto();
            producto.setNombre("Producto " + categoria.name());
            producto.setDescripcion("Descripción para " + categoria.name());
            producto.setStockActual(10);
            producto.setStockMinimo(2);
            producto.setPrecio(99.99);
            producto.setCategoria(categoria);
            producto.setDescuentoPromocional(5);

            assertEquals("Producto " + categoria.name(), producto.getNombre());
            assertEquals(categoria, producto.getCategoria());
            assertEquals(10, producto.getStockActual());
            assertEquals(99.99, producto.getPrecio());
        }
    }

    @Test
    void testEqualsAndHashCode() {
        Producto p1 = new Producto();
        p1.setNombre("A");

        Producto p2 = new Producto();
        p2.setNombre("A");

        assertEquals(p1, p2);
        assertEquals(p1.hashCode(), p2.hashCode());
    }

}
