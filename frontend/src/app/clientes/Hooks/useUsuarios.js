import { useReducer, useEffect } from 'react';
import { useClienteContext } from './ClienteContext';

// Action types for the reducer
const ACTIONS = {
  SET_USUARIOS: 'set_usuarios',
  SET_FILTERED_USUARIOS: 'set_filtered_usuarios',
  SET_SNACKBAR: 'set_snackbar',
  OPEN_MODAL: 'open_modal',
  CLOSE_MODAL: 'close_modal',
  SET_SEARCH_TERM: 'set_search_term',
};

// Initial state for the reducer
const initialState = {
  usuarios: [], // List of all usuarios
  filteredUsuarios: [], // Filtered list of usuarios (based on search)
  snackbar: { open: false, message: '', severity: 'success' }, // Snackbar state
  usuariosModalOpen: false, // Whether the usuario modal is open
  usuarioSeleccionado: null, // The usuario currently selected for editing
  searchTerm: '', // Current search term
};

// Reducer function to manage state transitions
const usuariosReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USUARIOS:
      return { ...state, usuarios: action.payload, filteredUsuarios: action.payload };
    case ACTIONS.SET_FILTERED_USUARIOS:
      return { ...state, filteredUsuarios: action.payload };
    case ACTIONS.SET_SNACKBAR:
      return { ...state, snackbar: action.payload };
    case ACTIONS.OPEN_MODAL:
      return { ...state, usuariosModalOpen: true, usuarioSeleccionado: action.payload };
    case ACTIONS.CLOSE_MODAL:
      return { ...state, usuariosModalOpen: false, usuarioSeleccionado: null };
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

/**
 * Custom hook to manage the state and logic for the DataGridUsuarios component.
 * Handles adding, editing, deleting, searching, and displaying usuarios.
 *
 * @returns {object} - State and handlers for managing usuarios.
 */
export const useUsuarios = () => {
  const { clienteSeleccionado, updateClienteSeleccionado } = useClienteContext(); // Access ClienteContext
  const [state, dispatch] = useReducer(usuariosReducer, initialState); // useReducer for state management

  /**
   * Initializes the usuarios list from the selected client.
   * Formats the usuarios to include a unique `tempId` for internal tracking.
   */
  useEffect(() => {
    if (clienteSeleccionado?.usuarios) {
      const formattedUsuarios = clienteSeleccionado.usuarios.map((usuario, index) => ({
        tempId: usuario.id || usuario.tempId || Date.now() + index, // Generate a unique tempId if not present
        ...usuario,
      }));
      dispatch({ type: ACTIONS.SET_USUARIOS, payload: formattedUsuarios });
    }
  }, [clienteSeleccionado]);

  /**
   * Handles the search functionality.
   * Filters the usuarios based on the search term entered by the user.
   *
   * @param {string} term - The search term entered by the user.
   */
  const handleSearch = (term) => {
    const value = term.toLowerCase();
    dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: value });

    if (value === '') {
      // If search term is empty, reset to all usuarios
      dispatch({ type: ACTIONS.SET_FILTERED_USUARIOS, payload: state.usuarios });
    } else {
      // Filter usuarios based on the search term
      const filtered = state.usuarios.filter((usuario) =>
        usuario.dni.toString().includes(value) ||
        usuario.nombre.toLowerCase().includes(value) ||
        usuario.apellido.toLowerCase().includes(value) ||
        usuario.correoElectronico.toLowerCase().includes(value)
      );
      dispatch({ type: ACTIONS.SET_FILTERED_USUARIOS, payload: filtered });
    }
  };

  /**
   * Opens the modal for adding or editing a usuario.
   *
   * @param {object|null} usuario - The usuario to edit (null for adding a new usuario).
   */
  const openUsuarioModal = (usuario = null) => {
    dispatch({ type: ACTIONS.OPEN_MODAL, payload: usuario });
  };

  /**
   * Closes the usuario modal.
   */
  const closeUsuarioModal = () => {
    dispatch({ type: ACTIONS.CLOSE_MODAL });
  };

  /**
   * Adds a new usuario to the list and updates the ClienteContext state.
   *
   * @param {object} nuevoUsuario - The new usuario to add.
   */
  const handleAdd = (nuevoUsuario) => {
    const newUsuario = { tempId: Date.now(), id: null, ...nuevoUsuario }; // Create a new usuario with a unique tempId
    const updatedUsuarios = [...state.usuarios, newUsuario];

    // Update the reducer state
    dispatch({ type: ACTIONS.SET_USUARIOS, payload: updatedUsuarios });

    // Update the ClienteContext state
    updateClienteSeleccionado((prev) => ({
      ...prev,
      usuarios: updatedUsuarios,
    }));

    // Show success notification
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { open: true, message: 'Usuario agregado correctamente', severity: 'success' },
    });

    // Close the modal
    closeUsuarioModal();
  };

  /**
   * Edits an existing usuario in the list and updates the ClienteContext state.
   *
   * @param {object} usuarioEditado - The usuario with updated values.
   */
  const handleEdit = (usuarioEditado) => {
    const updatedUsuarios = state.usuarios.map((usuario) =>
      usuario.tempId === state.usuarioSeleccionado.tempId ? { ...usuario, ...usuarioEditado } : usuario
    );

    // Update the reducer state
    dispatch({ type: ACTIONS.SET_USUARIOS, payload: updatedUsuarios });

    // Update the ClienteContext state
    updateClienteSeleccionado((prev) => ({
      ...prev,
      usuarios: updatedUsuarios,
    }));

    // Show success notification
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { open: true, message: 'Usuario editado correctamente', severity: 'success' },
    });

    // Close the modal
    closeUsuarioModal();
  };

  /**
   * Deletes a usuario from the list and updates the ClienteContext state.
   *
   * @param {number} tempId - The unique tempId of the usuario to delete.
   */
  const handleDelete = (tempId) => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar este usuario?');
    if (!confirmDelete) return;

    const updatedUsuarios = state.usuarios.filter((usuario) => usuario.tempId !== tempId);

    // Update the reducer state
    dispatch({ type: ACTIONS.SET_USUARIOS, payload: updatedUsuarios });

    // Update the ClienteContext state
    updateClienteSeleccionado((prev) => ({
      ...prev,
      usuarios: updatedUsuarios,
    }));

    // Show success notification
    dispatch({
      type: ACTIONS.SET_SNACKBAR,
      payload: { open: true, message: 'Usuario eliminado correctamente', severity: 'success' },
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

  

  // Return the state and handlers for use in the DataGridUsuarios component
  return {
    usuarios: state.filteredUsuarios, // Filtered usuarios for display
    snackbar: state.snackbar, // Snackbar state
    usuariosModalOpen: state.usuariosModalOpen, // Whether the usuario modal is open
    usuarioSeleccionado: state.usuarioSeleccionado, // The usuario currently selected for editing
    searchTerm: state.searchTerm, // Current search term
    handleSearch, // Handler for searching usuarios
    openUsuarioModal, // Handler for opening the usuario modal
    closeUsuarioModal, // Handler for closing the usuario modal
    handleAdd, // Handler for adding a new usuario
    handleEdit, // Handler for editing an existing usuario
    handleDelete, // Handler for deleting a usuario
    closeSnackbar, // Handler for closing the snackbar
  };
};