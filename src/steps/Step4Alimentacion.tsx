import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { InputField, RadioGroup, CheckboxGroup, SliderField, TextAreaField } from '../components/FormField';
import { UtensilsCrossed } from 'lucide-react';

interface Props {
  data: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRadioChange: (name: keyof FormData, value: string) => void;
  onCheckboxChange: (name: keyof FormData, values: string[]) => void;
  onSliderChange: (name: keyof FormData, value: string) => void;
}

const Step4Alimentacion: React.FC<Props> = ({ data, onChange, onRadioChange, onCheckboxChange, onSliderChange }) => (
  <div className="animate-fade-in-up">
    {/* Header */}
    <div className="mb-4 mb-md-5">
      <div className="section-header">
        <div className="section-icon">
          <UtensilsCrossed size={24} />
        </div>
        <div>
          <h2 className="section-title">Hábitos Alimenticios</h2>
        </div>
      </div>
      <p className="section-subtitle mt-2">
        ¿Cómo es tu alimentación actual? Esto me ayuda a adaptar tu plan. 🍽️
      </p>
    </div>

    <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

    {/* Comidas por día */}
    <Row>
      <Col xs={12}>
        <SliderField label="¿Cuántas comidas haces al día?" value={data.comidasPorDia}
          onChange={(val) => onSliderChange('comidasPorDia', val)} min={1} max={6} suffix="comidas" />
      </Col>
    </Row>

    {/* Horarios */}
    <Row>
      <Col xs={12} sm={4}>
        <InputField label="⏰ Desayuno" name="horarioDesayuno" value={data.horarioDesayuno}
          onChange={onChange} type="time" />
      </Col>
      <Col xs={12} sm={4}>
        <InputField label="⏰ Almuerzo" name="horarioComida" value={data.horarioComida}
          onChange={onChange} type="time" />
      </Col>
      <Col xs={12} sm={4}>
        <InputField label="⏰ Cena" name="horarioCena" value={data.horarioCena}
          onChange={onChange} type="time" />
      </Col>
    </Row>

    {/* Snacks */}
    <Row>
      <Col xs={12}>
        <RadioGroup
          label="¿Snacks entre comidas?"
          name="consumeSnacks"
          value={data.consumeSnacks}
          onChange={(val) => onRadioChange('consumeSnacks', val)}
          options={[
            { value: 'si', label: 'Sí', emoji: '🍎' },
            { value: 'no', label: 'No', emoji: '🚫' },
            { value: 'a_veces', label: 'A veces', emoji: '🤷' },
          ]}
          columns={3}
        />
      </Col>
    </Row>

    {(data.consumeSnacks === 'si' || data.consumeSnacks === 'a_veces') && (
      <Row className="animate-slide-down">
        <Col xs={12}>
          <InputField label="¿Qué tipo de snacks?" name="tipoSnacks" value={data.tipoSnacks}
            onChange={onChange} placeholder="Frutas, galletas, nueces..." />
        </Col>
      </Row>
    )}

    {/* Agua */}
    <Row>
      <Col xs={12}>
        <SliderField label="💧 Litros de agua por día" value={data.litrosAgua}
          onChange={(val) => onSliderChange('litrosAgua', val)} min={0} max={5} step={0.5} suffix="L" />
      </Col>
    </Row>

    {/* Alcohol */}
    <Row>
      <Col xs={12}>
        <RadioGroup
          label="¿Bebidas alcohólicas?"
          name="consumeAlcohol"
          value={data.consumeAlcohol}
          onChange={(val) => onRadioChange('consumeAlcohol', val)}
          options={[
            { value: 'no', label: 'No', emoji: '🚫' },
            { value: 'ocasionalmente', label: 'A veces', emoji: '🍷' },
            { value: 'frecuentemente', label: 'Seguido', emoji: '🍺' },
          ]}
          columns={3}
        />
      </Col>
    </Row>

    {data.consumeAlcohol && data.consumeAlcohol !== 'no' && (
      <Row className="animate-slide-down">
        <Col xs={12} md={6}>
          <InputField label="¿Con qué frecuencia?" name="frecuenciaAlcohol"
            value={data.frecuenciaAlcohol} onChange={onChange}
            placeholder="1-2 veces por semana, fines de semana..." />
        </Col>
      </Row>
    )}

    {/* Restricciones */}
    <Row>
      <Col xs={12}>
        <CheckboxGroup
          label="¿Restricciones alimentarias?"
          values={data.restriccionDieta}
          onChange={(vals) => onCheckboxChange('restriccionDieta', vals)}
          options={[
            { value: 'vegetariano', label: '🥬 Vegetariano' },
            { value: 'vegano', label: '🌱 Vegano' },
            { value: 'sin_gluten', label: '🌾 Sin gluten' },
            { value: 'sin_lactosa', label: '🥛 Sin lácteos' },
            { value: 'keto', label: '🥑 Keto' },
            { value: 'ninguna', label: '✅ Ninguna' },
          ]}
        />
      </Col>
    </Row>

    <Row>
      <Col xs={12}>
        <InputField label="¿Otra restricción?" name="otraRestriccion"
          value={data.otraRestriccion} onChange={onChange} placeholder="Especifica aquí" />
      </Col>
    </Row>

    {/* Gustos */}
    <Row>
      <Col xs={12} md={6}>
        <TextAreaField label="🚫 Alimentos que NO te gustan" name="alimentosNoGustan"
          value={data.alimentosNoGustan} onChange={onChange}
          placeholder="Brócoli, hígado, atún enlatado..." />
      </Col>
      <Col xs={12} md={6}>
        <TextAreaField label="💚 Alimentos que te encantan" name="alimentosFavoritos"
          value={data.alimentosFavoritos} onChange={onChange}
          placeholder="Pollo, arroz, frutas, huevo..." />
      </Col>
    </Row>

    <hr style={{ borderColor: 'var(--dark-500)', margin: '28px 0' }} />

    {/* Macronutrientes Disponibles */}
    <div className="mb-4">
      <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
        🛒 Alimentos que puedes comprar
      </h3>
      <p className="section-subtitle">
        Selecciona los alimentos disponibles para tu plan de dieta:
      </p>
    </div>

    {/* Carbohidratos */}
    <Row>
      <Col xs={12}>
        <CheckboxGroup
          label="🍚 Carbohidratos (selecciona los que puedes comprar)"
          values={data.carbsSelect}
          onChange={(vals) => onCheckboxChange('carbsSelect', vals)}
          options={[
            { value: 'papa', label: '🥔 Papa' },
            { value: 'arroz', label: '🍚 Arroz' },
            { value: 'camote', label: '🍠 Camote' },
            { value: 'arroz_integral', label: '🌾 Arroz integral' },
            { value: 'pan_integral', label: '🥖 Pan integral' },
            { value: 'avena', label: '🥣 Avena' },
            { value: 'quinoa', label: '🌿 Quinoa' },
            { value: 'lenteja', label: '🫘 Lenteja' },
            { value: 'frijoles', label: '🫘 Frijoles' },
          ]}
        />
      </Col>
    </Row>

    {/* Proteínas */}
    <Row className="mt-3">
      <Col xs={12}>
        <CheckboxGroup
          label="🥩 Proteínas (selecciona las que puedes comprar)"
          values={data.proteinasSelect}
          onChange={(vals) => onCheckboxChange('proteinasSelect', vals)}
          options={[
            { value: 'pollo', label: '🍗 Pollo' },
            { value: 'huevo', label: '🥚 Huevo' },
            { value: 'pescado', label: '🐟 Pescado' },
            { value: 'atun', label: '🐟 Atún' },
            { value: 'res', label: '🥩 Res' },
            { value: 'carne_molida', label: '🍖 Carne molida' },
            { value: 'jamon_pavo', label: '🦃 Jamón de pavo' },
            { value: 'bacon', label: '🥓 Bacon' },
          ]}
        />
      </Col>
    </Row>

    {/* Grasas */}
    <Row className="mt-3">
      <Col xs={12}>
        <CheckboxGroup
          label="🥑 Grasas saludables (selecciona las que puedes comprar)"
          values={data.grasasSelect}
          onChange={(vals) => onCheckboxChange('grasasSelect', vals)}
          options={[
            { value: 'frutos_secos', label: '🥜 Frutos secos' },
            { value: 'almendra', label: '🌰 Almendra' },
            { value: 'aceite_oliva', label: '🫒 Aceite de oliva' },
            { value: 'aceite_aguacate', label: '🥑 Aceite de aguacate' },
            { value: 'aceite_coco', label: '🥥 Aceite de coco' },
            { value: 'mantequilla_mani', label: '🥜 Mantequilla de maní' },
            { value: 'mantequilla_almendras', label: '🌰 Mantequilla de almendras' },
          ]}
        />
      </Col>
    </Row>
  </div>
);

export default Step4Alimentacion;
