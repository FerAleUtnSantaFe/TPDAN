import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function CategoriaSelect({ value, onChange }) {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Categoría</InputLabel>
      <Select
        value={value}
        label="Categoría"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="CEMENTOS">Cementos</MenuItem>
        <MenuItem value="YESERIA">Yeseria</MenuItem>
        <MenuItem value="PERFILES">Perfiles</MenuItem>
        <MenuItem value="PLACAS">Placas</MenuItem>
        <MenuItem value="MORTEROS">Morteros</MenuItem>
      </Select>
    </FormControl>
  );
}
