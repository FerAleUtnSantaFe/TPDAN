package backend.servicio_productos.exception;

public class ProductoNotFoundException extends Exception{
    public ProductoNotFoundException(Long id){
        super("Producto "+id+" no encontrado");
    }
}
