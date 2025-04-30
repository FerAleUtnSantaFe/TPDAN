import React, { createContext, useContext, useState } from 'react';

// Create the context
const ClienteContext = createContext();

// Provider component
export const ClienteProvider = ({ children }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState({
    id: null,
    cuit: '',
    correoElectronico: '',
    nombre: '',
    maximoDescubierto: 0,
    maximoDeObras: 0,
    obrasActivas: 0,
    obras: [],
    usuarios: [],
  });

  // Function to update the clienteSeleccionado
  const updateClienteSeleccionado = (cliente) => {
    setClienteSeleccionado((prev) => (typeof cliente === 'function' ? cliente(prev) : cliente));
  };

  return (
    <ClienteContext.Provider value={{ clienteSeleccionado, updateClienteSeleccionado }}>
      {children}
    </ClienteContext.Provider>
  );
};

// Custom hook to use the ClienteContext
export const useClienteContext = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error('useClienteContext must be used within a ClienteProvider');
  }
  return context;
};