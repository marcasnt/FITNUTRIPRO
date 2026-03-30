// ============================================================
// 🧪 FUNCIÓN DE DIAGNÓSTICO — Para encontrar el problema
// ============================================================
function diagnosticarSheet() {
  try {
    var ss = SpreadsheetApp.openById('1iNW0H7Asb_2m5YsOy63v1TGmjWDugplRAOdPNbwVuIk');
    
    // Mostrar todas las hojas disponibles
    var sheets = ss.getSheets();
    Logger.log('=== HOJAS DISPONIBLES ===');
    for (var i = 0; i < sheets.length; i++) {
      Logger.log('Hoja ' + i + ': "' + sheets[i].getName() + '"');
    }
    
    // Intentar acceder a la hoja "NOVATOS 2026"
    var hoja = ss.getSheetByName('NOVATOS 2026');
    if (hoja) {
      Logger.log('✅ Hoja "NOVATOS 2026" encontrada');
      Logger.log('   Última fila con datos: ' + hoja.getLastRow());
      Logger.log('   Número de columnas: ' + hoja.getLastColumn());
    } else {
      Logger.log('❌ ERROR: No se encontró la hoja "NOVATOS 2026"');
      Logger.log('   Creando la hoja...');
      hoja = ss.insertSheet('NOVATOS 2026');
      
      // Agregar encabezados
      var encabezados = [
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
      
      hoja.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
      Logger.log('✅ Hoja creada con encabezados');
    }
    
  } catch (error) {
    Logger.log('❌ ERROR EN DIAGNÓSTICO: ' + error.toString());
  }
}

// ============================================================
// 🧪 FUNCIÓN DE PRUEBA SIMPLE — Solo para probar el Sheet
// ============================================================
function testSimple() {
  try {
    var ss = SpreadsheetApp.openById('1iNW0H7Asb_2m5YsOy63v1TGmjWDugplRAOdPNbwVuIk');
    var hoja = ss.getSheetByName('NOVATOS 2026');
    
    if (!hoja) {
      Logger.log('❌ No existe la hoja "NOVATOS 2026"');
      return;
    }
    
    // Agregar una fila de prueba
    var datosPrueba = [
      new Date().toLocaleString(),
      'Test',
      'Usuario',
      'test@test.com',
      '5551234567',
      '1990-01-01',
      'masculino',
      'Tester',
      'CDMX',
      '80',
      '175',
      '26.1',
      '85',
      '95',
      '38',
      '55',
      '32',
      '20',
      'Ninguna',
      '',
      'Ninguna',
      'Ninguno',
      'Proteína',
      'Ninguno',
      '',
      '4',
      '07:00',
      '13:00',
      '20:00',
      'Sí',
      'Frutas',
      '3',
      'No',
      '',
      '',
      'Pollo',
      'Ninguna',
      '',
      'Sí',
      'Pesas',
      '5 días',
      '60 min',
      '6',
      '7',
      'Buena',
      '3',
      'No',
      '9-18',
      'Sí',
      '2 veces',
      'Ganar músculo',
      '',
      '85',
      'Sí',
      'Alta proteína',
      'Buenos',
      'Salud',
      'Test simple',
      '',
      '',
      '',
      ''
    ];
    
    hoja.appendRow(datosPrueba);
    Logger.log('✅ Fila de prueba agregada exitosamente');
    
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
  }
}
