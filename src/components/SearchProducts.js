import React from "react";
import axios from "axios";

const SearchProducts = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [products, setProducts] = React.useState([]);

  // Actualiza el término de búsqueda después de un retraso (300 ms)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer); // Limpia el temporizador si el usuario sigue escribiendo
  }, [searchTerm]);

  // Efecto para consultar el servidor cuando debouncedSearchTerm cambia
  React.useEffect(() => {
    if (debouncedSearchTerm) {
      axios
        .get(`http://localhost:4000/products/busqueda?search=${debouncedSearchTerm}`)
        .then((response) => {
          setProducts(response.data.productos || []);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full"
      />
      <ul>
        {products.map((product) => (
          <li key={product.CODIGO_MAT}>
            {product.DESCRIPCION} - {product.CODIGO_BARRAS}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchProducts;
