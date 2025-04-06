'use client';

import ProductGrid from '@/app/productos/Components/ProductGrid';
import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import NavBar from "../../Components/NavBar";
import ProgressBarPedido from '../Components/ProgressBarPedido';
import DataGridCliente from '@/app/clientes/Components/DataGridCliente';
import DataGridObras from '@/app/clientes/Components/DataGridObras';
import { useState } from 'react';

export default function PedidosPage() {

    const [currentStep, setCurrentStep] = useState(0); // Paso actual
    const [selectedCliente, setSelectedCliente] = useState({}); // Cliente seleccionado
    const [selectedObra, setSelectedObra] = useState({}); // Obra seleccionada
    const [selectedProductos, setSelectedProductos] = useState([]); // Productos seleccionados

    // Manejar la selección de un cliente
    const handleClienteSelect = (cliente) => {

        console.log("en la pantalla de nuevo pedido");
        console.log(cliente);

        setSelectedCliente(cliente); // Guardar el cliente seleccionado
        console.log(cliente)
        if(cliente) setCurrentStep(1);
    };

    // Manejar la selección de una obra
    const handleObraSelect = (obra) => {
        setSelectedObra(obra); // Guardar la obra seleccionada
        setCurrentStep(2); // Avanzar al paso 2
    };

    // Manejar la selección de productos
    const handleProductosSelect = (productos) => {
        setSelectedProductos(productos); // Guardar los productos seleccionados
        // Aquí puedes enviar los datos al backend o realizar otra acción
    };

    return (
        <div>
            <NavBar />
            <Container>
                <Typography variant="h3" color='primary' gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
                    Gestión de pedidos: Nuevo pedido
                </Typography>
                <ProgressBarPedido currentStep={currentStep} />

                {/* Mostrar el DataGrid correspondiente según el paso actual */}
                {/* {currentStep === 0 && (
                    <DataGridCliente
                        modo="pedido"
                        onClienteSelect={handleClienteSelect} // Pasar la función para manejar la selección de cliente
                        // Pasar la función para manejar la selección de cliente
                    />
                )}

                {currentStep === 1 && (
                    <DataGridObras
                        obrasIniciales={selectedCliente ? selectedCliente.obras : []} // Pasar las obras del cliente seleccionado
                        modo="pedido"
                        onObraSelect={handleObraSelect} // Pasar la función para manejar la selección de obra
                    />
                )} */}

                {currentStep === 2 && (
                    <ProductGrid
                        isPedidoMode={true}
                        // onProductosSelect={handleProductosSelect} // Pasar la función para manejar la selección de productos
                    />
                )}
            </Container>
        </div>
    );
}

