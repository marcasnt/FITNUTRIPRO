import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { RadioGroup, SliderField, SelectField } from '../components/FormField';
import { Moon } from 'lucide-react';

interface Props {
  data: FormData;
  onRadioChange: (name: keyof FormData, value: string) => void;
  onSliderChange: (name: keyof FormData, value: string) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Step6Lifestyle: React.FC<Props> = ({ data, onRadioChange, onSliderChange, onSelectChange }) => {
  const stressLevel = parseInt(data.nivelEstres);
  const stressColor = stressLevel <= 3 ? 'var(--neon)' : stressLevel <= 6 ? '#facc15' : '#f87171';
  const stressGlow = stressLevel <= 3
    ? '0 0 15px rgba(181,247,39,0.3)'
    : stressLevel <= 6
    ? '0 0 15px rgba(250,204,21,0.3)'
    : '0 0 15px rgba(248,113,113,0.3)';

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-4 mb-md-5">
        <div className="section-header">
          <div className="section-icon">
            <Moon size={24} />
          </div>
          <div>
            <h2 className="section-title">Lifestyle & Recuperación</h2>
          </div>
        </div>
        <p className="section-subtitle mt-2">
          El descanso y el estilo de vida impactan directamente en tus resultados. 🌙
        </p>
      </div>

      <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

      {/* Sueño */}
      <Row>
        <Col xs={12}>
          <SliderField label="😴 Horas de sueño por noche" value={data.horasSueno}
            onChange={(val) => onSliderChange('horasSueno', val)} min={3} max={12} suffix="hrs" />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <RadioGroup
            label="Calidad de sueño"
            name="calidadSueno"
            value={data.calidadSueno}
            onChange={(val) => onRadioChange('calidadSueno', val)}
            options={[
              { value: 'excelente', label: 'Excelente', emoji: '😴' },
              { value: 'buena', label: 'Buena', emoji: '🙂' },
              { value: 'regular', label: 'Regular', emoji: '😐' },
              { value: 'mala', label: 'Mala', emoji: '😫' },
            ]}
            columns={4}
          />
        </Col>
      </Row>

      {/* Estrés */}
      <Row>
        <Col xs={12}>
          <div className="mb-4">
            <label className="form-label-dark">😰 Nivel de estrés diario</label>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span style={{ fontSize: 28 }}>😌</span>
              <div style={{ flex: 1 }}>
                <input
                  type="range" min={1} max={10}
                  value={data.nivelEstres}
                  onChange={(e) => onSliderChange('nivelEstres', e.target.value)}
                />
              </div>
              <span style={{ fontSize: 28 }}>🤯</span>
            </div>
            <div className="text-center">
              <div className="d-inline-flex align-items-center justify-content-center" style={{
                width: 70, height: 70, borderRadius: 18,
                background: 'var(--dark-600)', border: '1px solid var(--dark-400)',
                boxShadow: stressGlow,
              }}>
                <span className="font-bebas" style={{ fontSize: 36, fontWeight: 900, color: stressColor }}>
                  {data.nivelEstres}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--dark-200)', marginTop: 10, fontWeight: 600 }}>
                {stressLevel <= 3 ? '✨ Bajo estrés — Genial' :
                 stressLevel <= 6 ? '⚡ Estrés moderado' :
                 '⚠️ Alto estrés — Trabajaremos en eso'}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Fuma */}
      <Row>
        <Col xs={12}>
          <RadioGroup
            label="¿Fumas?"
            name="fuma"
            value={data.fuma}
            onChange={(val) => onRadioChange('fuma', val)}
            options={[
              { value: 'no', label: 'No', emoji: '🚭' },
              { value: 'si', label: 'Sí', emoji: '🚬' },
              { value: 'deje', label: 'Lo dejé', emoji: '✅' },
            ]}
            columns={3}
          />
        </Col>
      </Row>

      {/* Horario de trabajo */}
      <Row>
        <Col xs={12} md={6}>
          <SelectField
            label="Horario de trabajo"
            name="horarioTrabajo"
            value={data.horarioTrabajo}
            onChange={onSelectChange}
            options={[
              { value: 'manana', label: 'Mañana (7am - 3pm)' },
              { value: 'completo', label: 'Completo (9am - 6pm)' },
              { value: 'tarde', label: 'Tarde (2pm - 10pm)' },
              { value: 'nocturno', label: 'Nocturno' },
              { value: 'rotativo', label: 'Turnos rotativos' },
              { value: 'flexible', label: 'Flexible / Freelance' },
              { value: 'no_trabajo', label: 'No trabajo' },
            ]}
          />
        </Col>
      </Row>

      {/* Cocina */}
      <Row>
        <Col xs={12}>
          <RadioGroup
            label="¿Cocinas en casa?"
            name="cocinasEnCasa"
            value={data.cocinasEnCasa}
            onChange={(val) => onRadioChange('cocinasEnCasa', val)}
            options={[
              { value: 'siempre', label: 'Siempre', emoji: '👨‍🍳' },
              { value: 'casi_siempre', label: 'Casi siempre', emoji: '🍳' },
              { value: 'a_veces', label: 'A veces', emoji: '🤷' },
              { value: 'casi_nunca', label: 'Casi nunca', emoji: '🚫' },
            ]}
            columns={4}
          />
        </Col>
      </Row>

      {/* Comes fuera */}
      <Row>
        <Col xs={12}>
          <RadioGroup
            label="¿Comes fuera de casa?"
            name="comesFuera"
            value={data.comesFuera}
            onChange={(val) => onRadioChange('comesFuera', val)}
            options={[
              { value: 'rara_vez', label: 'Rara vez', emoji: '🏠' },
              { value: '1-2_semana', label: '1-2/sem', emoji: '🍽️' },
              { value: '3-5_semana', label: '3-5/sem', emoji: '🍔' },
              { value: 'diario', label: 'Diario', emoji: '🥡' },
            ]}
            columns={4}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Step6Lifestyle;
