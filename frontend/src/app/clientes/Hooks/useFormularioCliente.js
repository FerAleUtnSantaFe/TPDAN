import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { findbyIdCliente, createCliente, updateCliente } from '../../APIs/ClientesAPI';
import { useClienteContext } from './ClienteContext';

/*
 * Custom hook for managing the state and logic of the FormularioCliente component.
 * Directly uses `clienteSeleccionado` from ClienteContext as the source of truth.
 *
 * @param {string} modo - The mode of the form ("nuevo" or "modificar").
 * @returns {object} - State and handlers for the form.
 */
export const useFormularioCliente = (modo) => {
  const { clienteSeleccionado, updateClienteSeleccionado } = useClienteContext(); // Access ClienteContext
  const router = useRouter(); // For navigation
  const searchParams = useSearchParams(); // For retrieving query parameters

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // State for alert messages (snackbar)
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

  /*
   * Initializes the clienteSeleccionado if none is selected.
   * In "modificar" mode, fetches the client data from the API if needed.
   */
  useEffect(() => {
    if (modo === 'modificar') {
      const fetchCliente = async () => {
        const id = searchParams.get('id'); // Get client ID from query params
        if (id) {
          try {
            const cliente = await findbyIdCliente(id); // Fetch client data from API
            updateClienteSeleccionado(cliente); // Update global context
          } catch (error) {
            console.error('Error fetching client data:', error);
            setAlert({
              open: true,
              message: 'Error al cargar los datos del cliente.',
              severity: 'error',
            });
          }
        }
      };
      if (!clienteSeleccionado.id) {
        // Only fetch if clienteSeleccionado is not already set
        fetchCliente();
      }
      console.log('ACA LO CARGO 1 SOLA VEZ useFormularioCliente:', clienteSeleccionado);
    }
  }, [clienteSeleccionado, modo, searchParams, updateClienteSeleccionado]);

  /**
   * Handles changes to form inputs.
   * Directly updates the `clienteSeleccionado` in ClienteContext.
   *
   * @param {object} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate positive numbers for specific fields
    if (['maximoDescubierto', 'maximoDeObras'].includes(name) && value < 0) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'El valor debe ser un número positivo.',
      }));
      return;
    }

    // Clear errors if the input is corrected
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
    else {
        // Update the clienteSeleccionado directly
        updateClienteSeleccionado((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
  };

  /**
   * Validates the form fields to ensure all required fields are filled.
   *
   * @returns {object} - An object containing validation errors.
   */
  const validateFields = () => {
    const newErrors = {};

    if (!clienteSeleccionado.cuit) newErrors.cuit = 'El CUIT es obligatorio.';
    if (!clienteSeleccionado.correoElectronico)
      newErrors.correoElectronico = 'El correo electrónico es obligatorio.';
    if (!clienteSeleccionado.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!clienteSeleccionado.maximoDescubierto)
      newErrors.maximoDescubierto = 'El máximo descubierto es obligatorio.';
    if (!clienteSeleccionado.maximoDeObras)
      newErrors.maximoDeObras = 'El máximo de obras es obligatorio.';

    return newErrors;
  };

  /**
   * Handles form submission.
   * Validates the form, sends data to the API, and provides feedback to the user.
   *
   * @param {object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set validation errors
      return;
    }

    try {
      let result;

      // Create a new client
      if (modo === 'nuevo') {
        result = await createCliente(
          clienteSeleccionado
        );
      }

      // Update an existing client
      if (modo === 'modificar') {
        const id = clienteSeleccionado.id;
        result = await updateCliente(
          id,
          clienteSeleccionado,
        );
      }

      // Handle success response
      if (result) {
        setAlert({
          open: true,
          message: `Cliente ${modo === 'nuevo' ? 'creado' : 'actualizado'
            } correctamente.`,
          severity: 'success',
        });

        // Redirect to the client list after a short delay
        setTimeout(() => {
          router.push('/clientes');
        }, 3000);
      } else {
        // Handle failure response
        setAlert({
          open: true,
          message: `Error al ${modo === 'nuevo' ? 'crear' : 'actualizar'
            } el cliente.`,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error(
        `Error al ${modo === 'nuevo' ? 'crear' : 'actualizar'} el cliente:`,
        error
      );
      setAlert({
        open: true,
        message: `Error al ${modo === 'nuevo' ? 'crear' : 'actualizar'
          } el cliente.`,
        severity: 'error',
      });
    }
  };

  /**
   * Closes the snackbar alert.
   */
  const closeSnackbar = () => {
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Return the state and handlers for use in the FormularioCliente component
  return {
    clienteSeleccionado, // Directly use clienteSeleccionado from context
    errors,
    alert,
    handleChange,
    handleSubmit,
    closeSnackbar,
  };
};