'use client';

import React, { Suspense } from 'react';
import FormularioCliente from '../Components/FormularioCliente';
import { ClienteProvider } from '../Hooks/ClienteContext';


export default function Modificar() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClienteProvider>
        <FormularioCliente modo="modificar" />
      </ClienteProvider>
    </Suspense>
  );
}