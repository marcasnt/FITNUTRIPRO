import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { InputField, CheckboxGroup, TextAreaField } from '../components/FormField';
import { HeartPulse } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCheckboxChange: (name: keyof FormData, values: string[]) => void;
}

const Step3Salud: React.FC<Props> = ({ data, onChange, onCheckboxChange }) => (
  <div className="animate-fade-in-up">
    {/* Header */}
    <div className="mb-4 mb-md-5">
      <div className="section-header">
        <div className="section-icon">
          <HeartPulse size={24} />
        </div>
        <div>
          <h2 className="section-title">Historial de Salud</h2>
        </div>
      </div>
      <p className="section-subtitle mt-2">
        Info 100% confidencial. Necesaria para un plan seguro y efectivo. 🔒
      </p>
    </div>

    <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

    {/* Condiciones médicas */}
    <Row>
      <Col xs={12}>
        <CheckboxGroup
          label="¿Padeces alguna de estas condiciones?"
          values={data.enfermedades}
          onChange={(vals) => onCheckboxChange('enfermedades', vals)}
          options={[
            { value: 'diabetes', label: '🩸 Diabetes' },
            { value: 'hipertension', label: '❤️ Hipertensión' },
            { value: 'hipotiroidismo', label: '🦋 Hipotiroidismo' },
            { value: 'hipertiroidismo', label: '🦋 Hipertiroidismo' },
            { value: 'colesterol_alto', label: '🫀 Colesterol alto' },
            { value: 'trigliceridos', label: '🫀 Triglicéridos altos' },
            { value: 'anemia', label: '💉 Anemia' },
            { value: 'resistencia_insulina', label: '🔬 Resistencia a la insulina' },
            { value: 'sindrome_ovario', label: '♀️ SOP' },
            { value: 'ninguna', label: '✅ Ninguna' },
          ]}
        />
      </Col>
    </Row>

    <Row>
      <Col xs={12}>
        <InputField label="¿Otra condición médica?" name="otraEnfermedad"
          value={data.otraEnfermedad} onChange={onChange} placeholder="Escríbela aquí" />
      </Col>
    </Row>

    <Row>
      <Col xs={12}>
        <TextAreaField label="¿Alergias alimentarias?" name="alergias"
          value={data.alergias} onChange={onChange} placeholder="Ej: Lactosa, gluten, mariscos..." />
      </Col>
    </Row>

    <Row>
      <Col xs={12} md={6}>
        <TextAreaField label="¿Medicamentos actuales?" name="medicamentos"
          value={data.medicamentos} onChange={onChange} placeholder="Nombre y dosis" rows={3} />
      </Col>
      <Col xs={12} md={6}>
        <TextAreaField label="¿Suplementos?" name="suplementos"
          value={data.suplementos} onChange={onChange} placeholder="Ej: Proteína, creatina, multivitamínico..." rows={3} />
      </Col>
    </Row>

    {/* Problemas digestivos */}
    <Row>
      <Col xs={12}>
        <CheckboxGroup
          label="¿Problemas digestivos?"
          values={data.problemasDigestivos}
          onChange={(vals) => onCheckboxChange('problemasDigestivos', vals)}
          options={[
            { value: 'gastritis', label: '🔥 Gastritis' },
            { value: 'reflujo', label: '😖 Reflujo' },
            { value: 'estreñimiento', label: '💩 Estreñimiento' },
            { value: 'inflamacion', label: '🫃 Inflamación' },
            { value: 'colitis', label: '😣 Colitis' },
            { value: 'ninguno', label: '✅ Ninguno' },
          ]}
        />
      </Col>
    </Row>

    <Row>
      <Col xs={12} md={6}>
        <InputField label="¿Otro problema digestivo?" name="otroProblemaDigestivo"
          value={data.otroProblemaDigestivo} onChange={onChange} placeholder="Especifica aquí" />
      </Col>
    </Row>
  </div>
);

export default Step3Salud;
