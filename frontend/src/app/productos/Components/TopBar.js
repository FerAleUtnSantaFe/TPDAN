import { AddShoppingCart } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function TopBar({
    isPedidoMode,
    onListaProductosSelect,
    productosSeleccionados,
    onProvisionClick,

}) {
    const GenerarPedido = () => {
        onListaProductosSelect(productosSeleccionados);
    };

    const router = useRouter();

    const handleNew = () => {
        router.push("/productos/nuevo");
    };

    return (
        <Box marginTop={1}>
            <AppBar position="static" >
                <Toolbar>
                    {/* Título en la parte izquierda */}
                    <Typography
                        variant="h6"
                        sx={{
                            flex: 1,
                            fontWeight: "bold",
                            marginLeft: "16px", // Alineado con la SidebarFilter
                        }}
                    >
                    </Typography>

                    {/* Controles a la derecha */}
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {!isPedidoMode && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onProvisionClick}
                                startIcon={<AddShoppingCart />}
                                sx={{ ml: 'auto' }}
                            >
                                Nueva provisión
                            </Button>)}
                        <Button
                            variant="contained"
                            color="success"
                            onClick={isPedidoMode ? GenerarPedido : handleNew}
                            startIcon={!isPedidoMode && <AddIcon />}
                            sx={{ ml: 'auto' }}
                        >
                            {isPedidoMode ? "Generar Pedido" : "Nuevo"}
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box >
    );
}