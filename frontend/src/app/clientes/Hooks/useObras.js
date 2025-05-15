import { useReducer, useEffect } from 'react';
import { useClienteContext } from './ClienteContext';

// Action types for the reducer
const ACTIONS = {
  SET_OBRAS: 'set_obras',
  SET_FILTERED_OBRAS: 'set_filtered_obras',
  SET_SNACKBAR: 'set_snackbar',
  OPEN_MODAL: 'open_modal',
  CLOSE_MODAL: 'close_modal',
  SET_SEARCH_TERM: 'set_search_term',
  SET_OBRA_SELECCIONADA: 'set_obra_seleccionada',
};

// Initial state for the reducer
const initialState = {
  obras: [], // List of all obras
  filteredObras: [], // Filtered list of obras (based on search)
  snackbar: { open: false, message: '', severity: 'success' }, // Snackbar state
  obraModalOpen: false, // Whether the obra modal is open
  obraSeleccionada: null, // The obra currently selected for editing
  searchTerm: '', // Current search term
  modoModal: 'nuevo', // Mode of the modal (nuevo or modificar)
};

// Reducer function to manage state transitions
const obrasReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_OBRAS:
      return { ...state, obras: [...action.payload], filteredObras: action.payload };
    case ACTIONS.SET_FILTERED_OBRAS:
      return { ...state, filteredObras: action.payload };
    case ACTIONS.SET_SNACKBAR:
      return { ...state, snackbar: action.payload };
    case ACTIONS.OPEN_MODAL:
      return { ...state, obraModalOpen: true, obraSeleccionada: action.payload, modoModal: action.modo };
    case ACTIONS.CLOSE_MODAL:
      return { ...state, obraModalOpen: false, obraSeleccionada: null, modoModal: 'nuevo' };
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    case ACTIONS.SET_OBRA_SELECCIONADA:
      return { ...state, obraSeleccionada: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

/**
 * Custom hook to manage the state and logic for the DataGridObras component.
 * Handles adding, editing, deleting, searching, and displaying obras.
 *
 * @returns {object} - State and handlers for managing obras.
 */
export const useObras = () => {
  const { clienteSeleccionado, updateClienteSeleccionado } = useClienteContext(); // Access client context
  const [state, dispatch] = useReducer(obrasReducer, initialState); // useReducer for state management

  /**
   * Initializes the obras list from the selected client.
   * Formats the obras to include a unique `tempId` for internal tracking.
   */
  useEffect(() => {
    if (clienteSeleccionado?.obras) {
      const formattedObras = clienteSeleccionado.obras.map((obra, index) => ({
        tempId: obra.id || obra.tempId || Date.now() + index, // Generate a unique tempId if not present
        ...obra,
      }));
      dispatch({ type: ACTIONS.SET_OBRAS, payload: formattedObras });
    }
  }, [clienteSeleccionado]);

  /**
   * Handles the search functionality.
   * Filters the obras based on the search term entered by the user.
   *
   * @param {string} term - The search term entered by the user.
   */
  const handleSearch = (term) => {
    const value = term.toLowerCase();
    dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: value });

    if (value === '') {
      // If search term is empty, reset to all obras
      dispatch({ type: ACTIONS.SET_FILTERED_OBRAS, payload: state.obras });
    } else {
      // Filter obras based on the search term
      const filtered = state.obras.filter((obra) =>
        obra.direccion.toLowerCase().includes(value) ||
        obra.lat.toString().includes(value) ||
        obra.lng.toString().includes(value) ||
        obra.presupuesto.toString().includes(value) ||
        obra.estado.toLowerCase().includes(value)
      );
      dispatch({ type: ACTIONS.SET_FILTERED_OBRAS, payload: filtered });
    }
  };

  /**
   * Opens the modal for adding or editing an obra.
   *
   * @param {object|null} obra - The obra to edit (null for adding a new obra).
   * @param {string} modo - The mode of the modal ("nuevo" or "modificar").
   */
  const openObraModal = (obra = null, modo = 'nuevo') => {
    dispatch({ type: ACTIONS.OPEN_MODAL, payload: obra, modo });
  };

  /**
   * Closes the obra modal.
   */
  const closeObraModal = () => {
    dispatch({ type: ACTIONS.CLOSE_MODAL });
  };

  /**
   * Adds a new obra to the list and updates the ClienteContext state.
   *
   * @param {object} nuevaObra - The new obra to add.
   */
  const handleAdd = (nuevaObra) => {
    const estado =
      clienteSeleccionado.obrasActivas < clienteSeleccionado.maximoDeObras
        ? 'HABILITADA'
        : 'PENDIENTE';

    const newObra = { tempId: Date.now(), id: null, estado, ...nuevaObra }; // Create a new obra with a unique tempId
    const updatedObras = [...state.obras, newObra];

    // Update the reducer state
    dispatch({ type: ACTIONS.SET_OBRAS, payload: updatedObras });

    // Update the ClienteContext state
    updateClienteSeleccionado((prev) => ({
      ...prev,
      obras: updatedObras,
      obrasActivas: estado === 'HABILITADA' ? prev.obrasActivas + 1 : prev.obrasActivas,
    }));

    // Show success notification
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { open: true, message: 'Obra agregada correctamente', severity: 'success' },
    });

    // Close the modal
    closeObraModal();
  };

  /**
   * Edits an existing obra in the list and updates the ClienteContext state.
   *                        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Revisar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * @param {object} obraEditada - The obra with updated values.
   */
  const handleEdit = (obraEditada) => {
    const currentEstado = state.obraSeleccionada.estado;
    const newEstado = obraEditada.estado;

    const updatedObras = state.obras.map((obra) =>
      obra.tempId === state.obraSeleccionada.tempId ? { ...obra, ...obraEditada } : obra
    );

    let updatedObrasActivas = clienteSeleccionado.obrasActivas;

    // Handle estado transitions
    if (currentEstado === 'PENDIENTE' && newEstado === 'HABILITADA') {
      if (clienteSeleccionado.obrasActivas < clienteSeleccionado.maximoDeObras) {
        updatedObrasActivas += 1;
      } else {
        dispatch({
          type: ACTIONS.SET_SNACKBAR,
          payload: { open: true, message: 'No se puede habilitar más obras', severity: 'error' },
        });
        return;
      }
    } else if (currentEstado === 'HABILITADA' && (newEstado === 'PENDIENTE' || newEstado === 'FINALIZADA')) {
      updatedObrasActivas -= 1;
    } else if (currentEstado === 'FINALIZADA') {
      dispatch({
        type: ACTIONS.SET_SNACKBAR,
        payload: { open: true, message: 'No se puede cambiar el estado de una obra finalizada', severity: 'error' },
      });
      return;
    }

    // Update the ClienteContext state
    updateClienteSeleccionado((prev) => ({
      ...prev,
      obras: updatedObras,
      obrasActivas: updatedObrasActivas,
    }));

    // Automatically habilitate a pending obra if a finalizada obra is saved
    if (currentEstado === 'HABILITADA' && newEstado === 'FINALIZADA') {
      const pendingObra = updatedObras.find((obra) => obra.estado === 'PENDIENTE');
      if (pendingObra) {
        pendingObra.estado = 'HABILITADA';
        updatedObrasActivas += 1;
      }
    }

    // Update the reducer state
    dispatch({ type: ACTIONS.SET_OBRAS, payload: updatedObras });

    // Show success notification
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { open: true, message: 'Obra editada correctamente', severity: 'success' },
    });

    // Close the modal
    closeObraModal();
  };

  /**
   * Deletes an obra from the list and updates the ClienteContext state.
   *
   * @param {number} tempId - The unique tempId of the obra to delete.
   */
  const handleDelete = (tempId) => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar esta obra?');
    if (!confirmDelete) return;

    const obraToDelete = state.obras.find((obra) => obra.tempId === tempId);
    const updatedObras = state.obras.filter((obra) => obra.tempId !== tempId);

    // Update the ClienteContext state
    updateClienteSeleccionado((prev) => ({
      ...prev,
      obras: updatedObras,
      obrasActivas:
        obraToDelete.estado === 'HABILITADA' ? prev.obrasActivas - 1 : prev.obrasActivas,
    }));

    // Update the reducer state
    dispatch({ type: ACTIONS.SET_OBRAS, payload: updatedObras });

    // Show success notification
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { open: true, message: 'Obra eliminada correctamente', severity: 'success' },
    });
  };

  /**
   * Closes the snackbar notification.
   */
  const closeSnackbar = () => {
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { ...state.snackbar, open: false },
    });
  };

  const seleccionarObra = (obra) => {
    dispatch({ type: ACTIONS.SET_OBRA_SELECCIONADA, payload: obra });
  };

  // Return the state and handlers for use in the DataGridObras component
  return {
    obras: state.filteredObras, // Filtered obras for display
    snackbar: state.snackbar, // Snackbar state
    obraModalOpen: state.obraModalOpen, // Whether the obra modal is open
    obraSeleccionada: state.obraSeleccionada, // The obra currently selected for editing
    searchTerm: state.searchTerm, // Current search term
    modoModal: state.modoModal, // Mode of the modal (nuevo or modificar)
    handleSearch, // Handler for searching obras
    openObraModal, // Handler for opening the obra modal
    closeObraModal, // Handler for closing the obra modal
    handleAdd, // Handler for adding a new obra
    handleEdit, // Handler for editing an existing obra
    handleDelete, // Handler for deleting an obra
    closeSnackbar, // Handler for closing the snackbar
    seleccionarObra, // Handler for selecting an obra
  };
};