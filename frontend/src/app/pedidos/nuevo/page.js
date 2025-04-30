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
import FormularioPedido from '../Components/FormularioPedido';
import { CargandoPedido } from '../Components/CargandoPedido';
import { ClienteProvider } from '@/app/clientes/Hooks/ClienteContext';

export default function PedidosPage() {

    const [currentStep, setCurrentStep] = useState(0); // Paso actual
    const [selectedCliente, setSelectedCliente] = useState(null); // Cliente seleccionado
    const [selectedObra, setSelectedObra] = useState(null); // Obra seleccionada
    const [selectedProductos, setSelectedProductos] = useState([]); // Productos seleccionados

    /////////////// SEGIR ACA, SE ROMPIO LA CREACION DE PEDIDOS

    const handleClienteSelect = (cliente) => {
        if (cliente) {
            setSelectedCliente(cliente);
            setCurrentStep(1); // Move to the next step
        } else {
            alert('Debe seleccionar un cliente para continuar.');
        }
    };

    // Handle obra selection
    const handleObraSelect = (obra) => {
        console.log("obra seleccionada: ", obra);
        if (obra && obra.estado === 'HABILITADA') {
            setSelectedObra(obra);
            setCurrentStep(2); // Move to the next step
        } else {
            alert('Debe seleccionar una obra con estado HABILITADA.');
        }
    };

    const handleProductosSelect = (productosSeleccionados) => {
        setSelectedProductos(productosSeleccionados);
        setCurrentStep(3);
    };

    return (
        <div>
            <NavBar />
            <ClienteProvider >
                <Container>
                    <Typography variant="h3" color='primary' gutterBottom sx={{ margin: 1, textAlign: 'center' }}>
                        Gestión de pedidos: Nuevo pedido
                    </Typography>
                    <ProgressBarPedido currentStep={currentStep} />

                    {currentStep === 0 && (
                        <DataGridCliente
                            modo="pedido"
                            onClienteSelect={handleClienteSelect} // Pasar la función para manejar la selección de cliente
                        // Pasar la función para manejar la selección de cliente
                        />
                    )}

                    {currentStep === 1 && (
                        <DataGridObras
                            modo="pedido"
                            onObraSelect={handleObraSelect}
                        />
                    )}

                    {currentStep === 2 && (
                        <ProductGrid
                            isPedidoMode={true}
                            onListaProductosSelect={handleProductosSelect} // Pasar la función para manejar la selección de productos
                        />
                    )}

                    {currentStep === 3 && (
                        <CargandoPedido onEnd={() => {
                            setCurrentStep(4)
                            console.log("selected productos en paso 4: ", selectedProductos);
                        }}
                        />

                    )}

                    {currentStep === 4 && (
                        <FormularioPedido
                            cliente={selectedCliente} // Pasar el cliente seleccionado
                            obra={selectedObra} // Pasar la obra seleccionada
                            listaProductos={selectedProductos} // Pasar los productos seleccionados
                        />
                    )}
                </Container>
            </ClienteProvider>
        </div>
    );

}