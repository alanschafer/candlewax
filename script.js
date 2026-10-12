// --- Sample Product Data ---
const products = [
    {
        id: 1,
        name: "Santak & Amber",
        category: "Woody",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
        description: "A rich, comforting blend of warm cedar, royal amber, and soft musk. Hand-poured into an amber glass vessel.",
        notes: "Top: Eucalyptus | Mid: Cedarwood | Base: Amber, Musk"
    },
    {
        id: 2,
        name: "Wild Lavender & Sage",
        category: "Floral",
        price: 36.00,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        description: "Calming French lavender balanced with earthy white sage leaves to bring tranquility and mindfulness to your space.",
        notes: "Top: White Sage | Mid: French Lavender | Base: Driftwood"
    },
    {
        id: 3,
        name: "Spiced Fig & Bourbon",
        category: "Warm",
        price: 42.00,
        image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800",
        description: "Decadent dark fig blended with aged oak barrel bourbon and subtle hints of sweet vanilla bean.",
        notes: "Top: Lush Fig | Mid: Oak Bourbon | Base: Vanilla Bean"
    },
    {
        id: 4,
        name: "Bergamot & Tobacco Leaf",
        category: "Woody",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
        description: "Bright Italian bergamot pairs with deep, smoky tobacco leaf and tonka bean for a refined atmosphere.",
        notes: "Top: Italian Bergamot | Mid: Tobacco Leaf | Base: Tonka Bean"
    },
    {
        id: 5,
        name: "Eucalyptus & White Tea",
        category: "Floral",
        price: 34.00,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800",
        description: "Crisp, restorative eucalyptus infused with delicate white tea leaves and a splash of sweet citrus.",
        notes: "Top: Lemon Zest | Mid: White Tea | Base: Crushed Eucalyptus"
    },
    {
        id: 6,
        name: "Blood Orange & Clove",
        category: "Warm",
        price: 36.00,
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
        description: "Zesty blood orange zest combined with warm cinnamon stick and freshly crushed spice cloves.",
        notes: "Top: Blood Orange | Mid: Cinnamon | Base: Clove"
    }
];

// --- State Management ---
let cart = [];
let activeCategory = 'all';

// --- DOM Elements ---
const productsGrid = document.getElementById('productsGrid');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const shippingProgress = document.getElementById('shippingProgress');
const shippingText = document.getElementById('shippingText');
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalGrid = document.getElementById('modalGrid');
const searchInput = document.getElementById('searchInput');

// --- Render Products Grid ---
function renderProducts(items) {
    productsGrid.innerHTML = items.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Bag</button>
            </div>
        </div>
    `).join('');
}

// --- Filter & Search Logic ---
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeCategory = e.target.getAttribute('data-category');
        filterProducts();
    });
});

searchInput.addEventListener('input', filterProducts);

function filterProducts() {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });
    renderProducts(filtered);
}

// --- Product Modal ---
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalGrid.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}" class="modal-img">
        </div>
        <div>
            <span class="product-category">${product.category}</span>
            <h2 style="font-size: 2.2rem; margin: 8px 0;">${product.name}</h2>
            <div class="product-price" style="font-size: 1.3rem;">$${product.price.toFixed(2)}</div>
            <p style="margin: 16px 0; color: var(--text-secondary);">${product.description}</p>
            <div class="modal-notes">
                <h4>Fragrance Notes</h4>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">${product.notes}</p>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 12px;" onclick="addToCart(${product.id}); closeModal();">Add to Bag • $${product.price.toFixed(2)}</button>
        </div>
    `;
    productModal.classList.add('active');
}

function closeModal() {
    productModal.classList.remove('active');
}

closeModalBtn.addEventListener('click', closeModal);
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeModal();
});

// --- Cart Operations ---
function addToCart(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    openCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }
    updateCart();
}

function updateCart() {
    // Total count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    // Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

    // Free shipping threshold ($75)
    const threshold = 75;
    if (subtotal >= threshold) {
        shippingProgress.style.width = '100%';
        shippingText.textContent = "🎉 You've unlocked Complimentary Free Shipping!";
    } else {
        const remaining = threshold - subtotal;
        const percentage = Math.min((subtotal / threshold) * 100, 100);
        shippingProgress.style.width = `${percentage}%`;
        shippingText.textContent = `Add $${remaining.toFixed(2)} more for Free Shipping!`;
    }

    // Render items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align: center; color: var(--text-secondary); margin-top: 40px;">Your bag is empty.</p>`;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 6px;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="width: 24px; height: 24px; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="width: 24px; height: 24px; cursor: pointer;">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function openCardDrawer() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
}

cartToggleBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// --- Initial Render ---
renderProducts(products);
updateCart();
