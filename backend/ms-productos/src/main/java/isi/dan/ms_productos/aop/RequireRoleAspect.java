package isi.dan.ms_productos.aop;

import org.aspectj.lang.annotation.*;
import org.aspectj.lang.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RequireRoleAspect {

    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getAuthorities().stream().noneMatch(
                a -> a.getAuthority().equals(requireRole.value()))) {
                return ResponseEntity
                        .status(403)
                        .body("No tienes permiso para acceder a este recurso.");
        }

        return joinPoint.proceed();
    }
}
