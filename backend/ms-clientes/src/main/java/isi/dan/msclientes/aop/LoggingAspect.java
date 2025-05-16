package isi.dan.msclientes.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    /**
     * Pointcut for methods annotated with @LogExecutionTime
     */
    @Pointcut("@annotation(isi.dan.msclientes.aop.LogExecutionTime)")
    public void logExecutionTimeAnnotation() {
        // Pointcut definition
    }

    /**
     * Logs method execution time, arguments, and exceptions.
     *
     * @param joinPoint the join point representing the method
     * @return the result of the method execution
     * @throws Throwable if the method throws an exception
     */
    @Around("logExecutionTimeAnnotation()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        MDC.clear(); // Clear MDC to avoid leftover data from previous logs

        // Add method details to MDC for structured logging
        MDC.put("class", joinPoint.getSignature().getDeclaringTypeName());
        MDC.put("method", joinPoint.getSignature().getName());
        MDC.put("arguments", Arrays.toString(joinPoint.getArgs()));

        try {
            // Proceed with method execution
            Object result = joinPoint.proceed();

            // Calculate execution time
            long executionTime = System.currentTimeMillis() - start;
            MDC.put("executionTimeMs", String.valueOf(executionTime));

            // Log success
            logger.info("Method executed successfully: {}.{}() with arguments {} in {} ms",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    Arrays.toString(joinPoint.getArgs()),
                    executionTime);

            return result;
        } catch (Throwable ex) {
            // Log exception details
            MDC.put("exception", ex.getClass().getName());
            MDC.put("exceptionMessage", ex.getMessage());
            logger.error("Exception in method: {}.{}() with arguments {}. Exception: {} - {}",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    Arrays.toString(joinPoint.getArgs()),
                    ex.getClass().getName(),
                    ex.getMessage(),
                    ex);

            throw ex; // Re-throw the exception to maintain application behavior
        } finally {
            // Clear MDC after logging
            MDC.clear();
        }
    }
}