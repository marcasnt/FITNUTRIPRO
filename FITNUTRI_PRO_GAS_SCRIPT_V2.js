// ============================================================
// 🏋️ FitNutriPro — Google Apps Script Backend V2 (con Macronutrientes)
// ============================================================
// Este script recibe los datos del formulario web,
// los guarda en Google Sheets y sube las fotos a Google Drive.
// ============================================================

// ═════════════════════════════════════════════════════════
// 📌 CONFIGURACIÓN — ACTUALIZADA CON TUS DATOS
// ═════════════════════════════════════════════════════════
const SPREADSHEET_ID = '1P-0r41AXoFGPIGE2VbfAejnueK0M37XRaTzZ0TzZ3ko';
const NOMBRE_HOJA = 'FitNutriPro - Clientes';
const NOMBRE_CARPETA_RAIZ = 'FitNutriPro - Fotos Clientes';
const TU_EMAIL = 'marcasnt@gmail.com';

// ═════════════════════════════════════════════════════════
// 📌 COLUMNAS — 65 columnas totales (incluyendo macronutrientes)
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
  // Macronutrientes seleccionados
  'carbsSelect',
  'proteinasSelect',
  'grasasSelect',
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

// ═════════════════════════════════════════════════════════
// 🚀 FUNCIÓN PRINCIPAL — doPost
// ═════════════════════════════════════════════════════════
function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    
    var ahora = new Date();
    var fechaRegistro = Utilities.formatDate(ahora, 'America/Mexico_City', 'dd/MM/yyyy HH:mm:ss');
    
    // Calcular IMC
    var imc = '';
    if (datos.peso && datos.estatura) {
      var pesoNum = parseFloat(datos.peso);
      var estaturaNum = parseFloat(datos.estatura) / 100;
      if (pesoNum > 0 && estaturaNum > 0) {
        imc = (pesoNum / (estaturaNum * estaturaNum)).toFixed(1);
      }
    }
    
    // Crear carpeta del cliente
    var nombreCliente = (datos.nombre || 'Sin_Nombre') + ' ' + (datos.apellido || '');
    nombreCliente = nombreCliente.trim();
    var fechaCarpeta = Utilities.formatDate(ahora, 'America/Mexico_City', 'yyyy-MM-dd');
    var nombreCarpetaCliente = nombreCliente + ' - ' + fechaCarpeta;
    
    var carpetaCliente = crearCarpetaCliente(nombreCarpetaCliente);
    var linkCarpeta = carpetaCliente.getUrl();
    
    // Subir fotos
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
    
    // Preparar fila de datos
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
          // Arrays (como macronutrientes) se convierten a string separado por comas
          var valor = datos[col];
          if (Array.isArray(valor)) {
            fila.push(valor.join(', '));
          } else if (valor !== undefined && valor !== null) {
            fila.push(String(valor));
          } else {
            fila.push('');
          }
          break;
      }
    }
    
    // Escribir en Google Sheets
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var hoja = ss.getSheetByName(NOMBRE_HOJA);
    
    if (!hoja) {
      hoja = ss.getSheets()[0];
    }
    
    hoja.appendRow(fila);
    
    // Enviar notificación
    enviarNotificacion(datos, nombreCliente, linkCarpeta);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Datos guardados correctamente',
        cliente: nombreCliente,
        carpeta: linkCarpeta
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═════════════════════════════════════════════════════════
// 📁 FUNCIÓN: Crear carpeta del cliente en Drive
// ═════════════════════════════════════════════════════════
function crearCarpetaCliente(nombreCarpeta) {
  var carpetaRaiz;
  
  var carpetasExistentes = DriveApp.getFoldersByName(NOMBRE_CARPETA_RAIZ);
  
  if (carpetasExistentes.hasNext()) {
    carpetaRaiz = carpetasExistentes.next();
  } else {
    carpetaRaiz = DriveApp.createFolder(NOMBRE_CARPETA_RAIZ);
    Logger.log('Carpeta raíz creada: ' + NOMBRE_CARPETA_RAIZ);
  }
  
  var carpetaCliente = carpetaRaiz.createFolder(nombreCarpeta);
  Logger.log('Carpeta del cliente creada: ' + nombreCarpeta);
  
  return carpetaCliente;
}

// ═════════════════════════════════════════════════════════
// 📸 FUNCIÓN: Subir foto base64 a Google Drive
// ═════════════════════════════════════════════════════════
function subirFoto(carpeta, base64String, nombreArchivo) {
  try {
    var partes = base64String.split(',');
    var mimeMatch = partes[0].match(/:(.*?);/);
    var mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    var datosBase64 = partes.length > 1 ? partes[1] : partes[0];
    
    var extension = '.jpg';
    if (mimeType.indexOf('png') > -1) extension = '.png';
    else if (mimeType.indexOf('webp') > -1) extension = '.webp';
    else if (mimeType.indexOf('heic') > -1) extension = '.heic';
    
    var blob = Utilities.newBlob(
      Utilities.base64Decode(datosBase64),
      mimeType,
      nombreArchivo + extension
    );
    
    var archivo = carpeta.createFile(blob);
    archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    Logger.log('Foto subida: ' + nombreArchivo + extension);
    
    return archivo.getUrl();
    
  } catch (error) {
    Logger.log('Error subiendo foto ' + nombreArchivo + ': ' + error.toString());
    return 'Error: ' + error.toString();
  }
}

// ═════════════════════════════════════════════════════════
// 📧 FUNCIÓN: Enviar notificación por email
// ═══════════════════════════════════════════════════════
function enviarNotificacion(datos, nombreCliente, linkCarpeta) {
  try {
    var asunto = '🏋️ Nuevo Cliente FitNutriPro: ' + nombreCliente;
    
    // Formatear macronutrientes para el email
    var carbsList = Array.isArray(datos.carbsSelect) ? datos.carbsSelect.join(', ') : 'No seleccionados';
    var proteinasList = Array.isArray(datos.proteinasSelect) ? datos.proteinasSelect.join(', ') : 'No seleccionadas';
    var grasasList = Array.isArray(datos.grasasSelect) ? datos.grasasSelect.join(', ') : 'No seleccionadas';
    
    var cuerpo = '¡Hola Coach! 💪\n\n';
    cuerpo += 'Tienes un nuevo registro de asesoría nutricional:\n\n';
    cuerpo += '👤 Cliente: ' + nombreCliente + '\n';
    cuerpo += '📧 Email: ' + (datos.email || 'No proporcionado') + '\n';
    cuerpo += '📱 Teléfono: ' + (datos.telefono || 'No proporcionado') + '\n';
    cuerpo += '🏙️ Ciudad: ' + (datos.ciudad || 'No proporcionada') + '\n';
    cuerpo += '⚖️ Peso: ' + (datos.peso || '?') + ' kg\n';
    cuerpo += '📏 Estatura: ' + (datos.estatura || '?') + ' cm\n';
    cuerpo += '🎯 Objetivo: ' + (datos.objetivoPrincipal || 'No especificado') + '\n\n';
    
    cuerpo += '🛒 ALIMENTOS DISPONIBLES:\n';
    cuerpo += '🍚 Carbohidratos: ' + carbsList + '\n';
    cuerpo += '🥩 Proteínas: ' + proteinasList + '\n';
    cuerpo += '🥑 Grasas: ' + grasasList + '\n\n';
    
    cuerpo += '📁 Carpeta de fotos: ' + linkCarpeta + '\n\n';
    cuerpo += '🔗 Ver Google Sheets: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '\n\n';
    cuerpo += '¡Revisa los datos y contacta al cliente pronto!';
    
    MailApp.sendEmail(TU_EMAIL, asunto, cuerpo);
    Logger.log('Notificación enviada a: ' + TU_EMAIL);
    
  } catch (error) {
    Logger.log('Error enviando email: ' + error.toString());
  }
}

// ═══════════════════════════════════════════════════════
// 🧪 FUNCIÓN: testDoPost — Prueba con macronutrientes
// ═══════════════════════════════════════════════════════
function testDoPost() {
  var datosPrueba = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Ana',
        apellido: 'García Test',
        email: 'ana@test.com',
        telefono: '5559876543',
        fechaNacimiento: '1992-08-20',
        genero: 'femenino',
        ocupacion: 'Nutricionista',
        ciudad: 'Guadalajara',
        peso: '65',
        estatura: '165',
        circunferenciaCintura: '70',
        circunferenciaCadera: '95',
        circunferenciaCuello: '32',
        circunferenciaPierna: '50',
        circunferenciaBrazo: '28',
        porcentajeGrasa: '22',
        enfermedades: ['Ninguna'],
        otraEnfermedad: '',
        alergias: 'Ninguna',
        medicamentos: 'Ninguno',
        suplementos: 'Multivitamínico',
        problemasDigestivos: ['Ninguno'],
        otroProblemaDigestivo: '',
        comidasPorDia: '4',
        horarioDesayuno: '08:00',
        horarioComida: '14:00',
        horarioCena: '20:00',
        consumeSnacks: 'si',
        tipoSnacks: 'Frutas',
        litrosAgua: '2.5',
        consumeAlcohol: 'no',
        frecuenciaAlcohol: '',
        alimentosNoGustan: 'Espinaca',
        alimentosFavoritos: 'Pollo, arroz',
        restriccionDieta: ['ninguna'],
        otraRestriccion: '',
        // Macronutrientes seleccionados
        carbsSelect: ['arroz', 'avena', 'camote', 'quinoa'],
        proteinasSelect: ['pollo', 'huevo', 'pescado', 'atun'],
        grasasSelect: ['aceite_oliva', 'almendra', 'mantequilla_mani'],
        realizaEjercicio: 'si',
        tipoEjercicio: 'Crossfit',
        frecuenciaEjercicio: '4 días',
        duracionEjercicio: '45 minutos',
        horasQuePasaSentado: '5',
        horasSueno: '8',
        calidadSueno: 'Buena',
        nivelEstres: '3',
        fuma: 'no',
        horarioTrabajo: '9:00 - 17:00',
        cocinasEnCasa: 'si',
        comesFuera: '1 vez',
        objetivoPrincipal: 'Perder grasa',
        otroObjetivo: '',
        pesoMeta: '58',
        hasSeguirDietaAntes: 'si',
        cualDieta: 'Keto',
        resultadoDieta: 'Funcionó pero difícil de mantener',
        motivacion: 'Salud y energía',
        comentariosAdicionales: 'Prueba con macronutrientes'
      })
    }
  };
  
  var resultado = doPost(datosPrueba);
  Logger.log(resultado.getContent());
}

// ═══════════════════════════════════════════════════════
// 🔧 FUNCIÓN: doGet (verificar que el script está activo)
// ═══════════════════════════════════════════════════════
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'online',
      app: 'FitNutriPro Backend V2',
      version: '2.1',
      message: '🏋️ FitNutriPro con macronutrientes activo',
      features: ['Macronutrientes seleccionables', 'Notificaciones email', 'Fotos Drive']
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════
// 🛠️ FUNCIÓN: Crear encabezados en Google Sheet
// ═══════════════════════════════════════════════════════
function crearEncabezados() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var hoja = ss.getSheetByName(NOMBRE_HOJA);
    
    if (!hoja) {
      hoja = ss.getSheets()[0];
    }
    
    // Verificar si ya tiene encabezados
    var primeraFila = hoja.getRange(1, 1, 1, COLUMNAS.length).getValues()[0];
    
    // Si la primera celda está vacía o diferente, agregar encabezados
    if (primeraFila[0] !== 'fechaRegistro') {
      hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);
      
      // Formatear encabezados (negrita, fondo azul)
      var rangoEncabezados = hoja.getRange(1, 1, 1, COLUMNAS.length);
      rangoEncabezados.setFontWeight('bold');
      rangoEncabezados.setBackground('#4285f4');
      rangoEncabezados.setFontColor('white');
      
      Logger.log('✅ Encabezados creados: ' + COLUMNAS.length + ' columnas');
    } else {
      Logger.log('ℹ️ Los encabezados ya existen');
    }
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
  }
}
