/* =========================================================================
   PROTOCOLO DE DIABETES - CLONE COMPLETO E IDÊNTICO AO VÍDEO
   ========================================================================= */

const CONFIG = {
  checkoutUrl: 'https://checkout.payt.com.br/x', // Link para onde o botão final direciona
  price: 'R$ 37,90',
  totalAnchor: 'R$ 272,90'
};

// Helper para garantir que SVGs não quebrem as aspas de atributos HTML
const svgUrl = (svg) => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());

const ASSETS = {
  // Imagens reais enviadas pelo usuário
  bannerAbertura: 'img/banner-abertura.png',
  avatarMan: 'img/homem.png',
  avatarWoman: 'img/mulher.png',
  symptomsGraphic: 'img/sintomas.png',
  symptomsGraphicMan: 'img/sintomas-homem.jpg',
  noticiaG1: 'img/noticia-g1.webp',
  audioProtocolo: (typeof AUDIO_DATA !== 'undefined' && AUDIO_DATA.protocolo) ? AUDIO_DATA.protocolo : 'img/Protocolo-de-Diabetes.mp3',
  audio2: (typeof AUDIO_DATA !== 'undefined' && AUDIO_DATA.audio2) ? AUDIO_DATA.audio2 : 'img/audio2.mp3',
  audioProtocoloCriado: (typeof AUDIO_DATA !== 'undefined' && AUDIO_DATA.audio2) ? AUDIO_DATA.audio2 : 'img/audio2.mp3',
  audioProtocoloGerado: (typeof AUDIO_DATA !== 'undefined' && AUDIO_DATA.protocoloGerado) ? AUDIO_DATA.protocoloGerado : 'img/protocologerado.mp3',
  casoGlicosimetro: 'img/glicosimetro-240-105.png',
  casoOnCallPlus: 'img/on-call-plus-355-78.png',
  carousel198: 'img/carrossel-198.png',
  carousel108: 'img/carrossel-108.png',
  carousel588: 'img/carrossel-588.png',
  carousel107: 'img/carrossel-107.png',
  cardLoading: 'img/card-loading-protocolo.png',
  cardOferta: 'img/card-oferta-protocolo.png',

  // Parasita real (Ascaris lumbricoides)
  parasiteMicro: 'img/parasita-ascaris.png',

  // Avatar Ana Lima (foto real da especialista)
  avatarAna: 'img/ana-lima.png',

  // Avatar Rita Limeira (foto real do depoimento etapa 8)
  avatarRita: 'img/rita-limeira.png',

  // Avatar Roberta Lira (foto real do depoimento checkout)
  avatarRoberta: 'img/roberta-lira.png',

  // Abacate (foto real)
  avocadoImg: 'img/abacate.png',

  // Avatares Antes e Depois do Checkout (adaptativos por gênero com fundo branco)
  mulherAntes: 'img/mulher-antes.png',
  mulherDepois: 'img/mulher-depois.png',
  homemAntes: 'img/homem-antes.png',
  homemDepois: 'img/homem-depois.png',

  // Banner Garantia 30 Dias (foto real enviada pelo usuário)
  guaranteeBanner: 'img/garantia-30-dias.png',

  // Depoimento em Vídeo Maria
  videoMariaThumb: 'img/depoimento-maria-thumb.jpg'
};

/* =========================================================================
   ESTADO DO QUIZ
   ========================================================================= */
let currentScreen = 0;
let userGender = 'mulher';
// Atalho para teste rápido: aceita ?etapa=X ou #X e ?genero=homem|mulher na URL
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('etapa')) {
    currentScreen = parseInt(urlParams.get('etapa'), 10) || 0;
  } else if (window.location.hash) {
    const hashNum = parseInt(window.location.hash.replace('#', ''), 10);
    if (!isNaN(hashNum)) currentScreen = hashNum;
  }
  if (urlParams.has('genero')) {
    userGender = urlParams.get('genero').toLowerCase();
  }
}
let answers = {
  sintomas1ano: null,
  desparasitou: null,
  gravidade: null,
  concordaDoces: null,
  sintomasIncomodam: [],
  atrapalhaVida: null,
  interesse14dias: null,
  medicamentos: [],
  frequenciaGlicose: null,
  saudeImportante: null,
  compromisso: null
};

const $screenContainer = document.getElementById('screenContainer');
const $progressBar = document.getElementById('progressBar');
const $btnBack = document.getElementById('btnBack');
const $topbar = document.getElementById('topbar');

const TOTAL_STEPS = 18;

function updateProgress() {
  if (currentScreen === 0) {
    $progressBar.style.width = '0%';
    $btnBack.style.visibility = 'hidden';
  } else {
    $btnBack.style.visibility = 'visible';
    const pct = Math.min(100, Math.round((currentScreen / TOTAL_STEPS) * 100));
    $progressBar.style.width = pct + '%';
  }
}

function nextScreen() {
  currentScreen++;
  renderScreen();
  window.scrollTo(0, 0);
}

function prevScreen() {
  if (currentScreen > 0) {
    currentScreen--;
    renderScreen();
    window.scrollTo(0, 0);
  }
}

$btnBack.addEventListener('click', prevScreen);

/* =========================================================================
   PLAYER DE ÁUDIO REAL & EQUALIZADOR ANIMADO
   ========================================================================= */
function formatAudioTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function createAudioPlayerHTML(author, timer, durationSeconds, audioSrc = '') {
  return `
    <div class="audio-player-card" data-duration="${durationSeconds}">
      ${audioSrc ? `<audio class="audio-element" src="${audioSrc}" preload="auto" playsinline><source src="${audioSrc}" type="audio/mpeg"></audio>` : ''}
      <img src="${ASSETS.avatarAna}" alt="${author}" class="audio-avatar">
      <div class="audio-info">
        <span class="audio-author">${author}</span>
        <div class="audio-controls-row">
          <button class="btn-play-pause" type="button" aria-label="Tocar áudio">
            <svg class="icon-play" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg class="icon-pause" style="display:none;" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
          <div class="waveform">
            ${Array.from({ length: 28 }).map((_, i) => `<div class="waveform-bar" style="--i: ${i}; height: ${Math.sin(i * 0.7) * 9 + 12}px;"></div>`).join('')}
          </div>
          <span class="audio-timer">${timer}</span>
        </div>
      </div>
    </div>
  `;
}

function bindAudioPlayers(root) {
  const target = (root && root.querySelectorAll) ? root : document;
  const cards = target.querySelectorAll('.audio-player-card');
  cards.forEach(card => {
    if (card.dataset.bound === 'true') return;
    card.dataset.bound = 'true';

    const audio = card.querySelector('.audio-element');
    const playBtn = card.querySelector('.btn-play-pause');
    const playIcon = card.querySelector('.icon-play');
    const pauseIcon = card.querySelector('.icon-pause');
    const waveform = card.querySelector('.waveform');
    const timerSpan = card.querySelector('.audio-timer');
    const bars = card.querySelectorAll('.waveform-bar');
    const defaultDuration = parseInt(card.dataset.duration || '33', 10);

    const setPlayingUI = (playing) => {
      if (playing) {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (waveform) waveform.classList.add('playing');
      } else {
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (waveform) waveform.classList.remove('playing');
      }
    };

    if (audio) {
      const updateProgress = () => {
        const dur = (audio.duration && !isNaN(audio.duration) && audio.duration > 0) ? audio.duration : defaultDuration;
        const cur = audio.currentTime || 0;
        if (timerSpan) timerSpan.textContent = formatAudioTime(cur);

        const pct = dur > 0 ? (cur / dur) : 0;
        const activeIndex = Math.floor(pct * bars.length);
        bars.forEach((b, idx) => {
          if (idx <= activeIndex && cur > 0) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
      };

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration) && audio.paused && audio.currentTime === 0) {
          if (timerSpan) timerSpan.textContent = formatAudioTime(audio.duration);
        }
      });

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('play', () => setPlayingUI(true));
      audio.addEventListener('pause', () => setPlayingUI(false));

      audio.addEventListener('ended', () => {
        setPlayingUI(false);
        bars.forEach(b => b.classList.remove('active'));
        const dur = (audio.duration && !isNaN(audio.duration)) ? audio.duration : defaultDuration;
        if (timerSpan) timerSpan.textContent = formatAudioTime(dur);
      });

      const togglePlay = (e) => {
        if (e) e.stopPropagation();

        if (audio.paused) {
          // Pausar qualquer outro áudio tocando na página
          document.querySelectorAll('audio').forEach(other => {
            if (other !== audio) {
              try { other.pause(); } catch(err) {}
            }
          });

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setPlayingUI(true);
            }).catch(err => {
              console.warn('Reprodução bloqueada, tentando forçar reload:', err);
              audio.load();
              audio.play().then(() => setPlayingUI(true)).catch(e => console.error('Erro play final:', e));
            });
          }
        } else {
          audio.pause();
          setPlayingUI(false);
        }
      };

      if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.waveform') || e.target.closest('.btn-play-pause')) return;
        togglePlay(e);
      });

      if (waveform) {
        waveform.addEventListener('click', (e) => {
          e.stopPropagation();
          const rect = waveform.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = Math.max(0, Math.min(1, clickX / rect.width));
          const dur = (audio.duration && !isNaN(audio.duration)) ? audio.duration : defaultDuration;
          audio.currentTime = pct * dur;
          updateProgress();
          if (audio.paused) {
            audio.play().then(() => setPlayingUI(true)).catch(() => {});
          }
        });
      }

    } else {
      // Simulação para telas sem áudio MP3 definido
      let isPlaying = false;
      let simSecs = 0;
      let simTimer = null;

      const toggleSimPlay = (e) => {
        if (e) e.stopPropagation();
        isPlaying = !isPlaying;
        setPlayingUI(isPlaying);

        if (isPlaying) {
          simTimer = setInterval(() => {
            simSecs++;
            if (simSecs > defaultDuration) {
              clearInterval(simTimer);
              isPlaying = false;
              setPlayingUI(false);
              bars.forEach(b => b.classList.remove('active'));
              if (timerSpan) timerSpan.textContent = formatAudioTime(defaultDuration);
              simSecs = 0;
              return;
            }
            if (timerSpan) timerSpan.textContent = formatAudioTime(simSecs);
            const pct = simSecs / defaultDuration;
            const activeIdx = Math.floor(pct * bars.length);
            bars.forEach((b, i) => {
              if (i <= activeIdx) b.classList.add('active');
              else b.classList.remove('active');
            });
          }, 1000);
        } else {
          clearInterval(simTimer);
        }
      };

      if (playBtn) playBtn.addEventListener('click', toggleSimPlay);
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-play-pause')) return;
        toggleSimPlay(e);
      });
    }
  });
}

/* =========================================================================
   TELAS DO FUNIL (0 a 18)
   ========================================================================= */

function renderScreen() {
  // Parar áudio anterior ao trocar de tela
  document.querySelectorAll('audio').forEach(a => {
    try {
      a.pause();
      a.currentTime = 0;
    } catch (e) {}
  });

  updateProgress();
  $screenContainer.innerHTML = '';
  const screenDiv = document.createElement('div');
  screenDiv.className = 'screen-fade';

  switch (currentScreen) {
    // -------------------------------------------------------------
    // ETAPA 0: TELA DE ABERTURA / PROMESSA
    // -------------------------------------------------------------
    case 0:
      screenDiv.innerHTML = `
        <div class="banner-abertura-wrap">
          <img src="${ASSETS.bannerAbertura}" alt="Protocolo da Diabetes" class="banner-abertura-img">
          <button class="btn-green-bubble" id="btnStartQuiz">
            QUERO APRENDER TAMBÉM !
          </button>
        </div>
      `;
      screenDiv.querySelector('#btnStartQuiz').onclick = nextScreen;
      break;

    // -------------------------------------------------------------
    // ETAPA 1: SEGMENTAÇÃO POR GÊNERO
    // -------------------------------------------------------------
    case 1:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">Vamos iniciar sua avaliação</h2>
        <p class="quiz-subtitle">Selecione sua opção abaixo!</p>
        <div class="gender-cards-row">
          <div class="gender-card" id="genderMan">
            <img src="${ASSETS.avatarMan}" class="gender-card-img" alt="Sou Homem">
            <span class="gender-card-label">Sou Homem</span>
          </div>
          <div class="gender-card" id="genderWoman">
            <img src="${ASSETS.avatarWoman}" class="gender-card-img" alt="Sou mulher">
            <span class="gender-card-label">Sou mulher</span>
          </div>
        </div>
      `;
      screenDiv.querySelector('#genderMan').onclick = () => {
        userGender = 'homem';
        nextScreen();
      };
      screenDiv.querySelector('#genderWoman').onclick = () => {
        userGender = 'mulher';
        nextScreen();
      };
      break;

    // -------------------------------------------------------------
    // ETAPA 2: TRIAGEM DE SINTOMAS (1 ANO)
    // -------------------------------------------------------------
    case 2:
      const currentSymptomsImg = userGender === 'homem' ? ASSETS.symptomsGraphicMan : ASSETS.symptomsGraphic;
      screenDiv.innerHTML = `
        <div class="symptoms-card-wrap" style="text-align: center; margin-bottom: 16px;">
          <img src="${currentSymptomsImg}" alt="Sintomas há mais de 1 ano" style="width: 100%; max-width: 440px; height: auto; border-radius: 14px; display: block; margin: 0 auto;">
        </div>
        <button class="btn-green-bubble" id="sintoMais1">
          Sinto mais de 1 😓
        </button>
        <button class="btn-green-bubble" id="sintoMais2">
          Sinto 2 ou mais 😬
        </button>
      `;
      screenDiv.querySelector('#sintoMais1').onclick = () => { answers.sintomas1ano = 'mais_de_1'; nextScreen(); };
      screenDiv.querySelector('#sintoMais2').onclick = () => { answers.sintomas1ano = '2_ou_mais'; nextScreen(); };
      break;

    // -------------------------------------------------------------
    // ETAPA 3: HISTÓRICO DE DESPARASITAÇÃO
    // -------------------------------------------------------------
    case 3:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">Você já <span class="highlight-green">Desparasitou</span> de alguma maneira?</h2>
        <p class="quiz-subtitle">Utilizando remédios ou formas naturais.</p>
        <button class="btn-green-bubble" id="nuncaDesparasitei">
          😐 Não, eu nunca desparasitei.
        </button>
        <button class="btn-green-bubble" id="jaDesparasitei">
          😄 Sim, eu já desparasitei.
        </button>
      `;
      screenDiv.querySelector('#nuncaDesparasitei').onclick = () => { answers.desparasitou = 'nunca'; nextScreen(); };
      screenDiv.querySelector('#jaDesparasitei').onclick = () => { answers.desparasitou = 'ja'; nextScreen(); };
      break;

    // -------------------------------------------------------------
    // ETAPA 4: TELA DE ALERTA / NOTÍCIA G1
    // -------------------------------------------------------------
    case 4:
      screenDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 16px; padding: 0 4px;">
          <p style="font-size: 17px; font-weight: 800; line-height: 1.35; margin-bottom: 12px;">
            <span style="color: #dc2626;">Se você nunca fez uma Desparasitação Natural, cuidado:</span>
            <span style="color: #0f172a;">os vermes podem se multiplicar no seu corpo e alcançar órgãos vitais como cérebro, coração e pulmões.</span><br>
            <span style="color: #0f172a;">Não ignore esse risco,</span>
            <span style="color: #65a30d;">é essencial desparasitar pelo menos uma vez ao ano!</span>
          </p>
          <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 14px;">
            <u style="text-underline-offset: 3px;">Veja essa Noticia do G1</u> 👇
          </p>
        </div>
        <div style="border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0; margin-bottom: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.06);">
          <img src="${ASSETS.noticiaG1}" alt="Notícia G1" style="width: 100%; height: auto; display: block;">
        </div>
        <button class="btn-green-bubble" id="btnContinuarG1">
          Continuar !
        </button>
      `;
      screenDiv.querySelector('#btnContinuarG1').onclick = nextScreen;
      break;

    // -------------------------------------------------------------
    // ETAPA 5: PERCEPÇÃO DE GRAVIDADE
    // -------------------------------------------------------------
    case 5:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Você tem ciência que a <span class="highlight-green">falta de cuidados com esse assunto</span> pode piorar sua diabetes e deixar sequelas que podem ser irreversíveis?
        </h2>
        <p class="quiz-subtitle">Por favor, seja sincero.</p>
        <button class="btn-green-bubble" id="seiGravidade">
          😔 Sim, eu sei da gravidade que é ter parasitas habitando o meu intestino
        </button>
        <button class="btn-green-bubble" id="naoSabiaGravidade">
          😰 Não sabia da gravidade, mais quero cuidar.
        </button>
      `;
      screenDiv.querySelector('#seiGravidade').onclick = () => { answers.gravidade = 'sei'; nextScreen(); };
      screenDiv.querySelector('#naoSabiaGravidade').onclick = () => { answers.gravidade = 'nao_sabia'; nextScreen(); };
      break;

    // -------------------------------------------------------------
    // ETAPA 6: CONCORDÂNCIA COM A TESE
    // -------------------------------------------------------------
    case 6:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Você concorda comigo que na maioria das vezes o consumo <span class="highlight-green">Exagerado de Doces</span> e a má alimentação não é nossa culpa, somos taxados como desequilibrados mas isso se deve ao nosso organismo estar inflamado por conta de parasitas intestinais?
        </h2>
        <p class="quiz-subtitle">Por favor, seja ${userGender === 'homem' ? 'sincero' : 'sincera'}, quero ajudar!</p>
        <button class="btn-green-bubble" id="concordoSim">
          Eu concordo sim!
        </button>
        <button class="btn-green-bubble" id="concordoPartes">
          Concordo em partes.
        </button>
      `;
      screenDiv.querySelector('#concordoSim').onclick = () => { answers.concordaDoces = 'sim'; nextScreen(); };
      screenDiv.querySelector('#concordoPartes').onclick = () => { answers.concordaDoces = 'partes'; nextScreen(); };
      break;

        // -------------------------------------------------------------
    // ETAPA 7: SINTOMAS LISTADOS (MÚLTIPLA SELEÇÃO)
    // -------------------------------------------------------------
    case 7:
      const sintomas = ['INSÔNIA', 'FADIGA', 'SEDE EXCESSIVA', 'FORMIGAMENTO', 'VISÃO EMBAÇADA', 'DORES NO CORPO'];
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Dentro dos sintomas listados abaixo, quais mais te incomodam?
        </h2>
        <p class="quiz-subtitle">Selecione um ou mais.</p>
        <div class="options-list">
          ${sintomas.map(s => `
            <button type="button" class="opt-pill ${answers.sintomasIncomodam.includes(s) ? 'selected' : ''}" data-item="${s}">
              <div class="opt-pill-icon-left">
                <span class="check-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>${s}</span>
              </div>
            </button>
          `).join('')}
        </div>
        <div class="alert-mandatory" id="alertSintomas">
          ⚠️ Por favor, selecione pelo menos uma opção para continuar.
        </div>
        <button class="btn-green-bubble" id="btnContinuarSintomas">
          Continuar
        </button>
      `;

      const btnContinuarSintomas = screenDiv.querySelector('#btnContinuarSintomas');
      const alertSintomas = screenDiv.querySelector('#alertSintomas');

      const updateSintomasBtn = () => {
        const hasSelection = answers.sintomasIncomodam.length > 0;
        btnContinuarSintomas.classList.toggle('disabled', !hasSelection);
        if (hasSelection && alertSintomas) {
          alertSintomas.style.display = 'none';
        }
      };

      updateSintomasBtn();

      screenDiv.querySelectorAll('.opt-pill').forEach(btn => {
        btn.onclick = () => {
          const item = btn.dataset.item;
          btn.classList.toggle('selected');
          if (answers.sintomasIncomodam.includes(item)) {
            answers.sintomasIncomodam = answers.sintomasIncomodam.filter(x => x !== item);
          } else {
            answers.sintomasIncomodam.push(item);
          }
          updateSintomasBtn();
        };
      });

      btnContinuarSintomas.onclick = () => {
        if (answers.sintomasIncomodam.length === 0) {
          if (alertSintomas) {
            alertSintomas.style.display = 'block';
            alertSintomas.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return;
        }
        nextScreen();
      };
      break;

        // -------------------------------------------------------------
    // ETAPA 8: IMPACTO DOS SINTOMAS
    // -------------------------------------------------------------
    case 8:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Os sintomas que você selecionou tem <span class="highlight-green">atrapalhado a sua vida?</span>
        </h2>
        <button class="btn-green-bubble" id="atrapalhaRotina" style="font-size: 15px; line-height: 1.35; padding: 14px 16px;">
          😫 Muito, afetam TOTALMENTE minha rotina;
        </button>
        <button class="btn-green-bubble" id="atrapalhaEsperancoso" style="font-size: 15px; line-height: 1.35; padding: 14px 16px;">
          🤞 Bastante, porém me sinto esperançoso(a) com a DESPARASITAÇÃO;
        </button>
        <button class="btn-green-bubble" id="atrapalhaAcostumei" style="font-size: 15px; line-height: 1.35; padding: 14px 16px;">
          😔 Atrapalham, porém infelizmente me acostumei...
        </button>
        <button class="btn-green-bubble" id="atrapalhaNaoAguento" style="font-size: 15px; line-height: 1.35; padding: 14px 16px;">
          😭 Sim, já virou parte do meu dia a dia, mas não aguento mais viver assim...
        </button>
      `;
      screenDiv.querySelector('#atrapalhaRotina').onclick = () => { answers.atrapalhaVida = 'afetam_totalmente'; nextScreen(); };
      screenDiv.querySelector('#atrapalhaEsperancoso').onclick = () => { answers.atrapalhaVida = 'esperancoso_desparasitacao'; nextScreen(); };
      screenDiv.querySelector('#atrapalhaAcostumei').onclick = () => { answers.atrapalhaVida = 'acostumei'; nextScreen(); };
      screenDiv.querySelector('#atrapalhaNaoAguento').onclick = () => { answers.atrapalhaVida = 'nao_aguento_mais'; nextScreen(); };
      break;

    // -------------------------------------------------------------
    // ETAPA 9: ÁUDIO + CASO (RITA LIMEIRA)
    // -------------------------------------------------------------
    case 9:
      screenDiv.innerHTML = `
        <div class="alert-danger-banner">
          ⚠️ <strong>Os Resultados Não Mentem:</strong> Seus Sintomas estão indicando Algo Muito Perigoso — <u>Ouça Com Atenção!</u>
        </div>
        <p style="text-align:center; font-weight:700; margin-bottom:8px; font-size:14px;">
          Escute essa rápida explicação 👇<br>
          <span style="font-size:12px; font-weight:500; color:#6b7280;">Caso o áudio não inicie, basta clicar nele!</span>
        </p>
        ${createAudioPlayerHTML('Ana Lima', '00:33', 33, ASSETS.audioProtocolo)}
        <h3 style="text-align:center; font-size:16px; font-weight:800; margin-bottom:4px;">Veja so esse caso</h3>
        <p style="text-align:center; font-size:13px; color:#6b7280; margin-bottom:12px;">1 semana após iniciar a desparasitação</p>
        <div style="position: relative; border-radius: 14px; overflow: hidden; border: 1.5px solid #e2e8f0; margin-bottom: 16px; box-shadow: 0 3px 10px rgba(0,0,0,0.06); background: #000;">
          <div style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #f87171; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; backdrop-filter: blur(2px);">
            ANTES
          </div>
          <div style="position: absolute; top: 10px; right: 10px; background: rgba(15, 23, 42, 0.85); color: #4ade80; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; backdrop-filter: blur(2px);">
            DEPOIS
          </div>
          <img src="${ASSETS.casoGlicosimetro}" alt="Resultado do glicosímetro antes (240) e depois (105)" style="width: 100%; height: auto; display: block; border-radius: 12px;">
        </div>
        <div class="testimonial-card">
          <div class="testimonial-header">
            <img src="${ASSETS.avatarRita}" alt="Rita Limeira" class="testimonial-avatar">
            <div>
              <div class="testimonial-name">Rita Limeira</div>
              <div class="testimonial-city">Porto Alegre, RS</div>
            </div>
          </div>
          <p class="testimonial-text">
            Muito obrigada Ana, ja to desparasitando a 30 dias, e meus niveis de glicose estão estaveis, to muito feliz por essa vitoria em minha vida 😭😭😭😭 obrigada vc foi um anjo.
          </p>
        </div>
        <button class="btn-green-bubble" id="btnContinuarRita">
          Continuar
        </button>
      `;
      bindAudioPlayers();
      screenDiv.querySelector('#btnContinuarRita').onclick = nextScreen;
      break;

    // -------------------------------------------------------------
    // ETAPA 10: INTERESSE NO PROTOCOLO
    // -------------------------------------------------------------
    case 10:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Você teria interesse em receber um protocolo personalizado para <span class="highlight-green">Desparasitação em 14 dias?</span>
        </h2>
        <button class="btn-green-bubble" id="queroDemais">
          ✅ Sim, Eu quero demais!
        </button>
        <button class="btn-green-bubble" id="tenhoInteresseDuvidas">
          😃 Tenho interesse, mas quero tirar dúvidas.
        </button>
      `;
      screenDiv.querySelector('#queroDemais').onclick = () => { answers.interesse14dias = 'sim'; nextScreen(); };
      screenDiv.querySelector('#tenhoInteresseDuvidas').onclick = () => { answers.interesse14dias = 'duvidas'; nextScreen(); };
      break;

        // -------------------------------------------------------------
    // ETAPA 11: MEDICAMENTOS EM USO (MÚLTIPLA SELEÇÃO)
    // -------------------------------------------------------------
    case 11:
      const meds = ['Metformina', 'Glifage', 'Glicazida', 'Glimepirida', 'Insulina', 'Uso outros medicamentos', 'Não uso nada no momento'];
      screenDiv.innerHTML = `
        <h2 class="quiz-title">Você está utilizando algum desses medicamentos atualmente?</h2>
        <p class="quiz-subtitle">Selecione uma ou mais opções.</p>
        <div class="options-list">
          ${meds.map(m => `
            <button type="button" class="opt-pill ${answers.medicamentos.includes(m) ? 'selected' : ''}" data-med="${m}">
              <span>${m}</span>
            </button>
          `).join('')}
        </div>
        <div class="alert-mandatory" id="alertMeds">
          ⚠️ Por favor, selecione pelo menos uma opção para continuar.
        </div>
        <button class="btn-green-bubble" id="btnContinuarMeds">
          Continuar
        </button>
      `;

      const btnContinuarMeds = screenDiv.querySelector('#btnContinuarMeds');
      const alertMeds = screenDiv.querySelector('#alertMeds');

      const updateMedsBtn = () => {
        const hasSelection = answers.medicamentos.length > 0;
        btnContinuarMeds.classList.toggle('disabled', !hasSelection);
        if (hasSelection && alertMeds) {
          alertMeds.style.display = 'none';
        }
      };

      updateMedsBtn();

      screenDiv.querySelectorAll('.opt-pill').forEach(btn => {
        btn.onclick = () => {
          const m = btn.dataset.med;
          if (m === 'Não uso nada no momento') {
            if (answers.medicamentos.includes(m)) {
              answers.medicamentos = [];
              btn.classList.remove('selected');
            } else {
              answers.medicamentos = [m];
              screenDiv.querySelectorAll('.opt-pill').forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
            }
          } else {
            answers.medicamentos = answers.medicamentos.filter(x => x !== 'Não uso nada no momento');
            const noneBtn = screenDiv.querySelector('[data-med="Não uso nada no momento"]');
            if (noneBtn) noneBtn.classList.remove('selected');

            btn.classList.toggle('selected');
            if (answers.medicamentos.includes(m)) {
              answers.medicamentos = answers.medicamentos.filter(x => x !== m);
            } else {
              answers.medicamentos.push(m);
            }
          }
          updateMedsBtn();
        };
      });

      btnContinuarMeds.onclick = () => {
        if (answers.medicamentos.length === 0) {
          if (alertMeds) {
            alertMeds.style.display = 'block';
            alertMeds.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return;
        }
        nextScreen();
      };
      break;

    // -------------------------------------------------------------
    // ETAPA 12: FREQUÊNCIA DE MONITORAMENTO
    // -------------------------------------------------------------
    case 12:
      const freqs = [
        { label: 'SEMPRE ANTES DE COMER', emoji: '⚠️' },
        { label: 'UMA VEZ AO DIA', emoji: '✅' },
        { label: 'VARIAS VEZES AO DIA', emoji: '😥' },
        { label: 'ALGUMAS VEZES NA SEMANA', emoji: '🩸' },
        { label: 'AINDA NÃO FAÇO', emoji: '😐' }
      ];
      screenDiv.innerHTML = `
        <h2 class="quiz-title">Com que frequência você realiza monitoramento da sua glicose?</h2>
        <div class="options-list">
          ${freqs.map(f => `
            <button type="button" class="opt-pill" data-freq="${f.label}">
              <span>${f.label}</span>
              <span class="opt-pill-emoji">${f.emoji}</span>
            </button>
          `).join('')}
        </div>
      `;
      screenDiv.querySelectorAll('.opt-pill').forEach(btn => {
        btn.onclick = () => {
          btn.classList.add('selected');
          answers.frequenciaGlicose = btn.dataset.freq;
          setTimeout(nextScreen, 220);
        };
      });
      break;

    // -------------------------------------------------------------
    // ETAPA 13: VALOR DA SAÚDE
    // -------------------------------------------------------------
    case 13:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Você concorda comigo que a nossa saúde <span class="highlight-green">é o nosso bem mais importante?</span>
        </h2>
        <p class="quiz-subtitle">sem ela não somos nada.</p>
        <button class="btn-green-bubble" id="saudeConcordo">
          ✅ Concordo!
        </button>
        <button class="btn-green-bubble" id="saudeNaoConcordo">
          😕 Não concordo.
        </button>
      `;
      screenDiv.querySelector('#saudeConcordo').onclick = () => { answers.saudeImportante = 'sim'; nextScreen(); };
      screenDiv.querySelector('#saudeNaoConcordo').onclick = () => { answers.saudeImportante = 'nao'; nextScreen(); };
      break;

    // -------------------------------------------------------------
    // ETAPA 14: COMPROMISSO + CARROSSEL (DESLIZE COM O DEDO)
    // -------------------------------------------------------------
    case 14:
      screenDiv.innerHTML = `
        <h2 class="quiz-title">
          Você se compromete em seguir nosso <span class="highlight-green">Protocolo de 14 Dias em Casa?</span>
        </h2>
        <p class="quiz-subtitle">vou te ajudar em tudo o que precisar.</p>
        <button class="btn-green-bubble" id="comprometoSim">
          😍 Sim eu me Comprometo!
        </button>
        <button class="btn-green-bubble" id="comprometoTentar">
          😀 Eu vou Tentar!
        </button>
        <div class="carousel-wrap" style="margin-top:20px;">
          <div class="carousel-slides" id="carouselSlides">
            <div class="carousel-slide">
              <img src="${ASSETS.carousel198}" alt="Resultado Glicosímetro 198 mg/dL">
            </div>
            <div class="carousel-slide">
              <img src="${ASSETS.carousel108}" alt="Resultado Glicosímetro 108 mg/dL">
            </div>
            <div class="carousel-slide">
              <img src="${ASSETS.carousel588}" alt="Resultado Glicosímetro 588 mg/dL">
            </div>
            <div class="carousel-slide">
              <img src="${ASSETS.carousel107}" alt="Resultado Glicosímetro 107 mg/dL">
            </div>
          </div>
          <button class="carousel-arrow prev" id="carouselPrev" type="button" aria-label="Imagem anterior">‹</button>
          <button class="carousel-arrow next" id="carouselNext" type="button" aria-label="Próxima imagem">›</button>
          <div class="carousel-dots" id="carouselDots">
            <span class="carousel-dot active" data-index="0"></span>
            <span class="carousel-dot" data-index="1"></span>
            <span class="carousel-dot" data-index="2"></span>
            <span class="carousel-dot" data-index="3"></span>
          </div>
        </div>
      `;
      screenDiv.querySelector('#comprometoSim').onclick = () => { answers.compromisso = 'sim'; nextScreen(); };
      screenDiv.querySelector('#comprometoTentar').onclick = () => { answers.compromisso = 'tentar'; nextScreen(); };
      
      const slides = screenDiv.querySelector('#carouselSlides');
      const dots = screenDiv.querySelectorAll('.carousel-dot');
      const btnPrev = screenDiv.querySelector('#carouselPrev');
      const btnNext = screenDiv.querySelector('#carouselNext');

      const updateActiveDot = () => {
        const slideWidth = slides.clientWidth;
        if (!slideWidth) return;
        const activeIndex = Math.min(dots.length - 1, Math.max(0, Math.round(slides.scrollLeft / slideWidth)));
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIndex);
        });
      };

      slides.addEventListener('scroll', updateActiveDot, { passive: true });

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          slides.scrollTo({ left: index * slides.clientWidth, behavior: 'smooth' });
        });
      });

      if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
          slides.scrollBy({ left: -slides.clientWidth, behavior: 'smooth' });
        });
        btnNext.addEventListener('click', () => {
          slides.scrollBy({ left: slides.clientWidth, behavior: 'smooth' });
        });
      }

      // Suporte a arrastar com o mouse no computador (desktop drag)
      let isDragging = false;
      let startX = 0;
      let scrollStart = 0;

      slides.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - slides.offsetLeft;
        scrollStart = slides.scrollLeft;
        slides.style.cursor = 'grabbing';
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        slides.style.cursor = 'grab';
        const targetIndex = Math.round(slides.scrollLeft / slides.clientWidth);
        slides.scrollTo({ left: targetIndex * slides.clientWidth, behavior: 'smooth' });
      });

      slides.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - slides.offsetLeft;
        const walk = (x - startX) * 1.5;
        slides.scrollLeft = scrollStart - walk;
      });
      break;

    // -------------------------------------------------------------
    // ETAPA 15: ÁUDIO 2 + CASO ON CALL PLUS
    // -------------------------------------------------------------
    case 15:
      screenDiv.innerHTML = `
        <p style="text-align:center; font-weight:700; margin-bottom:8px; font-size:15px;">
          Escute o áudio abaixo: 👇<br>
          <span style="font-size:12px; font-weight:500; color:#6b7280;">Caso o AUDIO não inicie, basta clicar nele!</span>
        </p>
        ${createAudioPlayerHTML('Ana Lima', '00:30', 30, ASSETS.audio2)}
        <h3 style="text-align:center; font-size:16px; font-weight:800; margin-bottom:4px;">Veja só esse caso</h3>
        <p style="text-align:center; font-size:13px; color:#6b7280; margin-bottom:12px;">1 semana após iniciar a desparasitação ➔ <strong>14 DIAS DEPOIS</strong></p>
        <div style="margin-bottom: 20px; border-radius: 14px; overflow: hidden; border: 1.5px solid #e2e8f0; box-shadow: 0 3px 10px rgba(0,0,0,0.06);">
          <img src="${ASSETS.casoOnCallPlus}" alt="Antes de desparasitar 355 e 14 dias depois 78" style="width: 100%; height: auto; display: block; border-radius: 12px;">
        </div>
        <button class="btn-green-bubble" id="btnGerarProtocolo">
          Gerar Protocolo Personalizado! ✅
        </button>
      `;
      screenDiv.querySelector('#btnGerarProtocolo').onclick = nextScreen;

      // Tentar iniciar áudio automaticamente (conforme texto da tela)
      setTimeout(() => {
        const playBtn = screenDiv.querySelector('.btn-play-pause');
        const audioEl = screenDiv.querySelector('.audio-element');
        if (playBtn && audioEl && audioEl.paused) {
          playBtn.click();
        }
      }, 400);
      break;

    // -------------------------------------------------------------
    // ETAPA 16: TELA DE LOADING INTERATIVO (DUAS BARRAS - EFEITO ILUSÓRIO 8 SEGUNDOS)
    // -------------------------------------------------------------
    case 16:
      screenDiv.innerHTML = `
        <div class="loading-card-wrap" style="text-align: center; margin-bottom: 24px;">
          <img src="${ASSETS.cardLoading}" alt="Protocolo da Diabetes - Analisando respostas" style="width: 100%; max-width: 440px; height: auto; border-radius: 18px; display: block; margin: 0 auto; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
        </div>
        <div class="progress-track-wrap">
          <div class="progress-track-label">
            <span>Montando protocolo personalizado</span>
            <span id="loadPct1">7%</span>
          </div>
          <div class="progress-track-bg">
            <div class="progress-track-fill" id="loadBar1" style="width:7%;"></div>
          </div>
        </div>
        <div class="progress-track-wrap">
          <div class="progress-track-label">
            <span>Estamos analisando suas respostas</span>
            <span id="loadPct2">14%</span>
          </div>
          <div class="progress-track-bg">
            <div class="progress-track-fill" id="loadBar2" style="width:14%;"></div>
          </div>
        </div>
      `;

      const currentAtStart = currentScreen;
      const startTime = performance.now();
      const totalDuration = 8000; // Duração total exata de 8 segundos

      function updateLoader(now) {
        if (currentScreen !== currentAtStart) return;
        const elapsed = now - startTime;

        // Barra 2: "Estamos analisando suas respostas" (Mais rápida, efeito ilusório - conclui em ~5.4s)
        const prog2 = Math.min(elapsed / 5400, 1);
        const pct2 = Math.min(100, Math.round(14 + (86 * Math.pow(prog2, 0.78))));

        // Barra 1: "Montando protocolo personalizado" (Mais cadenciada - conclui em ~7.4s)
        const prog1 = Math.min(elapsed / 7400, 1);
        const pct1 = Math.min(100, Math.round(7 + (93 * Math.pow(prog1, 0.96))));

        const elPct1 = document.getElementById('loadPct1');
        const elPct2 = document.getElementById('loadPct2');
        const elBar1 = document.getElementById('loadBar1');
        const elBar2 = document.getElementById('loadBar2');

        if (elPct1) elPct1.textContent = pct1 + '%';
        if (elBar1) elBar1.style.width = pct1 + '%';
        if (elPct2) elPct2.textContent = pct2 + '%';
        if (elBar2) elBar2.style.width = pct2 + '%';

        if (elapsed < totalDuration) {
          requestAnimationFrame(updateLoader);
        } else {
          if (currentScreen === currentAtStart) {
            nextScreen();
          }
        }
      }

      requestAnimationFrame(updateLoader);
      break;

    // -------------------------------------------------------------
    // ETAPA 17: ANÁLISE / DIAGNÓSTICO & REVELAÇÃO DO ABACATE
    // -------------------------------------------------------------
    case 17:
      screenDiv.innerHTML = `
        <div class="compare-table">
          <div class="compare-col">
            <div class="compare-col-header" style="color:#ef4444;">❌ Remédios</div>
            <ul class="compare-list">
              <li>❌ Não acaba de uma vez com a diabetes</li>
              <li>❌ Não elimina nem 50% dos vermes e parasitas</li>
              <li>❌ Fazem muito mal para sua saúde.</li>
              <li>❌ Destrói seu intestino.</li>
            </ul>
          </div>
          <div class="compare-col highlight">
            <div class="compare-col-header" style="color:#4d7c0f;">✅ Nosso Protocolo da diabetes</div>
            <ul class="compare-list">
              <li>✅ Acaba com a diabetes em 14 dias.</li>
              <li>✅ Elimina mais de 150 Parasitas.</li>
              <li>✅ 100% Natural.</li>
              <li>✅ Receita simples e fácil de fazer.</li>
            </ul>
          </div>
        </div>

        <p style="text-align:center; font-weight:700; font-size:14px; margin-bottom:14px;">
          Abaixo está a análise da sua situação atual, baseada nas suas respostas.
        </p>

        <div class="gauge-card">
          <div class="gauge-item" data-target="95">
            <div class="gauge-header">
              <span>Chances de possuir parasitas no organismo</span>
              <span class="gauge-val" style="color:#65a30d;">0%</span>
            </div>
            <div class="gauge-bar-bg">
              <div class="gauge-bar-fill green" style="width:0%;"></div>
              <div class="gauge-thumb green" style="left:0%;"></div>
            </div>
          </div>

          <div class="gauge-item" data-target="66">
            <div class="gauge-header">
              <span>Risco de vida</span>
              <span class="gauge-val" style="color:#ef4444;">0%</span>
            </div>
            <div class="gauge-bar-bg">
              <div class="gauge-bar-fill red" style="width:0%;"></div>
              <div class="gauge-thumb red" style="left:0%;"></div>
            </div>
          </div>

          <div class="gauge-item" data-target="77">
            <div class="gauge-header">
              <span>Chances de contrair doenças autoimunes se não tratar em breve</span>
              <span class="gauge-val" style="color:#ef4444;">0%</span>
            </div>
            <div class="gauge-bar-bg">
              <div class="gauge-bar-fill red" style="width:0%;"></div>
              <div class="gauge-thumb red" style="left:0%;"></div>
            </div>
          </div>

          <div class="gauge-item" data-target="100">
            <div class="gauge-header">
              <span>Chances de Desparasitação</span>
              <span class="gauge-val" style="color:#65a30d;">0%</span>
            </div>
            <div class="gauge-bar-bg">
              <div class="gauge-bar-fill green" style="width:0%;"></div>
              <div class="gauge-thumb green" style="left:0%;"></div>
            </div>
          </div>

          <div class="gauge-item" data-target="100">
            <div class="gauge-header">
              <span>Chances de eliminar a Diabetes por completo</span>
              <span class="gauge-val" style="color:#65a30d;">0%</span>
            </div>
            <div class="gauge-bar-bg">
              <div class="gauge-bar-fill green" style="width:0%;"></div>
              <div class="gauge-thumb green" style="left:0%;"></div>
            </div>
          </div>
        </div>

        <div style="text-align:center; margin-bottom:14px;">
          <h4 style="font-size:15px; font-weight:800; color:#15803d; margin-bottom:4px;">
            Possível agente parasitário de acordo com os seus sintomas:
          </h4>
          <span style="display:inline-block; text-decoration:underline; font-weight:700; font-size:16px;">
            Ascaris lumbricoides
          </span>
        </div>

        <div style="border-radius:14px; overflow:hidden; border:2px solid #ef4444; margin-bottom:14px; background:#000;">
          <img src="${ASSETS.parasiteMicro}" alt="Ascaris lumbricoides" style="width:100%; height:200px; object-fit:cover; display:block;">
        </div>

        <div class="alert-danger-banner">
          ⚠️ <strong>Atenção !</strong><br>
          No nosso Protocolo, você pode ficar tranquilo! <strong>Nenhum verme ou parasita sairá vivo</strong> de forma incômoda. Eles são eliminados <strong>já mortos e desmanchados</strong>, quase imperceptíveis. 😌
        </div>

        <div class="avocado-block">
          <p style="font-weight:700; font-size:14px; color:#166534; line-height:1.4;">
            A Desparasitação ocorrerá primeiramente através de uma <strong>vitamina de abacate com um ingrediente secreto</strong> facilmente encontrado nos mercados e pouco utilizado.
          </p>
          <img src="${ASSETS.avocadoImg}" alt="Abacate" class="avocado-img">
        </div>

        <button class="btn-green-bubble" id="btnGerarTratamento">
          Gerar Protocolo de Tratamento! ✅
        </button>
      `;
      screenDiv.querySelector('#btnGerarTratamento').onclick = nextScreen;

      // Animação das barras e contadores de porcentagem até os valores definidos
      setTimeout(() => {
        const gaugeItems = screenDiv.querySelectorAll('.gauge-item');
        gaugeItems.forEach((item) => {
          const target = parseInt(item.getAttribute('data-target'), 10);
          const fill = item.querySelector('.gauge-bar-fill');
          const thumb = item.querySelector('.gauge-thumb');
          const valEl = item.querySelector('.gauge-val');

          if (fill) fill.style.width = target + '%';
          if (thumb) thumb.style.left = target + '%';

          if (valEl) {
            const duration = 1600;
            const startTime = performance.now();
            const tick = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(ease * target);
              valEl.textContent = current + '%';
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                valEl.textContent = target + '%';
              }
            };
            requestAnimationFrame(tick);
          }
        });
      }, 100);
      break;

    // -------------------------------------------------------------
    // ETAPA 18: OFERTA FINAL / VSL / CHECKOUT
    // -------------------------------------------------------------
    case 18:
      screenDiv.innerHTML = `
        <div class="compare-slider-wrap">
          <div class="compare-card-side">
            <span class="compare-card-title">ANTES</span>
            <img src="${userGender === 'homem' ? ASSETS.homemAntes : ASSETS.mulherAntes}" class="compare-avatar-img" alt="Antes">
            <span class="compare-desc">${userGender === 'homem' ? 'Este é você sofrendo com os parasitas.' : 'Esta é você sofrendo com os parasitas.'}</span>
            <div style="width:100%; height:5px; background:#e2e8f0; border-radius:99px; overflow:hidden;">
              <div style="width:25%; height:100%; background:#ef4444; border-radius:99px;"></div>
            </div>
          </div>
          <div class="compare-card-side">
            <span class="compare-card-title">DEPOIS</span>
            <img src="${userGender === 'homem' ? ASSETS.homemDepois : ASSETS.mulherDepois}" class="compare-avatar-img" alt="Depois">
            <span class="compare-desc">${userGender === 'homem' ? 'Este é você livre da Diabetes' : 'Essa é você livre da Diabetes'}</span>
            <div style="width:100%; height:5px; background:#22c55e; border-radius:99px;"></div>
          </div>
        </div>

        <p style="text-align:center; font-weight:700; font-size:14px; margin-bottom:12px;">
          Escute o Áudio. Irei te explicar como funciona o Protocolo da diabetes. 👇
        </p>
        ${createAudioPlayerHTML('Ana Lima', '00:26', 26, ASSETS.audioProtocoloGerado)}

        <div class="stack-offer-img-card" style="margin-bottom:20px;">
          <img src="${ASSETS.cardOferta}" alt="Protocolo da Diabetes - Tudo o que você vai receber" style="width:100%; height:auto; display:block; border-radius:18px; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
        </div>

        <button class="btn-green-bubble btn-checkout-trigger" id="btnAcessarCheckout" style="font-size:18px; padding:18px; margin-bottom:16px;">
          Acessar meu Protocolo Agora! ✅
        </button>

        <div class="benefits-list">
          <div class="benefit-item">
            <span>✅</span> <div><strong>Pagamento Único</strong><br><span style="font-size:12px; color:#6b7280;">Sem mensalidades.</span></div>
          </div>
          <div class="benefit-item">
            <span>✅</span> <div><strong>Acesso Imediato</strong><br><span style="font-size:12px; color:#6b7280;">Acesso imediato após o pagamento.</span></div>
          </div>
        </div>

        <div class="guarantee-banner-wrap" style="margin-top:16px; margin-bottom:20px;">
          <img src="${ASSETS.guaranteeBanner}" alt="Teste Seguro - 30 dias Garantia" style="width:100%; height:auto; display:block; border-radius:14px; box-shadow:0 3px 10px rgba(0,0,0,0.06);">
        </div>

        <!-- Depoimento em Vídeo Maria (YouTube Facade Responsivo) -->
        <div class="video-testimonial-wrap" id="youtubeVideoWrap" style="margin-top:22px; margin-bottom:18px; border-radius:14px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.12); background:#000; position:relative; aspect-ratio:16/9; cursor:pointer;">
          <div id="videoFacade" style="position:absolute; inset:0; background:url('${ASSETS.videoMariaThumb}') center/cover no-repeat; display:flex; align-items:center; justify-content:center;">
            <!-- Barra Superior estilo YouTube -->
            <div style="position:absolute; top:0; left:0; right:0; padding:10px 14px; background:linear-gradient(to bottom, rgba(0,0,0,0.75), transparent); display:flex; align-items:center; gap:10px; pointer-events:none;">
              <div style="width:28px; height:28px; border-radius:50%; background:#ef4444; color:#fff; font-weight:800; font-size:9px; display:flex; align-items:center; justify-content:center; text-align:center; line-height:1.1;">Dicas<br>do dia</div>
              <span style="color:#ffffff; font-weight:700; font-size:13px; text-shadow:0 1px 2px rgba(0,0,0,0.8); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Depoimento Maria</span>
            </div>

            <!-- Botão Play Vermelho do YouTube -->
            <div class="yt-play-btn" style="width:68px; height:48px; background:rgba(255,0,0,0.92); border-radius:14px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 18px rgba(0,0,0,0.5);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
            </div>

            <!-- Botão Assistir no YouTube no rodapé -->
            <a href="https://youtu.be/gZK0AybZlRU" target="_blank" rel="noopener noreferrer" style="position:absolute; bottom:10px; right:12px; background:rgba(0,0,0,0.75); color:#ffffff; padding:4px 9px; border-radius:4px; font-size:11px; text-decoration:none; display:flex; align-items:center; gap:5px; z-index:2; backdrop-filter:blur(2px);">
              <span>Assistir no</span>
              <strong style="display:flex; align-items:center; gap:3px;"><span style="color:#ff0000; font-size:10px;">▶</span> YouTube</strong>
            </a>
          </div>
        </div>

        <!-- Card Teste 30 Dias Sem Compromisso -->
        <div class="test-30-card" style="border:1.5px solid #22c55e; border-radius:14px; background:#ffffff; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
          <div>
            <div style="font-size:14px; font-weight:800; color:#111827; letter-spacing:0.5px;">TESTE 30 DIAS</div>
            <div style="font-size:12px; color:#4b5563; margin-top:2px; font-weight:500;">sem compromisso</div>
          </div>
          <div style="background:#f1f5f9; border-radius:10px; padding:6px 12px; text-align:right;">
            <div style="font-size:10px; color:#64748b; font-weight:600;">por apenas 5x de</div>
            <div style="font-size:16px; font-weight:900; color:#0f172a; line-height:1.2;">R$ 8,27</div>
          </div>
        </div>

        <!-- Botão CTA 2 -->
        <button class="btn-green-bubble btn-checkout-trigger" style="font-size:17px; padding:17px; margin-bottom:20px;">
          Acessar meu Protocolo Agora! ✅
        </button>

        <!-- Card Depoimento Roberta Lira -->
        <div class="testimonial-card" style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:14px 16px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <div style="display:flex; align-items:center;">
            <img src="${ASSETS.avatarRoberta}" alt="Roberta Lira" style="width:38px; height:38px; border-radius:50%; object-fit:cover; margin-right:12px; border:1px solid #e2e8f0;">
            <div>
              <div style="font-weight:800; font-size:13px; color:#111827;">Roberta Lira</div>
              <div style="font-size:10px; color:#6b7280; font-weight:700; letter-spacing:0.5px;">JOÃO PESSOA, PB</div>
            </div>
          </div>
          <p style="font-size:12px; color:#374151; line-height:1.5; margin-top:10px; margin-bottom:0;">
            Muito obrigada Ana, fiz tudo como vc me passou e já tem 3 meses que não tomo mais nenhum remédio, to livre da diabetes e saudável.
          </p>
        </div>

        <!-- Botão CTA 3 -->
        <button class="btn-green-bubble btn-checkout-trigger" style="font-size:17px; padding:17px; margin-bottom:20px;">
          Acessar meu Protocolo Agora! ✅
        </button>

        <!-- Card Seu Risco é Zero -->
        <div class="zero-risk-card" style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:16px; padding:24px 18px; text-align:center; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" style="color:#0f172a; margin:0 auto 10px; display:block;">
            <path d="M12 2C8.69 2 6 4.69 6 8c0 1.83.82 3.47 2.12 4.56L6.5 22l5.5-2.5 5.5 2.5-1.62-9.44C17.18 11.47 18 9.83 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
          </svg>
          <h4 style="font-size:17px; font-weight:900; color:#111827; margin-bottom:14px;">Seu risco é zero!</h4>
          <p style="font-size:11.5px; color:#1f2937; line-height:1.6; text-align:center; margin:0;">
            ⭕ <strong>O CÓDIGO DE DEFESA DO CONSUMIDOR</strong> GARANTE 7 DIAS DE GARANTIA INCONDICIONAL EM SEU <strong>ART 49</strong>. MAS NÓS CONFIAMOS TANTO NA QUALIDADE DO NOSSO PRODUTO QUE IREMOS <strong>ESTENDER PARA 30 DIAS</strong>. CASO CUMPRA O PROTOCOLO E NÃO TENHA RESULTADOS IREMOS <strong>DEVOLVER O SEU DINHEIRO SEM BUROCRACIA! FAÇA O TESTE SEM COMPROMISSO!</strong>
          </p>
        </div>

        <!-- Botão CTA 4 -->
        <button class="btn-green-bubble btn-checkout-trigger" style="font-size:17px; padding:17px; margin-bottom:24px;">
          Acessar meu Protocolo Agora! ✅
        </button>
      `;
      screenDiv.querySelectorAll('.btn-checkout-trigger').forEach(btn => {
        btn.onclick = () => {
          window.location.href = CONFIG.checkoutUrl;
        };
      });

      // Player de vídeo inteligente (YouTube Facade)
      const videoWrap = screenDiv.querySelector('#youtubeVideoWrap');
      if (videoWrap) {
        videoWrap.onclick = (e) => {
          if (e.target.closest('a')) return;
          if (window.location.protocol === 'file:') {
            window.open('https://youtu.be/gZK0AybZlRU', '_blank');
          } else {
            videoWrap.innerHTML = `
              <iframe src="https://www.youtube.com/embed/gZK0AybZlRU?autoplay=1" title="Depoimento Maria" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>
            `;
          }
        };
      }
      break;
  }

  $screenContainer.appendChild(screenDiv);
  bindAudioPlayers($screenContainer);
}

// Inicializar na primeira tela
renderScreen();
