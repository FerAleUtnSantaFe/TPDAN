import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DataGridUsuarios = ({ rows, onDelete }) => {
  const columns = [
    { field: 'dni', headerName: 'DNI', flex: 1 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'apellido', headerName: 'Apellido', flex: 1 },
    { field: 'correoElectronico', headerName: 'Correo', flex: 1 },
    {
      field: 'acciones',
      headerName: '',
      sortable: false,
      renderCell: (params) => (
        <Button color="error" onClick={() => onDelete(params.row.id)}>
          <DeleteIcon />
        </Button>
      ),
    },
  ];

  return <DataGrid 
    rows={rows} 
    columns={columns} 
    pageSize={5}
    pageSizeOptions={[5, 10, 20]}
    checkboxSelection
    localeText={{
      noRowsLabel: 'No se encontraron resultados',
      MuiTablePagination: {
        labelRowsPerPage: 'Obras por página:',
      },
    }}
    sx={{
      width: '100%',
    }}/>;
};

export default DataGridUsuarios;