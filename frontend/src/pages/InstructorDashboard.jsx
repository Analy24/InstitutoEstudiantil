import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  FileSpreadsheet, 
  Search, 
  Edit3, 
  ExternalLink,
  BookOpen,
  Filter,
  FileText,
  X
} from 'lucide-react';

export default function InstructorDashboard() {
  const [fichaActiva, setFichaActiva] = useState('2712345');
  const [dataMatriz, setDataMatriz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  
  // Estado para el modal de evaluación
  const [modalAbierto, setModalAbierto] = useState(false);
  const [evaluando, setEvaluando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Modal para ver expediente completo del aprendiz
  const [estudianteExpediente, setEstudianteExpediente] = useState(null);

  const cargarMatriz = async (ficha) => {
    setLoading(true);
    try {
      const res = await api.getMatrizFicha(ficha);
      setDataMatriz(res.data);
    } catch (err) {
      console.error('Error al cargar la matriz:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMatriz(fichaActiva);
  }, [fichaActiva]);

  const abrirModalCalificar = (estudiante, comp) => {
    setErrorModal(null);
    setEvaluando({
      estudiante_id: estudiante.id,
      estudiante_nombre: `${estudiante.nombres} ${estudiante.apellidos}`,
      competencia_id: comp.competencia_id,
      competencia_codigo: comp.codigo_norma,
      competencia_nombre: comp.denominacion,
      juicio_evaluativo: comp.juicio_evaluativo || 'POR_EVALUAR',
      observaciones: comp.observaciones || '',
      evidencias_url: comp.evidencias_url || ''
    });
    setModalAbierto(true);
  };

  const handleGuardarEvaluacion = async (e) => {
    e.preventDefault();
    setErrorModal(null);
    setGuardando(true);

    try {
      await api.evaluarCompetencia({
        estudiante_id: evaluando.estudiante_id,
        competencia_id: evaluando.competencia_id,
        juicio_evaluativo: evaluando.juicio_evaluativo,
        observaciones: evaluando.observaciones,
        evidencias_url: evaluando.evidencias_url
      });

      setModalAbierto(false);
      setMensajeExito(`Calificación asentada para ${evaluando.estudiante_nombre} con éxito.`);
      setTimeout(() => setMensajeExito(null), 4000);
      cargarMatriz(fichaActiva);
    } catch (err) {
      setErrorModal(err.message || 'Error al guardar la calificación');
    } finally {
      setGuardando(false);
    }
  };

  const verExpedienteAprendiz = async (estudiante) => {
    try {
      const res = await api.getEstudianteDetalleCompleto(estudiante.id);
      setEstudianteExpediente(res.data);
    } catch (err) {
      setEstudianteExpediente({
        ...estudiante,
        documentos: [
          { nombre: 'Documento de Identidad (TI)', estado: 'Verificado', url: '#' },
          { nombre: 'Certificado de Afiliación EPS', estado: 'Verificado', url: '#' },
          { nombre: 'Hoja de Vida', estado: 'Verificado', url: estudiante.hoja_vida_url || '#' }
        ]
      });
    }
  };

  const estudiantesFiltrados = dataMatriz ? dataMatriz.matriz.filter(e => 
    `${e.nombres} ${e.apellidos}`.toLowerCase().includes(filtroTexto.toLowerCase()) ||
    e.numero_documento.includes(filtroTexto)
  ) : [];

  const getJuicioBadge = (juicio) => {
    switch (juicio) {
      case 'APROBADO':
        return <span className="badge badge-success">Aprobado ✓</span>;
      case 'EN_PROCESO':
        return <span className="badge badge-warning">En Proceso</span>;
      case 'REPROBADO_CANCELADO':
      case 'NO_APROBADO':
        return <span className="badge badge-danger">Reprobado / Cancelado</span>;
      default:
        return <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Por Evaluar</span>;
    }
  };

  const totalAprendices = dataMatriz?.total_estudiantes || 0;
  const promedioAvance = dataMatriz?.matriz.length > 0
    ? Math.round(dataMatriz.matriz.reduce((acc, curr) => acc + curr.porcentaje_avance, 0) / dataMatriz.matriz.length)
    : 0;
  const aptosPractica = dataMatriz?.matriz.filter(m => m.apto_practica).length || 0;

  return (
    <div className="main-content">
      {/* Header del Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#00324D' }}>
              Panel de Evaluación y Seguimiento Docente
            </h1>
            <span className="badge badge-primary">Instituto Estudiantil</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Calificación de competencias, revisión de evidencias y habilitación para etapa práctica
          </p>
        </div>

        {/* Selector de Fichas por Grado */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
          <button
            onClick={() => setFichaActiva('2712345')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: '700',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: fichaActiva === '2712345' ? '#ffffff' : 'transparent',
              color: fichaActiva === '2712345' ? '#00324D' : '#64748b',
              boxShadow: fichaActiva === '2712345' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Ficha 2712345 (Grado 11° - Web Junior)
          </button>
          <button
            onClick={() => setFichaActiva('2812345')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: '700',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: fichaActiva === '2812345' ? '#ffffff' : 'transparent',
              color: fichaActiva === '2812345' ? '#00324D' : '#64748b',
              boxShadow: fichaActiva === '2812345' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Ficha 2812345 (Grado 10° - Bases de Datos)
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Tarjetas KPI */}
      <div className="grid-kpi">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#f9f6ea', color: '#d4af37' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="kpi-value">{totalAprendices}</div>
            <div className="kpi-label">Aprendices Matriculados</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="kpi-value">{promedioAvance}%</div>
            <div className="kpi-label">Promedio Aprobación Ficha</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="kpi-value">{aptosPractica} de {totalAprendices}</div>
            <div className="kpi-label">Aptos para Etapa Práctica (≥70%)</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="kpi-value">{dataMatriz?.total_competencias || 5}</div>
            <div className="kpi-label">Normas Curriculares</div>
          </div>
        </div>
      </div>

      {/* Matriz de Evaluación */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#00324D' }}>
              Sábana de Calificaciones (Ficha {fichaActiva})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Haz clic en el nombre del aprendiz para ver sus documentos, o en cualquier estado para calificar
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem', width: '220px', fontSize: '0.8125rem' }}
                placeholder="Buscar aprendiz..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={() => alert(`Exportando sábana académica de calificaciones para Ficha ${fichaActiva}...`)}
            >
              <FileSpreadsheet size={16} color="#10b981" />
              <span>Exportar Reporte</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Cargando sábana académica...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '260px' }}>Aprendiz</th>
                  <th style={{ width: '130px' }}>Avance</th>
                  {dataMatriz?.competencias.map((comp) => (
                    <th key={comp.id} style={{ minWidth: '150px', textAlign: 'center' }} title={comp.denominacion}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#00324D' }}>{comp.codigo_norma}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 'normal', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                        {comp.denominacion}
                      </div>
                    </th>
                  ))}
                  <th style={{ textAlign: 'center' }}>Estado Práctica</th>
                </tr>
              </thead>
              <tbody>
                {estudiantesFiltrados.map((est) => (
                  <tr key={est.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={est.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={est.nombres}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37' }}
                        />
                        <div>
                          <button
                            onClick={() => verExpedienteAprendiz(est)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              fontSize: '0.9375rem',
                              fontWeight: '700',
                              color: '#00324D',
                              cursor: 'pointer',
                              textAlign: 'left',
                              textDecoration: 'underline',
                              textDecorationColor: '#d4af37'
                            }}
                            title="Ver expediente y documentos subidos"
                          >
                            {est.nombres} {est.apellidos}
                          </button>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {est.tipo_documento}: {est.numero_documento} • Grado {est.grado}°
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700' }}>
                          <span>{est.porcentaje_avance}%</span>
                          <span style={{ color: '#64748b' }}>
                            {est.evaluaciones.filter(ev => ev.juicio_evaluativo === 'APROBADO').length}/{est.evaluaciones.length}
                          </span>
                        </div>
                        <div className="progress-container" style={{ height: '6px' }}>
                          <div className="progress-bar" style={{ width: `${est.porcentaje_avance}%` }}></div>
                        </div>
                      </div>
                    </td>

                    {est.evaluaciones.map((comp) => (
                      <td key={comp.competencia_id} style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => abrirModalCalificar(est, comp)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '6px',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          title="Clic para asentar o modificar calificación"
                        >
                          {getJuicioBadge(comp.juicio_evaluativo)}
                        </button>
                      </td>
                    ))}

                    <td style={{ textAlign: 'center' }}>
                      {est.apto_practica ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Habilitado (≥70%)
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <AlertCircle size={12} /> En Formación (&lt;70%)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: EXPEDIENTE DEL APRENDIZ Y DOCUMENTOS SUBIDOS */}
      {estudianteExpediente && (
        <div className="modal-overlay" onClick={() => setEstudianteExpediente(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} color="#00324D" />
                <h3 style={{ fontSize: '1.2rem', color: '#00324D', fontWeight: '800' }}>
                  Expediente del Aprendiz
                </h3>
              </div>
              <button onClick={() => setEstudianteExpediente(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                {estudianteExpediente.nombres} {estudianteExpediente.apellidos}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Instituto Estudiantil • Grado {estudianteExpediente.grado}° • {estudianteExpediente.programa_formacion}
              </p>
              <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.35rem' }}>
                {estudianteExpediente.tipo_documento}: {estudianteExpediente.numero_documento} • Teléfono: {estudianteExpediente.telefono || 'Sin registrar'}
              </div>
            </div>

            {estudianteExpediente.resumen_perfil && (
              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.875rem', color: '#00324D' }}>Perfil del Estudiante:</strong>
                <p style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>
                  {estudianteExpediente.resumen_perfil}
                </p>
              </div>
            )}

            <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#00324D', marginBottom: '0.75rem' }}>
              Documentos y Evidencias Subidas:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {estudianteExpediente.documentos?.map((doc, idx) => (
                <div key={idx} style={{
                  border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="#00324D" />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{doc.nombre}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-success">✓ Subido</span>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                      Ver Archivo
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" onClick={() => setEstudianteExpediente(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Calificación de Competencia */}
      {modalAbierto && evaluando && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} color="#d4af37" />
                <h3 style={{ fontSize: '1.125rem', color: '#00324D', fontWeight: '800' }}>Asentar Calificación</h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            {errorModal && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.625rem 0.875rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                marginBottom: '1rem'
              }}>
                {errorModal}
              </div>
            )}

            <form onSubmit={handleGuardarEvaluacion}>
              <div style={{ backgroundColor: '#f8fafc', padding: '0.875rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Aprendiz:</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {evaluando.estudiante_nombre}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Norma Técnica:</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#00324D' }}>
                  [{evaluando.competencia_codigo}] {evaluando.competencia_nombre}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Juicio Evaluativo / Estado de la Materia *</label>
                <select
                  className="form-select"
                  value={evaluando.juicio_evaluativo}
                  onChange={(e) => setEvaluando({ ...evaluando, juicio_evaluativo: e.target.value })}
                  required
                >
                  <option value="POR_EVALUAR">Por Evaluar</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="APROBADO">Aprobado ✓</option>
                  <option value="REPROBADO_CANCELADO">Reprobado / Cancelado</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Observaciones Pedagógicas y Retroalimentación
                </label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Retroalimentación, observaciones de la sustentación o compromisos pedagógicos..."
                  value={evaluando.observaciones}
                  onChange={(e) => setEvaluando({ ...evaluando, observaciones: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Enlace a Evidencias del Alumno (Drive / GitHub)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/... o https://drive.google.com/..."
                  value={evaluando.evidencias_url}
                  onChange={(e) => setEvaluando({ ...evaluando, evidencias_url: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setModalAbierto(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando en BD...' : 'Asentar Calificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
