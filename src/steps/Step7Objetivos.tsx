import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { InputField, RadioGroup, TextAreaField } from '../components/FormField';
import { Target, Trophy } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRadioChange: (name: keyof FormData, value: string) => void;
}

const Step7Objetivos: React.FC<Props> = ({ data, onChange, onRadioChange }) => (
  <div className="animate-fade-in-up">
    {/* Header */}
    <div className="mb-4 mb-md-5">
      <div className="section-header">
        <div className="section-icon">
          <Target size={24} />
        </div>
        <div>
          <h2 className="section-title">Tus Objetivos</h2>
        </div>
      </div>
      <p className="section-subtitle mt-2">
        ¡Última sección! Dime qué quieres lograr y te llevo ahí. 🚀
      </p>
    </div>

    <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

    {/* Objetivo principal */}
    <Row>
      <Col xs={12}>
        <RadioGroup
          label="¿Cuál es tu objetivo principal?"
          name="objetivoPrincipal"
          value={data.objetivoPrincipal}
          onChange={(val) => onRadioChange('objetivoPrincipal', val)}
          options={[
            { value: 'bajar_peso', label: 'Bajar de peso', emoji: '⬇️' },
            { value: 'subir_peso', label: 'Subir de peso', emoji: '⬆️' },
            { value: 'ganar_musculo', label: 'Ganar músculo', emoji: '💪' },
            { value: 'mejorar_salud', label: 'Mejorar salud', emoji: '❤️' },
            { value: 'rendimiento', label: 'Rendimiento', emoji: '🏆' },
            { value: 'habitos', label: 'Mejorar hábitos', emoji: '🔄' },
            { value: 'recomposicion', label: 'Recomposición', emoji: '🔥' },
            { value: 'otro', label: 'Otro', emoji: '✨' },
          ]}
          columns={2}
        />
      </Col>
    </Row>

    {data.objetivoPrincipal === 'otro' && (
      <Row className="animate-slide-down">
        <Col xs={12}>
          <InputField label="¿Cuál es tu objetivo?" name="otroObjetivo"
            value={data.otroObjetivo} onChange={onChange} placeholder="Describe tu objetivo" />
        </Col>
      </Row>
    )}

    {(data.objetivoPrincipal === 'bajar_peso' || data.objetivoPrincipal === 'subir_peso') && (
      <Row className="animate-slide-down">
        <Col xs={12} md={6}>
          <InputField label="¿Cuál es tu peso meta?" name="pesoMeta"
            value={data.pesoMeta} onChange={onChange} type="number" placeholder="65" suffix="kg" />
        </Col>
      </Row>
    )}

    {/* Dietas anteriores */}
    <Row>
      <Col xs={12}>
        <RadioGroup
          label="¿Has seguido algún plan antes?"
          name="hasSeguirDietaAntes"
          value={data.hasSeguirDietaAntes}
          onChange={(val) => onRadioChange('hasSeguirDietaAntes', val)}
          options={[
            { value: 'si', label: 'Sí', emoji: '📋' },
            { value: 'no', label: 'No, primera vez', emoji: '🆕' },
          ]}
        />
      </Col>
    </Row>

    {data.hasSeguirDietaAntes === 'si' && (
      <div className="animate-slide-down">
        <Row>
          <Col xs={12}>
            <InputField label="¿Qué tipo de dieta?" name="cualDieta"
              value={data.cualDieta} onChange={onChange}
              placeholder="Keto, conteo de calorías, ayuno intermitente..." />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <RadioGroup
              label="¿Qué resultado tuviste?"
              name="resultadoDieta"
              value={data.resultadoDieta}
              onChange={(val) => onRadioChange('resultadoDieta', val)}
              options={[
                { value: 'buenos', label: 'Buen resultado', emoji: '👍' },
                { value: 'regulares', label: 'Regular', emoji: '👌' },
                { value: 'no_funciono', label: 'No funcionó', emoji: '👎' },
                { value: 'rebote', label: 'Efecto rebote', emoji: '📈' },
              ]}
              columns={2}
            />
          </Col>
        </Row>
      </div>
    )}

    {/* Motivación */}
    <Row>
      <Col xs={12}>
        <TextAreaField label="💡 ¿Qué te motiva a cambiar?" name="motivacion"
          value={data.motivacion} onChange={onChange}
          placeholder="Más energía, mejor autoestima, mejorar salud..." rows={3} />
      </Col>
    </Row>

    <Row>
      <Col xs={12}>
        <TextAreaField label="📝 ¿Algo más que quieras contarme?" name="comentariosAdicionales"
          value={data.comentariosAdicionales} onChange={onChange}
          placeholder="Cualquier detalle extra que consideres importante..." rows={4} />
      </Col>
    </Row>

    {/* Motivational card */}
    <Row>
      <Col xs={12}>
        <div className="info-card neon-border neon-glow" style={{ marginTop: 8 }}>
          <div className="d-flex align-items-start gap-3 gap-md-4">
            <div className="animate-heartbeat" style={{
              width: 60, height: 60, minWidth: 60, borderRadius: 16,
              background: 'rgba(181,247,39,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={28} style={{ color: 'var(--neon)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                ¡ESTÁS A UN PASO!
              </h3>
              <p style={{ fontSize: 14, color: 'var(--dark-100)', lineHeight: 1.6, margin: 0 }}>
                Al enviar este formulario, me comprometo a crear un plan{' '}
                <span style={{ color: 'var(--neon)', fontWeight: 700 }}>100% personalizado</span> para ti.
                ¡Juntos vamos a romperla! 🔥
              </p>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
);

export default Step7Objetivos;
