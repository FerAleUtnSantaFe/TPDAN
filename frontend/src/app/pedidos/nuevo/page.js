'use client';

import { Container } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import NavBar from "../../Components/NavBar";
import ProgressBarPedido from '../Components/ProgressBarPedido';
import DataGridCliente from '@/app/clientes/Components/DataGridCliente';
import DataGridObras from '@/app/clientes/Components/DataGridObras';

export default function PedidosPage() {
    
    const [currentStep, setCurrentStep] = React.useState(0); // Paso actual
    const [selectedCliente, setSelectedCliente] = React.useState(null); // Cliente seleccionado
    const [selectedObra, setSelectedObra] = React.useState(null); // Obra seleccionada
    const [selectedProductos, setSelectedProductos] = React.useState([]); // Productos seleccionados

    // Manejar la selección de un cliente
    const handleClienteSelect = (cliente) => {
        setSelectedCliente(cliente); // Guardar el cliente seleccionado
        console.log(cliente)
        setCurrentStep(1); // Avanzar al paso 1
    };

    // Manejar la selección de una obra
    const handleObraSelect = (obra) => {
        setSelectedObra(obra); // Guardar la obra seleccionada
        setCurrentStep(1); // Avanzar al paso 2
    };

    // Manejar la selección de productos
    const handleProductosSelect = (productos) => {
        setSelectedProductos(productos); // Guardar los productos seleccionados
        console.log('Pedido completo:', {
            cliente: selectedCliente,
            obra: selectedObra,
            productos: productos,
        });
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
                {currentStep === 0 && (
                    <DataGridCliente
                        modo="pedido"
                        onClienteSelect={handleClienteSelect} // Pasar la función para manejar la selección de cliente
                    />
                )}

                {currentStep === 1 && (
                    <DataGridObras
                        modo="pedido"
                        onObraSelect={handleObraSelect} // Pasar la función para manejar la selección de obra
                    />
                )}

                {currentStep === 2 && (
                    <DataGridProductos
                        modo="pedido"
                        onProductosSelect={handleProductosSelect} // Pasar la función para manejar la selección de productos
                    />
                )}
            </Container>
        </div>
    );
}

