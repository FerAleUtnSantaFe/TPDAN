import { AppBar, Button, Card, CardContent, IconButton, MenuItem, Snackbar, Toolbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchIconWrapper, StyledInputBase, StyledSelect } from "@/app/styles/styles";
import { useRouter } from "next/navigation";
import EstadoChipPedidos from "./EstadoChipPedidos";
import EstadoModalPedidos from "./EstadoPedidoModal";
import { usePedidos } from "./usePedidos";

/**
 * DataGridPedidos Component
 * Displays a list of pedidos (orders) in a professional, interactive data grid.
 * Allows users to search, filter, and edit pedidos.
 */
function DataGridPedidos() {
  const router = useRouter();
  const {
    pedidos,
    searchTerm,
    snackbar,
    modalOpen,
    selectedPedido,
    handleSearch,
    handleEdit,
    handleSaveEstado,
    closeSnackbar,
    setModalOpen,
  } = usePedidos();

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "numeroPedido", headerName: "Nro Pedido", flex: 1 },
    { field: "fecha", headerName: "Fecha", flex: 1 },
    { field: "cliente", headerName: "Cliente", flex: 1 },
    { field: "obra", headerName: "ID Obra", flex: 1 },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) => <EstadoChipPedidos estado={params.value} />,
    },
    { field: "total", headerName: "Total", flex: 1 },
    {
      field: "editar",
      headerName: "Editar",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleEdit(params.row)}
          disabled={["ENTREGADO", "RECHAZADO", "CANCELADO"].includes(params.row.estado)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      {/* AppBar for Search and Action Buttons */}
      <AppBar position="static">
        <Toolbar>
          {/* Search by CUIT */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar por ID"
              value={searchTerm.cuit}
              onChange={handleSearch}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {/* Filter by Estado */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledSelect
              name="estado"
              value={searchTerm.estado}
              onChange={handleSearch}
              displayEmpty
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="ACEPTADO">ACEPTADO</MenuItem>
              <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
              <MenuItem value="CANCELADO">CANCELADO</MenuItem>
              <MenuItem value="EN_PREPARACION">EN_PREPARACION</MenuItem>
              <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
              <MenuItem value="RECIBIDO">RECIBIDO</MenuItem>
            </StyledSelect>
          </Search>
          {/* Add New Pedido Button */}
          <Button
            variant="contained"
            color="success"
            sx={{ ml: "auto" }}
            startIcon={<AddCircleIcon />}
            onClick={() => router.push("/pedidos/nuevo")}
          >
            Nuevo
          </Button>
        </Toolbar>
      </AppBar>

      {/* DataGrid to Display Pedidos */}
      <Card sx={{ marginBottom: 4 }}>
        <CardContent>
          <DataGrid
            rows={pedidos}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            localeText={{
              noRowsLabel: "No se encontraron resultados",
              MuiTablePagination: { labelRowsPerPage: "Pedidos por página:" },
            }}
          />
        </CardContent>
      </Card>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <MuiAlert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* Modal for Editing Pedido Estado */}
      {selectedPedido && (
        <EstadoModalPedidos
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEstado}
          currentEstado={selectedPedido.estado}
          availableEstados={
            selectedPedido.estado === "ACEPTADO"
              ? ["CANCELADO", "EN_PREPARACION"]
              : selectedPedido.estado === "EN_PREPARACION"
              ? ["CANCELADO", "ENTREGADO"]
              : selectedPedido.estado === "RECIBIDO"
              ? ["RECHAZADO", "ACEPTADO"]
              : []
          }
        />
      )}
    </>
  );
}

export default DataGridPedidos;