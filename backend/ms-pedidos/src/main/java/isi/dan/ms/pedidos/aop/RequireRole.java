package isi.dan.ms.pedidos.aop;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    String value(); // Ej: "ROLE_ADMIN"
}
