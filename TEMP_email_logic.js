// ==========================================
// SERVICIO DE CORREO (GOOGLE APPS SCRIPT)
// ==========================================

// ¡IMPORTANTE! Reemplaza este valor con la URL de tu Web App de Apps Script publicada:
const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";

window.sendTestEmail = function () {
    const emailInput = document.getElementById('testEmailInput');
    const email = emailInput.value.trim();

    if (!email) {
        alert('❌ Por favor ingresa un correo de destino.');
        emailInput.focus();
        return;
    }

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_APPS_SCRIPT_URL_HERE")) {
        alert('⚠️ ATENCIÓN: No has configurado la URL del Apps Script.\n\nPor favor abre el archivo app.js y busca "APPS_SCRIPT_URL" para pegar la URL de tu script publicado.');
        return;
    }

    const btn = document.querySelector('button[onclick="sendTestEmail()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Enviando... ⏳';
    btn.disabled = true;

    // Datos de prueba simulando un objeto de evento
    const testPayload = {
        action: "send_email", // La acción que el script debe reconocer
        recipient: email,
        subject: "Prueba de Sistema de Horarios - Ti_St",
        body: `
            <h3>Prueba de Conectividad</h3>
            <p>Este es un correo de prueba enviado desde la aplicación de Horarios.</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            <p>Si recibes esto, la conexión entre la App y Apps Script funciona correctamente.</p>
            <hr>
            <small>Sistema de Horarios 2026</small>
        `,
        // Intentamos enviar datos extra para ver si el script los procesa
        data: {
            test: true,
            timestamp: Date.now()
        }
    };

    // Usamos fetch con mode 'no-cors' ya que Apps Script suele tener restricciones CORS
    // Nota: Con 'no-cors' no podemos leer la respuesta (si fue status 200 o 500),
    // pero sí podemos enviar la petición.
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
    })
        .then(() => {
            // Asumimos éxito si la red no falló
            alert(`✅ Petición enviada a ${email}.\n\nRevisa tu bandeja de entrada (y spam). Si no llega en 1 minuto, verifica los logs en Apps Script.`);
        })
        .catch(error => {
            console.error("Error enviando correo:", error);
            alert('❌ Error de red al intentar conectar con el script.\n' + error.message);
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
};

