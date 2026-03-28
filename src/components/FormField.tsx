import React from 'react';
import { Row, Col } from 'react-bootstrap';

/* ========== INPUT FIELD ========== */
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  suffix?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label, name, value, onChange, type = 'text', placeholder, required, icon, suffix,
}) => (
  <div className="mb-4">
    <label className="form-label-dark">
      {label} {required && <span className="required-star">*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      {icon && (
        <div style={{
          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--dark-200)', display: 'flex', alignItems: 'center',
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-control-dark ${icon ? 'with-icon' : ''} ${suffix ? 'with-suffix' : ''}`}
      />
      {suffix && (
        <span style={{
          position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--dark-100)', fontSize: 14, fontWeight: 700,
        }}>
          {suffix}
        </span>
      )}
    </div>
  </div>
);

/* ========== TEXTAREA FIELD ========== */
interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label, name, value, onChange, placeholder, rows = 3, required,
}) => (
  <div className="mb-4">
    <label className="form-label-dark">
      {label} {required && <span className="required-star">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="form-control-dark"
      style={{ resize: 'none' }}
    />
  </div>
);

/* ========== SELECT FIELD ========== */
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label, name, value, onChange, options, required, placeholder = 'Selecciona una opción',
}) => (
  <div className="mb-4">
    <label className="form-label-dark">
      {label} {required && <span className="required-star">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="form-select-dark"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

/* ========== RADIO GROUP ========== */
interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; emoji?: string }[];
  required?: boolean;
  columns?: number;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label, name: _name, value, onChange, options, required, columns = 2,
}) => {
  const colSize = columns >= 4 ? 6 : columns === 3 ? 12 : 12;
  const colSizeSm = columns >= 4 ? 6 : columns === 3 ? 4 : 6;
  const colSizeMd = columns >= 4 ? 3 : columns === 3 ? 4 : 6;

  return (
    <div className="mb-4">
      <label className="form-label-dark">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <Row className="g-3">
        {options.map((opt) => (
          <Col xs={colSize} sm={colSizeSm} md={colSizeMd} key={opt.value}>
            <button
              type="button"
              onClick={() => onChange(opt.value)}
              className={`option-btn ${value === opt.value ? 'active' : ''}`}
            >
              {opt.emoji && <span className="option-emoji">{opt.emoji}</span>}
              {opt.label}
            </button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

/* ========== CHECKBOX GROUP ========== */
interface CheckboxGroupProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label, values, onChange, options, required,
}) => {
  const toggleValue = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  return (
    <div className="mb-4">
      <label className="form-label-dark">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <Row className="g-3">
        {options.map((opt) => (
          <Col xs={12} sm={6} key={opt.value}>
            <button
              type="button"
              onClick={() => toggleValue(opt.value)}
              className={`option-btn ${values.includes(opt.value) ? 'active' : ''}`}
            >
              <div className="checkbox-box">
                {values.includes(opt.value) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {opt.label}
            </button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

/* ========== SLIDER FIELD ========== */
interface SliderFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  label, value, onChange, min, max, step = 1, suffix = '',
}) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label className="form-label-dark mb-0">{label}</label>
      <span className="font-bebas" style={{ fontSize: 28, fontWeight: 900, color: 'var(--neon)', letterSpacing: '0.05em' }}>
        {value} {suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="d-flex justify-content-between mt-1" style={{ fontSize: 12, color: 'var(--dark-200)' }}>
      <span>{min} {suffix}</span>
      <span>{max} {suffix}</span>
    </div>
  </div>
);
