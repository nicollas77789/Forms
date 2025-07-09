// Coletar informações avançadas do usuário
async function coletarInformacoesUsuario() {
  const data = {
    ip: await getIP(),
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    location: await getApproximateLocation(),
    deviceInfo: getDeviceInfo(),
    browserInfo: getBrowserInfo(),
    osInfo: getOSInfo(),
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes',
    plugins: getBrowserPlugins(),
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    touchSupport: 'maxTouchPoints' in navigator ? navigator.maxTouchPoints > 0 : false
  };
  
  return data;
}

// Obter endereço IP
async function getIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return 'Não disponível';
  }
}

// Obter localização aproximada
async function getApproximateLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve('Geolocalização não suportada');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(`Lat: ${position.coords.latitude.toFixed(2)}, Long: ${position.coords.longitude.toFixed(2)}`);
      },
      (error) => {
        // Tentar obter localização via IP
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data.city && data.country) {
              resolve(`${data.city}, ${data.country}`);
            } else {
              resolve('Localização não disponível');
            }
          })
          .catch(() => {
            resolve('Localização não disponível');
          });
      },
      { timeout: 5000 }
    );
  });
}

// Detectar informações do dispositivo
function getDeviceInfo() {
  const ua = navigator.userAgent;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// Detectar navegador
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  
  if (ua.includes("Firefox")) {
    browser = "Firefox";
  } else if (ua.includes("SamsungBrowser")) {
    browser = "Samsung Browser";
  } else if (ua.includes("Opera") || ua.includes("OPR")) {
    browser = "Opera";
  } else if (ua.includes("Trident")) {
    browser = "Internet Explorer";
  } else if (ua.includes("Edge")) {
    browser = "Edge";
  } else if (ua.includes("Chrome")) {
    browser = "Chrome";
  } else if (ua.includes("Safari")) {
    browser = "Safari";
  }
  
  return browser;
}

// Detectar sistema operacional
function getOSInfo() {
  const ua = navigator.userAgent;
  let os = "Unknown";
  
  if (ua.includes("Windows")) {
    os = "Windows";
  } else if (ua.includes("Mac")) {
    os = "MacOS";
  } else if (ua.includes("Linux")) {
    os = "Linux";
  } else if (ua.includes("Android")) {
    os = "Android";
  } else if (ua.includes("iOS") || /iPhone|iPad|iPod/.test(ua)) {
    os = "iOS";
  }
  
  return os;
}

// Listar plugins do navegador
function getBrowserPlugins() {
  const plugins = [];
  
  for (let i = 0; i < navigator.plugins.length; i++) {
    plugins.push(navigator.plugins[i].name);
  }
  
  return plugins.length > 0 ? plugins.join(', ') : 'Nenhum plugin detectado';
}

// Monitorar comportamento do usuário
function trackUserBehavior() {
  let idleTime = 0;
  const idleInterval = setInterval(() => {
    idleTime++;
    if (idleTime > 5) { // 5 minutos inativo
      logUserEvent('user_inactive', { idleTime });
      idleTime = 0;
    }
  }, 60000); // 1 minuto
  
  // Eventos de mouse e teclado resetam o tempo ocioso
  document.addEventListener('mousemove', () => idleTime = 0);
  document.addEventListener('keypress', () => idleTime = 0);
  
  // Rastrear cliques
  document.addEventListener('click', (e) => {
    logUserEvent('click', {
      target: e.target.tagName,
      id: e.target.id || 'none',
      class: e.target.className || 'none'
    });
  });
  
  // Rastrear mudanças de campo
  document.querySelectorAll('input, textarea, select').forEach(element => {
    element.addEventListener('change', (e) => {
      logUserEvent('field_change', {
        field: e.target.name,
        value: e.target.value.substring(0, 50) // Limitar tamanho
      });
    });
  });
}

// Registrar eventos do usuário
function logUserEvent(type, data) {
  const event = {
    type,
    data,
    timestamp: new Date().toISOString(),
    page: window.location.pathname
  };
  
  // Enviar para o servidor ou salvar localmente
  console.log('User event:', event);
}

// Iniciar monitoramento quando a página carregar
window.addEventListener('load', () => {
  trackUserBehavior();
  
  // Verificar se é um bot (simplificado)
  if (navigator.webdriver || /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
    logUserEvent('bot_detected', {
      userAgent: navigator.userAgent
    });
  }
});
