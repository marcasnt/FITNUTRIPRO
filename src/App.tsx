import React, { useState, useCallback, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FormData, initialFormData } from './types';
import StepIndicator from './components/StepIndicator';
import Step1Personal from './steps/Step1Personal';
import Step2Medidas from './steps/Step2Medidas';
import Step3Salud from './steps/Step3Salud';
import Step4Alimentacion from './steps/Step4Alimentacion';
import Step5Ejercicio from './steps/Step5Ejercicio';
import Step6Lifestyle from './steps/Step6Lifestyle';
import Step7Objetivos from './steps/Step7Objetivos';
import Step8Fotos from './steps/Step8Fotos';
import {
  ArrowLeft, ArrowRight, Send, Dumbbell, CheckCircle, Sparkles,
  Shield, Clock, Heart, Instagram, Phone, Mail, Flame, Zap,
  Trophy, Target, ChevronDown,
} from 'lucide-react';

type Page = 'landing' | 'form' | 'success';
const TOTAL_STEPS = 8;

// 🔗 GOOGLE APPS SCRIPT URL — Conectado y funcional
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz17w0PL8O-v8hK6y6N_xjJwdnNyFnI7NRtmhpBmdd6Ey2Yi-vuqgWX_qLP607maHfm/exec';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }, []
  );
  const handleRadioChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleCheckboxChange = useCallback((name: keyof FormData, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  }, []);
  const handleSliderChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);
  const handleFileChange = useCallback((name: keyof FormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  }, []);

  const nextStep = () => { if (currentStep < TOTAL_STEPS - 1) { setCurrentStep((p) => p + 1); scrollToTop(); } };
  const prevStep = () => { if (currentStep > 0) { setCurrentStep((p) => p - 1); scrollToTop(); } };
  const goToStep = (step: number) => { setCurrentStep(step); scrollToTop(); };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Preparar datos de texto (sin archivos)
      const textData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (key === 'fotoFrente' || key === 'fotoEspalda' || key === 'fotoPerfil') continue;
        if (Array.isArray(value)) {
          textData[key] = value.join(', ');
        } else {
          textData[key] = value;
        }
      }

      // Convertir fotos a base64
      const fotos: Record<string, string> = {};
      let fotosSizeMB = 0;
      
      if (formData.fotoFrente) {
        fotos.fotoFrente = await fileToBase64(formData.fotoFrente);
        fotosSizeMB += fotos.fotoFrente.length * 0.75 / 1024 / 1024;
      }
      if (formData.fotoEspalda) {
        fotos.fotoEspalda = await fileToBase64(formData.fotoEspalda);
        fotosSizeMB += fotos.fotoEspalda.length * 0.75 / 1024 / 1024;
      }
      if (formData.fotoPerfil) {
        fotos.fotoPerfil = await fileToBase64(formData.fotoPerfil);
        fotosSizeMB += fotos.fotoPerfil.length * 0.75 / 1024 / 1024;
      }

      // Validar tamaño del payload
      if (fotosSizeMB > 45) {
        alert(`Las fotos son muy grandes (${fotosSizeMB.toFixed(1)} MB total). El límite es 50MB. Por favor comprime las imágenes.`);
        setIsSubmitting(false);
        return;
      }

      const payload = { ...textData, ...fotos };
      const payloadSizeMB = JSON.stringify(payload).length / 1024 / 1024;
      
      console.log('📤 Enviando payload...');
      console.log('   Tamaño estimado:', payloadSizeMB.toFixed(2), 'MB');
      console.log('   URL:', GOOGLE_SCRIPT_URL);
      console.log('   Datos:', Object.keys(payload));

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('✅ Respuesta recibida:', response.status, response.type);
      
      setPage('success');
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      
      let errorMsg = 'Hubo un error al enviar. ';
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMsg += 'No se pudo conectar con el servidor. Verifica:\n' +
          '1. Que la URL del script esté correcta\n' +
          '2. Que el script esté implementado como "Aplicación web"\n' +
          '3. Que el acceso sea "Cualquier persona"';
      } else if (error instanceof Error && error.message.includes('timeout')) {
        errorMsg += 'El servidor tardó demasiado en responder. Las fotos pueden ser muy grandes.';
      } else {
        errorMsg += 'Por favor intenta de nuevo.';
      }
      
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1Personal data={formData} onChange={handleInputChange} onRadioChange={handleRadioChange} />;
      case 1: return <Step2Medidas data={formData} onChange={handleInputChange} />;
      case 2: return <Step3Salud data={formData} onChange={handleInputChange} onCheckboxChange={handleCheckboxChange} />;
      case 3: return <Step4Alimentacion data={formData} onChange={handleInputChange} onRadioChange={handleRadioChange} onCheckboxChange={handleCheckboxChange} onSliderChange={handleSliderChange} />;
      case 4: return <Step5Ejercicio data={formData} onChange={handleInputChange} onRadioChange={handleRadioChange} />;
      case 5: return <Step6Lifestyle data={formData} onRadioChange={handleRadioChange} onSliderChange={handleSliderChange} onSelectChange={handleInputChange} />;
      case 6: return <Step7Objetivos data={formData} onChange={handleInputChange} onRadioChange={handleRadioChange} />;
      case 7: return <Step8Fotos data={formData} onFileChange={handleFileChange} />;
      default: return null;
    }
  };

  // ==========================================
  // ============= LANDING PAGE ===============
  // ==========================================
  if (page === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark-900)', color: '#fff', overflow: 'hidden' }}>
        {/* ===== HERO ===== */}
        <header style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* BG Effects */}
          <div className="grid-pattern" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', top: 0, left: '25%', width: 500, height: 500, background: 'rgba(181,247,39,0.04)', borderRadius: '50%', filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: '25%', width: 400, height: 400, background: 'rgba(34,197,94,0.04)', borderRadius: '50%', filter: 'blur(100px)' }} />

          {/* Nav */}
          <nav style={{ position: 'relative', zIndex: 10 }}>
            <Container>
              <Row className="py-4">
                <Col xs={6} className="d-flex align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{
                      width: 44, height: 44, background: 'var(--neon)', borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Dumbbell size={22} strokeWidth={3} style={{ color: 'var(--dark-900)' }} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 900, fontSize: 22, color: '#fff' }}>FitNutri</span>
                      <span style={{ fontWeight: 900, fontSize: 22, color: 'var(--neon)' }}>Pro</span>
                    </div>
                  </div>
                </Col>
                <Col xs={6} className="d-flex align-items-center justify-content-end">
                  <button
                    onClick={() => { setPage('form'); window.scrollTo({ top: 0 }); }}
                    className="btn-neon"
                    style={{ padding: '10px 24px', fontSize: 13 }}
                  >
                    Empezar
                  </button>
                </Col>
              </Row>
            </Container>
          </nav>

          {/* Hero Content */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center' }}>
            <Container>
              <Row className="align-items-center gy-5">
                {/* Left Text */}
                <Col xs={12} lg={7} className="order-2 order-lg-1">
                  <div className="animate-fade-in-up">
                    {/* Badge */}
                    <div className="d-inline-flex align-items-center gap-2 mb-4" style={{
                      padding: '10px 20px', background: 'rgba(181,247,39,0.08)',
                      border: '1px solid rgba(181,247,39,0.15)', borderRadius: 50,
                    }}>
                      <Flame size={16} style={{ color: 'var(--neon)' }} />
                      <span style={{ color: 'var(--neon)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Asesoría Nutricional Fitness
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-bebas" style={{
                      fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 900,
                      textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.01em',
                    }}>
                      <span style={{ color: '#fff' }}>Transforma</span><br />
                      <span style={{ color: '#fff' }}>tu </span>
                      <span className="shimmer-text">cuerpo,</span><br />
                      <span style={{ color: '#fff' }}>domina tu</span><br />
                      <span className="gradient-text-fitness">nutrición</span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{ color: 'var(--dark-100)', marginTop: 24, maxWidth: 520, fontSize: 17, lineHeight: 1.7 }}>
                      Completa el formulario y obtén un plan nutricional
                      <span style={{ color: 'var(--neon)', fontWeight: 600 }}> diseñado exclusivamente para ti</span>,
                      basado en tu training, tu estilo de vida y tus metas fitness.
                    </p>

                    {/* Buttons */}
                    <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                      <button
                        onClick={() => { setPage('form'); window.scrollTo({ top: 0 }); }}
                        className="btn-neon btn-neon-lg animate-pulse-neon"
                      >
                        <Zap size={22} strokeWidth={3} />
                        Comenzar ahora
                      </button>
                      <a href="#como-funciona" className="btn-outline-dark" style={{ textDecoration: 'none' }}>
                        ¿Cómo funciona?
                        <ChevronDown size={18} />
                      </a>
                    </div>

                    {/* Stats */}
                    <Row className="mt-5 g-3" style={{ maxWidth: 440 }}>
                      {[
                        { num: '500+', label: 'Clientes' },
                        { num: '98%', label: 'Satisfacción' },
                        { num: '5.0', label: 'Rating ⭐' },
                      ].map((s) => (
                        <Col xs={4} key={s.label}>
                          <div className="text-center" style={{
                            padding: '16px 12px', borderRadius: 16,
                            background: 'rgba(26,26,26,0.6)', border: '1px solid var(--dark-500)',
                          }}>
                            <p className="font-bebas mb-0" style={{ fontSize: 28, fontWeight: 900, color: 'var(--neon)', letterSpacing: '0.05em' }}>
                              {s.num}
                            </p>
                            <p className="mb-0" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--dark-200)', marginTop: 4 }}>
                              {s.label}
                            </p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>

                {/* Right Visual */}
                <Col xs={12} lg={5} className="order-1 order-lg-2 d-flex justify-content-center">
                  <div style={{ position: 'relative', width: 'min(360px, 80vw)', height: 'min(360px, 80vw)' }}>
                    {/* Ring */}
                    <div className="animate-spin-slow" style={{
                      position: 'absolute', inset: 0, borderRadius: '50%',
                      border: '2px dashed rgba(181,247,39,0.15)',
                    }} />
                    <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', border: '1px solid rgba(181,247,39,0.08)' }} />
                    {/* Center */}
                    <div className="neon-glow" style={{
                      position: 'absolute', inset: '18%', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--dark-600), var(--dark-800))',
                      border: '1px solid rgba(181,247,39,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div className="text-center">
                        <Dumbbell size={48} style={{ color: 'var(--neon)', marginBottom: 12 }} strokeWidth={2} />
                        <p className="font-bebas mb-0" style={{ fontSize: 24, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Fit</p>
                        <p className="font-bebas mb-0" style={{ fontSize: 24, fontWeight: 900, color: 'var(--neon)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Nutri</p>
                        <p className="mb-0" style={{ fontSize: 10, fontWeight: 700, color: 'var(--dark-200)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 4 }}>Pro</p>
                      </div>
                    </div>
                    {/* Floating badges */}
                    <div className="animate-float d-none d-sm-block" style={{
                      position: 'absolute', top: 15, right: 10, padding: '10px 16px',
                      background: 'var(--dark-700)', borderRadius: 14, border: '1px solid var(--dark-400)',
                    }}>
                      <span style={{ fontWeight: 700, color: 'var(--neon)', fontSize: 13 }}>💪 Muscle</span>
                    </div>
                    <div className="animate-float d-none d-sm-block" style={{
                      position: 'absolute', bottom: 20, left: 5, padding: '10px 16px',
                      background: 'var(--dark-700)', borderRadius: 14, border: '1px solid var(--dark-400)',
                      animationDelay: '1s',
                    }}>
                      <span style={{ fontWeight: 700, color: 'var(--neon-light)', fontSize: 13 }}>🔥 Fat Loss</span>
                    </div>
                    <div className="animate-float d-none d-sm-block" style={{
                      position: 'absolute', top: '50%', left: -20, padding: '10px 16px',
                      background: 'var(--dark-700)', borderRadius: 14, border: '1px solid var(--dark-400)',
                      animationDelay: '2s',
                    }}>
                      <span style={{ fontWeight: 700, color: '#4ade80', fontSize: 13 }}>🥗 Nutrition</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          {/* Scroll indicator */}
          <div className="text-center pb-4" style={{ position: 'relative', zIndex: 10 }}>
            <ChevronDown size={24} style={{ color: 'var(--dark-300)', animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </header>

        {/* ===== HOW IT WORKS ===== */}
        <section id="como-funciona" style={{ position: 'relative', padding: '80px 0' }}>
          <div className="diagonal-stripes" style={{ position: 'absolute', inset: 0 }} />
          <Container style={{ position: 'relative' }}>
            <Row className="justify-content-center mb-5">
              <Col xs={12} className="text-center">
                <p className="mb-2" style={{ color: 'var(--neon)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>El proceso</p>
                <h2 className="font-bebas" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
                  ¿Cómo funciona?
                </h2>
              </Col>
            </Row>

            <Row className="g-4">
              {[
                { icon: <ClipboardIcon />, step: '01', title: 'Llena el formulario', desc: 'Responde sobre tu salud, hábitos, training y objetivos. Solo 5-10 minutos.', accent: 'linear-gradient(135deg, var(--neon), var(--neon-dark))' },
                { icon: <Sparkles size={28} />, step: '02', title: 'Análisis PRO', desc: 'Analizo cada detalle para crear el plan nutricional perfecto para tus metas.', accent: 'linear-gradient(135deg, #60a5fa, #6366f1)' },
                { icon: <Trophy size={28} />, step: '03', title: 'Recibe tu plan', desc: 'Plan nutricional personalizado con menús, macros y seguimiento profesional.', accent: 'linear-gradient(135deg, #fb923c, #ef4444)' },
              ].map((item) => (
                <Col xs={12} md={4} key={item.step}>
                  <div style={{
                    position: 'relative', padding: '36px 30px', borderRadius: 20,
                    background: 'var(--dark-800)', border: '1px solid var(--dark-500)',
                    transition: 'all 0.3s ease', height: '100%',
                  }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 18, background: item.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--dark-900)', marginBottom: 24,
                    }}>
                      {item.icon}
                    </div>
                    <span className="font-bebas" style={{
                      fontSize: 60, fontWeight: 900, color: 'var(--dark-600)',
                      position: 'absolute', top: 20, right: 24,
                    }}>
                      {item.step}
                    </span>
                    <h3 className="font-bebas" style={{ fontSize: 24, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--dark-100)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ===== FEATURES ===== */}
        <section style={{ padding: '80px 0' }}>
          <Container>
            <Row className="justify-content-center mb-5">
              <Col xs={12} className="text-center">
                <p className="mb-2" style={{ color: 'var(--neon)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Ventajas</p>
                <h2 className="font-bebas" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
                  ¿Por qué entrenar conmigo?
                </h2>
              </Col>
            </Row>

            <Row className="g-4">
              {[
                { icon: <Target size={26} style={{ color: 'var(--neon)' }} />, title: '100% Personal', desc: 'Nada genérico. Todo a tu medida.' },
                { icon: <Shield size={26} style={{ color: '#60a5fa' }} />, title: 'Confidencial', desc: 'Tu info está protegida y segura.' },
                { icon: <Clock size={26} style={{ color: '#fbbf24' }} />, title: 'Seguimiento', desc: 'Te acompaño en cada fase.' },
                { icon: <Heart size={26} style={{ color: '#f87171' }} />, title: 'Resultados', desc: 'Planes basados en ciencia.' },
              ].map((feat) => (
                <Col xs={12} sm={6} lg={3} key={feat.title}>
                  <div className="text-center" style={{
                    padding: '32px 24px', borderRadius: 20,
                    background: 'var(--dark-800)', border: '1px solid var(--dark-500)',
                    transition: 'all 0.3s ease', height: '100%',
                  }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: 'var(--dark-700)', border: '1px solid var(--dark-400)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}>
                      {feat.icon}
                    </div>
                    <h3 className="font-bebas" style={{ fontSize: 20, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                      {feat.title}
                    </h3>
                    <p style={{ color: 'var(--dark-100)', fontSize: 14, margin: 0 }}>{feat.desc}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ===== CTA ===== */}
        <section style={{ padding: '80px 0', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--dark-900), var(--dark-800), var(--dark-900))' }} />
          <Container style={{ position: 'relative' }}>
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={8} className="text-center">
                <div className="animate-heartbeat d-inline-flex align-items-center justify-content-center mx-auto mb-4" style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(181,247,39,0.08)', border: '1px solid rgba(181,247,39,0.15)',
                }}>
                  <Flame size={36} style={{ color: 'var(--neon)' }} />
                </div>
                <h2 className="font-bebas" style={{
                  fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, color: '#fff',
                  textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 16,
                }}>
                  ¿Ready para tu<br />
                  <span className="gradient-text-fitness">transformación?</span>
                </h2>
                <p style={{ color: 'var(--dark-100)', fontSize: 17, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                  No esperes más. El mejor momento para cambiar tu nutrición es{' '}
                  <span style={{ color: 'var(--neon)', fontWeight: 700 }}>AHORA</span>.
                </p>
                <button
                  onClick={() => { setPage('form'); window.scrollTo({ top: 0 }); }}
                  className="btn-neon btn-neon-lg animate-pulse-neon"
                >
                  <Zap size={24} strokeWidth={3} />
                  ¡Vamos con todo!
                </button>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ===== FOOTER ===== */}
        <footer style={{ background: 'var(--dark-800)', borderTop: '1px solid var(--dark-600)', padding: '48px 0' }}>
          <Container>
            <Row className="align-items-center gy-4">
              <Col xs={12} sm={6} className="text-center text-sm-start">
                <div className="d-flex align-items-center gap-2 justify-content-center justify-content-sm-start">
                  <div style={{
                    width: 36, height: 36, background: 'var(--neon)', borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Dumbbell size={16} strokeWidth={3} style={{ color: 'var(--dark-900)' }} />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>FitNutri<span style={{ color: 'var(--neon)' }}>Pro</span></span>
                </div>
              </Col>
              <Col xs={12} sm={6} className="text-center text-sm-end">
                <div className="d-flex align-items-center gap-4 justify-content-center justify-content-sm-end" style={{ color: 'var(--dark-200)' }}>
                  <a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }}><Instagram size={20} /></a>
                  <a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }}><Phone size={20} /></a>
                  <a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }}><Mail size={20} /></a>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <hr style={{ borderColor: 'var(--dark-600)', margin: '24px 0' }} />
                <p className="text-center mb-0" style={{ color: 'var(--dark-200)', fontSize: 13 }}>
                  © {new Date().getFullYear()} FitNutriPro — Todos los derechos reservados. 💪
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
  }

  // ==========================================
  // ============= SUCCESS PAGE ===============
  // ==========================================
  if (page === 'success') {
    return (
      <div className="grid-pattern" style={{ minHeight: '100vh', background: 'var(--dark-900)', display: 'flex', alignItems: 'center', padding: '40px 0' }}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} className="text-center animate-fade-in-up">
              <div className="animate-pulse-neon d-inline-flex align-items-center justify-content-center mb-4" style={{
                width: 100, height: 100, background: 'var(--neon)', borderRadius: 24, transform: 'rotate(3deg)',
              }}>
                <CheckCircle size={48} strokeWidth={3} style={{ color: 'var(--dark-900)' }} />
              </div>

              <h1 className="font-bebas" style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: '#fff',
                textTransform: 'uppercase', marginBottom: 12,
              }}>
                ¡Formulario enviado! 🔥
              </h1>

              <p style={{ color: 'var(--dark-100)', fontSize: 18, marginBottom: 8 }}>
                Gracias, <strong style={{ color: 'var(--neon)' }}>{formData.nombre || 'crack'}</strong>.
              </p>
              <p style={{ color: 'var(--dark-200)', marginBottom: 32, fontSize: 15 }}>
                En las próximas <strong style={{ color: '#fff' }}>24-48 horas</strong> recibirás
                tu plan nutricional personalizado por correo. ¡Prepárate! 💪
              </p>

              {/* Resumen */}
              <div style={{
                background: 'var(--dark-800)', borderRadius: 20, padding: '28px 28px',
                border: '1px solid var(--dark-500)', textAlign: 'left', marginBottom: 32,
              }}>
                <h3 className="d-flex align-items-center gap-2 mb-4" style={{
                  fontWeight: 900, color: '#fff', textTransform: 'uppercase', fontSize: 13, letterSpacing: '0.08em',
                }}>
                  <Sparkles size={18} style={{ color: 'var(--neon)' }} />
                  Resumen
                </h3>
                {[
                  { label: 'Nombre', value: `${formData.nombre} ${formData.apellido}` },
                  { label: 'Email', value: formData.email },
                  {
                    label: 'Objetivo',
                    value: formData.objetivoPrincipal === 'bajar_peso' ? '⬇️ Bajar de peso' :
                      formData.objetivoPrincipal === 'subir_peso' ? '⬆️ Subir de peso' :
                      formData.objetivoPrincipal === 'ganar_musculo' ? '💪 Ganar músculo' :
                      formData.objetivoPrincipal === 'mejorar_salud' ? '❤️ Mejorar salud' :
                      formData.objetivoPrincipal === 'rendimiento' ? '🏆 Rendimiento' :
                      formData.objetivoPrincipal === 'habitos' ? '🔄 Mejorar hábitos' :
                      formData.objetivoPrincipal === 'recomposicion' ? '🔥 Recomposición' :
                      formData.otroObjetivo || '—'
                  },
                  ...(formData.peso ? [{ label: 'Peso actual', value: `${formData.peso} kg` }] : []),
                  { label: 'Fotos', value: `${[formData.fotoFrente, formData.fotoEspalda, formData.fotoPerfil].filter(Boolean).length}/3 subidas 📸` },
                ].map((row) => (
                  <div key={row.label} className="d-flex justify-content-between align-items-center" style={{
                    padding: '14px 0', borderBottom: '1px solid var(--dark-600)', fontSize: 14,
                  }}>
                    <span style={{ color: 'var(--dark-200)', fontWeight: 500 }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setPage('landing'); setCurrentStep(0); setFormData(initialFormData); }}
                className="btn-neon"
              >
                Volver al inicio
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // ==========================================
  // ============== FORM PAGE =================
  // ==========================================
  return (
    <div ref={formRef} className="grid-pattern" style={{ minHeight: '100vh', background: 'var(--dark-900)' }}>
      {/* ===== Sticky Header ===== */}
      <div style={{
        background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--dark-600)', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Container>
          <Row className="py-3 align-items-center">
            <Col xs={4}>
              <button
                onClick={() => setPage('landing')}
                className="d-flex align-items-center gap-2"
                style={{
                  background: 'none', border: 'none', color: 'var(--dark-200)',
                  cursor: 'pointer', fontWeight: 700, fontSize: 13, textTransform: 'uppercase',
                  letterSpacing: '0.08em', fontFamily: 'Outfit, sans-serif', padding: 0,
                }}
              >
                <ArrowLeft size={18} />
                <span className="d-none d-sm-inline">Volver</span>
              </button>
            </Col>
            <Col xs={4} className="text-center">
              <div className="d-flex align-items-center gap-2 justify-content-center">
                <div style={{
                  width: 32, height: 32, background: 'var(--neon)', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Dumbbell size={14} strokeWidth={3} style={{ color: 'var(--dark-900)' }} />
                </div>
                <span style={{ fontWeight: 900, color: '#fff', fontSize: 14 }}>
                  FitNutri<span style={{ color: 'var(--neon)' }}>Pro</span>
                </span>
              </div>
            </Col>
            <Col xs={4} className="text-end">
              <span className="font-bebas" style={{ fontSize: 22, fontWeight: 900, color: 'var(--neon)', letterSpacing: '0.1em' }}>
                {currentStep + 1}/{TOTAL_STEPS}
              </span>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ===== Progress Bar ===== */}
      <div className="progress-neon">
        <div className="progress-fill" style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* ===== Form Content ===== */}
      <Container className="py-4 py-md-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={9}>
            {/* Step Indicator */}
            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

            {/* Form Card */}
            <div className="form-card">
              {renderStep()}

              {/* Navigation */}
              <hr style={{ borderColor: 'var(--dark-500)', margin: '32px 0 28px' }} />

              <Row className="align-items-center">
                <Col xs={6}>
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 20px', borderRadius: 14, fontWeight: 700,
                      fontSize: 14, transition: 'all 0.2s', cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      background: 'transparent', border: 'none', fontFamily: 'Outfit, sans-serif',
                      color: currentStep === 0 ? 'var(--dark-400)' : 'var(--dark-100)',
                    }}
                  >
                    <ArrowLeft size={18} />
                    <span className="d-none d-sm-inline">Anterior</span>
                  </button>
                </Col>
                <Col xs={6} className="text-end">
                  {currentStep < TOTAL_STEPS - 1 ? (
                    <button onClick={nextStep} className="btn-neon">
                      Siguiente
                      <ArrowRight size={18} strokeWidth={3} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={isSubmitting} className="btn-neon" style={{ opacity: isSubmitting ? 0.6 : 1 }}>
                      {isSubmitting ? (
                        <>
                          <div style={{
                            width: 20, height: 20, border: '2px solid rgba(10,10,10,0.3)',
                            borderTop: '2px solid var(--dark-900)', borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }} />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar 🔥
                          <Send size={18} strokeWidth={3} />
                        </>
                      )}
                    </button>
                  )}
                </Col>
              </Row>
            </div>

            {/* Security note */}
            <div className="d-flex align-items-center justify-content-center gap-2 mt-4" style={{ fontSize: 12, color: 'var(--dark-300)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Shield size={14} />
              <span>Tu información es 100% confidencial</span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const ClipboardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

export default App;
