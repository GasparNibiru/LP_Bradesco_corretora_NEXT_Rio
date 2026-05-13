document.addEventListener('DOMContentLoaded', function(){
      const toggle = document.querySelector('.menu-toggle');
      const nav = document.querySelector('.nav');
      if(toggle){
        toggle.addEventListener('click', () => nav.classList.toggle('active'));
      }
    });

    document.addEventListener('click', function(e){
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const id = a.getAttribute('href');
      if(id.length > 1){
        e.preventDefault();
        document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
      }
    });

    (function(){
      const slider = document.querySelector('.plans-slider');
      if(!slider) return;

      const track = slider.querySelector('.track');
      const slides = [...slider.querySelectorAll('.slide')];
      const btnPrev = slider.querySelector('.nav-btn.prev');
      const btnNext = slider.querySelector('.nav-btn.next');
      const dotsWrap = document.querySelector('.dots');

      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
        b.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(b);
      });

      function updateDots(index){
        [...dotsWrap.children].forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
      }

      function slideWidth(){
        const style = getComputedStyle(track);
        const gap = parseInt(style.columnGap || style.gap) || 0;
        return slides[0].getBoundingClientRect().width + gap;
      }

      function indexNow(){
        return Math.round(track.scrollLeft / slideWidth());
      }

      function goTo(idx){
        track.scrollTo({left: idx * slideWidth(), behavior: 'smooth'});
        updateDots(idx);
      }

      btnPrev.addEventListener('click', () => goTo(Math.max(0, indexNow() - 1)));
      btnNext.addEventListener('click', () => goTo(Math.min(slides.length - 1, indexNow() + 1)));
      track.addEventListener('scroll', () => updateDots(indexNow()));

      let isDown = false, startX = 0, startScroll = 0;
      track.addEventListener('pointerdown', e => {
        isDown = true;
        startX = e.clientX;
        startScroll = track.scrollLeft;
        track.setPointerCapture(e.pointerId);
      });
      track.addEventListener('pointermove', e => {
        if(!isDown) return;
        track.scrollLeft = startScroll - (e.clientX - startX);
      });
      track.addEventListener('pointerup', () => {
        isDown = false;
        goTo(indexNow());
      });

      updateDots(0);
    })();

    (function(){
      const wrap = document.querySelector('.side-hospitals');
      if(!wrap) return;

      const track = wrap.querySelector('.side-hospitals__track');
      const prev = wrap.querySelector('.sh-btn.prev');
      const next = wrap.querySelector('.sh-btn.next');

      const step = () => track.firstElementChild
        ? track.firstElementChild.getBoundingClientRect().width + 12
        : 290;

      prev.addEventListener('click', () => track.scrollBy({left: -step(), behavior: 'smooth'}));
      next.addEventListener('click', () => track.scrollBy({left: step(), behavior: 'smooth'}));

      let down = false, startX = 0, startLeft = 0, pid = 0;
      const onDown = e => {
        down = true;
        startX = (e.touches ? e.touches[0].clientX : e.clientX);
        startLeft = track.scrollLeft;
        pid = (e.pointerId || 0);
        track.setPointerCapture?.(pid);
      };
      const onMove = e => {
        if(!down) return;
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        track.scrollLeft = startLeft - (x - startX);
      };
      const onUp = () => {
        down = false;
        try{ track.releasePointerCapture?.(pid); }catch(e){}
      };

      track.addEventListener('pointerdown', onDown);
      track.addEventListener('pointermove', onMove);
      track.addEventListener('pointerup', onUp);
      track.addEventListener('touchstart', onDown, {passive:true});
      track.addEventListener('touchmove', onMove, {passive:true});
      track.addEventListener('touchend', onUp);
    })();

    (function(){
      const form = document.getElementById('formCotacao');
      const PHONE = '5521977301089';
      if(!form) return;

      form.addEventListener('submit', function(e){
        e.preventDefault();

        const data = {
          nome: form.nome.value.trim(),
          whatsapp: form.whatsapp.value.trim(),
          email: form.email.value.trim(),
          qtd: form.quantidade.value.trim(),
          idades: form.idades.value.trim(),
          possui: (form.querySelector('input[name="possui_plano"]:checked') || {}).value || 'Não informado'
        };

        if(!data.nome || !data.whatsapp || !data.email || !data.qtd || !data.idades){
          alert('Preencha os campos obrigatórios.');
          return;
        }

        const linhas = [
          'Olá, gostaria de saber mais sobre o Bradesco Saúde para a região do Rio de Janeiro. Minhas informações:',
          `• Nome: ${data.nome}`,
          `• WhatsApp: ${data.whatsapp}`,
          `• E-mail: ${data.email}`,
          `• Pessoas no plano: ${data.qtd}`,
          `• Idades: ${data.idades}`,
          `• Já possui plano? ${data.possui}`
        ];

        const msg = encodeURIComponent(linhas.join('\n'));
        window.open(`https://wa.me/${PHONE}?text=${msg}`, '_blank', 'noopener');
      });
    })();
