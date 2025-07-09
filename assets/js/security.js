// Verificações avançadas de segurança
class SecurityScanner {
  constructor() {
    this.threatLevel = 0;
    this.detectedThreats = [];
  }

  async runFullScan() {
    // Verificar ambiente do navegador
    this.scanBrowserEnv();
    
    // Verificar plugins suspeitos
    this.scanPlugins();
    
    // Verificar comportamento anômalo
    await this.checkAnomalies();
    
    // Verificar proxy/VPN
    await this.checkNetwork();
    
    return {
      threatLevel: this.threatLevel,
      threats: this.detectedThreats,
      safe: this.threatLevel < 5
    };
  }

  scanBrowserEnv() {
    // Detectar navegadores headless
    const headlessTests = [
      !window.chrome, // Chrome headless
      navigator.webdriver,
      window.callPhantom || window._phantom,
      window.phantom,
      window.__nightmare,
      navigator.userAgent.includes('Headless'),
      navigator.userAgent.includes('Node.js'),
      navigator.userAgent.includes('PhantomJS')
    ];
    
    if (headlessTests.some(test => test)) {
      this.threatLevel += 3;
      this.detectedThreats.push('Navegador headless detectado');
    }
    
    // Verificar resolução incomum
    if (window.screen.width < 300 || window.screen.height < 300) {
      this.threatLevel += 1;
      this.detectedThreats.push('Resolução de tela suspeita');
    }
    
    // Verificar recursos ausentes
    const missingFeatures = [
      !window.WebGLRenderingContext,
      !window.speechSynthesis,
      !navigator.mediaDevices,
      !navigator.geolocation
    ].filter(Boolean).length;
    
    if (missingFeatures > 2) {
      this.threatLevel += 2;
      this.detectedThreats.push(`${missingFeatures} recursos críticos ausentes`);
    }
  }

  scanPlugins() {
    const dangerousPlugins = [
      'Chrome PDF Viewer',
      'Chromium PDF Viewer',
      'Microsoft Edge PDF Viewer',
      'WebKit built-in PDF'
    ];
    
    const plugins = Array.from(navigator.plugins).map(p => p.name);
    const dangerousFound = plugins.filter(p => dangerousPlugins.includes(p));
    
    if (dangerousFound.length > 0) {
      this.threatLevel += 2;
      this.detectedThreats.push(`Plugins potencialmente perigosos: ${dangerousFound.join(', ')}`);
    }
    
    // Verificar número incomum de plugins
    if (plugins.length > 10 || plugins.length === 0) {
      this.threatLevel += 1;
      this.detectedThreats.push(`Número anômalo de plugins: ${plugins.length}`);
    }
  }

  async checkAnomalies() {
    // Verificar tempo de carregamento (simulação)
    const loadTime = performance.now();
    if (loadTime < 100) {
      this.threatLevel += 1;
      this.detectedThreats.push('Tempo de carregamento anômalo');
    }
    
    // Verificar comportamento do mouse
    let mouseMoves = 0;
    const mouseListener = () => mouseMoves++;
    document.addEventListener('mousemove', mouseListener);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    document.removeEventListener('mousemove', mouseListener);
    
    if (mouseMoves === 0) {
      this.threatLevel += 2;
      this.detectedThreats.push('Nenhum movimento do mouse detectado');
    } else if (mouseMoves > 100) {
      this.threatLevel += 1;
      this.detectedThreats.push('Comportamento do mouse anômalo');
    }
  }

  async checkNetwork() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      // Verificar país de risco
      const riskyCountries = ['RU', 'CN', 'KP', 'IR'];
      if (riskyCountries.includes(data.country)) {
        this.threatLevel += 3;
        this.detectedThreats.push(`Conexão de país de risco: ${data.country_name}`);
      }
      
      // Verificar proxy/VPN
      if (data.vpn || data.proxy || data.tor) {
        this.threatLevel += 2;
        this.detectedThreats.push('Conexão via VPN/Proxy detectada');
      }
    } catch (error) {
      console.error('Erro na verificação de rede:', error);
    }
  }
}

// Inicializar scanner de segurança
const securityScanner = new SecurityScanner();

// Função para verificar segurança ao carregar a página
async function initSecurityChecks() {
  const scanResults = await securityScanner.runFullScan();
  
  if (!scanResults.safe) {
    console.warn('Ameaças detectadas:', scanResults.threats);
    logSecurityEvent('security_alert', scanResults);
    
    // Opcional: Enviar alerta para o servidor
    await sendSecurityAlert(scanResults);
  }
}

// Registrar eventos de segurança
function logSecurityEvent(type, data) {
  const event = {
    type,
    data,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ip: window.userIP || 'unknown'
  };
  
  // Aqui você pode enviar para um serviço de log ou salvar localmente
  console.log('Security Event:', event);
}

// Enviar alerta para o servidor
async function sendSecurityAlert(scanResults) {
  const embed = {
    title: '⚠ ALERTA DE SEGURANÇA',
    color: 0xFF0000,
    fields: [
      { name: 'Nível de Ameaça', value: scanResults.threatLevel.toString(), inline: true },
      { name: 'Seguro', value: scanResults.safe ? '✅ Sim' : '❌ Não', inline: true },
      { name: 'Ameaças Detectadas', value: scanResults.threats.join('\n') || 'Nenhuma' }
    ],
    timestamp: new Date().toISOString()
  };
  
  const payload = {
    embeds: [embed]
  };
  
  try {
    await fetch('https://discord.com/api/webhooks/SEU_WEBHOOK_DE_SECURANCA', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error('Erro ao enviar alerta:', error);
  }
}

// Iniciar verificações quando a página carregar
window.addEventListener('load', () => {
  setTimeout(initSecurityChecks, 5000); // Esperar 5s para não afetar performance
});

// Monitorar eventos suspeitos
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    logSecurityEvent('devtools_attempt', { keyCombo: 'Ctrl+Shift+I' });
  }
});

// Detectar abas em segundo plano
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    logSecurityEvent('tab_backgrounded', { time: new Date().toISOString() });
  }
});
