export interface FormData {
  // Step 1: Datos Personales
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  genero: string;
  ocupacion: string;
  ciudad: string;

  // Step 2: Medidas Corporales
  peso: string;
  estatura: string;
  circunferenciaCintura: string;
  circunferenciaCadera: string;
  circunferenciaCuello: string;
  circunferenciaPierna: string;
  circunferenciaBrazo: string;
  porcentajeGrasa: string;

  // Step 3: Historial de Salud
  enfermedades: string[];
  otraEnfermedad: string;
  alergias: string;
  medicamentos: string;
  suplementos: string;
  problemasDigestivos: string[];
  otroProblemaDigestivo: string;

  // Step 4: Hábitos Alimenticios
  comidasPorDia: string;
  horarioDesayuno: string;
  horarioComida: string;
  horarioCena: string;
  consumeSnacks: string;
  tipoSnacks: string;
  litrosAgua: string;
  consumeAlcohol: string;
  frecuenciaAlcohol: string;
  alimentosNoGustan: string;
  alimentosFavoritos: string;
  restriccionDieta: string[];
  otraRestriccion: string;
  // Macronutrientes disponibles
  carbsSelect: string[];
  proteinasSelect: string[];
  grasasSelect: string[];

  // Step 5: Actividad Física
  realizaEjercicio: string;
  tipoEjercicio: string;
  frecuenciaEjercicio: string;
  duracionEjercicio: string;
  horasQuePasaSentado: string;

  // Step 6: Estilo de Vida
  horasSueno: string;
  calidadSueno: string;
  nivelEstres: string;
  fuma: string;
  horarioTrabajo: string;
  cocinasEnCasa: string;
  comesFuera: string;

  // Step 7: Objetivos
  objetivoPrincipal: string;
  otroObjetivo: string;
  pesoMeta: string;
  hasSeguirDietaAntes: string;
  cualDieta: string;
  resultadoDieta: string;
  motivacion: string;
  comentariosAdicionales: string;

  // Step 8: Fotos
  fotoFrente: File | null;
  fotoEspalda: File | null;
  fotoPerfil: File | null;
}

export const initialFormData: FormData = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  fechaNacimiento: '',
  genero: '',
  ocupacion: '',
  ciudad: '',
  peso: '',
  estatura: '',
  circunferenciaCintura: '',
  circunferenciaCadera: '',
  circunferenciaCuello: '',
  circunferenciaPierna: '',
  circunferenciaBrazo: '',
  porcentajeGrasa: '',
  enfermedades: [],
  otraEnfermedad: '',
  alergias: '',
  medicamentos: '',
  suplementos: '',
  problemasDigestivos: [],
  otroProblemaDigestivo: '',
  comidasPorDia: '3',
  horarioDesayuno: '',
  horarioComida: '',
  horarioCena: '',
  consumeSnacks: '',
  tipoSnacks: '',
  litrosAgua: '2',
  consumeAlcohol: '',
  frecuenciaAlcohol: '',
  alimentosNoGustan: '',
  alimentosFavoritos: '',
  restriccionDieta: [],
  otraRestriccion: '',
  carbsSelect: [],
  proteinasSelect: [],
  grasasSelect: [],
  realizaEjercicio: '',
  tipoEjercicio: '',
  frecuenciaEjercicio: '',
  duracionEjercicio: '',
  horasQuePasaSentado: '',
  horasSueno: '7',
  calidadSueno: '',
  nivelEstres: '5',
  fuma: '',
  horarioTrabajo: '',
  cocinasEnCasa: '',
  comesFuera: '',
  objetivoPrincipal: '',
  otroObjetivo: '',
  pesoMeta: '',
  hasSeguirDietaAntes: '',
  cualDieta: '',
  resultadoDieta: '',
  motivacion: '',
  comentariosAdicionales: '',
  fotoFrente: null,
  fotoEspalda: null,
  fotoPerfil: null,
};
