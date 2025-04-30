'use client';

import React, { Suspense } from 'react';
import { ClienteProvider } from '../Hooks/ClienteContext';
import FormularioCliente from '../Components/FormularioCliente';

export default function Nuevo(){
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ClienteProvider>
        <FormularioCliente modo="nuevo"/>
      </ClienteProvider>
    </Suspense>
  );
};