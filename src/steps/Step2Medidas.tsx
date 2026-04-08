import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { InputField } from '../components/FormField';
import { Ruler } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof FormData, string>>;
}

const Step2Medidas: React.FC<Props> = ({ data, onChange, errors = {} }) => {
  const peso = parseFloat(data.peso) || 0;
  const estatura = parseFloat(data.estatura) || 0;
  const imc = estatura > 0 ? peso / ((estatura / 100) ** 2) : 0;

  const getImcCategory = (imc: number) => {
    if (imc === 0) return { label: '—', color: '#777', bar: '#333', emoji: '⚖️' };
    if (imc < 18.5) return { label: 'Bajo peso', color: '#60a5fa', bar: '#60a5fa', emoji: '🔽' };
    if (imc < 25) return { label: 'Normal', color: '#b5f727', bar: '#b5f727', emoji: '✅' };
    if (imc < 30) return { label: 'Sobrepeso', color: '#facc15', bar: '#facc15', emoji: '⚠️' };
    return { label: 'Obesidad', color: '#f87171', bar: '#f87171', emoji: '🔴' };
  };

  const category = getImcCategory(imc);

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-4 mb-md-5">
        <div className="section-header">
          <div className="section-icon">
            <Ruler size={24} />
          </div>
          <div>
            <h2 className="section-title">Medidas Corporales</h2>
          </div>
        </div>
        <p className="section-subtitle mt-2">
          Estos datos son clave para diseñar tu plan. Si no tienes alguna medida, déjala vacía.
        </p>
      </div>

      <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

      {/* Peso y Estatura */}
      <Row>
        <Col xs={12} md={6}>
          <InputField 
            label="Peso actual" name="peso" value={data.peso} onChange={onChange}
            type="number" placeholder="70" required suffix="kg" 
            error={errors.peso}
          />
        </Col>
        <Col xs={12} md={6}>
          <InputField 
            label="Estatura" name="estatura" value={data.estatura} onChange={onChange}
            type="number" placeholder="170" required suffix="cm" 
            error={errors.estatura}
          />
        </Col>
      </Row>

      {/* IMC Card */}
      {imc > 0 && (
        <Row className="mb-4">
          <Col xs={12}>
            <div className="info-card neon-border animate-scale-in">
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-3" style={{ gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark-100)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    IMC — Índice de Masa Corporal
                  </p>
                  <p className="font-bebas" style={{ fontSize: 48, fontWeight: 900, color: category.color, margin: '4px 0 0 0', lineHeight: 1 }}>
                    {imc.toFixed(1)}
                  </p>
                </div>
                <div style={{
                  padding: '10px 20px', borderRadius: 14, color: category.color,
                  fontWeight: 700, fontSize: 14, background: 'var(--dark-500)', border: '1px solid var(--dark-400)',
                }}>
                  {category.emoji} {category.label}
                </div>
              </div>
              <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'var(--dark-500)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4, transition: 'all 0.7s ease',
                  width: `${Math.min((imc / 40) * 100, 100)}%`,
                  background: category.bar,
                  boxShadow: `0 0 10px ${category.bar}50`,
                }} />
              </div>
              <div className="d-flex justify-content-between mt-2" style={{ fontSize: 10, color: 'var(--dark-200)', fontWeight: 600 }}>
                <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--dark-200)', marginTop: 10, marginBottom: 0 }}>
                ⚠️ El IMC es solo una referencia, no un diagnóstico completo.
              </p>
            </div>
          </Col>
        </Row>
      )}

      {/* Cintura y Cadera */}
      <Row>
        <Col xs={12} md={6}>
          <InputField label="Circunferencia de cintura" name="circunferenciaCintura"
            value={data.circunferenciaCintura} onChange={onChange} type="number" placeholder="80" suffix="cm" />
        </Col>
        <Col xs={12} md={6}>
          <InputField label="Circunferencia de cadera" name="circunferenciaCadera"
            value={data.circunferenciaCadera} onChange={onChange} type="number" placeholder="95" suffix="cm" />
        </Col>
      </Row>

      {/* Cuello y Pierna */}
      <Row>
        <Col xs={12} md={6}>
          <InputField label="Circunferencia de cuello" name="circunferenciaCuello"
            value={data.circunferenciaCuello} onChange={onChange} type="number" placeholder="38" suffix="cm" />
        </Col>
        <Col xs={12} md={6}>
          <InputField label="Circunferencia de pierna (muslo)" name="circunferenciaPierna"
            value={data.circunferenciaPierna} onChange={onChange} type="number" placeholder="55" suffix="cm" />
        </Col>
      </Row>

      {/* Brazo y % Grasa */}
      <Row>
        <Col xs={12} md={6}>
          <InputField label="Circunferencia de brazo (bíceps)" name="circunferenciaBrazo"
            value={data.circunferenciaBrazo} onChange={onChange} type="number" placeholder="32" suffix="cm" />
        </Col>
        <Col xs={12} md={6}>
          <InputField label="% Grasa corporal (si lo conoces)" name="porcentajeGrasa"
            value={data.porcentajeGrasa} onChange={onChange} type="number" placeholder="20" suffix="%" />
        </Col>
      </Row>
    </div>
  );
};

export default Step2Medidas;
