import { useReducer, useEffect } from 'react';
import { findClientes, deleteCliente } from "@/app/APIs/ClientesAPI";
import { useClienteContext } from './ClienteContext';


/* 
    Client state management using useReducer.
    This hook manages the state of clients, including fetching, filtering, and deleting clients.
*/

//Acciones para el reducer
const ACTIONS = {
    UPDATE_CLIENTES: 'set_clientes',
    SELECT_CLIENTE: 'SET_CLIENTE_SELECCIONADO',
    UPDATE_SNACKBAR: 'SET_SNACKBAR',
    FILTER_CLIENTES: 'FILTER_CLIENTES',
};

// Initial state
const initialState = {
    clientes: [],
    clientesOriginales: [],
    clienteSeleccionado: null,
    snackbar: { open: false, message: '', severity: 'success' },
};

// Reducer function
const clienteReducer = (state, action) => {
    switch (action.type) {
        
        case ACTIONS.UPDATE_CLIENTES:
            return { ...state, clientes: action.payload, clientesOriginales: action.payload };
        case ACTIONS.SELECT_CLIENTE:
            return { ...state, clienteSeleccionado: action.payload };
        case ACTIONS.UPDATE_SNACKBAR:
            return { ...state, snackbar: action.payload };
        case ACTIONS.FILTER_CLIENTES:
            const filteredClientes = state.clientesOriginales.filter((cliente) =>
                cliente.cuit.toLowerCase().includes(action.payload) ||
                cliente.nombre.toLowerCase().includes(action.payload) ||
                cliente.correoElectronico.toLowerCase().includes(action.payload) ||
                cliente.maximoDescubierto.toString().includes(action.payload) ||
                cliente.maximoDeObras.toString().includes(action.payload)
            );
            return { ...state, clientes: filteredClientes };
        default:
            return state;
    }
};


// Custom hook
export const useCliente = () => {
    const { clienteSeleccionado, updateClienteSeleccionado } = useClienteContext(); // Access ClienteContext
    const [state, dispatch] = useReducer(clienteReducer, initialState);

    // Fetch clients on mount
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await findClientes();
                data.map((cliente) => ({
                    id: cliente.id,
                    cuit: cliente.cuit,
                    nombre: cliente.nombre,
                    correoElectronico: cliente.correoElectronico,
                    maximoDescubierto: cliente.maximoDescubierto,
                    maximoDeObras: cliente.maximoDeObras,
                    obrasActivas: cliente.obrasActivas,
                    obras: cliente.obras || [],
                    usuarios: cliente.usuarios || []
                }));
                dispatch({ type: ACTIONS.UPDATE_CLIENTES, payload: data });
            } catch (error) {
                console.error('Error al cargar los clientes:', error);
                dispatch({
                    type: ACTIONS.UPDATE_SNACKBAR,
                    payload: { open: true, message: 'Error al cargar los clientes', severity: 'error' },
                });
            }
        };
        fetchClientes();
    }, []);

    // Handle search
    const buscarCliente = (searchTerm) => {
        dispatch({ type: ACTIONS.FILTER_CLIENTES, payload: searchTerm.toLowerCase() });
    };

    // Handle delete
    const eliminarCliente = async (cliente) => {
        if (window.confirm(`¿Está seguro de que desea eliminar el cliente ${cliente.nombre}?`)) {
            try {
                const result = await deleteCliente(cliente.id);
                console.log('Resultado de la eliminación:', result);
                if (result) {
                    dispatch({
                        type: ACTIONS.UPDATE_SNACKBAR,
                        payload: { open: true, message: 'Cliente eliminado con éxito', severity: 'success' },
                    });
                    const updatedClientes = await findClientes();
                    updatedClientes.map((cliente) => ({
                        id: cliente.id,
                        cuit: cliente.cuit,
                        nombre: cliente.nombre,
                        correoElectronico: cliente.correoElectronico,
                        maximoDescubierto: cliente.maximoDescubierto,
                        maximoDeObras: cliente.maximoDeObras,
                        obrasActivas: cliente.obrasActivas,
                        obras: cliente.obras || [],
                        usuarios: cliente.usuarios || []
                    }));
                    dispatch({ type: ACTIONS.UPDATE_CLIENTES, payload: updatedClientes });
                } else {
                    dispatch({
                        type: ACTIONS.UPDATE_SNACKBAR,
                        payload: { open: true, message: 'Error al eliminar el cliente', severity: 'error' },
                    });
                }
            } catch (error) {
                console.error('Error al eliminar el cliente:', error);
                dispatch({
                    type: ACTIONS.UPDATE_SNACKBAR,
                    payload: { open: true, message: 'Error al eliminar el cliente', severity: 'error' },
                });
            }
        }
    };

    // Handle client selection
    const seleccionarCliente = (cliente) => {
        dispatch({ type: ACTIONS.SELECT_CLIENTE, payload: cliente });
        updateClienteSeleccionado(cliente); // Update the selected client in the context
        console.log('ESTO SE DEBERIA LLAMAR 1 VEZ NOMAS useCliente:', cliente);
    };

    // Close snackbar
    const closeSnackbar = () => {
        dispatch({ type: ACTIONS.UPDATE_SNACKBAR, payload: { ...state.snackbar, open: false } });
    };

    return {
        clientes: state.clientes,
        clienteSeleccionado: state.clienteSeleccionado,
        snackbar: state.snackbar,
        buscarCliente,
        eliminarCliente,
        seleccionarCliente,
        closeSnackbar,
    };
};