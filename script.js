/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Quantidade inicial modelo
let quantidade = 1;

//Array Carrinho
let carrinho = [];

//Qual a pizza selecionada no modelo
let qualPizza = 0;

const c = (seletor) => document.querySelector(seletor);
const ca = (seletores) => document.querySelectorAll(seletores);


//Listagem das pizzas
pizzasJson.map((valorAtual, indice) => {

    //cloner modelo itens pizza
    let pizzaItem = c('.modelos .pizza-item').cloneNode(true);

    //add atributo especifico a elemento e fornece valor especifico
    pizzaItem.setAttribute('data-key', indice);

    //add dados pizza
    pizzaItem.querySelector('.pizza-item-imagem img').src = valorAtual.img;
    pizzaItem.querySelector('.pizza-item-preco').innerHTML = `R$ ${valorAtual.preco[2].toFixed(2)}`; //template Strings padronizar 2 casas decimais com toFixed();
    pizzaItem.querySelector('.pizza-item-nome').innerHTML = valorAtual.nome;
    pizzaItem.querySelector('.pizza-item-descricao').innerHTML = valorAtual.descricao;

    // Evento cancelar ação padrão atualizar página
    pizzaItem.querySelector('a').addEventListener('click', (evento) => {
        evento.preventDefault();

        //retornar elemento mais proximo
        let key = evento.target.closest('.pizza-item').getAttribute('data-key');


        quantidade = 1;
        qualPizzas = key;

        //add dos pizza 
        c('.pizzagrande img').src = pizzasJson[key].img;
        c('.pizzaInformacao h1').innerHTML = pizzasJson[key].nome;
        c('.pizzaInformacao-descricao').innerHTML = pizzasJson[key].descricao;
        c('.pizzaInformacao-atualPreco').innerHTML = `R$ ${pizzasJson[key].preco[2].toFixed(2)}`;

        //remover selected botão tamanho
        c('.pizzaInformacao-tamanho.selected').classList.remove('selected');


        //chamar função para cada elemento
        ca('.pizzaInformacao-tamanho').forEach((tamanho, tamanhoIndice) => {
            if (tamanhoIndice == 2) {
                tamanho.classList.add('selected');
            }
            tamanho.querySelector('span').innerHTML = pizzasJson[key].tamanho[tamanhoIndice];
        });

        //chamar função para cada elemento e Evento alterar valor/tamanho
        ca('.pizzaInformacao-tamanho').forEach((preco, precoItem) => {
            preco.addEventListener('click', () => {
                c('.pizzaInformacao-atualPreco').innerHTML = `R$ ${pizzasJson[key].preco[precoItem].toFixed(2)}`;
            });
        });

        //visualização dados pizza window area
        c('.pizzaInformacao-quantidade').innerHTML = quantidade;
        c('.pizzaJanelaArea').style.opacity = 0;
        c('.pizzaJanelaArea').style.display = 'flex';


        setTimeout(() => {
            c('.pizzaJanelaArea').style.opacity = 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);

});

//Evento de fechar 
function fecharModelo() {
    c('.pizzaJanelaArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaJanelaArea').style.display = 'none';
    }, 500);
}
ca('.pizzaInformacao-cancelarCelularBotao, .pizzaInformacao-cancelarBotao').forEach((valorAtual) => {
    valorAtual.addEventListener('click', fecharModelo);
});

c('.pizzaInformacao-quantidademenos').addEventListener('click', () => {
    if (quantidade > 1) {
        quantidade--;
        c('.pizzaInformacao-quantidade').innerHTML = quantidade;
    }
});

c('.pizzaInformacao-quantidademais').addEventListener('click', (evento) => {
    quantidade++;
    c('.pizzaInformacao-quantidade').innerHTML = quantidade;
});

ca('.pizzaInformacao-tamanho').forEach((tamanho, indice) => {
    tamanho.addEventListener('click', () => {
        c('.pizzaInformacao-tamanho.selected').classList.remove('selected');
        tamanho.classList.add('selected');
    });
});
//Ação Botão Adicionar no carrinho
//Evento Click no Botão
c('.pizzaInformacao-adicionarBotao').addEventListener('click', () => {
    let tamanho = parseInt(c('.pizzaInformacao-tamanho.selected').getAttribute('data-key'));

    let identificador = pizzasJson[qualPizzas].id + '@' + tamanho;

    let identificadorChave = carrinho.findIndex((indice) => indice.identificador == identificador);
    if (identificadorChave > -1) {
        carrinho[identificadorChave].quantidade += quantidade;
    } else {
        // add no carrinho
        carrinho.push({
            identificador,
            id: pizzasJson[qualPizzas].id,
            tamanho,
            quantidade: quantidade
        });
    }
    atualizarCarrinho();
    fecharModelo();

});
c('.menu-abrir').addEventListener('click', () => {
    if (carrinho.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-fechar').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

function atualizarCarrinho() {
    c('.menu-abrir span').innerHTML = carrinho.length;
    if (carrinho.length > 0) {
        c('aside').classList.add('show');
        c('.carrinho').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in carrinho) {
            let pizzaItem = pizzasJson.find((indice) => indice.id == carrinho[i].id);
            subtotal += pizzaItem.preco[carrinho[i].tamanho] * carrinho[i].quantidade;

            let carrinhoItem = c('.modelos .carrinho-item').cloneNode(true);

            let pizzaNomeTamanho;
            switch (carrinho[i].tamanho) {
                case 0:
                    pizzaNomeTamanho = 'P';
                    break;
                case 1:
                    pizzaNomeTamanho = 'M';
                    break;
                case 2:
                    pizzaNomeTamanho = 'G';
                    break;
            }
            let pizzaNome = `${pizzaItem.nome}(${pizzaNomeTamanho})`;

            carrinhoItem.querySelector('img').src = pizzaItem.img;
            carrinhoItem.querySelector('.carrinho-item-nome').innerHTML = pizzaNome;
            carrinhoItem.querySelector('.carrinho-item-quantidade').innerHTML = carrinho[i].quantidade;
            carrinhoItem.querySelector('.carrinho-item-quantidademenos').addEventListener('click', () => {
                if (carrinho[i].quantidade > 1) {
                    carrinho[i].quantidade--;
                } else {
                    carrinho.splice(i, 1);
                }
                atualizarCarrinho();
            });
            carrinhoItem.querySelector('.carrinho-item-quantidademais').addEventListener('click', () => {
                carrinho[i].quantidade++;
                atualizarCarrinho();
            });

            c('.carrinho').append(carrinhoItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}