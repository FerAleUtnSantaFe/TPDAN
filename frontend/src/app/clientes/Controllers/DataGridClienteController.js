import { findClientes, deleteCliente } from "@/app/APIs/ClientesAPI";

export async function cargarClientes() {
        const data = await findClientes();
        return data.map((cliente) => ({
            id: cliente.id,
            cuit: cliente.cuit,
            nombre: cliente.nombre,
            correoElectronico: cliente.correoElectronico,
            maximoDescubierto: cliente.maximoDescubierto,
            maximoDeObras: cliente.maximoDeObras,
            obrasActivas: cliente.obrasActivas,
            obras: cliente.obras || [],
            usuarios: cliente.usuarios || []
        }));
}

export async function eliminarCliente(clienteId) {
    const result = await deleteCliente(clienteId);
    if (result) {
        return true;
    } else {
        return false;
    }
}