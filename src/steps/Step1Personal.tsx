import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { InputField, RadioGroup } from '../components/FormField';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadioChange: (name: keyof FormData, value: string) => void;
}

const Step1Personal: React.FC<Props> = ({ data, onChange, onRadioChange }) => (
  <div className="animate-fade-in-up">
    {/* Header */}
    <div className="mb-4 mb-md-5">
      <div className="section-header">
        <div className="section-icon">
          <User size={24} />
        </div>
        <div>
          <h2 className="section-title">Datos Personales</h2>
        </div>
      </div>
      <p className="section-subtitle mt-2">
        Cuéntame sobre ti para personalizar tu plan al máximo. 💪
      </p>
    </div>

    <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

    {/* Nombre y Apellido */}
    <Row>
      <Col xs={12} md={6}>
        <InputField label="Nombre" name="nombre" value={data.nombre} onChange={onChange}
          placeholder="Tu nombre" required icon={<User size={16} />} />
      </Col>
      <Col xs={12} md={6}>
        <InputField label="Apellido" name="apellido" value={data.apellido} onChange={onChange}
          placeholder="Tu apellido" required icon={<User size={16} />} />
      </Col>
    </Row>

    {/* Email y Teléfono */}
    <Row>
      <Col xs={12} md={6}>
        <InputField label="Correo electrónico" name="email" value={data.email} onChange={onChange}
          type="email" placeholder="tu@email.com" required icon={<Mail size={16} />} />
      </Col>
      <Col xs={12} md={6}>
        <InputField label="Teléfono / WhatsApp" name="telefono" value={data.telefono} onChange={onChange}
          type="tel" placeholder="+52 555 123 4567" required icon={<Phone size={16} />} />
      </Col>
    </Row>

    {/* Fecha de nacimiento y Ciudad */}
    <Row>
      <Col xs={12} md={6}>
        <InputField label="Fecha de nacimiento" name="fechaNacimiento" value={data.fechaNacimiento}
          onChange={onChange} type="date" required />
      </Col>
      <Col xs={12} md={6}>
        <InputField label="Ciudad" name="ciudad" value={data.ciudad} onChange={onChange}
          placeholder="¿Dónde vives?" icon={<MapPin size={16} />} />
      </Col>
    </Row>

    {/* Ocupación */}
    <Row>
      <Col xs={12}>
        <InputField label="Ocupación" name="ocupacion" value={data.ocupacion} onChange={onChange}
          placeholder="¿A qué te dedicas?" icon={<Briefcase size={16} />} />
      </Col>
    </Row>

    {/* Sexo */}
    <Row>
      <Col xs={12}>
        <RadioGroup
          label="Sexo biológico"
          name="genero"
          value={data.genero}
          onChange={(val) => onRadioChange('genero', val)}
          options={[
            { value: 'masculino', label: 'Masculino', emoji: '♂️' },
            { value: 'femenino', label: 'Femenino', emoji: '♀️' },
          ]}
          required
        />
      </Col>
    </Row>
  </div>
);

export default Step1Personal;
