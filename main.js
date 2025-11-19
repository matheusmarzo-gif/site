// Sistema de Impressão 3D - Funcionalidades Principais

// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Escultura Geométrica",
        category: "decorative",
        weight: 150,
        colors: 1,
        price: 95,
        image: "resources/product1.png",
        description: "Escultura moderna com formas hexagonais interconectadas"
    },
    {
        id: 2,
        name: "Suporte para Smartphone",
        category: "utility",
        weight: 85,
        colors: 2,
        price: 55,
        image: "resources/product2.png",
        description: "Suporte ergonômico com design dual-tone"
    },
    {
        id: 3,
        name: "Sistema de Engrenagens",
        category: "mechanical",
        weight: 200,
        colors: 1,
        price: 120,
        image: "resources/product3.png",
        description: "Conjunto de engrenagens com precisão mecânica"
    },
    {
        id: 4,
        name: "Vaso Decorativo",
        category: "decorative",
        weight: 120,
        colors: 1,
        price: 80,
        image: "resources/product4.png",
        description: "Vaso com padrão em espiral elegante"
    },
    {
        id: 5,
        name: "Modelo Arquitetônico",
        category: "architectural",
        weight: 300,
        colors: 1,
        price: 170,
        image: "resources/product5.png",
        description: "Maquete detalhada para projetos arquitetônicos"
    },
    {
        id: 6,
        name: "Chaveiro Personalizado",
        category: "personal",
        weight: 25,
        colors: 4,
        price: 30,
        image: "resources/product6.png",
        description: "Chaveiro colorido com texto personalizado"
    },
    {
        id: 7,
        name: "Robô Articulado",
        category: "toy",
        weight: 180,
        colors: 2,
        price: 110,
        image: "resources/product7.png",
        description: "Figura colecionável com juntas articuladas"
    },
    {
        id: 8,
        name: "Caixa de Joias",
        category: "luxury",
        weight: 90,
        colors: 1,
        price: 65,
        image: "resources/product8.png",
        description: "Caixa decorativa com padrões filigranados"
    }
];

// Taxas de impressão
const PRICING = {
    baseFee: 20.00,
    singleColor: 0.50,
    multiColor: 1.00
};

// Classe para gerenciar produtos
class ProductManager {
    static calculateCost(weight, colors) {
        const perGramRate = colors === 1 ? PRICING.singleColor : PRICING.multiColor;
        return PRICING.baseFee + (weight * perGramRate);
    }

    static renderProducts(containerId, category = 'all') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        ${product.colors} cor${product.colors > 1 ? 'es' : ''}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-sm text-gray-500">Peso: ${product.weight}g</span>
                        <span class="text-lg font-bold text-blue-600">R$ ${product.price.toFixed(2)}</span>
                    </div>
                    <button onclick="addToQuote(${product.id})" class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200">
                        Adicionar ao Orçamento
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Classe para gerenciar orçamentos
class QuoteManager {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('quoteItems')) || [];
        this.updateQuoteDisplay();
    }

    addItem(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }

        this.saveQuote();
        this.updateQuoteDisplay();
        this.showNotification('Item adicionado ao orçamento!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveQuote();
        this.updateQuoteDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveQuote();
            this.updateQuoteDisplay();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (ProductManager.calculateCost(item.weight, item.colors) * item.quantity);
        }, 0);
    }

    saveQuote() {
        localStorage.setItem('quoteItems', JSON.stringify(this.items));
    }

    updateQuoteDisplay() {
        const quoteCount = document.getElementById('quote-count');
        const quoteItems = document.getElementById('quote-items');
        const quoteTotal = document.getElementById('quote-total');

        if (quoteCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            quoteCount.textContent = totalItems;
            quoteCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        if (quoteItems) {
            quoteItems.innerHTML = this.items.map(item => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm">${item.name}</h4>
                        <p class="text-xs text-gray-600">Qtd: ${item.quantity}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-blue-600">R$ ${(ProductManager.calculateCost(item.weight, item.colors) * item.quantity).toFixed(2)}</p>
                        <button onclick="quoteManager.removeItem(${item.id})" class="text-red-500 text-xs hover:text-red-700">Remover</button>
                    </div>
                </div>
            `).join('');
        }

        if (quoteTotal) {
            quoteTotal.textContent = `R$ ${this.getTotal().toFixed(2)}`;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Calculadora de custos
class CostCalculator {
    constructor() {
        this.initializeCalculator();
    }

    initializeCalculator() {
        const weightInput = document.getElementById('calc-weight');
        const colorsSelect = document.getElementById('calc-colors');
        const resultDiv = document.getElementById('calc-result');

        if (!weightInput || !colorsSelect || !resultDiv) return;

        const updateCalculation = () => {
            const weight = parseFloat(weightInput.value) || 0;
            const colors = parseInt(colorsSelect.value) || 1;
            
            if (weight > 0) {
                const cost = ProductManager.calculateCost(weight, colors);
                resultDiv.innerHTML = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <h4 class="font-semibold text-blue-800 mb-2">Estimativa de Custo</h4>
                        <div class="space-y-1 text-sm">
                            <div class="flex justify-between">
                                <span>Taxa base:</span>
                                <span>R$ ${PRICING.baseFee.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Material (${weight}g × ${colors === 1 ? 'R$0.50' : 'R$1.00'}):</span>
                                <span>R$ ${(weight * (colors === 1 ? PRICING.singleColor : PRICING.multiColor)).toFixed(2)}</span>
                            </div>
                            <div class="border-t pt-1 flex justify-between font-semibold text-blue-800">
                                <span>Total estimado:</span>
                                <span>R$ ${cost.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = '';
            }
        };

        weightInput.addEventListener('input', updateCalculation);
        colorsSelect.addEventListener('change', updateCalculation);
    }
}

// Sistema de formulário de orçamento
class QuoteForm {
    constructor() {
        this.initializeForm();
    }

    initializeForm() {
        const form = document.getElementById('quote-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
    }

    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simular envio do orçamento
        this.showSubmitMessage();
        
        // Limpar formulário após 2 segundos
        setTimeout(() => {
            form.reset();
            this.hideSubmitMessage();
        }, 2000);
    }

    showSubmitMessage() {
        const message = document.createElement('div');
        message.id = 'submit-message';
        message.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        message.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                <div class="text-green-500 text-6xl mb-4">✓</div>
                <h3 class="text-xl font-semibold mb-2">Orçamento Enviado!</h3>
                <p class="text-gray-600">Entraremos em contato em breve com mais detalhes.</p>
            </div>
        `;
        document.body.appendChild(message);
    }

    hideSubmitMessage() {
        const message = document.getElementById('submit-message');
        if (message) {
            document.body.removeChild(message);
        }
    }
}

// Funções globais
function addToQuote(productId) {
    if (typeof quoteManager !== 'undefined') {
        quoteManager.addItem(productId);
    }
}

function filterProducts(category) {
    ProductManager.renderProducts('products-grid', category);
    
    // Atualizar botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.querySelector(`[onclick="filterProducts('${category}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-blue-500', 'text-white');
    }
}

// Inicialização do sistema
let quoteManager, costCalculator, quoteForm;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gerenciadores
    quoteManager = new QuoteManager();
    costCalculator = new CostCalculator();
    quoteForm = new QuoteForm();
    
    // Renderizar produtos iniciais
    if (document.getElementById('products-grid')) {
        ProductManager.renderProducts('products-grid');
    }
    
    // Inicializar animações de scroll
    initializeScrollAnimations();
    
    // Inicializar efeitos do header
    initializeHeaderEffects();
});

// Animações de scroll
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Efeitos do header
function initializeHeaderEffects() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('bg-white', 'shadow-lg');
            header.classList.remove('bg-transparent');
        } else {
            header.classList.remove('bg-white', 'shadow-lg');
            header.classList.add('bg-transparent');
        }
    });
}

// Efeitos de digitação para textos
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Inicializar efeito de digitação quando o elemento estiver visível
function initializeTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const text = typewriterElement.getAttribute('data-text') || '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(typewriterElement, text);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(typewriterElement);
    }
}
