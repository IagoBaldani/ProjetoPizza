// Array do carrinho de compras
let cart = [];
// Variável de quantidades de pizzas do modal
let modalQt = 1;
// Variável para armazenar qual key está selecionada no modal
let modalKey = 0;

// As funções abaixo tem como intuito resumir a utilização do querySelector e querySelectorAll
const qsl = elemento => document.querySelector(elemento);
const qsla = elemento => document.querySelectorAll(elemento);

//***********************************************************//
//***********************************************************//
// Listagem das pizzas
//***********************************************************//
//***********************************************************//


// Pega o Json e executa a função dentro de cada posição dele
    pizzaJson.map((item, index)=>{
        // Clona toda a estrutura HTML do ".models .pizza-item"
            let pizzaItem = qsl('.models .pizza-item').cloneNode(true);

        // Insere no HTML o atributo "data-key" com o valor do index da pizza atual
            pizzaItem.setAttribute('data-key', index);

        // Insere as informações do Json no código HTML
            pizzaItem.querySelector('.pizza-item--img img').src = item.img;
            pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.prices[2].toFixed(2)}`;
            pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
            pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

        // Seleciona a tag link e insere um evento ao clicar - ABRE O MODAL
            pizzaItem.querySelector('a').addEventListener('click', (e)=>{
                e.preventDefault(); //Anula os eventos padrões

                // Pega o valor do atributo "data-key"
                    let = key = e.target.closest('.pizza-item').getAttribute('data-key');
                    modalQt = 1;
                    modalKey = key;

                // Insere as informações do Json no código HTML do modal
                    qsl('.pizzaBig img').src = pizzaJson[key].img;
                    qsl('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
                    qsl('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
                    qsl('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[2].toFixed(2)}`;
                    qsl('.pizzaInfo--size.selected').classList.remove('selected');

                // Para cada tamanho, insere o valor correspondende no json.
                    qsla('.pizzaInfo--size').forEach((size,sizeIndex)=>{
                        if(sizeIndex==2){
                            size.classList.add('selected');
                        }
                        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
                    });

                    qsl('.pizzaInfo--qt').innerHTML = modalQt;
                

                // Faz com que o modal apareça na tela
                    qsl('.pizzaWindowArea').style.opacity = '0'; 
                    qsl('.pizzaWindowArea').style.display = 'flex';
                    setTimeout(()=> qsl('.pizzaWindowArea').style.opacity = '1',200) // Esse código é necessário para que haja a animação de fade-in
            });
        
        // Seleciona a div class "pizza-area" e insere em seu final a estrutura HTML retirada no cloneNode
            qsl('.pizza-area').append(pizzaItem);
    })

//***********************************************************//
//***********************************************************//
// Eventos do Modal
//***********************************************************//
//***********************************************************//

// Função que fecha o modal
    function closeModal(){
        qsl('.pizzaWindowArea').style.opacity = '0'; 
        setTimeout(()=> qsl('.pizzaWindowArea').style.display = 'none',500)
    }

// Habilita os dois botões (Tanto o pra PC quanto pra mobile) a fechar o modal
    qsla('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item=>{
        item.addEventListener('click',closeModal);
    });

// Aumenta e diminui a quantidade de pizzas ao clicar.
    qsl('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
        if(modalQt > 1){
            modalQt--;
            qsl('.pizzaInfo--qt').innerHTML = modalQt;  
        }
        else{
            modalQt = 1;
        }
    });

    qsl('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        qsl('.pizzaInfo--qt').innerHTML = modalQt;
    });

// Define como selecionado o tamanho ao clicar 
    qsla('.pizzaInfo--size').forEach((size,sizeIndex)=>{
        size.addEventListener('click',(e)=>{
            qsl('.pizzaInfo--size.selected').classList.remove('selected');
            qsl('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].prices[sizeIndex].toFixed(2)}`;
            size.classList.add('selected');
        });
    });

// Adiciona ao carrinho as opções selecionadas
    qsl('.pizzaInfo--addButton').addEventListener('click', ()=>{

        let size = parseInt(qsl('.pizzaInfo--size.selected').getAttribute('data-key'));
        let preco = qsl('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].prices[size].toFixed(2);


        // Cria um identificador por pedido no modal
        let ident = pizzaJson[modalKey].id+'@'+size;

        // Verifica se já existe o identificador no carrinho.
            let aux = cart.findIndex((item) => {
                return item.ident == ident;
            });
            

            // Se existir, ele apenas aumenta a quantidade de acordo com o segundo pedido.
             if(aux > -1){
                cart[aux].qtd += modalQt;
            }
            // Se não existir, ele vai pro carrinho direto
            else{
                cart.push({
                    ident,
                    id: pizzaJson[modalKey].id,
                    size: size,
                    qtd: modalQt,
                    preco
                });
            }

        updateCart()
        closeModal();
    });

// Cria uma ação de abertura do carrinho - Mobile
qsl('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        qsl('aside').style.left = '0';
    }
});

// Cria uma ação de fechamento do carrinho - Mobile
qsl('.menu-closer').addEventListener('click', ()=>{
    qsl('aside').style.left = '100vw';
});

// Atualiza o carrinho
function updateCart(){
    
    qsl('.menu-openner span').innerHTML = cart.length;

    
    
    //Verifica se o carrinho não está vazio.
    if(cart.length > 0){
        qsl('aside').classList.add('show');
        qsl('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // Cria um loop de repetição para ler todas as posições do carrinho.
        for(let i in cart){
            let pizzaItem = pizzaJson.find(item => item.id == cart[i].id );

            subtotal +=  cart[i].preco * cart[i].qtd;

            let cartItem = qsl('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'Pequena';
                    break;
                case 1:
                    pizzaSizeName = 'Média';
                    break;
                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qtd > 1){
                    cart[i].qtd--;
                }
                else{
                    cart.splice(i,1);
                }
                
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qtd++;

                updateCart();
            });

            qsl('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;     
       
        qsl('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qsl('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qsl('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }
    else{
        qsl('aside').classList.remove('show');
        qsl('aside').style.left = '100vw';
    }
}




