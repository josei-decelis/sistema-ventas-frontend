import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductCreate } from './pages/ProductCreate';
import { ProductEdit } from './pages/ProductEdit';
import { IngredientList } from './pages/IngredientList';
import { IngredientCreate } from './pages/IngredientCreate';
import { ClienteList } from './pages/ClienteList';
import { ClienteForm } from './pages/ClienteForm';
import { ClienteDetail } from './pages/ClienteDetail';
import { MetodoPagoList } from './pages/MetodoPagoList';
import { VentaList } from './pages/VentaList';
import { VentaCreate } from './pages/VentaCreate';
import './styles/globals.scss';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar__container">
            <Link to="/" className="navbar__brand">
              🍕 Sistema de Ventas
            </Link>
            <div className="navbar__links">
              <Link to="/" className="navbar__link">
                Dashboard
              </Link>
              <Link to="/clientes" className="navbar__link">
                Clientes
              </Link>
              <Link to="/productos" className="navbar__link">
                Productos
              </Link>
              <Link to="/ingredientes" className="navbar__link">
                Ingredientes
              </Link>
              <Link to="/ventas" className="navbar__link">
                Ventas
              </Link>
              <Link to="/metodos-pago" className="navbar__link">
                Métodos Pago
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientes" element={<ClienteList />} />
              <Route path="/clientes/crear" element={<ClienteForm />} />
              <Route path="/clientes/editar/:id" element={<ClienteForm />} />
              <Route path="/clientes/:id" element={<ClienteDetail />} />
              <Route path="/productos" element={<ProductList />} />
              <Route path="/productos/crear" element={<ProductCreate />} />
              <Route path="/productos/:id/editar" element={<ProductEdit />} />
              <Route path="/ingredientes" element={<IngredientList />} />
              <Route path="/ingredientes/crear" element={<IngredientCreate />} />
              <Route path="/ventas" element={<VentaList />} />
              <Route path="/ventas/crear" element={<VentaCreate />} />
              <Route path="/metodos-pago" element={<MetodoPagoList />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>Sistema de Ventas de Pizzas © 2025</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
