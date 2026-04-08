import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { 
  FileText, User, Ruler, HeartPulse, UtensilsCrossed, Dumbbell, 
  Moon, Target, Camera, CheckCircle, AlertCircle, Edit3, Send 
} from 'lucide-react';

interface Props {
  data: FormData;
  onEditStep: (step: number) => void;
}

const ReviewSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  stepIndex: number;
  onEdit: () => void;
  children: React.ReactNode;
}> = ({ title, icon, onEdit, children }) => (
  <div style={{ 
    background: 'var(--dark-700)', 
    borderRadius: 16, 
    border: '1px solid var(--dark-500)',
    marginBottom: 16,
    overflow: 'hidden',
  }}>
    <div style={{ 
      padding: '16px 20px', 
      background: 'var(--dark-600)',
      borderBottom: '1px solid var(--dark-500)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div className="d-flex align-items-center gap-3">
        <div style={{ 
          width: 36, height: 36, minWidth: 36, borderRadius: 10,
          background: 'rgba(181,247,39,0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
      </div>
      <button
        onClick={onEdit}
        style={{
          padding: '8px 14px',
          borderRadius: 10,
          background: 'var(--dark-500)',
          border: '1px solid var(--dark-400)',
          color: 'var(--dark-100)',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--dark-400)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--dark-500)';
          e.currentTarget.style.color = 'var(--dark-100)';
        }}
      >
        <Edit3 size={14} />
        Editar
      </button>
    </div>
    <div style={{ padding: '20px' }}>
      {children}
    </div>
  </div>
);

const ReviewItem: React.FC<{ label: string; value: string | React.ReactNode; highlight?: boolean }> = ({ 
  label, value, highlight 
}) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    padding: '10px 0',
    borderBottom: '1px solid var(--dark-600)',
  }}>
    <span style={{ fontSize: 13, color: 'var(--dark-200)', fontWeight: 500 }}>{label}</span>
    <span style={{ 
      fontSize: 14, 
      fontWeight: 700, 
      color: highlight ? 'var(--neon)' : '#fff',
      textAlign: 'right',
      maxWidth: '60%',
    }}>
      {value || <span style={{ color: 'var(--dark-300)', fontStyle: 'italic' }}>—</span>}
    </span>
  </div>
);

const PhotoStatus: React.FC<{ uploaded: boolean; label: string }> = ({ uploaded, label }) => (
  <div className="d-flex align-items-center gap-2" style={{
    padding: '8px 14px',
    borderRadius: 10,
    background: uploaded ? 'rgba(181,247,39,0.1)' : 'var(--dark-600)',
    border: `1px solid ${uploaded ? 'rgba(181,247,39,0.25)' : 'var(--dark-500)'}`,
  }}>
    {uploaded ? (
      <CheckCircle size={14} style={{ color: 'var(--neon)' }} />
    ) : (
      <AlertCircle size={14} style={{ color: 'var(--dark-300)' }} />
    )}
    <span style={{ 
      fontSize: 12, 
      fontWeight: 700, 
      color: uploaded ? 'var(--neon)' : 'var(--dark-300)',
    }}>
      {label}
    </span>
  </div>
);

const Step9Review: React.FC<Props> = ({ data, onEditStep }) => {
  const objetivoMap: Record<string, string> = {
    'bajar_peso': '⬇️ Bajar de peso',
    'subir_peso': '⬆️ Subir de peso',
    'ganar_musculo': '💪 Ganar músculo',
    'mejorar_salud': '❤️ Mejorar salud',
    'rendimiento': '🏆 Rendimiento deportivo',
    'habitos': '🔄 Mejorar hábitos',
    'recomposicion': '🔥 Recomposición corporal',
  };

  const generoMap: Record<string, string> = {
    'masculino': '♂️ Masculino',
    'femenino': '♀️ Femenino',
  };

  const ejercicioMap: Record<string, string> = {
    'gimnasio_pesas': '🏋️ Gimnasio/Pesas',
    'crossfit': '💪 CrossFit',
    'calistenia': '🤸 Calistenia',
    'deportes': '⚽ Deportes',
    'cardio': '🏃 Cardio',
    'funcional': '🔥 Funcional',
    'otro': 'Otro',
  };

  const calidadSuenoMap: Record<string, string> = {
    'excelente': '⭐⭐⭐⭐⭐ Excelente',
    'buena': '⭐⭐⭐⭐ Buena',
    'regular': '⭐⭐⭐ Regular',
    'mala': '⭐⭐ Mala',
    'insomnio': '😴 Insomnio',
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-4 mb-md-5">
        <div className="section-header">
          <div className="section-icon">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="section-title">Revisar y Confirmar</h2>
          </div>
        </div>
        <p className="section-subtitle mt-2">
          Verifica que toda tu información sea correcta antes de enviar. 📋
        </p>
      </div>

      <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

      {/* Resumen de completitud */}
      <div style={{ 
        background: 'rgba(181,247,39,0.05)', 
        borderRadius: 16, 
        padding: '20px 24px',
        border: '1px solid rgba(181,247,39,0.15)',
        marginBottom: 28,
      }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 50, height: 50, minWidth: 50, borderRadius: 14,
            background: 'rgba(181,247,39,0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={26} style={{ color: 'var(--neon)' }} />
          </div>
          <div>
            <p className="mb-1" style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              ¡Casi listo, {data.nombre || 'crack'}!
            </p>
            <p className="mb-0" style={{ fontSize: 14, color: 'var(--dark-100)' }}>
              Revisa tu información y confirma para recibir tu plan nutricional personalizado.
            </p>
          </div>
        </div>
      </div>

      {/* Secciones de revisión */}
      <ReviewSection 
        title="Datos Personales" 
        icon={<User size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={0}
        onEdit={() => onEditStep(0)}
      >
        <Row>
          <Col xs={12} md={6}>
            <ReviewItem label="Nombre completo" value={`${data.nombre} ${data.apellido}`} highlight />
            <ReviewItem label="Email" value={data.email} />
            <ReviewItem label="Teléfono" value={data.telefono} />
          </Col>
          <Col xs={12} md={6}>
            <ReviewItem label="Fecha de nacimiento" value={data.fechaNacimiento} />
            <ReviewItem label="Sexo" value={generoMap[data.genero] || data.genero} />
            <ReviewItem label="Ciudad" value={data.ciudad} />
            <ReviewItem label="Ocupación" value={data.ocupacion} />
          </Col>
        </Row>
      </ReviewSection>

      <ReviewSection 
        title="Medidas Corporales" 
        icon={<Ruler size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={1}
        onEdit={() => onEditStep(1)}
      >
        <Row>
          <Col xs={6} md={4}>
            <ReviewItem label="Peso" value={data.peso ? `${data.peso} kg` : ''} highlight />
          </Col>
          <Col xs={6} md={4}>
            <ReviewItem label="Estatura" value={data.estatura ? `${data.estatura} cm` : ''} highlight />
          </Col>
          <Col xs={6} md={4}>
            <ReviewItem label="% Grasa" value={data.porcentajeGrasa ? `${data.porcentajeGrasa}%` : ''} />
          </Col>
          <Col xs={6} md={4}>
            <ReviewItem label="Cintura" value={data.circunferenciaCintura ? `${data.circunferenciaCintura} cm` : ''} />
          </Col>
          <Col xs={6} md={4}>
            <ReviewItem label="Cadera" value={data.circunferenciaCadera ? `${data.circunferenciaCadera} cm` : ''} />
          </Col>
          <Col xs={6} md={4}>
            <ReviewItem label="Cuello" value={data.circunferenciaCuello ? `${data.circunferenciaCuello} cm` : ''} />
          </Col>
        </Row>
      </ReviewSection>

      <ReviewSection 
        title="Historial de Salud" 
        icon={<HeartPulse size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={2}
        onEdit={() => onEditStep(2)}
      >
        <ReviewItem 
          label="Enfermedades/condiciones" 
          value={data.enfermedades.length > 0 ? data.enfermedades.join(', ') : 'Ninguna'} 
        />
        <ReviewItem label="Alergias alimentarias" value={data.alergias || 'Ninguna'} />
        <ReviewItem label="Medicamentos" value={data.medicamentos || 'Ninguno'} />
        <ReviewItem label="Suplementos" value={data.suplementos || 'Ninguno'} />
      </ReviewSection>

      <ReviewSection 
        title="Hábitos Alimenticios" 
        icon={<UtensilsCrossed size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={3}
        onEdit={() => onEditStep(3)}
      >
        <Row>
          <Col xs={12} md={6}>
            <ReviewItem label="Comidas por día" value={data.comidasPorDia} />
            <ReviewItem label="Horario desayuno" value={data.horarioDesayuno} />
            <ReviewItem label="Horario comida" value={data.horarioComida} />
            <ReviewItem label="Horario cena" value={data.horarioCena} />
          </Col>
          <Col xs={12} md={6}>
            <ReviewItem label="Consume alcohol" value={data.consumeAlcohol === 'si' ? `Sí (${data.frecuenciaAlcohol})` : 'No'} />
            <ReviewItem label="Litros de agua/día" value={`${data.litrosAgua}L`} highlight />
            <ReviewItem label="Alimentos favoritos" value={data.alimentosFavoritos} />
            <ReviewItem label="Alimentos que no le gustan" value={data.alimentosNoGustan} />
          </Col>
        </Row>
      </ReviewSection>

      <ReviewSection 
        title="Actividad Física" 
        icon={<Dumbbell size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={4}
        onEdit={() => onEditStep(4)}
      >
        <ReviewItem 
          label="Realiza ejercicio" 
          value={data.realizaEjercicio === 'si' ? 
            `${ejercicioMap[data.tipoEjercicio] || data.tipoEjercicio} (${data.frecuenciaEjercicio}, ${data.duracionEjercicio})` : 
            'No realiza ejercicio regularmente'
          } 
        />
        <ReviewItem label="Horas sentado/día" value={`${data.horasQuePasaSentado}h`} />
      </ReviewSection>

      <ReviewSection 
        title="Estilo de Vida" 
        icon={<Moon size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={5}
        onEdit={() => onEditStep(5)}
      >
        <Row>
          <Col xs={12} md={6}>
            <ReviewItem label="Horas de sueño" value={`${data.horasSueno}h`} />
            <ReviewItem label="Calidad del sueño" value={calidadSuenoMap[data.calidadSueno] || data.calidadSueno} />
            <ReviewItem label="Nivel de estrés" value={`${data.nivelEstres}/10`} highlight />
          </Col>
          <Col xs={12} md={6}>
            <ReviewItem label="Fuma" value={data.fuma === 'si' ? 'Sí' : 'No'} />
            <ReviewItem label="Horario de trabajo" value={data.horarioTrabajo} />
            <ReviewItem label="Come fuera de casa" value={data.comesFuera === 'si' ? `Sí (${data.cocinasEnCasa})` : 'No'} />
          </Col>
        </Row>
      </ReviewSection>

      <ReviewSection 
        title="Objetivos" 
        icon={<Target size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={6}
        onEdit={() => onEditStep(6)}
      >
        <ReviewItem 
          label="Objetivo principal" 
          value={objetivoMap[data.objetivoPrincipal] || data.otroObjetivo || ''} 
          highlight 
        />
        <ReviewItem label="Peso meta" value={data.pesoMeta ? `${data.pesoMeta} kg` : ''} />
        <ReviewItem 
          label="Ha seguido dieta antes" 
          value={data.hasSeguirDietaAntes === 'si' ? 
            `Sí - ${data.cualDieta} (${data.resultadoDieta})` : 
            'No ha seguido dieta anteriormente'
          } 
        />
        <ReviewItem label="Motivación" value={data.motivacion} />
      </ReviewSection>

      <ReviewSection 
        title="Fotos de Progreso" 
        icon={<Camera size={18} style={{ color: 'var(--neon)' }} />}
        stepIndex={7}
        onEdit={() => onEditStep(7)}
      >
        <div className="d-flex flex-wrap gap-2 mb-3">
          <PhotoStatus uploaded={!!data.fotoFrente} label="Frente" />
          <PhotoStatus uploaded={!!data.fotoEspalda} label="Espalda" />
          <PhotoStatus uploaded={!!data.fotoPerfil} label="Perfil" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--dark-200)', margin: 0 }}>
          {([data.fotoFrente, data.fotoEspalda, data.fotoPerfil].filter(Boolean).length)}/3 fotos subidas
        </p>
      </ReviewSection>

      {/* Comentarios adicionales */}
      {data.comentariosAdicionales && (
        <ReviewSection 
          title="Comentarios Adicionales" 
          icon={<Send size={18} style={{ color: 'var(--neon)' }} />}
          stepIndex={6}
          onEdit={() => onEditStep(6)}
        >
          <p style={{ fontSize: 14, color: '#fff', margin: 0, lineHeight: 1.6 }}>
            {data.comentariosAdicionales}
          </p>
        </ReviewSection>
      )}
    </div>
  );
};

export default Step9Review;
