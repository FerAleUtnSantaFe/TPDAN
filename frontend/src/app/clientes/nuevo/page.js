'use client';

import React, { Suspense } from 'react';
import FormularioCliente from '../Components/FormularioCliente';

export default function Nuevo(){
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FormularioCliente modo="nuevo"/>
    </Suspense>
  );
};