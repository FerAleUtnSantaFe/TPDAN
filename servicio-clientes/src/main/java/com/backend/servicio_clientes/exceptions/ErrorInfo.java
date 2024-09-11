package com.backend.servicio_clientes.exceptions;

import java.time.Instant;

public record ErrorInfo(Instant fecha, String description, String detalle, Integer codigo) {
}    