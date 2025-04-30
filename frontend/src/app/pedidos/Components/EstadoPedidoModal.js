import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import EstadoChipPedidos from './EstadoChipPedidos'; // Import the chip component

/**
 * EstadoModalPedidos Component
 * A modal to change the estado of a pedido.
 *
 * @param {boolean} open - Whether the modal is open.
 * @param {function} onClose - Function to close the modal.
 * @param {function} onSave - Function to save the new estado.
 * @param {string} currentEstado - The current estado of the pedido.
 * @param {Array<string>} availableEstados - The list of available estados to select.
 */
const EstadoModalPedidos = ({ open, onClose, onSave, currentEstado, availableEstados }) => {
    const [selectedEstado, setSelectedEstado] = useState(currentEstado);

    const handleSave = () => {
        onSave(selectedEstado); // Pass the new estado to the parent
        onClose(); // Close the modal
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cambiar Estado del Pedido</DialogTitle>
            <DialogContent>
                <Box marginTop={2}>
                    <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            label="Estado"
                            value={selectedEstado}
                            onChange={(e) => setSelectedEstado(e.target.value)}
                            renderValue={(selected) => <EstadoChipPedidos estado={selected} />} // Render the selected chip
                        >
                            {availableEstados.map((estado) => (
                                <MenuItem key={estado} value={estado}>
                                    <EstadoChipPedidos estado={estado} /> {/* Render chips as options */}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>
                    Cancelar
                </Button>
                <Button color="primary" onClick={handleSave}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EstadoModalPedidos;