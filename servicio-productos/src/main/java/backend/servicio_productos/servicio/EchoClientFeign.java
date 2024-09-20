package backend.servicio_productos.servicio;

//import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

// @FeignClient("MS-CLIENTES") esto es del eureka
public interface EchoClientFeign {
    
    @GetMapping(value="/api/clientes/echo")
    String echo();
        
}
