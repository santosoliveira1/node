// Base de dados inicial do sistema (Produtos Padrão)
const defaultBurgers = [
    { id: 'b1', name: 'X-Burger', price: 28.90, desc: 'Pão brioche, hambúrguer artesanal, cheddar, alface, tomate e molho especial.', image:'burger.webp' },
    { id: 'b2', name: 'X-Salada', price: 30.90, desc: 'Pão, hambúrguer artesanal, presunto, queijo, alface, tomate e milho.',  image:'x salada.avif' },
    { id: 'b3', name: 'Bacon Burger', price: 36.90, desc: 'Pão australiano, hambúrguer artesanal, cheddar, bacon crocante e cebola caramelizada.',  image:'bacon burger.avif' },
    { id: 'b4', name: 'Chicken Burger', price: 32.90, desc: 'Pão, frango empanado, queijo prato, alface e maionese especial.',  image:'Chicken Burguer.webp' }
];

const defaultDrinks = [
    { id: 'd1', name: 'Coca-Cola', price: 6.00 }, { id: 'd2', name: 'Coca Zero', price: 6.00 },
    { id: 'd3', name: 'Guaraná', price: 5.50 }, { id: 'd4', name: 'Fanta Laranja', price: 5.50 },
    { id: 'd5', name: 'Água', price: 4.00 }, { id: 'd6', name: 'Suco Natural', price: 8.00 }
];

const defaultAddons = [
    { id: 'a1', name: 'Bacon', price: 4.50 }, { id: 'a2', name: 'Cheddar', price: 4.00 },
    { id: 'a3', name: 'Catupiry', price: 4.00 }, { id: 'a4', name: 'Onion Rings', price: 7.00 },
    { id: 'a5', name: 'Batata Frita', price: 8.90 }, { id: 'a6', name: 'Milk Shake', price: 12.90 },
    { id: 'a7', name: 'Brownie', price: 6.50 }, { id: 'a8', name: 'Sorvete', price: 5.00 }
];

// Estado da aplicação
let currentStep = 1;
let selectedBurger = null;
let selectedDrink = null;
let selectedAddons = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
    renderStepFields();
    renderTables();
    setupFormListeners();
});

function initLocalStorage() {
    if (!localStorage.getItem('burgers')) localStorage.setItem('burgers', JSON.stringify(defaultBurgers));
    if (!localStorage.getItem('drinks')) localStorage.setItem('drinks', JSON.stringify(defaultDrinks));
    if (!localStorage.getItem('addons')) localStorage.setItem('addons', JSON.stringify(defaultAddons));
    if (!localStorage.getItem('history')) localStorage.setItem('history', JSON.stringify([]));
    if (!localStorage.getItem('clients')) localStorage.setItem('clients', JSON.stringify([]));
}

// Renderização dos elementos das Etapas
function renderStepFields() {
    const burgers = JSON.parse(localStorage.getItem('burgers'));
    console.log(burgers)
    const drinks = JSON.parse(localStorage.getItem('drinks'));
    const addons = JSON.parse(localStorage.getItem('addons'));

    // Grid Hamburgueres
    const bGrid = document.getElementById('burgers-grid');
    bGrid.innerHTML = burgers.map(b => `
        <div class="item-card ${selectedBurger?.id === b.id ? 'selected' : ''}" onclick="selectBurger('${b.id}')">
            <img src="${b.image}" alt="${b.name}">
            <h3>${b.name}</h3>
            <p>${b.desc || ''}</p>
            <div class="price">R$ ${b.price.toFixed(2)}</div>
        </div>
    `).join('');

    // Grid Bebidas
    const dGrid = document.getElementById('drinks-grid');
    dGrid.innerHTML = drinks.map(d => `
        <div class="item-card ${selectedDrink?.id === d.id ? 'selected' : ''}" onclick="selectDrink('${d.id}')">
            <img src="https://unsplash.com" alt="${d.name}">
            <h3>${d.name}</h3>
            <div class="price">R$ ${d.price.toFixed(2)}</div>
        </div>
    `).join('');

    // Grid Adicionais
    const aGrid = document.getElementById('addons-grid');
    aGrid.innerHTML = addons.map(a => `
        <div class="item-card ${selectedAddons.some(item => item.id === a.id) ? 'selected' : ''}" onclick="toggleAddon('${a.id}')">
            <img src="https://unsplash.com" alt="${a.name}">
            <h3>${a.name}</h3>
            <div class="price">R$ ${a.price.toFixed(2)}</div>
        </div>
    `).join('');
}

// Seleção de Itens Unitários / Múltiplos
function selectBurger(id) {
    const burgers = JSON.parse(localStorage.getItem('burgers'));
    selectedBurger = burgers.find(b => b.id === id);
    renderStepFields();
}

function selectDrink(id) {
    const drinks = JSON.parse(localStorage.getItem('drinks'));
    selectedDrink = drinks.find(d => d.id === id);
    renderStepFields();
}

function toggleAddon(id) {
    const addons = JSON.parse(localStorage.getItem('addons'));
    const addon = addons.find(a => a.id === id);
    const index = selectedAddons.findIndex(item => item.id === id);
    
    if (index > -1) selectedAddons.splice(index, 1);
    else selectedAddons.push(addon);
    renderStepFields();
}

// Controlo do Fluxo e Validação
function updateProgressBar() {
    const widthPercentage = ((currentStep - 1) / 3) * 100;
    document.getElementById('progressBar').style.width = `${widthPercentage === 0 ? 25 : widthPercentage}%`;
    
    for(let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}-indicator`).classList.toggle('active', i === currentStep);
    }
}

function nextStep(step) {
    if (currentStep === 1 && !selectedBurger) { alert('Selecione um Hambúrguer para continuar.'); return; }
    if (currentStep === 2 && !selectedDrink) { alert('Selecione uma Bebida para continuar.'); return; }
    
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    
    updateProgressBar();
    if(currentStep === 4) generateResume();
}

function prevStep(step) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    currentStep = step;
    document.getElementById(`step-${currentStep}`).classList.add('active');
    updateProgressBar();
}

// Resumo do Pedido e Cálculo Total
function generateResume() {
    const obs = document.getElementById('order-obs').value;
    let total = selectedBurger.price + selectedDrink.price;
    selectedAddons.forEach(a => total += a.price);

    const resumeHtml = `
        <div class="resume-item">
            <img src="${selectedBurger.image}">
            <div><h3>${selectedBurger.name}</h3><p>R$ ${selectedBurger.price.toFixed(2)}</p></div>
        </div>
        <div class="resume-item">
            <div style="padding-left:15px;"><h3>Bebida: ${selectedDrink.name}</h3><p>R$ ${selectedDrink.price.toFixed(2)}</p></div>
        </div>
        ${selectedAddons.length > 0 ? `
            <div class="resume-item"><div style="padding-left:15px;"><h3>Adicionais:</h3>
            <p>${selectedAddons.map(a => `${a.name} (+R$ ${a.price.toFixed(2)})`).join(', ')}</p></div></div>
        ` : ''}
        ${obs ? `<div class="resume-item"><div style="padding-left:15px;"><h3>Observações:</h3><p>${obs}</p></div></div>` : ''}
        <div class="total-highlight">Valor Total: R$ ${total.toFixed(2)}</div>
    `;
    document.getElementById('order-resume').innerHTML = resumeHtml;
}

function confirmOrder() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    let total = selectedBurger.price + selectedDrink.price;
    selectedAddons.forEach(a => total += a.price);

    const newOrder = {
        id: Math.floor(Math.random() * 9000) + 1000,
        date: new Date().toLocaleDateString('pt-PT'),
        client: "Consumidor Final",
        items: `${selectedBurger.name}, ${selectedDrink.name} ${selectedAddons.length ? '(+ Adicionais)' : ''}`,
        total: `R$ ${total.toFixed(2)}`
    };

    history.push(newOrder);
    localStorage.setItem('history', JSON.stringify(history));
    alert('Pedido guardado e finalizado com sucesso!');
    resetOrder();
    renderTables();
}

function resetOrder() {
    selectedBurger = null;
    selectedDrink = null;
    selectedAddons = [];
    document.getElementById('order-obs').value = '';
    renderStepFields();
    prevStep(1);
}

// Painéis de Gestão (Histórico, Clientes, Produtos)
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.currentTarget.classList.add('active');
}

function renderTables() {
    // Render Histórico
    const history = JSON.parse(localStorage.getItem('history')) || [];
    document.getElementById('history-table-body').innerHTML = history.map(h => `
        <tr><td>#${h.id}</td><td>${h.date}</td><td>${h.client}</td><td>${h.items}</td><td>${h.total}</td></tr>
    `).join('');

    // Render Clientes
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    document.getElementById('clients-table-body').innerHTML = clients.map(c => `
        <tr><td>${c.name}</td><td>${c.phone}</td></tr>
    `).join('');

    // Render Produtos Cadastrados
    const burgers = JSON.parse(localStorage.getItem('burgers')) || [];
    const drinks = JSON.parse(localStorage.getItem('drinks')) || [];
    const addons = JSON.parse(localStorage.getItem('addons')) || [];

    let pListHtml = '';
    burgers.forEach(b => pListHtml += `<tr><td>${b.name}</td><td>Hambúrguer</td><td>R$ ${b.price.toFixed(2)}</td></tr>`);
    drinks.forEach(d => pListHtml += `<tr><td>${d.name}</td><td>Bebida</td><td>R$ ${d.price.toFixed(2)}</td></tr>`);
    addons.forEach(a => pListHtml += `<tr><td>${a.name}</td><td>Adicional</td><td>R$ ${a.price.toFixed(2)}</td></tr>`);
    document.getElementById('products-table-body').innerHTML = pListHtml;
}

function setupFormListeners() {
    // Cadastro de Clientes
    document.getElementById('client-form').addEventListener('submit', (e) =>
         {e.preventDefault();
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients.push({name: document.getElementById('client-name').value,
                phone: document.getElementById('client-phone').value
            });
            localStorage.setItem('clients', JSON.stringify(clients));
            document.getElementById('client-form').reset();
            renderTables();alert('Cliente registado!');
        });
        // Cadastro de Produtos
        document.getElementById('product-form').addEventListener('submit', (e) =>
             {e.preventDefault();
                const type = document.getElementById('prod-type').value;
                const name = document.getElementById('prod-name').value;
                const price = parseFloat(document.getElementById('prod-price').value);
                const desc = document.getElementById('prod-desc').value;
                let storageKey = type === 'burger' ? 'burgers' : (type === 'drink' ? 'drinks' : 'addons');
                const list = JSON.parse(localStorage.getItem(storageKey)) || [];
                list.push({ id: 'custom-' + Date.now(), name, price, desc, image: '' });
                localStorage.setItem(storageKey, JSON.stringify(list));
                document.getElementById('product-form').reset();
                renderStepFields();
                renderTables();
                alert('Produto registado com sucesso!');
            });
        }

        function Limpar() {
            localStorage.clear()
        }
