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

export default function PedidosPage() {

    const [currentStep, setCurrentStep] = useState(0); // Paso actual
    const [selectedCliente, setSelectedCliente] = useState({}); // Cliente seleccionado
    const [selectedObra, setSelectedObra] = useState({}); // Obra seleccionada
    const [selectedProductos, setSelectedProductos] = useState([]); // Productos seleccionados


    const handleClienteSelect = (cliente) => {
        setSelectedCliente(cliente);
        console.log("cliente seleccionado: ", cliente);
        console.log("selected cliente: ", selectedCliente);
        if (cliente) setCurrentStep(1);
    };

    const handleObraSelect = (obra) => {
        setSelectedObra(obra);
        console.log("obra seleccionada: ", obra);
        console.log("selected obra: ", selectedObra);
        setCurrentStep(2);
    };

    const handleProductosSelect = (productosSeleccionados) => {
        setSelectedProductos(productosSeleccionados);
        console.log("productos seleccionados: ", productosSeleccionados);
        console.log("selected productos: ", selectedProductos);
        setCurrentStep(3);
    };

    return (
        <div>
            <NavBar />
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
                        obrasIniciales={selectedCliente ? selectedCliente.obras : []} // Pasar las obras del cliente seleccionado
                        modo="pedido"
                        onObraSelect={handleObraSelect} // Pasar la función para manejar la selección de obra
                    />
                )}

                {currentStep === 2 && (
                    <ProductGrid
                        isPedidoMode={true}
                        onListaProductosSelect={handleProductosSelect} // Pasar la función para manejar la selección de productos
                    />
                )}

                {currentStep === 3 && (
                    <CargandoPedido onEnd={() => {setCurrentStep(4)
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
        </div>
    );

}