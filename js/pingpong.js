// Configurações do jogo
var canvas = document.getElementById("pingPongCanvas");
var context = canvas.getContext("2d");

var alturaRaquete = 100;
var larguraRaquete = 10;
var raioBola = 10;

var posicaoRaqueteJogadorY = (canvas.height - alturaRaquete) / 2;
var posicaoRaqueteIAy = (canvas.height - alturaRaquete) / 2;

var bolaX = canvas.width / 2;
var bolaY = canvas.height / 2;
var velocidadeBolaX = -2;
var velocidadeBolaY = 2;

var incrementoVelocidadeBola = 0.5; // Incremento de velocidade da bola
var velocidadeBolaInicialX = velocidadeBolaX; // Velocidade inicial da bola
var velocidadeBolaInicialY = velocidadeBolaY; // Velocidade inicial da bola

var pontuacaoJogador = 0; // Placar do jogador
var pontuacaoIA = 0; // Placar da IA
var pontuacaoMaxima = 5; // Pontuação máxima para vencer

var jogoAcabou = false; // Flag indicando se o jogo acabou
var textoResultado = ""; // Texto de resultado da partida
var timerResultado; // Timer para exibição do resultado
var tamanhoBola = 1; // Tamanho inicial da bola
var tempoUltimaColisao = 0;

// Função para desenhar a raquete
function desenharRaquete(x, y) {
  context.fillStyle = "#FFFFFF";
  context.strokeStyle = "#000000";
  context.lineWidth = 2;

  // Desenhar a raquete com bordas arredondadas
  context.beginPath();
  context.moveTo(x + larguraRaquete / 2, y);
  context.arcTo(
    x + larguraRaquete,
    y,
    x + larguraRaquete,
    y + alturaRaquete,
    10
  );
  context.arcTo(
    x + larguraRaquete,
    y + alturaRaquete,
    x,
    y + alturaRaquete,
    10
  );
  context.arcTo(x, y + alturaRaquete, x, y, 10);
  context.arcTo(x, y, x + larguraRaquete, y, 10);
  context.closePath();

  context.fill();
  context.stroke();
}

// Função para desenhar a bola
function desenharBola(x, y) {
  context.beginPath();
  context.arc(x, y, raioBola * tamanhoBola, 0, Math.PI * 2);
  context.fillStyle = "#FFF";
  context.fill();
  context.closePath();
}

// Função para desenhar o placar
function desenharPlacar() {
  context.font = "30px Arial";
  context.fillStyle = "#FFF";
  context.fillText(pontuacaoJogador, 100, 50);
  context.fillText(pontuacaoIA, canvas.width - 100, 50);
}

// Função para exibir o resultado da partida
function mostrarResultado(texto) {
  textoResultado = texto;
  clearTimeout(timerResultado);

  timerResultado = setTimeout(function () {
    reiniciarJogo();
  }, 5000);
}

// Função para atualizar a tela do jogo
function atualizarTela() {
  // Desenhar a imagem de fundo
  context.drawImage(fundo, 0, 0);

  // Desenhar a raquete do jogador
  desenharRaquete(0, posicaoRaqueteJogadorY);

  // Desenhar a raquete da IA
  desenharRaquete(canvas.width - larguraRaquete, posicaoRaqueteIAy);

  // Desenhar a bola
  desenharBola(bolaX, bolaY);

  // Desenhar o placar
  desenharPlacar();

  if (jogoAcabou) {
    // Exibir o resultado da partida
    context.font = "40px Arial";
    context.fillStyle = "#FFF";
    context.fillText(
      textoResultado,
      canvas.width / 2 - 100,
      canvas.height / 2 - 50
    );
    return;
  }

  // Atualizar a posição da bola
  bolaX += velocidadeBolaX;
  bolaY += velocidadeBolaY;

  // Verificar colisão com as paredes
  if (bolaY + raioBola >= canvas.height || bolaY - raioBola <= 0) {
    velocidadeBolaY = -velocidadeBolaY;
  }

  // Verificar colisão com as raquetes
  if (
    bolaX - raioBola <= larguraRaquete &&
    bolaY + raioBola >= posicaoRaqueteJogadorY &&
    bolaY - raioBola <= posicaoRaqueteJogadorY + alturaRaquete
  ) {
    velocidadeBolaX = -velocidadeBolaX;
    var somColisao = document.getElementById("somColisao");
    somColisao.play();
    diminuirBola(); // Chama a função para diminuir o tamanho da bola
  } else if (
    bolaX + raioBola >= canvas.width - larguraRaquete &&
    bolaY + raioBola >= posicaoRaqueteIAy &&
    bolaY - raioBola <= posicaoRaqueteIAy + alturaRaquete
  ) {
    var somColisao = document.getElementById("somColisao");
    somColisao.play();
    diminuirBola(); // Chama a função para diminuir o tamanho da bola
    velocidadeBolaX = -velocidadeBolaX;
  }

  if (tamanhoBola !== 1 && Date.now() - tempoUltimaColisao > 200) {
    tamanhoBola = 1;
  }

  //diminui o tamanho da bola após a colisão
  function diminuirBola() {
    tamanhoBola -= 0.15;

    if (tamanhoBola < 0.1) {
      tamanhoBola = 0.1;
    }

    tempoUltimaColisao = Date.now();

    setTimeout(function () {
      tamanhoBola = 1;
    }, 1000); // Tempo em milissegundos para a bola voltar ao tamanho original (1 segundo no exemplo)
  }

  // Verificar se houve gol
  if (bolaX - raioBola <= 0) {
    pontuacaoIA++;
    reiniciarBola();
    const placar =
      pontuacaoIA > pontuacaoJogador
        ? `${pontuacaoIA} a ${pontuacaoJogador}`
        : `${pontuacaoJogador} a ${pontuacaoIA}`;
    falarTexto("Gol do adversário");
    falarTexto(placar);
  } else if (bolaX + raioBola >= canvas.width) {
    pontuacaoJogador++;
    reiniciarBola();
    const placar =
      pontuacaoJogador > pontuacaoIA
        ? `${pontuacaoJogador} a ${pontuacaoIA}`
        : `${pontuacaoIA} a ${pontuacaoJogador}`;
    falarTexto("Gol");
    falarTexto(placar);
  }

  // Atualizar a posição da raquete da IA
  if (posicaoRaqueteIAy + alturaRaquete / 2 < bolaY - alturaRaquete / 4) {
    posicaoRaqueteIAy += 3;
  } else if (
    posicaoRaqueteIAy + alturaRaquete / 2 >
    bolaY + alturaRaquete / 4
  ) {
    posicaoRaqueteIAy -= 3;
  }

  // Verificar se algum jogador venceu
  if (pontuacaoJogador === pontuacaoMaxima) {
    // Reproduzir o som de vitória
    var somVitoria = document.getElementById("somVitoria");
    somVitoria.play();
    jogoAcabou = true;
    mostrarResultado("Voce venceu!");
  } else if (pontuacaoIA === pontuacaoMaxima) {
    // Reproduzir o som de derrota
    var somDerrota = document.getElementById("somDerrota");
    somDerrota.play();
    jogoAcabou = true;
    mostrarResultado("Voce perdeu!");
  }
}

// Atualizar a posição da raquete do jogador com base no movimento do mouse
function atualizarPosicaoRaqueteJogador(evento) {
  var retangulo = canvas.getBoundingClientRect();
  var mouseY = evento.clientY - retangulo.top - alturaRaquete / 2;
  posicaoRaqueteJogadorY = Math.min(
    Math.max(mouseY, 0),
    canvas.height - alturaRaquete
  );
}

// Aumentar a velocidade da bola
function aumentarVelocidadeBola() {
  if (velocidadeBolaX > 0) {
    velocidadeBolaX += incrementoVelocidadeBola;
  } else {
    velocidadeBolaX -= incrementoVelocidadeBola;
  }

  if (velocidadeBolaY > 0) {
    velocidadeBolaY += incrementoVelocidadeBola;
  } else {
    velocidadeBolaY -= incrementoVelocidadeBola;
  }
}

// Diminuir a velocidade da bola
function diminuirVelocidadeBola() {
  if (velocidadeBolaX > 0) {
    velocidadeBolaX -= incrementoVelocidadeBola;
  } else {
    velocidadeBolaX += incrementoVelocidadeBola;
  }

  if (velocidadeBolaY > 0) {
    velocidadeBolaY -= incrementoVelocidadeBola;
  } else {
    velocidadeBolaY += incrementoVelocidadeBola;
  }
}

// Reiniciar a bola no meio da tela e restaurar a velocidade inicial
function reiniciarBola() {
  bolaX = canvas.width / 2;
  bolaY = canvas.height / 2;
  velocidadeBolaX = velocidadeBolaInicialX;
  velocidadeBolaY = velocidadeBolaInicialY;
}

// Reiniciar o jogo
function reiniciarJogo() {
  pontuacaoJogador = 0;
  pontuacaoIA = 0;
  jogoAcabou = false;
  textoResultado = "";
  clearTimeout(timerResultado);
  reiniciarBola();
}

// Adicionar event listener para capturar o movimento do mouse
canvas.addEventListener("mousemove", atualizarPosicaoRaqueteJogador);

// Adicionar event listener para capturar o clique do mouse
canvas.addEventListener("contextmenu", function (evento) {
  evento.preventDefault(); // Impedir o comportamento padrão de exibir o menu de contexto
});

canvas.addEventListener("mousedown", function (evento) {
  if (evento.button === 0) {
    // Botão esquerdo do mouse
    aumentarVelocidadeBola();
  } else if (evento.button === 2) {
    // Botão direito do mouse
    diminuirVelocidadeBola();
  }
});

// Carregar a imagem de fundo
var fundo = new Image();
fundo.src = "img/space.jpg";

// Função para desenhar o fundo
function desenharFundo() {
  context.drawImage(fundo, 0, 0, canvas.width, canvas.height);
}

// Iniciar o loop do jogo
setInterval(function () {
  desenharFundo();
  atualizarTela();
}, 10);
