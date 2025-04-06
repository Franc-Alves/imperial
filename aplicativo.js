const canvas = document.querySelector("canvas").getContext("2d");
canvas.imageSmoothingEnabled = false;

const radios = document.querySelectorAll(".radio-input");
const texto = document.querySelector(".texto");
const linha = document.querySelector("#linha");
const tamahoFonte = document.querySelector("#tamanhoFonte");
const espessuraLinha = document.querySelector("#espessuraLinha");

let elementosLinhas = new Array();
let elementosTexto = new Array();

let selecionado = null;
let redimensionando = false;
let deslocamentoX = 0;
let deslocamentoY = 0;
let tipoElemento = 0;
let escala = 1;
// let deletarItem = false;
let imagem = new Image();

imagem.src = "hinos/1.png";
imagem.onload = () => {
    canvas.imageSmoothingEnabled = false;
    canvas.canvas.width  =  imagem.width;
    canvas.canvas.height = imagem.height;
    canvas.drawImage(imagem, 0, 0);
};

radios.forEach(radio => {
    radio.addEventListener("change", function() {
        if (this.name == "cores-texto") texto.style.color = this.value;
        else linha.style.background = this.value;
    });
});

// Soltar o botão do mouse
canvas.canvas.addEventListener("mouseup", () => {
    selecionado = null;
    redimensionando = false;
    canvas.canvas.style.cursor = "default";
});

// Detectar clique no elemento
canvas.canvas.addEventListener("mousedown", ( eventos ) => {
    // console.log( eventos.button )
    const rect = canvas.canvas.getBoundingClientRect();
    const escalaX = canvas.canvas.width / rect.width;
    const escalaY = canvas.canvas.height / rect.height;

    const mouseX = ( eventos.clientX - rect.left ) * escalaX;
    const mouseY = ( eventos.clientY - rect.top ) * escalaY;

    // if ( eventos.button == 2 ) deletarItem = true;
    // else deletarItem = false;

    for ( let i = elementosLinhas.length - 1; i >= 0; i-- ) {
        let pontos = elementosLinhas[i][2];

        if ( elementosLinhas[i][3] != 5 && elementosLinhas[i][3] != 6 ) {

            // Pega o canto inferior direito do objeto
            let [x1, y1] = pontos[0]; // canto superior esquerdo
            let [x2, y2] = pontos[2]; // canto inferior direito
            let [x3, y3] = pontos[1]; // canto inferior direito

            // Se clicar no canto direito, entra no modo de redimensionamento
            if ( mouseX >= x2 - 10 && mouseX <= x2 + 5 && mouseY >= y2 && mouseY <= y1 ) {
                selecionado = i;
                tipoElemento = elementosLinhas[i][3]
                redimensionando = true;
                return;
            }

            // Se clicar no canto direito, entra no modo de redimensionamento
            else if ( mouseX >= x2 - 10 && mouseX <= x2 + 5 && mouseY >= y1 && mouseY <= y2 ) {
                selecionado = i;
                tipoElemento = elementosLinhas[i][3]
                redimensionando = true;
                return;
            }

            // Se clicar dentro do objeto, entra no modo de movimentação
            if ( mouseX >= x1 && mouseX <= x2 && mouseY >= y2 && mouseY <= y1 ) {
                selecionado = i;
                redimensionando = false;
                deslocamentoX = mouseX - x1;
                deslocamentoY = mouseY - y1;
                return;
            }

            // Se clicar dentro do objeto, entra no modo de movimentação
            else if ( mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2 ) {
                selecionado = i;
                redimensionando = false;
                deslocamentoX = mouseX - x1;
                deslocamentoY = mouseY - y1;
                return;
            }

            // Se clicar dentro do objeto, entra no modo de movimentação
            else if ( mouseX <= x2 && mouseX >= x3 && mouseY >= y1 && mouseY <= y2 ) {
                selecionado = i;
                redimensionando = false;
                deslocamentoX = mouseX - x1;
                deslocamentoY = mouseY - y1;
                return;
            }

            // Se clicar dentro do objeto, entra no modo de movimentação
            else if ( mouseX >= x2 && mouseX <= x3 && mouseY >= y1 && mouseY <= y2 ) {
                selecionado = i;
                redimensionando = false;
                deslocamentoX = mouseX - x1;
                deslocamentoY = mouseY - y1;
                return;
            }

            // Se clicar dentro do objeto, entra no modo de movimentação
            else if ( mouseX >= x2 && mouseX <= x3 && mouseY <= y1 && mouseY >= y2 ) {
                selecionado = i;
                redimensionando = false;
                deslocamentoX = mouseX - x1;
                deslocamentoY = mouseY - y1;
                return;
            }
        } else {
            canvas.font = `${elementosLinhas[i][0]}px Arial`;
            const metricas = canvas.measureText(elementosLinhas[i][2][1]);

            let [x1, y1] = pontos[0];
            y1 = y1 - metricas.actualBoundingBoxAscent;
            let x2 = x1 + metricas.width;
            let y2 = y1 + metricas.actualBoundingBoxDescent;
            y2 = y1 + ( ~~elementosLinhas[i][0] );

            if ( mouseX >= ( x1 - 3 ) && mouseX <= ( x2 + 3 ) && mouseY >= y1 && mouseY <=  y2 ) {
                selecionado = i;
                redimensionando = false;
                deslocamentoX = mouseX - x1;
                deslocamentoY = mouseY - y1;
                return;
            }

            if ( elementosLinhas[i][3] == 6 ) {
                x2 = x2 + metricas.actualBoundingBoxAscent;
                x1 = x2 + metricas.fontBoundingBoxAscent;
                y1 = y1 + metricas.actualBoundingBoxRight + metricas.actualBoundingBoxAscent;

                if (mouseX >= x2 && mouseX <= x1 + 5 && mouseY >= y2 &&  mouseY <= y1 + 5) {
                    selecionado = i;
                    redimensionando = false;
                    deslocamentoX = mouseX - x1;
                    deslocamentoY = mouseY - y1;
                    return;
                }
            }

        }
    }
});

// Movimentar ou redimensionar o elemento enquanto o mouse está pressionado
canvas.canvas.addEventListener("mousemove", ( eventos ) => {
    if (selecionado === null) return;
    const rect = canvas.canvas.getBoundingClientRect();
    const escalaX = canvas.canvas.width / rect.width;
    const escalaY = canvas.canvas.height / rect.height;

    const mouseX = ( eventos.clientX - rect.left ) * escalaX;
    const mouseY = ( eventos.clientY - rect.top ) * escalaY;

    let pontos = elementosLinhas[selecionado][2];

    if (redimensionando) {
        // Alterar a largura do objeto ao mover o canto direito
        if (elementosLinhas[selecionado][3] == 1) {
            pontos[2][0] = mouseX;
            pontos[3][0] = mouseX;
        }
        
        if (elementosLinhas[selecionado][3] == 2) {
            pontos[0][0] = mouseX;
            pontos[2][0] = mouseX;
        }

        if (elementosLinhas[selecionado][3] == 3 || elementosLinhas[selecionado][3] == 4) {
            pontos[2][0] = mouseX;
        }

        if (elementosLinhas[selecionado][3] == 0) {
            pontos[2][0] = mouseX;
            pontos[3][0] = mouseX;

            pontos[0][1] = mouseY;
            pontos[3][1] = mouseY;
            pontos[4][1] = mouseY;
        }

        canvas.canvas.style.cursor = "ew-resize";
    } else {
        // Mover o objeto
        let dx = mouseX - deslocamentoX;
        let dy = mouseY - deslocamentoY;

        if ( elementosLinhas[selecionado][3] == 1 ) {
            let largura = pontos[2][0] - pontos[0][0];
            let altura  = pontos[2][1] - pontos[0][1];

            pontos[0] = [dx, dy];
            pontos[1] = [dx, dy + altura];
            pontos[2] = [dx + largura, dy + altura];
            pontos[3] = [dx + largura, dy];
        }
        else if ( elementosLinhas[selecionado][3] == 2 ) {
            let largura = pontos[0][0] - pontos[1][0];
            let altura  = pontos[0][1] - pontos[0][1];

            pontos[0] = [dx, dy];
            pontos[1] = [dx-largura, dy+5];
            pontos[2] = [dx, dy + 10];
        }
        else if ( elementosLinhas[selecionado][3] == 3 ) {
            let largura = pontos[2][0] - pontos[0][0];
            let altura  = pontos[2][1] - pontos[0][1];

            pontos[0] = [dx, dy];
            pontos[1] = [dx, dy + altura];
            pontos[2] = [dx + largura, dy + altura];
        }
        else if ( elementosLinhas[selecionado][3] == 4 ) {
            let largura = pontos[2][0] - pontos[0][0];
            let altura  = pontos[2][1] - pontos[0][1];

            pontos[0] = [dx, dy];
            pontos[1] = [dx, dy + altura];
            pontos[2] = [dx + largura, dy + altura];
        }
        else if ( elementosLinhas[selecionado][3] == 5 ) {
            const metricas = canvas.measureText(elementosLinhas[selecionado][2][1]);
            pontos[0] = [ dx +( metricas.width / 4 ), dy + ( ( ~~elementosLinhas[selecionado][0] ) / 2 ) ];
        }
        else if ( elementosLinhas[selecionado][3] == 6 ) {
            pontos[0] = [ dx , dy ];
            console.log(pontos[0])
        }
        else if ( elementosLinhas[selecionado][3] == 0 ) {
            let largura = pontos[2][0] - pontos[0][0];
            let altura  = pontos[2][1] - pontos[0][1];

            pontos[0] = [dx, dy];
            pontos[1] = [dx, dy + altura];
            pontos[2] = [dx + largura, dy + altura];
            pontos[3] = [dx + largura, dy];
            pontos[4] = [dx, dy];
        }

        canvas.canvas.style.cursor = "move";
    }
    desenharCanvas();
});

document.querySelector('#tamanhoFonte').addEventListener('input', function() {
    texto.style.fontSize = `${this.value}px`;
});

document.querySelector('#espessuraLinha').addEventListener('input', function() {
    linha.style.height = `${this.value}px`;
});

document.querySelectorAll('.menu-item').forEach(( botao ) => {
    botao.addEventListener('click', ( texto ) => {
        elementosLinhas.push(
            [tamahoFonte.value, document.querySelector('input[name="cores-texto"]:checked').value, [
                    [canvas.canvas.width/2-100, centralizarObjetoTela()-6],
                    texto.target.innerHTML,
                ], 5
            ]
        );
        desenharCanvas();
    });
});

document.querySelector('#iconeCresc').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2+100, centralizarObjetoTela()-6],
                [canvas.canvas.width/2    , centralizarObjetoTela()],
                [canvas.canvas.width/2+100, centralizarObjetoTela()+6],
            ], 2
        ]
    );
    desenharCanvas();
});

document.querySelector('#iconeDim').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2-100, centralizarObjetoTela()-6],
                [canvas.canvas.width/2    , centralizarObjetoTela()],
                [canvas.canvas.width/2-100, centralizarObjetoTela()+6],
            ], 2
        ]
    );
    desenharCanvas();
});

document.querySelector('#afrase').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2      , centralizarObjetoTela() - 15],
                [canvas.canvas.width/2      , centralizarObjetoTela()],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela()],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela() - 15],
            ], 1
        ]
    );
    desenharCanvas();
});

document.querySelector('#bfrase').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2      , centralizarObjetoTela()],
                [canvas.canvas.width/2      , centralizarObjetoTela() - 15],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela() - 15],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela()],
            ], 1
        ]
    );
    desenharCanvas();
});

document.querySelector('#cfrase').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2      , centralizarObjetoTela()],
                [canvas.canvas.width/2      , centralizarObjetoTela() - 15],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela() - 15],
            ], 3
        ]
    );
    desenharCanvas();
});

document.querySelector('#dfrase').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2      , centralizarObjetoTela()],
                [canvas.canvas.width/2      , centralizarObjetoTela()+15],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela()+15],
            ], 4
        ]
    );
    desenharCanvas();
});

document.querySelector('#efrase').addEventListener('click', function( eventos ) {
    elementosLinhas.push(
        [espessuraLinha.value, document.querySelector('input[name="cores-linhas"]:checked').value, [
                [canvas.canvas.width/2      , centralizarObjetoTela()],
                [canvas.canvas.width/2      , centralizarObjetoTela() - 15],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela() - 15],
                [canvas.canvas.width/2 + 100, centralizarObjetoTela()],
                [canvas.canvas.width/2 -1   , centralizarObjetoTela()],
            ], 0
        ]
    );
    desenharCanvas();
});

document.querySelector('#pesquisar').addEventListener('click', () => {
    while( elementosLinhas.length > 0 ) elementosLinhas.pop();
    let numero = ~~imagem.src.split('/')[imagem.src.split('/').length-1].split('.')[0];
    let hinos  = document.querySelector('#hinos').value;

    if ( numero !=  hinos ) {
        window.scrollTo( { top: 0, behavior: 'smooth' } );
        imagem.src = `hinos/${hinos}.png`;
        imagem.onload = () => {
            canvas.imageSmoothingEnabled = false;
            canvas.canvas.width  =  imagem.width;
            canvas.canvas.height = imagem.height;
            canvas.drawImage( imagem, 0, 0 );
        };
    }
});

document.querySelectorAll('.fermata').forEach(( botao ) => {
    botao.addEventListener('click', ( texto ) => {
        elementosLinhas.push(
            [tamahoFonte.value, document.querySelector('input[name="cores-texto"]:checked').value, [
                    [canvas.canvas.width/2-100, centralizarObjetoTela()-6],
                    texto.target.id.toLocaleUpperCase(),
                ], 5
            ]
        );
        desenharCanvas();
    });
});

document.querySelector('#quantidadeTom').addEventListener('click', ( texto ) => {
    elementosLinhas.push(
        [tamahoFonte.value, document.querySelector('input[name="cores-texto"]:checked').value, [
                [canvas.canvas.width/2-100, centralizarObjetoTela()-6],
                `${document.querySelector('#tomsemitom').value.toLocaleUpperCase()}T`,
            ], 5
        ]
    );
    desenharCanvas();
});

document.querySelector('#quantidadeCompasso').addEventListener('click', ( texto ) => {
    elementosLinhas.push(
        [tamahoFonte.value, document.querySelector('input[name="cores-texto"]:checked').value, [
                [canvas.canvas.width/2-100, centralizarObjetoTela()-6],
                `${document.querySelector('#compasso').value.toLocaleUpperCase()}`,
            ], 5
        ]
    );
    desenharCanvas();
});

document.querySelector('#quantidadeSistema').addEventListener('click', ( texto ) => {
    elementosLinhas.push(
        [tamahoFonte.value, document.querySelector('input[name="cores-texto"]:checked').value, [
                [canvas.canvas.width/2-100, centralizarObjetoTela()-6],
                `${document.querySelector('#sistema').value.toLocaleUpperCase()}º Sist.`,
            ], 5 //6
        ]
    );
    desenharCanvas();
});

document.querySelector('#zoomAumentar').addEventListener('click', () => { ajustarZoom(1.1); });
document.querySelector('#zoomDiminuir').addEventListener('click', () => { ajustarZoom(0.9); });

// Vai aumentar o zoom das imagem
function ajustarZoom( porcentagem ) {
    escala *= porcentagem;
    // Definir a origem da transformação para o topo
    canvas.canvas.style.transformOrigin = "top center";
    canvas.canvas.style.transform = `scale(${escala})`;
}

function centralizarObjetoTela() {
    const alturaMaximaScroll = document.documentElement.scrollHeight - window.innerHeight;
    let scrollPorcentagem    = Math.max( 0.20, Math.min( window.scrollY / alturaMaximaScroll, 0.70 ) );
    let tamanhoImagemPorcentagem = 0.20;

    if ( scrollPorcentagem >= 0.20 && scrollPorcentagem <= 0.70 ) tamanhoImagemPorcentagem = scrollPorcentagem;

    return tamanhoImagemPorcentagem * canvas.canvas.height;
}

// Atualizar o canvas com os elementos redesenhados
function desenharCanvas() {
    canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    canvas.drawImage(imagem, 0, 0);

    elementosLinhas.forEach(elemento => {
        if ( elemento[3] != 5 && elemento[3] != 6 ) {
            canvas.lineWidth   = elemento[0];
            canvas.strokeStyle = elemento[1];

            canvas.beginPath();
            elemento[2].forEach((item, indice) => {
                if (indice == 0) canvas.moveTo(item[0], item[1]);
                else canvas.lineTo(item[0], item[1]);
            });
            canvas.stroke();
            canvas.closePath();
        } else {
            if (elemento[3] == 6) {
                canvas.save();
                canvas.translate( canvas.canvas.width / 2,  centralizarObjetoTela());
                canvas.rotate(Math.PI / 2);
                canvas.fillStyle = elemento[1];
                canvas.font = `${elemento[0]}px Arial`;
                canvas.fillText(elemento[2][1], elemento[2][0], elemento[2][1]);
                canvas.restore();
            } else {
                canvas.beginPath();
                canvas.fillStyle = elemento[1];
                canvas.font = `${elemento[0]}px Arial`;
                canvas.fillText(elemento[2][1], elemento[2][0][0], elemento[2][0][1]);
                canvas.closePath();

                if ( elemento[2][1] == "FC" ) {
                    canvas.beginPath();
                    canvas.fillStyle = elemento[1];
                    canvas.font = `${elemento[0]}px Arial`;
                    canvas.fillText(`${elemento[2][1]} = Fermata Conclusiva`, 100, 125);
                    canvas.closePath();

                    canvas.beginPath();
                    canvas.fillStyle = elemento[1];
                    canvas.font = `${elemento[0]}px Arial`;
                    canvas.fillText(`${elemento[2][1]} = Fermata Conclusiva`, 100, canvas.canvas.height - 50);
                    canvas.closePath();
                }

                if ( elemento[2][1] == "FS" ) {
                    canvas.beginPath();
                    canvas.fillStyle = elemento[1];
                    canvas.font = `${elemento[0]}px Arial`;
                    canvas.fillText(`${elemento[2][1]} = Fermata Suspensiva`, 100, 150);
                    canvas.closePath();

                    canvas.beginPath();
                    canvas.fillStyle = elemento[1];
                    canvas.font = `${elemento[0]}px Arial`;
                    canvas.fillText(`${elemento[2][1]} = Fermata Suspensiva`, 100, canvas.canvas.height - 25);
                    canvas.closePath();
                }
            }
        }
    });
}

// Remove itens da lista
function removerItem( item ) { elementosLinhas.splice(item, 1); }

function salvarImagem() {
    let canvasUrl = canvas.canvas.toDataURL("image/jpeg", 0.5);
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;
    createEl.download = `hino-${document.querySelector('#hinos').value}`;
    createEl.click();
    createEl.remove();
}

window.addEventListener("keydown", ( eventos ) => {
    if ( eventos.which == 88 ) if ( selecionado != null ) removerItem( selecionado );
    selecionado = null;
    redimensionando = false;
    canvas.canvas.style.cursor = "default";
    desenharCanvas();
});

document.addEventListener('contextmenu', event => event.preventDefault());