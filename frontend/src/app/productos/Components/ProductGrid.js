import { Grid2 } from "@mui/material";
import ProductCard from "./ProductCard";

export default function ProductGrid({ productos, handleEdit, handleDelete }) {
  return (
    <Grid2
      container
      spacing={3}
      sx={{
        marginTop: 2,
        alignItems: "center",
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6.2,
      }}
    >
      {productos.map((producto) => (
        <Grid2 item xs={12} sm={6} md={4} lg={3} key={producto.id}>
          <ProductCard
            producto={producto}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}
