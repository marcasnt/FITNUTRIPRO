// ============================================================
// 🏋️ FitNutriPro — Google Apps Script Backend
// ============================================================
// Este script recibe los datos del formulario web,
// los guarda en Google Sheets y sube las fotos a Google Drive.
// ============================================================

// ═══════════════════════════════════════════════════════════
// 📌 CONFIGURACIÓN — CAMBIA ESTOS VALORES
// ═══════════════════════════════════════════════════════════
const SPREADSHEET_ID = '1iNW0H7Asb_2m5YsOy63v1TGmjWDugplRAOdPNbwVuIk';
const NOMBRE_HOJA = 'NOVATOS 2026';
const NOMBRE_CARPETA_RAIZ = 'FitNutriPro - Fotos Clientes';

// ═══════════════════════════════════════════════════════════
// 📌 COLUMNAS — En el mismo orden que los encabezados del Sheet
// ═════════════════════════════════════════════════════════
const COLUMNAS = [
  'fechaRegistro',
  'nombre',
  'apellido',
  'email',
  'telefono',
  'fechaNacimiento',
  'genero',
  'ocupacion',
  'ciudad',
  'peso',
  'estatura',
  'imc',
  'circunferenciaCintura',
  'circunferenciaCadera',
  'circunferenciaCuello',
  'circunferenciaPierna',
  'circunferenciaBrazo',
  'porcentajeGrasa',
  'enfermedades',
  'otraEnfermedad',
  'alergias',
  'medicamentos',
  'suplementos',
  'problemasDigestivos',
  'otroProblemaDigestivo',
  'comidasPorDia',
  'horarioDesayuno',
  'horarioComida',
  'horarioCena',
  'consumeSnacks',
  'tipoSnacks',
  'litrosAgua',
  'consumeAlcohol',
  'frecuenciaAlcohol',
  'alimentosNoGustan',
  'alimentosFavoritos',
  'restriccionDieta',
  'otraRestriccion',
  'realizaEjercicio',
  'tipoEjercicio',
  'frecuenciaEjercicio',
  'duracionEjercicio',
  'horasQuePasaSentado',
  'horasSueno',
  'calidadSueno',
  'nivelEstres',
  'fuma',
  'horarioTrabajo',
  'cocinasEnCasa',
  'comesFuera',
  'objetivoPrincipal',
  'otroObjetivo',
  'pesoMeta',
  'hasSeguirDietaAntes',
  'cualDieta',
  'resultadoDieta',
  'motivacion',
  'comentariosAdicionales',
  'linkFotoFrente',
  'linkFotoEspalda',
  'linkFotoPerfil',
  'carpetaDrive'
];

// ═══════════════════════════════════════════════════════════
// 🚀 FUNCIÓN PRINCIPAL — doPost (recibe datos del formulario)
// ═════════════════════════════════════════════════════════
function doPost(e) {
  try {
    // 1. Parsear los datos JSON recibidos
    var datos = JSON.parse(e.postData.contents);
    
    // 2. Generar fecha y hora del registro
    var ahora = new Date();
    var fechaRegistro = Utilities.formatDate(ahora, 'America/Mexico_City', 'dd/MM/yyyy HH:mm:ss');
    
    // 3. Calcular IMC si hay peso y estatura
    var imc = '';
    if (datos.peso && datos.estatura) {
      var pesoNum = parseFloat(datos.peso);
      var estaturaNum = parseFloat(datos.estatura) / 100; // cm a metros
      if (pesoNum > 0 && estaturaNum > 0) {
        imc = (pesoNum / (estaturaNum * estaturaNum)).toFixed(1);
      }
    }
    
    // 4. Crear carpeta del cliente en Google Drive
    var nombreCliente = (datos.nombre || 'Sin_Nombre') + ' ' + (datos.apellido || '');
    nombreCliente = nombreCliente.trim();
    var fechaCarpeta = Utilities.formatDate(ahora, 'America/Mexico_City', 'yyyy-MM-dd');
    var nombreCarpetaCliente = nombreCliente + ' - ' + fechaCarpeta;
    
    var carpetaCliente = crearCarpetaCliente(nombreCarpetaCliente);
    var linkCarpeta = carpetaCliente.getUrl();
    
    // 5. Subir fotos a la carpeta del cliente
    var linkFotoFrente = '';
    var linkFotoEspalda = '';
    var linkFotoPerfil = '';
    
    if (datos.fotoFrente) {
      linkFotoFrente = subirFoto(carpetaCliente, datos.fotoFrente, 'Foto_Frente_' + nombreCliente);
    }
    if (datos.fotoEspalda) {
      linkFotoEspalda = subirFoto(carpetaCliente, datos.fotoEspalda, 'Foto_Espalda_' + nombreCliente);
    }
    if (datos.fotoPerfil) {
      linkFotoPerfil = subirFoto(carpetaCliente, datos.fotoPerfil, 'Foto_Perfil_' + nombreCliente);
    }
    
    // 6. Preparar la fila de datos para el Sheet
    var fila = [];
    for (var i = 0; i < COLUMNAS.length; i++) {
      var col = COLUMNAS[i];
      
      switch(col) {
        case 'fechaRegistro':
          fila.push(fechaRegistro);
          break;
        case 'imc':
          fila.push(imc);
          break;
        case 'linkFotoFrente':
          fila.push(linkFotoFrente);
          break;
        case 'linkFotoEspalda':
          fila.push(linkFotoEspalda);
          break;
        case 'linkFotoPerfil':
          fila.push(linkFotoPerfil);
          break;
        case 'carpetaDrive':
          fila.push(linkCarpeta);
          break;
        default:
          // Tomar el valor del JSON, o vacío si no existe
          var valor = datos[col] !== undefined && datos[col] !== null ? datos[col] : '';
          fila.push(String(valor));
          break;
      }
    }
    
    // 7. Escribir en Google Sheets
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var hoja = ss.getSheetByName(NOMBRE_HOJA);
    
    if (!hoja) {
      // Si no encuentra la hoja por nombre, usa la primera
      hoja = ss.getSheets()[0];
    }
    
    hoja.appendRow(fila);
    
    // 8. (Opcional) Enviar notificación por email
    // enviarNotificacion(datos, nombreCliente, linkCarpeta);
    
    // 9. Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Datos guardados correctamente',
        cliente: nombreCliente,
        carpeta: linkCarpeta
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Respuesta con error
    Logger.log('ERROR: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══════════════════════════════════════════════════════════
// 📁 FUNCIÓN: Crear carpeta del cliente en Drive
// ═════════════════════════════════════════════════════════
function crearCarpetaCliente(nombreCarpeta) {
  var carpetaRaiz;
  
  // Buscar o crear la carpeta raíz "FitNutriPro - Fotos Clientes"
  var carpetasExistentes = DriveApp.getFoldersByName(NOMBRE_CARPETA_RAIZ);
  
  if (carpetasExistentes.hasNext()) {
    carpetaRaiz = carpetasExistentes.next();
  } else {
    carpetaRaiz = DriveApp.createFolder(NOMBRE_CARPETA_RAIZ);
    Logger.log('Carpeta raíz creada: ' + NOMBRE_CARPETA_RAIZ);
  }
  
  // Crear subcarpeta para este cliente
  var carpetaCliente = carpetaRaiz.createFolder(nombreCarpeta);
  Logger.log('Carpeta del cliente creada: ' + nombreCarpeta);
  
  return carpetaCliente;
}

// ═══════════════════════════════════════════════════════════
// 📸 FUNCIÓN: Subir foto base64 a Google Drive
// ═════════════════════════════════════════════════════════
function subirFoto(carpeta, base64String, nombreArchivo) {
  try {
    // El base64 viene con prefijo "data:image/jpeg;base64,..." — lo separamos
    var partes = base64String.split(',');
    var mimeMatch = partes[0].match(/:(.*?);/);
    var mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    var datosBase64 = partes.length > 1 ? partes[1] : partes[0];
    
    // Determinar extensión
    var extension = '.jpg';
    if (mimeType.indexOf('png') > -1) {
      extension = '.png';
    } else if (mimeType.indexOf('webp') > -1) {
      extension = '.webp';
    } else if (mimeType.indexOf('heic') > -1) {
      extension = '.heic';
    }
    
    // Decodificar base64 y crear el archivo
    var blob = Utilities.newBlob(
      Utilities.base64Decode(datosBase64),
      mimeType,
      nombreArchivo + extension
    );
    
    var archivo = carpeta.createFile(blob);
    
    // Hacer el archivo accesible con link
    archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    Logger.log('Foto subida: ' + nombreArchivo + extension);
    
    return archivo.getUrl();
    
  } catch (error) {
    Logger.log('Error subiendo foto ' + nombreArchivo + ': ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// ═══════════════════════════════════════════════════════════
// 🧪 FUNCIÓN DE PRUEBA — Ejecuta esto para probar manualmente
// ═════════════════════════════════════════════════════════
function testDoPost() {
  var datosPrueba = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Juan',
        apellido: 'Pérez Test',
        email: 'juan@test.com',
        telefono: '5551234567',
        fechaNacimiento: '1990-05-15',
        genero: 'masculino',
        ocupacion: 'Ingeniero',
        ciudad: 'CDMX',
        peso: '80',
        estatura: '175',
        circunferenciaCintura: '85',
        circunferenciaCadera: '95',
        circunferenciaCuello: '38',
        circunferenciaPierna: '55',
        circunferenciaBrazo: '32',
        porcentajeGrasa: '20',
        enfermedades: 'Ninguna',
        otraEnfermedad: '',
        alergias: 'Ninguna',
        medicamentos: 'Ninguno',
        suplementos: 'Proteína whey',
        problemasDigestivos: 'Ninguno',
        otroProblemaDigestivo: '',
        comidasPorDia: '4',
        horarioDesayuno: '07:00',
        horarioComida: '13:00',
        horarioCena: '20:00',
        consumeSnacks: 'Sí',
        tipoSnacks: 'Frutas, yogurt',
        litrosAgua: '3',
        consumeAlcohol: 'Ocasionalmente',
        frecuenciaAlcohol: '1 vez por semana',
        alimentosNoGustan: 'Hígado',
        alimentosFavoritos: 'Pollo, arroz, huevo',
        restriccionDieta: 'Ninguna',
        otraRestriccion: '',
        realizaEjercicio: 'Sí',
        tipoEjercicio: 'Pesas y cardio',
        frecuenciaEjercicio: '5 días',
        duracionEjercicio: '60 minutos',
        horasQuePasaSentado: '6',
        horasSueno: '7',
        calidadSueno: 'Buena',
        nivelEstres: '4',
        fuma: 'No',
        horarioTrabajo: '9:00 - 18:00',
        cocinasEnCasa: 'Sí',
        comesFuera: '2 veces por semana',
        objetivoPrincipal: 'Ganar masa muscular',
        otroObjetivo: '',
        pesoMeta: '85',
        hasSeguirDietaAntes: 'Sí',
        cualDieta: 'Dieta alta en proteína',
        resultadoDieta: 'Buenos resultados pero no la mantuve',
        motivacion: 'Verme y sentirme mejor',
        comentariosAdicionales: 'Esto es una prueba del sistema'
        // No se incluyen fotos en la prueba para que sea rápido
      })
    }
  };
  
  var resultado = doPost(datosPrueba);
  Logger.log(resultado.getContent());
}

// ═════════════════════════════════════════════════════════
// 🔧 FUNCIÓN: doGet (para verificar que el script está activo)
// ═════════════════════════════════════════════════════════
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'online',
      app: 'FitNutriPro Backend',
      version: '2.0',
      message: '🏋️ El servidor de FitNutriPro está activo y funcionando.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
