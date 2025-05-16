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
import SnackbarComponent from '@/app/Components/SnackBarComponent';

export default function PedidosPage() {

    // Step and selection state
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedObra, setSelectedObra] = useState(null);
    const [selectedProductos, setSelectedProductos] = useState([]);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    /**
     * Shows a snackbar with the given message and severity.
     * @param {string} message - The message to display.
     * @param {'success'|'warning'|'error'|'info'} severity - The severity of the snackbar.
     */
    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    /**
    * Handles closing the snackbar.
    */
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    
    /**
     * Handles client selection.
     * @param {object} cliente - The selected client.
     */
    const handleClienteSelect = (cliente) => {
        if (cliente) {
            setSelectedCliente(cliente);
            setCurrentStep(1); // Move to the next step
        } else {
            showSnackbar('Debe seleccionar un cliente para continuar.', 'warning');
        }
    };


    /**
     * Handles obra (project) selection.
     * @param {object} obra - The selected obra.
     */
    const handleObraSelect = (obra) => {
        if (obra && obra.estado === 'HABILITADA') {
            setSelectedObra(obra);
            setCurrentStep(2); // Move to the next step
        } else {
            showSnackbar('Debe seleccionar una obra con estado HABILITADA.', 'warning');
        }
    };

    const handleProductosSelect = (productosSeleccionados) => {
        if (cliente) {
            setSelectedProductos(productosSeleccionados);
            setCurrentStep(3);
        }
        else {
            showSnackbar('Debe seleccionar al menos un producto para continuar.', 'warning');
        }
    };

    return (
        <div>
            <NavBar />
            <ClienteProvider >
                <Container>
                    <Typography variant="h1" gutterBottom sx={{ margin: 2, textAlign: 'center' }}>
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
                {/* Snackbar for user feedback */}
                <SnackbarComponent
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={handleSnackbarClose}
                />
            </ClienteProvider>
        </div>
    );

}