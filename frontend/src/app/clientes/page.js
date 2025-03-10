'use client';
import { useState } from 'react';

import Link from 'next/link';
import { buscarProducto } from "@/lib/productos-api";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  
  const handleSearch = async () => {
    const lista = await buscarProducto('abc');
    console.log(lista);
    // Simulate a search by filtering some dummy data
    const dummyData = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];
    setResults(dummyData.filter(product => product.name.includes(searchTerm) || product.id.toString() === searchTerm));
  };

  return (
    <>
      <h1>Productos Page</h1>
      <input 
        type="text" 
        placeholder="Buscar por número o nombre de producto" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <button onClick={handleSearch}>Buscar</button>
      <Link href="">
        <button>Crear nuevo producto</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {results.map(product => (
            <tr key={product.id}>
              <td>
                <Link href={`/clientes/${product.id}`}>{product.id}</Link>
              </td>
              <td>{product.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
