import React, { useRef, useCallback, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormData } from '../types';
import { Camera, Upload, X, User, RotateCcw, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { useToast } from '../components/Toast';

interface Props {
  data: FormData;
  onFileChange: (name: keyof FormData, file: File | null) => void;
}

interface CompressionInfo {
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

interface PhotoCardProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  silhouette: 'front' | 'back' | 'side';
  file: File | null;
  onFileChange: (file: File | null) => void;
  compressionInfo?: CompressionInfo | null;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ 
  label, description, icon, silhouette, file, onFileChange, compressionInfo 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxWidthOrHeight: 1920,
      maxSizeMB: 2,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error comprimiendo imagen:', error);
      return file;
    }
  };

  const handleFile = useCallback(async (f: File) => {
    if (!f.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen válida', 'warning');
      return;
    }

    // Check file size before compression
    if (f.size > 20 * 1024 * 1024) {
      showToast('La imagen es muy grande (>20MB). Se intentará comprimir.', 'warning', 5000);
    }

    setIsCompressing(true);
    
    try {
      const originalSize = f.size;
      const compressedFile = await compressImage(f);
      const compressedSize = compressedFile.size;
      
      // Store compression info for display
      const info: CompressionInfo = {
        originalSize,
        compressedSize,
        ratio: ((originalSize - compressedSize) / originalSize) * 100,
      };
      
      (compressedFile as File & { compressionInfo?: CompressionInfo }).compressionInfo = info;
      
      onFileChange(compressedFile);
      
      if (info.ratio > 10) {
        showToast(`Imagen comprimida: ${info.ratio.toFixed(0)}% menos (${formatFileSize(compressedSize)})`, 'success', 3000);
      }
    } catch (error) {
      showToast('Error al procesar la imagen, usando original', 'warning');
      onFileChange(f);
    } finally {
      setIsCompressing(false);
    }
  }, [onFileChange, showToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const getSilhouetteSVG = () => {
    if (silhouette === 'front') {
      return (
        <svg viewBox="0 0 100 160" width="60" height="96" fill="none" style={{ opacity: 0.15 }}>
          <ellipse cx="50" cy="28" rx="16" ry="18" stroke="currentColor" strokeWidth="2"/>
          <path d="M30 55 C30 45 70 45 70 55 L72 100 C72 104 68 106 65 106 L60 106 L58 150 C58 154 54 156 50 156 C46 156 42 154 42 150 L40 106 L35 106 C32 106 28 104 28 100 Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }
    if (silhouette === 'back') {
      return (
        <svg viewBox="0 0 100 160" width="60" height="96" fill="none" style={{ opacity: 0.15 }}>
          <ellipse cx="50" cy="28" rx="16" ry="18" stroke="currentColor" strokeWidth="2"/>
          <path d="M30 55 C30 45 70 45 70 55 L72 100 C72 104 68 106 65 106 L60 106 L58 150 C58 154 54 156 50 156 C46 156 42 154 42 150 L40 106 L35 106 C32 106 28 104 28 100 Z" stroke="currentColor" strokeWidth="2"/>
          <line x1="50" y1="50" x2="50" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 100 160" width="50" height="80" fill="none" style={{ opacity: 0.15 }}>
        <ellipse cx="50" cy="28" rx="14" ry="18" stroke="currentColor" strokeWidth="2"/>
        <path d="M40 50 C38 45 55 45 58 50 L62 100 C62 104 58 106 55 106 L53 106 L52 150 C52 154 48 156 46 156 C44 156 42 154 42 150 L41 106 L38 106 C35 106 32 104 32 100 Z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className="photo-upload-card"
      style={{
        borderColor: dragOver ? 'var(--neon)' : preview ? 'rgba(181,247,39,0.3)' : 'var(--dark-400)',
        background: dragOver ? 'rgba(181,247,39,0.05)' : preview ? 'rgba(181,247,39,0.03)' : 'var(--dark-700)',
        boxShadow: dragOver ? '0 0 30px rgba(181,247,39,0.15)' : preview ? '0 0 20px rgba(181,247,39,0.08)' : 'none',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {isCompressing ? (
        /* ===== COMPRESSION MODE ===== */
        <div className="photo-upload-content">
          <div className="photo-upload-icon-wrap" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
            <Loader2 size={28} style={{ color: 'var(--neon)' }} className="animate-spin" />
          </div>
          <h4 className="photo-card-title">Comprimiendo...</h4>
          <p className="photo-card-desc">Optimizando imagen para envío</p>
          <div style={{ 
            width: '80%', 
            height: 4, 
            background: 'var(--dark-500)', 
            borderRadius: 2,
            marginTop: 16,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: '60%',
              background: 'var(--neon)',
              borderRadius: 2,
              animation: 'progress 1.5s ease-in-out infinite',
            }} />
          </div>
        </div>
      ) : preview ? (
        /* ===== PREVIEW MODE ===== */
        <div className="photo-preview-container">
          <img src={preview} alt={label} className="photo-preview-image" />
          <div className="photo-preview-overlay">
            <button onClick={handleRemove} className="photo-remove-btn" type="button">
              <X size={18} />
            </button>
            <div className="photo-preview-actions">
              <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="photo-change-btn" type="button">
                <RotateCcw size={14} />
                Cambiar
              </button>
            </div>
          </div>
          <div className="photo-label-badge">
            {icon}
            <span>{label}</span>
          </div>
          {compressionInfo && compressionInfo.ratio > 5 && (
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(181,247,39,0.9)',
              color: 'var(--dark-900)',
              fontSize: 11,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <CheckCircle size={12} />
              -{compressionInfo.ratio.toFixed(0)}%
            </div>
          )}
        </div>
      ) : (
        /* ===== UPLOAD MODE ===== */
        <div className="photo-upload-content">
          <div className="photo-silhouette">
            {getSilhouetteSVG()}
          </div>
          <div className="photo-upload-icon-wrap">
            <Camera size={28} style={{ color: 'var(--neon)' }} />
          </div>
          <h4 className="photo-card-title">{label}</h4>
          <p className="photo-card-desc">{description}</p>
          <div className="photo-upload-action">
            <Upload size={14} />
            <span>Subir foto</span>
          </div>
          <p className="photo-card-format">JPG, PNG o HEIC • Auto-comprime</p>
        </div>
      )}
    </div>
  );
};

const Step8Fotos: React.FC<Props> = ({ data, onFileChange }) => {
  // Helper to get compression info from file
  const getCompressionInfo = (file: File | null): CompressionInfo | null => {
    if (!file) return null;
    const info = (file as File & { compressionInfo?: CompressionInfo }).compressionInfo;
    return info || null;
  };

  return (
    <div className="animate-fade-in-up">
    {/* Header */}
    <div className="mb-4 mb-md-5">
      <div className="section-header">
        <div className="section-icon">
          <Camera size={24} />
        </div>
        <div>
          <h2 className="section-title">Fotos de Progreso</h2>
        </div>
      </div>
      <p className="section-subtitle mt-2">
        Sube 3 fotos para evaluar tu punto de partida y diseñar tu plan ideal. 📸
      </p>
    </div>

    <hr style={{ borderColor: 'var(--dark-500)', marginBottom: 28 }} />

    {/* Instructions */}
    <Row className="mb-4">
      <Col xs={12}>
        <div className="info-card" style={{ background: 'rgba(181,247,39,0.04)', border: '1px solid rgba(181,247,39,0.12)' }}>
          <div className="d-flex align-items-start gap-3">
            <div style={{
              width: 44, height: 44, minWidth: 44, borderRadius: 12,
              background: 'rgba(181,247,39,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertCircle size={22} style={{ color: 'var(--neon)' }} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                📋 Instrucciones para las fotos
              </h4>
              <Row className="g-2">
                <Col xs={12} md={6}>
                  <ul className="photo-instructions-list">
                    <li><User size={13} /> <strong>Mujeres:</strong> Licra corta y top deportivo</li>
                    <li><User size={13} /> <strong>Varones:</strong> Boxer o short corto</li>
                  </ul>
                </Col>
                <Col xs={12} md={6}>
                  <ul className="photo-instructions-list">
                    <li>💡 Buena iluminación, fondo claro</li>
                    <li>📏 Cuerpo completo, de pies a cabeza</li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Col>
    </Row>

    {/* Photo Upload Cards */}
    <Row className="g-4 mb-4">
      <Col xs={12} md={4}>
        <PhotoCard
          label="Foto de Frente"
          description="Posición natural, brazos relajados a los costados"
          icon={<User size={14} />}
          silhouette="front"
          file={data.fotoFrente}
          onFileChange={(f) => onFileChange('fotoFrente', f)}
          compressionInfo={getCompressionInfo(data.fotoFrente)}
        />
      </Col>
      <Col xs={12} md={4}>
        <PhotoCard
          label="Foto de Espalda"
          description="Misma posición, de espaldas a la cámara"
          icon={<RotateCcw size={14} />}
          silhouette="back"
          file={data.fotoEspalda}
          onFileChange={(f) => onFileChange('fotoEspalda', f)}
          compressionInfo={getCompressionInfo(data.fotoEspalda)}
        />
      </Col>
      <Col xs={12} md={4}>
        <PhotoCard
          label="Foto de Perfil"
          description="De lado (derecho o izquierdo), postura natural"
          icon={<User size={14} />}
          silhouette="side"
          file={data.fotoPerfil}
          onFileChange={(f) => onFileChange('fotoPerfil', f)}
          compressionInfo={getCompressionInfo(data.fotoPerfil)}
        />
      </Col>
    </Row>

    {/* Status Summary */}
    <Row>
      <Col xs={12}>
        <div style={{
          background: 'var(--dark-700)', borderRadius: 16, padding: '20px 24px',
          border: '1px solid var(--dark-500)',
        }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <Camera size={18} style={{ color: 'var(--dark-200)' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark-100)' }}>
                Estado de fotos:
              </span>
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {[
                { label: 'Frente', done: !!data.fotoFrente },
                { label: 'Espalda', done: !!data.fotoEspalda },
                { label: 'Perfil', done: !!data.fotoPerfil },
              ].map((item) => (
                <div key={item.label} className="d-flex align-items-center gap-2" style={{
                  padding: '6px 14px', borderRadius: 10,
                  background: item.done ? 'rgba(181,247,39,0.1)' : 'var(--dark-600)',
                  border: `1px solid ${item.done ? 'rgba(181,247,39,0.25)' : 'var(--dark-400)'}`,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: item.done ? 'var(--neon)' : 'var(--dark-300)',
                    boxShadow: item.done ? '0 0 8px rgba(181,247,39,0.5)' : 'none',
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.done ? 'var(--neon)' : 'var(--dark-200)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>

    {/* Privacy note */}
    <Row className="mt-4">
      <Col xs={12}>
        <div className="info-card neon-border">
          <div className="d-flex align-items-center gap-3">
            <div style={{
              width: 44, height: 44, minWidth: 44, borderRadius: 12,
              background: 'rgba(181,247,39,0.08)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              🔒
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                Tus fotos son 100% confidenciales
              </h4>
              <p style={{ fontSize: 13, color: 'var(--dark-100)', margin: 0, lineHeight: 1.5 }}>
                Se almacenan en una carpeta privada de Google Drive. Solo tu nutricionista tiene acceso.
                Nunca serán compartidas con terceros.
              </p>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
  );
};

export default Step8Fotos;
