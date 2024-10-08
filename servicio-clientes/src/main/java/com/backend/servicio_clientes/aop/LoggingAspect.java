package com.backend.servicio_clientes.aop;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("@annotation(isi.dan.msclientes.aop.LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        Object proceed = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - start;

        logger.info("{};{}", joinPoint.getSignature().getDeclaringType()
        +"."+
        joinPoint.getSignature().getName(), executionTime);
        MDC.put("metodo", joinPoint.getSignature().toLongString());
        MDC.put("duracion", executionTime+"");

        return proceed;
    }

}
