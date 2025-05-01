"use client";

import {
    Search,
    SearchIconWrapper,
    StyledInputBase,
} from "@/app/styles/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Snackbar,
    Toolbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useCliente } from "../Hooks/useCliente";

export default function DataGridCliente({ modo, onClienteSelect }) {
  const router = useRouter();
  const {
    clientes,
    clienteSeleccionado,
    snackbar,
    buscarCliente,
    eliminarCliente,
    seleccionarCliente,
    closeSnackbar,
  } = useCliente();

    // Configuración de las columnas
    const columns = [
        { field: 'cuit', headerName: 'CUIL', flex: 1 },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'correoElectronico', headerName: 'Correo', flex: 1 },
        { field: 'maximoDeObras', headerName: 'Maximas Obras Activas', flex: 1 },
        { field: 'maximoDescubierto', headerName: 'Maximo Descubierto', flex: 1 },
        ...(modo !== 'pedido' ? [ // Si el modo no es "pedido", agrega la columna "opciones"
            {
                field: 'opciones',
                headerName: 'Opciones',
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                    <Box>
                        <IconButton size="small" color="primary" onClick={() => router.push(`/clientes/modificar?id=${params.row.id}`)}>
                            <SettingsIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => eliminarCliente(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )
            }
        ] : [])
    ];

  return (
    <Box marginTop={1}>
      <AppBar position="static">
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar cliente…"
              onChange={(e) => buscarCliente(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Button
            variant="contained"
            color="success"
            sx={{ ml: "auto" }}
            startIcon={
              modo !== "pedido" ? <PersonAddIcon /> : <NavigateNextIcon />
            }
            onClick={() => {
              /// MODIFICAR ESTO NO DEBE ACTUALZAR UN HOOK DESDE UN IF
              if (modo === "pedido") {
                if (clienteSeleccionado !== "") {
                  onClienteSelect(clienteSeleccionado); // Llama a la función de selección de cliente
                } else {
                  alert("Debe seleccionar un cliente para continuar");
                }
              } else {
                router.push("/clientes/nuevo");
              }
            }}
          >
            {modo === "pedido" ? "Siguiente" : "Nuevo"}
          </Button>
        </Toolbar>
      </AppBar>
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <DataGrid
            rows={clientes}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            disableMultipleRowSelection
            onRowSelectionModelChange={(ids) => {
              const selectedId = ids[0];
              const selectedClient = clientes.find(
                (cliente) => cliente.id === selectedId
              );
              seleccionarCliente(selectedClient || null); // Track the selected row
            }}
            localeText={{
              noRowsLabel: "No se encontraron resultados",
              MuiTablePagination: { labelRowsPerPage: "Clientes por página:" },
            }}
            sx={{ width: "100%" }}
          />
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => closeSnackbar()}
      >
        <MuiAlert
          onClose={() => closeSnackbar()}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
