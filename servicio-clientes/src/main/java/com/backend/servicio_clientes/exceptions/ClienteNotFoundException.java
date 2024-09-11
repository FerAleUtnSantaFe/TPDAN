package com.backend.servicio_clientes.exceptions;

public class ClienteNotFoundException extends Exception{
    public ClienteNotFoundException(String msg){
        super(msg);
    }
}
