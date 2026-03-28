import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  User, Ruler, HeartPulse, UtensilsCrossed, Dumbbell, Moon, Target, Camera,
} from 'lucide-react';

const steps = [
  { icon: User, label: 'Personal', short: '1' },
  { icon: Ruler, label: 'Medidas', short: '2' },
  { icon: HeartPulse, label: 'Salud', short: '3' },
  { icon: UtensilsCrossed, label: 'Nutrición', short: '4' },
  { icon: Dumbbell, label: 'Training', short: '5' },
  { icon: Moon, label: 'Lifestyle', short: '6' },
  { icon: Target, label: 'Goals', short: '7' },
  { icon: Camera, label: 'Fotos', short: '8' },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="mb-4 mb-md-5">
      {/* ===== DESKTOP (lg+) ===== */}
      <div className="d-none d-lg-block">
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="d-flex align-items-start justify-content-between position-relative" style={{ padding: '0 8px' }}>
              {/* Background line */}
              <div style={{
                position: 'absolute', top: 24, left: 40, right: 40,
                height: 2, background: 'var(--dark-500)', zIndex: 0,
              }} />
              {/* Active line */}
              <div style={{
                position: 'absolute', top: 24, left: 40,
                height: 2, zIndex: 1,
                width: `calc(${(currentStep / (steps.length - 1)) * 100}% - ${80 * currentStep / (steps.length - 1)}px + ${40 * currentStep / (steps.length - 1)}px)`,
                background: 'linear-gradient(90deg, var(--neon-dark), var(--neon), var(--neon-light))',
                transition: 'width 0.7s ease',
                boxShadow: '0 0 10px rgba(181,247,39,0.3)',
              }} />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div
                    key={index}
                    onClick={() => onStepClick(index)}
                    className="d-flex flex-column align-items-center"
                    style={{ position: 'relative', zIndex: 2, cursor: 'pointer' }}
                  >
                    <div className={`step-dot ${isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}`}>
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span style={{
                      marginTop: 8, fontSize: 11, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: isActive ? 'var(--neon)' : isCompleted ? 'rgba(181,247,39,0.6)' : 'var(--dark-200)',
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>

      {/* ===== TABLET (md) ===== */}
      <div className="d-none d-md-block d-lg-none">
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="d-flex align-items-center justify-content-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div
                    key={index}
                    onClick={() => onStepClick(index)}
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`step-dot ${isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}`}
                      style={{ width: 42, height: 42, minWidth: 42, borderRadius: 12 }}>
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span style={{
                      marginTop: 6, fontSize: 10, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: isActive ? 'var(--neon)' : isCompleted ? 'rgba(181,247,39,0.5)' : 'var(--dark-300)',
                    }}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>

      {/* ===== MOBILE (xs, sm) ===== */}
      <div className="d-block d-md-none">
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="d-flex align-items-center justify-content-between px-1">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div
                    key={index}
                    onClick={() => onStepClick(index)}
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`step-dot ${isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}`}
                      style={{ width: 38, height: 38, minWidth: 38, borderRadius: 10 }}>
                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span style={{
                      marginTop: 4, fontSize: 8, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.03em',
                      color: isActive ? 'var(--neon)' : isCompleted ? 'rgba(181,247,39,0.5)' : 'var(--dark-300)',
                    }}>
                      {isActive ? step.label : step.short}
                    </span>
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StepIndicator;
