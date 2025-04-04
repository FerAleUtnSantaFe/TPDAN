import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DataGridObras = ({ rows, onDelete, onObraSelect, modo}) => {
  const columns = [
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
    { field: 'lat', headerName: 'Latitud', flex: 1 },
    { field: 'lng', headerName: 'Longitud', flex: 1 },
    { field: 'presupuesto', headerName: 'Presupuesto', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    ...(modo !== 'pedido' ? [ // Si el modo no es "pedido", agrega la columna "opciones"
      {
        field: 'acciones',
        headerName: '',
        sortable: false,
        renderCell: (params) => (
          <Button color="error" onClick={() => onDelete(params.row.id)}>
            <DeleteIcon />
          </Button>
        ),
      }
    ] : []),
  ];

  return (
    <DataGrid
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
      }}
    />
  );
};

export default DataGridObras;