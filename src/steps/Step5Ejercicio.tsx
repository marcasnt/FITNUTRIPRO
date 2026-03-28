import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { RadioGroup, SelectField, InputField } from '../components/FormField';
import { Dumbbell } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRadioChange: (name: keyof FormData, value: string) => void;
}

const Step5Ejercicio: React.FC<Props> = ({ data, onChange, onRadioChange }) => {
  const activityScore =
    (data.realizaEjercicio === 'si' ? 2 : data.realizaEjercicio === 'a_veces' ? 1 : 0) +
    (data.frecuenciaEjercicio === '5-6' || data.frecuenciaEjercicio === 'diario' ? 2 : data.frecuenciaEjercicio === '3-4' ? 1 : 0);
  const activeLevel = Math.min(activityScore, 4);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-4 mb-md-5">
        <div className="section-header">
          <div className="section-icon">
            <Dumbbell size={24} />
          </div>
          <div>
            <h2 className="section-title">Training & Actividad Física</h2>
          </div>
        </div>
        <p className="section-subtitle mt-2">
          Tu nivel de actividad define tus requerimientos energéticos. 🏋️
        </p>
      </div>

      <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

      {/* ¿Entrenas? */}
      <Row>
        <Col xs={12}>
          <RadioGroup
            label="¿Entrenas actualmente?"
            name="realizaEjercicio"
            value={data.realizaEjercicio}
            onChange={(val) => onRadioChange('realizaEjercicio', val)}
            options={[
              { value: 'si', label: 'Sí, regularmente', emoji: '🏋️' },
              { value: 'a_veces', label: 'De vez en cuando', emoji: '🚶' },
              { value: 'no', label: 'No entreno', emoji: '🛋️' },
            ]}
            columns={3}
          />
        </Col>
      </Row>

      {data.realizaEjercicio !== 'no' && data.realizaEjercicio !== '' && (
        <div className="animate-slide-down">
          <Row>
            <Col xs={12}>
              <InputField label="¿Qué tipo de entrenamiento?" name="tipoEjercicio"
                value={data.tipoEjercicio} onChange={onChange}
                placeholder="Pesas, CrossFit, correr, natación, yoga..." />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <SelectField
                label="Frecuencia semanal"
                name="frecuenciaEjercicio"
                value={data.frecuenciaEjercicio}
                onChange={onChange}
                options={[
                  { value: '1-2', label: '1-2 veces/semana' },
                  { value: '3-4', label: '3-4 veces/semana' },
                  { value: '5-6', label: '5-6 veces/semana' },
                  { value: 'diario', label: 'Todos los días' },
                ]}
              />
            </Col>
            <Col xs={12} md={6}>
              <SelectField
                label="Duración por sesión"
                name="duracionEjercicio"
                value={data.duracionEjercicio}
                onChange={onChange}
                options={[
                  { value: '30', label: '< 30 min' },
                  { value: '30-60', label: '30-60 min' },
                  { value: '60-90', label: '60-90 min' },
                  { value: '90+', label: '90+ min' },
                ]}
              />
            </Col>
          </Row>
        </div>
      )}

      {/* Sedentarismo */}
      <Row>
        <Col xs={12} md={6}>
          <SelectField
            label="Horas sentado/a por día"
            name="horasQuePasaSentado"
            value={data.horasQuePasaSentado}
            onChange={onChange}
            options={[
              { value: '2-4', label: '2-4 hrs (poco sedentario)' },
              { value: '4-6', label: '4-6 hrs (moderado)' },
              { value: '6-8', label: '6-8 hrs (bastante sedentario)' },
              { value: '8+', label: '8+ hrs (muy sedentario)' },
            ]}
          />
        </Col>
      </Row>

      {/* Fitness Level Visual */}
      <Row>
        <Col xs={12}>
          <div className="info-card">
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--neon)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
              ⚡ Tu nivel de actividad
            </p>
            <div className="d-flex align-items-end justify-content-between" style={{ gap: 8 }}>
              {['Sedentario', 'Ligero', 'Moderado', 'Activo', 'Beast'].map((level, i) => (
                <div key={level} className="text-center" style={{ flex: 1 }}>
                  <div style={{
                    height: 24 + i * 10,
                    borderRadius: 10,
                    transition: 'all 0.5s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i <= activeLevel
                      ? 'linear-gradient(to top, var(--neon-dark), var(--neon))'
                      : 'var(--dark-500)',
                    boxShadow: i <= activeLevel ? '0 0 10px rgba(181,247,39,0.2)' : 'none',
                  }}>
                    {i === activeLevel && (
                      <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--dark-900)' }}>💪</span>
                    )}
                  </div>
                  <p style={{
                    fontSize: 9, marginTop: 8, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: i <= activeLevel ? 'var(--neon)' : 'var(--dark-300)',
                  }}>
                    {level}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Step5Ejercicio;
