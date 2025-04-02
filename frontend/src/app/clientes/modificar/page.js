'use client';

import React, { Suspense } from 'react';
import FormularioCliente from '../Components/FormularioCliente';

export default function Modificar() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FormularioCliente modo="modificar"/>
    </Suspense>
  );
}