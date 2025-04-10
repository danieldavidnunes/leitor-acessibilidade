(() => {
  let leitorAtivo = false;
  let ultimoTextoLido = "";

  const btn = document.createElement('button');
  btn.innerText = '🔈 Acessibilidade';
  btn.id = 'botaoLeitorAcessibilidade';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10000,
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
  });

  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', 'Ativar leitura de tela');
  document.body.appendChild(btn);

  const falarTexto = (texto) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    speechSynthesis.speak(fala);
    ultimoTextoLido = texto;
  };

  const obterTextoDoElemento = (el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === 'input' || tag === 'textarea') {
      return el.placeholder?.trim() || '';
    }

    return el.innerText?.trim() || '';
  };

  const deveLer = (el) => {
    if (!el || !el.tagName) return false;

    const tag = el.tagName.toLowerCase();
    const texto = obterTextoDoElemento(el);

    if (tag === 'body' || tag === 'html') return false;
    if (!texto || texto === "" || texto === ultimoTextoLido) return false;

    return true;
  };

  const tentarLerElemento = (el) => {
    if (!leitorAtivo) return;
    if (deveLer(el)) {
      const texto = obterTextoDoElemento(el);
      falarTexto(texto);
    }
  };

  const marcarElementosFocaveis = () => {
    document.querySelectorAll('div, p, span, li, section, article, label, strong, em').forEach(el => {
      const texto = el.innerText?.trim();
      if (texto && !el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('data-leitor-temp', '1');
      }
    });
  };

  const removerElementosFocaveis = () => {
    document.querySelectorAll('[data-leitor-temp="1"]').forEach(el => {
      el.removeAttribute('tabindex');
      el.removeAttribute('data-leitor-temp');
    });
  };

  btn.addEventListener('click', () => {
    leitorAtivo = !leitorAtivo;
    btn.innerText = leitorAtivo ? '🔇 Leitura ativa' : '🔈 Acessibilidade';
    btn.style.backgroundColor = leitorAtivo ? '#28a745' : '#007BFF';
    btn.setAttribute('aria-pressed', leitorAtivo.toString());
    btn.setAttribute('aria-label', leitorAtivo ? 'Desativar leitura de tela' : 'Ativar leitura de tela');

    if (leitorAtivo) {
      marcarElementosFocaveis();
    } else {
      removerElementosFocaveis();
      speechSynthesis.cancel();
      ultimoTextoLido = "";
    }
  });

  document.addEventListener('mouseover', (e) => tentarLerElemento(e.target));
  document.addEventListener('touchstart', (e) => tentarLerElemento(e.target));
  document.addEventListener('focusin', (e) => tentarLerElemento(e.target));
})();
