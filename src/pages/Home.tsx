import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { dashboardApi } from '../api/dashboardApi';
import { Card } from '../components/ui/Card';
import { DashboardStats } from '../types/common';
import './Home.scss';

export const Home: React.FC = () => {
  const [statsAll, setStatsAll] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string>('');
  const [statsMonth, setStatsMonth] = useState<DashboardStats | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [ventasPorMes, setVentasPorMes] = useState<any[]>([]);
  const [chartView, setChartView] = useState<'cantidad' | 'monto'>('monto');
  const [chartPeriod, setChartPeriod] = useState<6 | 12>(6);
  const [chartType, setChartType] = useState<'bar' | 'line'>('line');

  // Cargar estadísticas principales primero (prioridad)
  useEffect(() => {
    const fetchPriorityData = async () => {
      try {
        // Cargar lo más importante primero
        const dataAll = await dashboardApi.getEstadisticas();
        setStatsAll(dataAll);
        
        // Luego cargar datos secundarios en paralelo (no bloquean render)
        const [year, month] = selectedMonth.split('-');
        const fechaInicio = new Date(parseInt(year), parseInt(month) - 1, 1);
        const fechaFin = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

        Promise.all([
          dashboardApi.getEstadisticas({
            fechaInicio: fechaInicio.toISOString(),
            fechaFin: fechaFin.toISOString(),
          }),
          dashboardApi.getVentasPorMes(chartPeriod),
        ]).then(([dataMonth, ventasMes]) => {
          setStatsMonth(dataMonth);
          setVentasPorMes(ventasMes);
        });
      } catch (error) {
        setError('Error al cargar estadísticas del dashboard');
      }
    };

    fetchPriorityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar gráfico cuando cambia el período
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const ventasMes = await dashboardApi.getVentasPorMes(chartPeriod);
        setVentasPorMes(ventasMes);
      } catch (error) {
        // Error silently handled
      }
    };
    
    if (statsAll) {
      fetchChartData();
    }
  }, [chartPeriod, statsAll]);

  // Cargar solo estadísticas del mes cuando cambia el selector
  useEffect(() => {
    const fetchMonthStats = async () => {
      setLoadingMonth(true);
      try {
        const [year, month] = selectedMonth.split('-');
        const fechaInicio = new Date(parseInt(year), parseInt(month) - 1, 1);
        const fechaFin = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
        
        const data = await dashboardApi.getEstadisticas({
          fechaInicio: fechaInicio.toISOString(),
          fechaFin: fechaFin.toISOString(),
        });
        setStatsMonth(data);
      } catch (error) {
        // Error silently handled - stats will remain null
      } finally {
        setLoadingMonth(false);
      }
    };

    // Solo fetch si ya tenemos statsAll cargado (no es la carga inicial)
    if (statsAll) {
      fetchMonthStats();
    }
  }, [selectedMonth, statsAll]);

  // Generar opciones de meses (memoizado)
  const monthOptions = useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return options;
  }, []);

  const monthName = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [selectedMonth]);

  if (!statsAll) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <h1>Dashboard - Sistema de Ventas</h1>

      {/* Métricas Actuales */}
      <div className="stats-grid">
        <Card title="Ventas de Hoy">
          <div className="stat-value">${Math.round(statsAll?.resumen.ventasHoy || 0).toLocaleString('es-ES')}</div>
          <div className="stat-label">en {statsAll?.resumen.cantidadVentasHoy} ventas</div>
          {statsAll?.resumen.diferenciaVsHaceUnMes !== undefined && statsAll?.resumen.ventasHoyHaceUnMes !== undefined && (
            <div className={`stat-comparison ${statsAll.resumen.diferenciaVsHaceUnMes >= 0 ? 'positive' : 'negative'}`}>
              {statsAll.resumen.diferenciaVsHaceUnMes >= 0 ? '↑' : '↓'} 
              {Math.abs(statsAll.resumen.diferenciaVsHaceUnMes).toFixed(1)}% vs hace 1 mes 
              ({statsAll.resumen.diferenciaVsHaceUnMes >= 0 ? '+' : '-'}
              ${Math.abs(Math.round(statsAll.resumen.ventasHoy - statsAll.resumen.ventasHoyHaceUnMes)).toLocaleString('es-ES')})
            </div>
          )}
        </Card>

        <Card title="Ventas del Mes">
          <div className="stat-value">${Math.round(statsAll?.resumen.ventasMes || 0).toLocaleString('es-ES')}</div>
          <div className="stat-label">en {statsAll?.resumen.cantidadVentasMes} ventas</div>
          {statsAll?.resumen.diferenciaVsMesAnterior !== undefined && statsAll?.resumen.ventasMesAnterior !== undefined && (
            <div className={`stat-comparison ${statsAll.resumen.diferenciaVsMesAnterior >= 0 ? 'positive' : 'negative'}`}>
              {statsAll.resumen.diferenciaVsMesAnterior >= 0 ? '↑' : '↓'} 
              {Math.abs(statsAll.resumen.diferenciaVsMesAnterior).toFixed(1)}% vs mes anterior 
              ({statsAll.resumen.diferenciaVsMesAnterior >= 0 ? '+' : '-'}
              ${Math.abs(Math.round(statsAll.resumen.ventasMes - statsAll.resumen.ventasMesAnterior)).toLocaleString('es-ES')})
            </div>
          )}
        </Card>

        <Card title="Total Histórico">
          <div className="stat-value">${Math.round(statsAll?.resumen.totalVentas || 0).toLocaleString('es-ES')}</div>
          <div className="stat-label">en {statsAll?.resumen.cantidadVentas} ventas</div>
          <div className="stat-sublabel">{statsAll?.resumen.totalClientes} clientes registrados</div>
        </Card>
      </div>

      {/* Gráfico de Ventas */}
      <Card>
        <div className="chart-header">
          <h3>📊 Historial de Ventas</h3>
          <div className="chart-controls">
            <div className="toggle-group">
              <button
                className={`toggle-btn ${chartType === 'line' ? 'active' : ''}`}
                onClick={() => setChartType('line')}
                title="Gráfico de línea"
              >
                📈
              </button>
              <button
                className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
                onClick={() => setChartType('bar')}
                title="Gráfico de barras"
              >
                📊
              </button>
            </div>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${chartView === 'monto' ? 'active' : ''}`}
                onClick={() => setChartView('monto')}
              >
                Montos
              </button>
              <button
                className={`toggle-btn ${chartView === 'cantidad' ? 'active' : ''}`}
                onClick={() => setChartView('cantidad')}
              >
                Cantidad
              </button>
            </div>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${chartPeriod === 6 ? 'active' : ''}`}
                onClick={() => setChartPeriod(6)}
              >
                6 meses
              </button>
              <button
                className={`toggle-btn ${chartPeriod === 12 ? 'active' : ''}`}
                onClick={() => setChartPeriod(12)}
              >
                12 meses
              </button>
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          {ventasPorMes.length === 0 ? (
            <div className="chart-loading">
              <div className="loading-spinner-small"></div>
              <p>Cargando gráfico...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' ? (
                <LineChart data={ventasPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  tickFormatter={(value) => 
                    chartView === 'monto' 
                      ? `$${(value / 1000).toFixed(0)}k`
                      : value.toString()
                  }
                />
                <Tooltip 
                  formatter={(value: any) => [
                    chartView === 'monto' 
                      ? `$${value.toLocaleString('es-ES')}`
                      : `${value} ventas`,
                    chartView === 'monto' ? 'Monto Total' : 'Cantidad de Ventas'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                />
                <Line 
                  type="monotone"
                  dataKey={chartView === 'monto' ? 'montoTotal' : 'cantidadVentas'}
                  stroke="#0066cc"
                  strokeWidth={3}
                  dot={{ fill: '#0066cc', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <BarChart data={ventasPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#666"
                  tickFormatter={(value) => 
                    chartView === 'monto' 
                      ? `$${(value / 1000).toFixed(0)}k`
                      : value.toString()
                  }
                />
                <Tooltip 
                  formatter={(value: any) => [
                    chartView === 'monto' 
                      ? `$${value.toLocaleString('es-ES')}`
                      : `${value} ventas`,
                    chartView === 'monto' ? 'Monto Total' : 'Cantidad de Ventas'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                />
                <Bar 
                  dataKey={chartView === 'monto' ? 'montoTotal' : 'cantidadVentas'}
                  fill="#0066cc"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Rankings Históricos */}
      <div className="dashboard-content">
        <Card title="🏆 Productos Más Vendidos (Histórico)">
          {statsAll?.productosMasVendidos.length === 0 ? (
            <div className="list-item">No hay datos disponibles</div>
          ) : (
            statsAll?.productosMasVendidos.slice(0, 5).map((item, index) => (
              <div key={index} className="list-item">
                <span className="list-item__rank">#{index + 1}</span>
                <span className="list-item__name">{item.producto?.nombre}</span>
                <span className="list-item__value">
                  {item.cantidadVendida} vendidos - ${Math.round(item.totalGenerado || 0).toLocaleString('es-ES')}
                </span>
              </div>
            ))
          )}
        </Card>

        <Card title="⭐ Clientes Más Frecuentes (Histórico)">
          {statsAll?.clientesMasFrecuentes.length === 0 ? (
            <div className="list-item">No hay datos disponibles</div>
          ) : (
            statsAll?.clientesMasFrecuentes.slice(0, 5).map((item, index) => (
              <div key={index} className="list-item">
                <span className="list-item__rank">#{index + 1}</span>
                <span className="list-item__name">{item.cliente?.nombre}</span>
                <span className="list-item__value">
                  {item.cantidadCompras} compras - ${Math.round(item.totalGastado || 0).toLocaleString('es-ES')}
                </span>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Análisis Mensual */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>📊 Análisis Mensual</h2>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-selector"
            disabled={loadingMonth}
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="stats-grid">
          <Card title={`Ventas - ${monthName}`}>
            {loadingMonth ? (
              <div className="stat-value" style={{ opacity: 0.5 }}>Cargando...</div>
            ) : (
              <>
                <div className="stat-value">${Math.round(statsMonth?.resumen.ventasMes || 0).toLocaleString('es-ES')}</div>
                <div className="stat-label">en {statsMonth?.resumen.cantidadVentasMes} ventas</div>
              </>
            )}
          </Card>

          <Card title="Productos del Período">
            {loadingMonth ? (
              <div style={{ padding: '10px', color: '#999' }}>Cargando...</div>
            ) : statsMonth?.productosMasVendidos.length === 0 ? (
              <div style={{ padding: '10px', color: '#999' }}>Sin ventas en este mes</div>
            ) : (
              statsMonth?.productosMasVendidos.slice(0, 3).map((item, index) => (
                <div key={index} className="list-item-compact">
                  <span className="list-item__rank">#{index + 1}</span>
                  <span className="list-item__name">{item.producto?.nombre}</span>
                  <span className="list-item__value">
                    {item.cantidadVendida} vendidos - ${Math.round(item.totalGenerado || 0).toLocaleString('es-ES')}
                  </span>
                </div>
              ))
            )}
          </Card>

          <Card title="Clientes del Período">
            {loadingMonth ? (
              <div style={{ padding: '10px', color: '#999' }}>Cargando...</div>
            ) : statsMonth?.clientesMasFrecuentes.length === 0 ? (
              <div style={{ padding: '10px', color: '#999' }}>Sin ventas en este mes</div>
            ) : (
              statsMonth?.clientesMasFrecuentes.slice(0, 3).map((item, index) => (
                <div key={index} className="list-item-compact">
                  <span className="list-item__rank">#{index + 1}</span>
                  <span className="list-item__name">{item.cliente?.nombre}</span>
                  <span className="list-item__value">
                    {item.cantidadCompras} compras - ${Math.round(item.totalGastado || 0).toLocaleString('es-ES')}
                  </span>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Botón Flotante de Acción Principal */}
      <Link to="/ventas/crear" className="fab" title="Nueva Venta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </Link>
    </div>
  );
};
