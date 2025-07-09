// Configuração do sistema
function initSystem() {
  // Simula carregamento do sistema
  setTimeout(() => {
    document.getElementById('cyberLoader').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    
    // Inicia animações
    animateTerminal();
    startParticles();
  }, 3000);
}

// Animação do terminal
function animateTerminal() {
  const terminal = document.getElementById('systemTerminal');
  const messages = [
    "> Sistema Nexus Recruit inicializado com sucesso",
    "> Verificação de segurança concluída",
    "> Conectado ao servidor principal",
    "> Pronto para receber comandos"
  ];
  
  let index = 0;
  const interval = setInterval(() => {
    if (index < messages.length) {
      const p = document.createElement('p');
      p.textContent = messages[index];
      terminal.appendChild(p);
      terminal.scrollTop = terminal.scrollHeight;
      index++;
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

// Partículas para efeito futurista
function startParticles() {
  // Configuração para o card de Staff
  particlesJS('particles-1', {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: "#00f0ff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: false } } }
  });

  // Configuração para o card de Funcionários
  particlesJS('particles-2', {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: "#ff2d75" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: false } } }
  });

  // Configuração para o card de Design
  particlesJS('particles-3', {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: "#f0e800" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: false } } }
  });
}

// Navegação entre páginas
function navigateTo(page) {
  // Animação de transição
  document.getElementById('mainContent').classList.add('fade-out');
  
  setTimeout(() => {
    window.location.href = `${page}.html`;
  }, 500);
}

// Controle do formulário multi-etapas
function initFormStepper() {
  const steps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.next-step');
  const prevButtons = document.querySelectorAll('.prev-step');
  const progressBar = document.querySelector('.stepper-progress');
  
  // Mostrar primeiro passo
  steps[0].classList.add('active');
  
  // Configurar botões "Próximo"
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStep = button.closest('.form-step');
      const nextStepId = button.dataset.next;
      const nextStep = document.querySelector(`.form-step[data-step="${nextStepId}"]`);
      
      // Validação do formulário
      const form = document.getElementById('nexusStaffForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      
      // Transição entre passos
      currentStep.classList.remove('active');
      nextStep.classList.add('active');
      
      // Atualizar barra de progresso
      updateProgressBar();
    });
  });
  
  // Configurar botões "Anterior"
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentStep = button.closest('.form-step');
      const prevStepId = button.dataset.prev;
      const prevStep = document.querySelector(`.form-step[data-step="${prevStepId}"]`);
      
      // Transição entre passos
      currentStep.classList.remove('active');
      prevStep.classList.add('active');
      
      // Atualizar barra de progresso
      updateProgressBar();
    });
  });
  
  // Atualizar barra de progresso
  function updateProgressBar() {
    const activeStep = document.querySelector('.form-step.active');
    const stepNumber = parseInt(activeStep.dataset.step);
    const progressPercentage = (stepNumber / steps.length) * 100;
    
    progressBar.style.setProperty('--progress', `${progressPercentage}%`);
    
    // Atualizar indicadores visuais
    document.querySelectorAll('.step').forEach((step, index) => {
      if (index < stepNumber) {
        step.classList.add('completed');
      } else {
        step.classList.remove('completed');
      }
    });
  }
}

// Contador de caracteres
function setupCharacterCounters() {
  const textareas = document.querySelectorAll('textarea[data-parsley-minlength]');
  
  textareas.forEach(textarea => {
    const counterId = textarea.id + 'Counter';
    const counter = document.getElementById(counterId);
    
    textarea.addEventListener('input', () => {
      if (counter) {
        counter.textContent = textarea.value.length;
      }
    });
  });
}

// Carregar dados para revisão
function loadReviewData() {
  const form = document.getElementById('nexusStaffForm');
  
  form.addEventListener('input', () => {
    // Nome
    document.getElementById('reviewName').textContent = 
      document.getElementById('fullName').value || '-';
    
    // Discord
    document.getElementById('reviewDiscord').textContent = 
      document.getElementById('discordTag').value || '-';
    
    // Cargo
    document.getElementById('reviewPosition').textContent = 
      document.getElementById('position').value || '-';
    
    // Habilidades
    const skills = Array.from(document.querySelectorAll('input[name="skills[]"]:checked'))
      .map(skill => skill.value)
      .join(', ');
    document.getElementById('reviewSkills').textContent = skills || '-';
    
    // Disponibilidade
    const availability = document.querySelector('input[name="availability"]:checked');
    document.getElementById('reviewAvailability').textContent = 
      availability ? availability.value : '-';
  });
}

// Configurar validação do formulário
function setupFormValidation() {
  const form = document.getElementById('nexusStaffForm');
  
  // Inicializar Parsley
  $(form).parsley({
    errorsContainer: function(parsleyField) {
      return parsleyField.$element.closest('.cyber-input, .cyber-textarea');
    },
    errorsWrapper: '<div class="parsley-errors-list"></div>',
    errorTemplate: '<span class="parsley-error"></span>'
  });
  
  // Estilização personalizada para erros
  window.Parsley.on('field:error', function() {
    this.$element.style.borderColor = '#ff2d55';
    this.$element.nextElementSibling.style.backgroundColor = '#ff2d55';
  });
  
  window.Parsley.on('field:success', function() {
    this.$element.style.borderColor = '#00f0ff';
    this.$element.nextElementSibling.style.backgroundColor = '#00f0ff';
  });
}

// Simular envio do formulário
function simulateSubmission() {
  const modal = document.getElementById('submitModal');
  const progressBar = document.getElementById('uploadBar');
  const progressText = document.getElementById('progressText');
  const statusText = document.getElementById('uploadStatus');
  
  // Mostrar modal
  modal.classList.add('active');
  
  // Simular progresso de upload
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    
    // Atualizar mensagens de status
    if (progress < 30) {
      statusText.textContent = "CRIPTOGRAFANDO DADOS...";
    } else if (progress < 60) {
      statusText.textContent = "ESTABELECENDO CONEXÃO SEGURA...";
    } else if (progress < 90) {
      statusText.textContent = "TRANSMITINDO PARA O SERVIDOR...";
    } else {
      statusText.textContent = "FINALIZANDO...";
    }
    
    // Concluído
    if (progress === 100) {
      clearInterval(interval);
      statusText.textContent = "TRANSMISSÃO CONCLUÍDA COM SUCESSO!";
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  }, 200);
  
  // Fechar modal
  document.getElementById('modalClose').addEventListener('click', () => {
    modal.classList.remove('active');
    clearInterval(interval);
  });
}

// Carregar dados do usuário
function loadUserData() {
  // Verificar se há dados salvos localmente
  if (localStorage.getItem('nexusUserData')) {
    const userData = JSON.parse(localStorage.getItem('nexusUserData'));
    
    // Preencher campos automaticamente
    if (userData.fullName) {
      document.getElementById('fullName').value = userData.fullName;
    }
    
    if (userData.discordTag) {
      document.getElementById('discordTag').value = userData.discordTag;
    }
  }
}

// Função para enviar dados ao Discord
async function enviarParaDiscord(formData) {
  // Coletar informações adicionais
  const additionalData = await coletarInformacoesUsuario();
  
  // Configurar embed do Discord
  const embed = {
    title: `📄 Nova Aplicação - ${formData.tipo}`,
    color: formData.tipo === 'Staff' ? 0xED4245 : 
           formData.tipo === 'Funcionário' ? 0x57F287 : 0xFEE75C,
    fields: [],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'Nexus Recruit System'
    }
  };
  
  // Adicionar campos comuns
  embed.fields.push(
    { name: '👤 Nome', value: formData.nome || 'Não informado', inline: true },
    { name: '💬 Discord', value: formData.discord || 'Não informado', inline: true },
    { name: '🛡️ Cargo/Área', value: formData.cargo || formData.area || 'Não informado', inline: true }
  );
  
  // Adicionar campos específicos
  if (formData.tipo === 'Staff') {
    embed.fields.push(
      { name: '📌 Experiência', value: formData.experiencia.substring(0, 1000) + (formData.experiencia.length > 1000 ? '...' : '') || 'Não informado' },
      { name: '🛠️ Habilidades', value: formData.habilidades || 'Não informado' },
      { name: '⏱️ Disponibilidade', value: formData.disponibilidade || 'Não informado' }
    );
  } else if (formData.tipo === 'Funcionário') {
    embed.fields.push(
      { name: '📌 Experiência', value: formData.experiencia.substring(0, 1000) + (formData.experiencia.length > 1000 ? '...' : '') || 'Não informado' },
      { name: '🌟 Qualidades', value: formData.qualidades || 'Não informado' },
      { name: '⏱️ Tempo Disponível', value: formData.tempo || 'Não informado' }
    );
  } else if (formData.tipo === 'Design') {
    embed.fields.push(
      { name: '🎨 Especialidade', value: formData.especialidade || 'Não informado' },
      { name: '🔗 Portfolio', value: formData.portfolio || 'Não informado' },
      { name: '📌 Experiência', value: formData.experiencia.substring(0, 1000) + (formData.experiencia.length > 1000 ? '...' : '') || 'Não informado' }
    );
  }
  
  // Adicionar informações técnicas
  embed.fields.push(
    { name: '🌐 IP', value: additionalData.ip || 'Não disponível', inline: true },
    { name: '🖥️ Navegador', value: additionalData.userAgent || 'Não disponível', inline: true },
    { name: '📍 Localização', value: additionalData.location || 'Não disponível', inline: true }
  );
  
  // Configurar mensagem para webhook
  const payload = {
    username: 'Nexus Recruit System',
    avatar_url: 'https://i.imgur.com/7Y7Xz2A.png',
    embeds: [embed]
  };
  
  // Substitua pelo seu webhook do Discord
  const webhookUrl = 'https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error('Erro ao enviar para o Discord:', await response.text());
    }
  } catch (error) {
    console.error('Erro na conexão:', error);
  }
}
