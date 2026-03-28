# 🏋️ FitNutriPro — Tutorial Completo: Google Apps Script + Sheets + Drive

## 📋 ÍNDICE
1. [Crear el Google Sheets](#paso-1)
2. [Crear el Google Apps Script](#paso-2)
3. [Copiar el código del script](#paso-3)
4. [Dar permisos al script](#paso-4)
5. [Desplegar como aplicación web](#paso-5)
6. [Verificar que funciona](#paso-6)
7. [Solución de problemas](#paso-7)

---

<a name="paso-1"></a>
## 📊 PASO 1: Crear el Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo
2. Ponle de nombre: **`FitNutriPro - Base de Datos`**
3. En la **Fila 1**, copia EXACTAMENTE estos encabezados (uno por celda, de A1 a BJ1):

```
| Columna | Encabezado |
|---------|------------|
| A1  | fechaRegistro |
| B1  | nombre |
| C1  | apellido |
| D1  | email |
| E1  | telefono |
| F1  | fechaNacimiento |
| G1  | genero |
| H1  | ocupacion |
| I1  | ciudad |
| J1  | peso |
| K1  | estatura |
| L1  | imc |
| M1  | circunferenciaCintura |
| N1  | circunferenciaCadera |
| O1  | circunferenciaCuello |
| P1  | circunferenciaPierna |
| Q1  | circunferenciaBrazo |
| R1  | porcentajeGrasa |
| S1  | enfermedades |
| T1  | otraEnfermedad |
| U1  | alergias |
| V1  | medicamentos |
| W1  | suplementos |
| X1  | problemasDigestivos |
| Y1  | otroProblemaDigestivo |
| Z1  | comidasPorDia |
| AA1 | horarioDesayuno |
| AB1 | horarioComida |
| AC1 | horarioCena |
| AD1 | consumeSnacks |
| AE1 | tipoSnacks |
| AF1 | litrosAgua |
| AG1 | consumeAlcohol |
| AH1 | frecuenciaAlcohol |
| AI1 | alimentosNoGustan |
| AJ1 | alimentosFavoritos |
| AK1 | restriccionDieta |
| AL1 | otraRestriccion |
| AM1 | realizaEjercicio |
| AN1 | tipoEjercicio |
| AO1 | frecuenciaEjercicio |
| AP1 | duracionEjercicio |
| AQ1 | horasQuePasaSentado |
| AR1 | horasSueno |
| AS1 | calidadSueno |
| AT1 | nivelEstres |
| AU1 | fuma |
| AV1 | horarioTrabajo |
| AW1 | cocinasEnCasa |
| AX1 | comesFuera |
| AY1 | objetivoPrincipal |
| AZ1 | otroObjetivo |
| BA1 | pesoMeta |
| BB1 | hasSeguirDietaAntes |
| BC1 | cualDieta |
| BD1 | resultadoDieta |
| BE1 | motivacion |
| BF1 | comentariosAdicionales |
| BG1 | linkFotoFrente |
| BH1 | linkFotoEspalda |
| BI1 | linkFotoPerfil |
| BJ1 | carpetaDrive |
```

4. **Formatea la fila 1**: Selecciona toda la fila 1 → Negrita → Color de fondo verde (#b5f727) → Texto negro
5. **Congela la fila 1**: Ve a `Ver > Inmovilizar > 1 fila`
6. **COPIA EL ID de tu hoja** — está en la URL entre `/d/` y `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/ESTE_ES_TU_ID/edit
   ```
   Guárdalo, lo necesitarás en el paso 3.

---

<a name="paso-2"></a>
## ⚙️ PASO 2: Crear el Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. Ponle de nombre: **`FitNutriPro - Backend`**
4. **BORRA** todo el código que viene por defecto
5. Copia y pega el código completo del **Paso 3**

---

<a name="paso-3"></a>
## 💻 PASO 3: Código completo del Google Apps Script

> ⚠️ **IMPORTANTE**: Reemplaza `TU_SPREADSHEET_ID_AQUI` con el ID que copiaste en el Paso 1

```javascript
// ============================================================
// 🏋️ FitNutriPro — Google Apps Script Backend
// ============================================================
// Este script recibe los datos del formulario web,
// los guarda en Google Sheets y sube las fotos a Google Drive.
// ============================================================

// ═══════════════════════════════════════════════════════════
// 📌 CONFIGURACIÓN — CAMBIA ESTOS VALORES
// ═══════════════════════════════════════════════════════════
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';
const NOMBRE_HOJA = 'Hoja 1'; // Nombre de la pestaña en tu Sheet (puede ser "Sheet1" en inglés)
const NOMBRE_CARPETA_RAIZ = 'FitNutriPro - Fotos Clientes';

// ═══════════════════════════════════════════════════════════
// 📌 COLUMNAS — En el mismo orden que los encabezados del Sheet
// ═══════════════════════════════════════════════════════════
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
// ═══════════════════════════════════════════════════════════
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
// ═══════════════════════════════════════════════════════════
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
// ═══════════════════════════════════════════════════════════
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
// 📧 FUNCIÓN (OPCIONAL): Enviar notificación por email
// ═══════════════════════════════════════════════════════════
// Descomenta la línea "enviarNotificacion(...)" en doPost() para activarla
function enviarNotificacion(datos, nombreCliente, linkCarpeta) {
  var tuEmail = 'TU_EMAIL@gmail.com'; // ← CAMBIA ESTO por tu email
  
  var asunto = '🏋️ Nuevo Asesorado: ' + nombreCliente;
  
  var cuerpo = '¡Hola Coach! 💪\n\n';
  cuerpo += 'Tienes un nuevo registro de asesoría nutricional:\n\n';
  cuerpo += '👤 Nombre: ' + nombreCliente + '\n';
  cuerpo += '📧 Email: ' + (datos.email || 'No proporcionado') + '\n';
  cuerpo += '📱 Teléfono: ' + (datos.telefono || 'No proporcionado') + '\n';
  cuerpo += '🏙️ Ciudad: ' + (datos.ciudad || 'No proporcionada') + '\n';
  cuerpo += '⚖️ Peso: ' + (datos.peso || '?') + ' kg\n';
  cuerpo += '📏 Estatura: ' + (datos.estatura || '?') + ' cm\n';
  cuerpo += '🎯 Objetivo: ' + (datos.objetivoPrincipal || 'No especificado') + '\n\n';
  cuerpo += '📁 Carpeta de fotos: ' + linkCarpeta + '\n\n';
  cuerpo += '¡Ve a revisar tu Google Sheets para ver todos los datos!';
  
  MailApp.sendEmail(tuEmail, asunto, cuerpo);
  Logger.log('Notificación enviada a: ' + tuEmail);
}


// ═══════════════════════════════════════════════════════════
// 🧪 FUNCIÓN DE PRUEBA — Ejecuta esto para probar manualmente
// ═══════════════════════════════════════════════════════════
function testDoPost() {
  var datosPrueba = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Juan',
        apellido: 'Pérez Test',
        email: 'juan@test.com',
        telefono: '5551234567',
        fechaNacimiento: '1990-05-15',
        genero: 'Masculino',
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


// ═══════════════════════════════════════════════════════════
// 🔧 FUNCIÓN: doGet (para verificar que el script está activo)
// ═══════════════════════════════════════════════════════════
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
```

---

<a name="paso-4"></a>
## 🔐 PASO 4: Dar permisos al script

### 4.1 — Ejecutar la función de prueba
1. En el editor de Apps Script, selecciona la función **`testDoPost`** en el menú desplegable de arriba
2. Haz clic en el botón **▶ Ejecutar**
3. Te aparecerá un aviso: **"Se requiere autorización"** → Clic en **"Revisar permisos"**
4. Selecciona **tu cuenta de Google**
5. Si aparece **"Google no ha verificado esta app"**:
   - Haz clic en **"Avanzado"** (abajo a la izquierda)
   - Luego en **"Ir a FitNutriPro - Backend (no seguro)"**
6. Haz clic en **"Permitir"**

### 4.2 — Verificar que funcionó
1. Ve a tu Google Sheets → Debería aparecer **una fila nueva** con los datos de prueba
2. Ve a tu Google Drive → Debería existir la carpeta **"FitNutriPro - Fotos Clientes"** con una subcarpeta **"Juan Pérez Test - (fecha)"**
3. Si ves todo eso, ¡FUNCIONA! ✅

> 💡 **Si no aparece nada**, ve a `Ver > Registros de ejecución` en Apps Script para ver los errores

---

<a name="paso-5"></a>
## 🌐 PASO 5: Desplegar como Aplicación Web

1. En Apps Script, haz clic en **"Implementar"** (botón azul arriba a la derecha)
2. Selecciona **"Nueva implementación"**
3. Haz clic en el ícono de engranaje ⚙️ y selecciona **"Aplicación web"**
4. Configura así:

| Campo | Valor |
|-------|-------|
| **Descripción** | FitNutriPro Backend v2.0 |
| **Ejecutar como** | **Yo** (tu email) |
| **Quién tiene acceso** | **Cualquier persona** |

5. Haz clic en **"Implementar"**
6. Se generará una **URL** que se ve así:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. **COPIA ESA URL** — Es la que va en tu código web

> ⚠️ **IMPORTANTE**: Cada vez que cambies el código del script, debes hacer una **NUEVA implementación** para que los cambios se reflejen. Ve a `Implementar > Administrar implementaciones > ✏️ Editar > Nueva versión > Implementar`

---

<a name="paso-6"></a>
## ✅ PASO 6: Verificar que funciona desde la web

### 6.1 — Prueba rápida con el navegador
1. Abre la URL de tu script en el navegador (la que copiaste)
2. Deberías ver:
   ```json
   {
     "status": "online",
     "app": "FitNutriPro Backend",
     "version": "2.0",
     "message": "🏋️ El servidor de FitNutriPro está activo y funcionando."
   }
   ```
3. Si ves eso, tu backend está en línea ✅

### 6.2 — Prueba completa desde la web
1. Abre tu web FitNutriPro
2. Llena TODOS los pasos del formulario
3. Sube las 3 fotos
4. Haz clic en **"Enviar 🔥"**
5. Verifica en tu Google Sheets que los datos llegaron
6. Verifica en tu Google Drive que las fotos se subieron en una carpeta con el nombre del cliente

---

<a name="paso-7"></a>
## 🔧 PASO 7: Solución de problemas

### ❌ "No llegan los datos al Sheet"
- Verifica que el **nombre de la hoja** coincida con `NOMBRE_HOJA` en el script (puede ser `"Hoja 1"` o `"Sheet1"` dependiendo del idioma)
- Verifica que el **SPREADSHEET_ID** esté correcto
- Ve a `Ejecuciones` en el panel izquierdo de Apps Script para ver los logs

### ❌ "Error de permisos"
- Asegúrate de que ejecutaste `testDoPost` primero para dar permisos
- En el despliegue, debe decir **"Cualquier persona"** en "Quién tiene acceso"

### ❌ "Las fotos no se suben"
- Las fotos se envían en **base64**, lo cual aumenta el tamaño del payload
- Google Apps Script tiene un límite de **~50MB** por ejecución
- Si las fotos son muy grandes, el cliente debería comprimir antes de subir
- La web ya limita a **10MB por foto** en el formulario

### ❌ "El script tarda mucho"
- Subir 3 fotos puede tomar **10-30 segundos** dependiendo del tamaño
- Esto es normal en Google Apps Script
- La web muestra un spinner de carga mientras espera

### ❌ "Después de cambiar el código no se reflejan los cambios"
- Debes hacer una **NUEVA IMPLEMENTACIÓN** cada vez que cambies el código
- Ve a `Implementar > Administrar implementaciones > Crear nueva implementación`

---

## 📁 Estructura final en Google Drive

```
📂 Mi Drive
└── 📁 FitNutriPro - Fotos Clientes
    ├── 📁 María López - 2024-01-15
    │   ├── 🖼️ Foto_Frente_María López.jpg
    │   ├── 🖼️ Foto_Espalda_María López.jpg
    │   └── 🖼️ Foto_Perfil_María López.jpg
    │
    ├── 📁 Carlos Ruiz - 2024-01-16
    │   ├── 🖼️ Foto_Frente_Carlos Ruiz.jpg
    │   ├── 🖼️ Foto_Espalda_Carlos Ruiz.jpg
    │   └── 🖼️ Foto_Perfil_Carlos Ruiz.jpg
    │
    └── 📁 Ana Martínez - 2024-01-17
        ├── 🖼️ Foto_Frente_Ana Martínez.png
        ├── 🖼️ Foto_Espalda_Ana Martínez.png
        └── 🖼️ Foto_Perfil_Ana Martínez.png
```

---

## 📊 Estructura final en Google Sheets

| fechaRegistro | nombre | apellido | email | ... | linkFotoFrente | linkFotoEspalda | linkFotoPerfil | carpetaDrive |
|---|---|---|---|---|---|---|---|---|
| 15/01/2024 10:30:00 | María | López | maria@mail.com | ... | https://drive.google.com/... | https://drive.google.com/... | https://drive.google.com/... | https://drive.google.com/... |
| 16/01/2024 14:22:00 | Carlos | Ruiz | carlos@mail.com | ... | https://drive.google.com/... | https://drive.google.com/... | https://drive.google.com/... | https://drive.google.com/... |

---

## 💡 TIPS PRO

### 🔔 Activar notificaciones por email
En el código del script, busca esta línea (dentro de `doPost`):
```javascript
// enviarNotificacion(datos, nombreCliente, linkCarpeta);
```
Quita los `//` para activarla y cambia `TU_EMAIL@gmail.com` por tu email real en la función `enviarNotificacion`.

### 📱 Verificar desde el celular
Tu web es responsive, así que tus clientes pueden llenar el formulario desde su celular, tomarse las fotos y subirlas directamente.

### 🔄 Seguimiento de progreso
Si un cliente se registra varias veces (por ejemplo cada mes), se creará una carpeta nueva cada vez con la fecha. Así puedes comparar su progreso en las fotos y medidas.

### 🔒 Seguridad de las fotos
Las fotos en Drive se configuran como **"Cualquiera con el link puede ver"**. Solo tú y quienes tengan el enlace podrán verlas. Puedes cambiar los permisos manualmente en Drive si lo deseas.

---

## ✅ CHECKLIST FINAL

- [ ] Google Sheets creado con los 62 encabezados (A1 a BJ1)
- [ ] SPREADSHEET_ID reemplazado en el código del script
- [ ] NOMBRE_HOJA correcto ("Hoja 1" o "Sheet1")
- [ ] Función testDoPost ejecutada exitosamente
- [ ] Permisos otorgados al script
- [ ] Implementación desplegada como "Aplicación web"
- [ ] Acceso configurado como "Cualquier persona"
- [ ] URL del script pegada en el código de la web (src/App.tsx)
- [ ] Prueba completa desde la web exitosa
- [ ] Datos visibles en Google Sheets
- [ ] Fotos visibles en Google Drive
- [ ] (Opcional) Notificación por email activada

---

**¡Listo! Tu sistema FitNutriPro está 100% funcional 🏋️🔥**
