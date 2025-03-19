package isi.dan.ms_productos.exception;

import isi.dan.ms_productos.modelo.Categoria;

public class ProductoNotFoundException extends Exception{
    public ProductoNotFoundException(Long id){
        super("Producto "+id+" no encontrado");
    }

    public ProductoNotFoundException(Categoria categoria){
        super("Productos de la categoria " + categoria.toString() +  " no encontrados");
    }

    public ProductoNotFoundException(String cat){
        super("Categoria " +cat + " no existente.");
    }
}
