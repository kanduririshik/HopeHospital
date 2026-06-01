// ========== GLOBAL VARIABLES ==========
let cart = [];
let doctors = [];
let medicines = [];
let currentFilter = 'all';

let $ = (id) => document.getElementById(id);
let $$ = (sel) => document.querySelectorAll(sel);
let $one = (sel) => document.querySelector(sel);

const EMERGENCY_NUMBER = "+1 (555) 911-HELP";

// ========== NOTIFICATION ==========
function showNotification(msg, type = 'info') {
    let colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    let notif = $('notification');
    notif.textContent = msg;
    notif.style.background = colors[type] || colors.info;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// ========== LOADER ==========
window.addEventListener('load', function() {
    setTimeout(function() {
        $('loadingScreen').style.display = 'none';
        showNotification('Welcome to MediCare Plus!', 'success');
    }, 2500);
});

// ========== SECTION NAVIGATION ==========
function hideAll() {
    let sections = $$('.section');
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
}

function showSection(id) {
    hideAll();
    $(id).classList.add('active');
    let navLinks = $$('.nav-link');
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
        if (navLinks[i].getAttribute('onclick')?.includes(id)) {
            navLinks[i].classList.add('active');
        }
    }
}

function showHome() {
    showSection('home');
}

function showAppointment() {
    showSection('appointment');
}

function showDoctors() {
    showSection('doctors');
    if (doctors.length === 0) loadDoctors();
}

function showPharmacy() {
    showSection('pharmacy');
    if (medicines.length === 0) loadMedicines();
}

function showEmergency() {
    showSection('emergency');
}

// ========== DOCTORS ==========
function loadDoctors() {
    doctors = [{
            id: 1,
            name: 'Dr. SivaCharan Sai',
            specialty: 'cardiology',
            exp: '15 yrs',
            rating: 5,
            img: 'https://image2url.com/r2/default/images/1770910903503-8cc7a727-8434-4b11-b7eb-2d5244059daf.jpeg',
            avail: true,
            desc: 'Heart specialist'
        },
        {
            id: 2,
            name: 'Dr. Arjun Reddy',
            specialty: 'Neurology',
            exp: '12 yrs',
            rating: 4.8,
            img: 'https://i.pinimg.com/originals/74/aa/64/74aa642acd710c7ad1bfee1e3d3cfea8.jpg',
            avail: true,
            desc: 'Brain & nerves'
        },
        {
            id: 3,
            name: 'Dr. lalith ',
            specialty: 'Pediatrics',
            exp: '10 yrs',
            rating: 4.7,
            img: 'https://image2url.com/r2/default/images/1770911818663-440c3d5d-8d84-4547-a24c-78c9fd42f2a0.png',
            avail: false,
            desc: 'Child care'
        },
        {
            id: 4,
            name: 'Dr. Riya',
            specialty: 'Orthopedics',
            exp: '18 yrs',
            rating: 4.9,
            img: 'https://image2url.com/r2/default/images/1770970168300-619bfce0-f172-4110-975e-b4cf74594f44.jpeg',
            avail: true,
            desc: 'Bone & joint'
        }
    ];
    renderDoctors(doctors);
}

function renderDoctors(arr) {
    let grid = $one('.doctor-grid');
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    let template = $('doctor-card-template');

    for (let i = 0; i < arr.length; i++) {
        let d = arr[i];
        let card = template.content.cloneNode(true);

        let img = card.querySelector('.doctor-image img');
        img.src = d.img;
        img.alt = d.name;

        let status = card.querySelector('.doctor-status');
        status.className = 'doctor-status ' + (d.avail ? 'status-available' : 'status-busy');
        status.textContent = d.avail ? 'Available' : 'Busy';

        card.querySelector('.doctor-name').textContent = d.name;
        card.querySelector('.doctor-specialty').textContent = d.specialty;
        card.querySelector('.exp-text').textContent = d.exp;

        let stars = '';
        for (let s = 0; s < Math.floor(d.rating); s++) stars += '★';
        for (let s = 0; s < 5 - Math.floor(d.rating); s++) stars += '☆';
        card.querySelector('.rating-stars').textContent = stars;
        card.querySelector('.rating-value').textContent = d.rating + '/5';

        card.querySelector('.doctor-desc').textContent = d.desc;

        card.querySelector('.action-btn.book').setAttribute('onclick', 'bookDoctor(' + d.id + ')');
        card.querySelector('.action-btn.profile').setAttribute('onclick', 'viewDoctorProfile(' + d.id + ')');

        grid.appendChild(card);
    }
}

function filterDoctors() {
    let term = $('doctorSearch').value.toLowerCase();
    let filtered = [];
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].name.toLowerCase().includes(term) || doctors[i].specialty.toLowerCase().includes(term)) {
            filtered.push(doctors[i]);
        }
    }
    if (currentFilter !== 'all') {
        let specFiltered = [];
        for (let i = 0; i < filtered.length; i++) {
            if (filtered[i].specialty.toLowerCase().includes(currentFilter)) {
                specFiltered.push(filtered[i]);
            }
        }
        renderDoctors(specFiltered);
    } else {
        renderDoctors(filtered);
    }
}

function filterBySpecialty(spec, btn) {
    currentFilter = spec;
    let btns = $$('.filter-btn');
    for (let i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');
    filterDoctors();
}

function bookDoctor(id) {
    let doctor;
    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id === id) {
            doctor = doctors[i];
            break;
        }
    }
    if (!doctor.avail) {
        showNotification('Doctor busy', 'warning');
        return;
    }
    showAppointment();
    showNotification('Booking with ' + doctor.name, 'info');
}

function viewDoctorProfile(id) {
    let doctor = null;

    for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].id === id) {
            doctor = doctors[i];
            break;
        }
    }


    if (!doctor) {
        alert("Doctor not found");
        return;
    }


    alert(` ${doctor.name}
${doctor.specialty}
${doctor.exp}
Rating: ${doctor.rating}/5
${doctor.desc}`);
}

// ========== PHARMACY ==========

function Medicines(arr) {

    let grid = document.querySelector('.medicine-grid');

    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    let template = document.getElementById('medicine-card-template');

    for (let i = 0; i < arr.length; i++) {

        let m = arr[i];

        let fragment = template.content.cloneNode(true);
        let card = fragment.firstElementChild;

        let badge = card.querySelector('.medicine-badge');
        let name = card.querySelector('.medicine-name');
        let descIcon = card.querySelector('.medicine-desc i');
        let descText = card.querySelector('.desc-text');
        let stockStatus = card.querySelector('.stock-status');
        let stockIcon = stockStatus.querySelector('i');
        let stockText = card.querySelector('.stock-text');
        let price = card.querySelector('.medicine-price');
        let qtySpan = card.querySelector('.quantity-value');
        let minusBtn = card.querySelector('.quantity-btn.minus');
        let plusBtn = card.querySelector('.quantity-btn.plus');
        let addBtn = card.querySelector('.add-to-cart-btn');


        name.textContent = m.name;

        descIcon.className = m.icon;
        descText.textContent = m.desc;

        if (m.stock > 0) {
            stockIcon.className = 'fas fa-check-circle';
            stockStatus.style.color = '#4caf50';
            stockText.textContent = m.stock + ' in stock';
        } else {
            stockIcon.className = 'fas fa-times-circle';
            stockStatus.style.color = '#f44336';
            stockText.textContent = 'Out';
        }

        price.textContent = '₹' + m.price;

        qtySpan.id = 'q' + m.id;
        qtySpan.textContent = '1';

        minusBtn.setAttribute(
            'onclick',
            'adjustQty("q' + m.id + '",-1)'
        );

        plusBtn.setAttribute(
            'onclick',
            'adjustQty("q' + m.id + '",1)'
        );

        addBtn.setAttribute(
            'onclick',
            'orderAndAdd(' + m.id +
            ', parseInt(document.getElementById("q' + m.id + '").innerText))'
        );

        if (m.stock === 0) {
            addBtn.disabled = true;
        }

        grid.appendChild(fragment);
    }
}

function loadMedicines() {
    medicines = [{
            id: 1,
            name: 'Paracetamol 500mg',
            cat: 'Pain',
            price: 99,
            stock: 50,
            icon: 'fas fa-tablets',
            desc: 'Fever & pain'
        },
        {
            id: 2,
            name: 'Amoxicillin 250mg',
            cat: 'Antibiotic',
            price: 199,
            stock: 30,
            icon: 'fas fa-capsules',
            desc: 'Bacterial infection'
        },
        {
            id: 3,
            name: 'Vitamin D3 1000IU',
            cat: 'Supplement',
            price: 149,
            stock: 100,
            icon: 'fas fa-sun',
            desc: 'Bone health'
        },
        {
            id: 4,
            name: 'Cetirizine 10mg',
            cat: 'Allergy',
            price: 79,
            stock: 80,
            icon: 'fas fa-allergies',
            desc: 'Allergy relief'
        },
        {
            id: 5,
            name: 'Omeprazole 20mg',
            cat: 'Chronic',
            price: 129,
            stock: 40,
            icon: 'fas fa-stomach',
            desc: 'Acid reflux'
        },
        {
            id: 6,
            name: 'Metformin 500mg',
            cat: 'Chronic',
            price: 89,
            stock: 60,
            icon: 'fas fa-syringe',
            desc: 'Diabetes'
        }
    ];
    Medicines(medicines);
}


function adjustQty(id, delta) {
    let span = $(id);
    let val = parseInt(span.innerText) + delta;
    if (val < 1) val = 1;
    span.innerText = val;
}

function filterMedicines() {
    let term = $('medicineSearch').value.toLowerCase();
    let cat = $('categoryFilter').value;
    let filtered = [];
    for (let i = 0; i < medicines.length; i++) {
        let m = medicines[i];
        if ((cat === 'all' || m.cat.toLowerCase().includes(cat)) &&
            (m.name.toLowerCase().includes(term) || m.cat.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term))) {
            filtered.push(m);
        }
    }
    Medicines(filtered);
}

// ========== CART ==========
function addToCart(id, qty) {
    let med;
    for (let i = 0; i < medicines.length; i++) {
        if (medicines[i].id === id) {
            med = medicines[i];
            break;
        }
    }
    let idx = -1;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            idx = i;
            break;
        }
    }
    if (idx !== -1) {
        cart[idx].quantity += qty;
    } else {
        let newItem = {
            ...med,
            quantity: qty
        };
        cart.push(newItem);
    }
    updateCart();
    showNotification('Added ' + med.name, 'success');
}

function updateCart() {
    let totalItems = 0,
        subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems += cart[i].quantity;
        subtotal += cart[i].price * cart[i].quantity;
    }
    $('cartCount').innerText = totalItems;
    $('subtotal').innerText = '₹' + subtotal;
    let delivery = subtotal > 500 ? 0 : 50;
    $('delivery').innerText = delivery ? '₹50' : 'FREE';
    $('cartTotal').innerText = '₹' + (subtotal + delivery);
    renderCart();
    $('checkoutBtn').disabled = cart.length === 0;
}

function renderCart() {
    let container = $('cartItems');
    while (container.firstChild) container.removeChild(container.firstChild);

    if (cart.length === 0) {
        let emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-cart';
        let emptyIcon = document.createElement('i');
        emptyIcon.className = 'fas fa-shopping-basket';
        emptyDiv.appendChild(emptyIcon);
        let emptyP = document.createElement('p');
        emptyP.textContent = 'Your cart is empty';
        emptyDiv.appendChild(emptyP);
        let browseBtn = document.createElement('button');
        browseBtn.className = 'btn btn-outline';
        browseBtn.setAttribute('onclick', 'showPharmacy()');
        browseBtn.textContent = 'Browse Medicines';
        emptyDiv.appendChild(browseBtn);
        container.appendChild(emptyDiv);
        return;
    }

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        let imgDiv = document.createElement('div');
        imgDiv.className = 'cart-item-image';
        let imgIcon = document.createElement('i');
        imgIcon.className = item.icon;
        imgDiv.appendChild(imgIcon);
        cartItem.appendChild(imgDiv);

        let detailsDiv = document.createElement('div');
        detailsDiv.className = 'cart-item-details';

        let nameDiv = document.createElement('div');
        nameDiv.className = 'cart-item-name';
        nameDiv.textContent = item.name;
        detailsDiv.appendChild(nameDiv);

        let catDiv = document.createElement('div');
        catDiv.className = 'cart-item-category';
        catDiv.textContent = item.cat;
        detailsDiv.appendChild(catDiv);

        let controlsDiv = document.createElement('div');
        controlsDiv.className = 'cart-item-controls';

        let qtyDiv = document.createElement('div');
        qtyDiv.className = 'cart-item-quantity';

        let minusBtn = document.createElement('button');
        minusBtn.className = 'quantity-btn-small';
        minusBtn.setAttribute('onclick', 'updateQuantity(' + i + ', -1)');
        minusBtn.textContent = '-';
        qtyDiv.appendChild(minusBtn);

        let qtySpan = document.createElement('span');
        qtySpan.textContent = item.quantity;
        qtyDiv.appendChild(qtySpan);

        let plusBtn = document.createElement('button');
        plusBtn.className = 'quantity-btn-small';
        plusBtn.setAttribute('onclick', 'updateQuantity(' + i + ', 1)');
        plusBtn.textContent = '+';
        qtyDiv.appendChild(plusBtn);

        controlsDiv.appendChild(qtyDiv);

        let priceDiv = document.createElement('div');
        priceDiv.className = 'cart-item-price';
        priceDiv.textContent = '₹' + (item.price * item.quantity);
        controlsDiv.appendChild(priceDiv);

        let removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item';
        removeBtn.setAttribute('onclick', 'removeItem(' + i + ')');
        let trashIcon = document.createElement('i');
        trashIcon.className = 'fas fa-trash';
        removeBtn.appendChild(trashIcon);
        controlsDiv.appendChild(removeBtn);

        detailsDiv.appendChild(controlsDiv);
        cartItem.appendChild(detailsDiv);
        container.appendChild(cartItem);
    }
}

function updateQuantity(idx, delta) {
    if (cart[idx].quantity + delta < 1) {
        removeItem(idx);
        return;
    }
    cart[idx].quantity += delta;
    updateCart();
}

function removeItem(idx) {
    let removed = cart.splice(idx, 1)[0];
    updateCart();
    showNotification('Removed ' + removed.name, 'warning');
}

function toggleCart() {
    $('cartSidebar').classList.toggle('active');
    $('overlay').classList.toggle('active');
}

function placeOrder() {
    if (cart.length === 0) {
        showNotification('Cart empty', 'error');
        return;
    }
    if (confirm('Order total: ' + $('cartTotal').innerText + '. Confirm?')) {
        showNotification('Order placed! Delivery in 30min', 'success');
        cart = [];
        updateCart();
        toggleCart();
    }
}

// ========== PROMISE + ASYNC ==========
function checkStock(id) {
    return new Promise(function(resolve, reject) {
        let med = medicines.find(m => m.id === id);
        setTimeout(function() {
            if (med && med.stock > 0) resolve(med.stock);
            else reject('Out of stock');
        }, 500);
    });
}

async function orderAndAdd(id, qty) {
    try {
        await checkStock(id);
        addToCart(id, qty);
    } catch (err) {
        showNotification(err, 'error');
    }
}

// ========== APPOINTMENT FORM ==========
$('appointmentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    let name = this.querySelector('input[placeholder="Full Name"]').value.trim();
    if (name === '') {
        showNotification('Please enter name', 'error');
        return;
    }
    showNotification('Appointment booked for ' + name, 'success');
    this.reset();
    showHome();
});

// ========== LOGIN ==========
function showLogin() {
    $('loginModal').classList.add('active');
}

function closeLogin() {
    $('loginModal').classList.remove('active');
}

function showRegister() {
    closeLogin();
    showNotification('Register page demo', 'info');
}

$('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    let email = this.querySelector('input[type="email"]').value;
    let pass = this.querySelector('input[type="password"]').value;
    if (!email.includes('@') || pass.length < 6) {
        showNotification('Invalid email or password (min 6 chars)', 'error');
        return;
    }
    showNotification('Login successful', 'success');
    closeLogin();
});

// ========== EMERGENCY ==========
function callAmbulance() {
    if (confirm('Call ' + EMERGENCY_NUMBER + '?')) {
        showNotification('Ambulance dispatched! ETA 8min', 'success');
    }
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showHome();
    }
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        showDoctors();
    }
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        showPharmacy();
    }
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        toggleCart();
    }
    if (e.key === 'Escape') {
        closeLogin();
        if ($('cartSidebar').classList.contains('active')) toggleCart();
    }
});

// ========== DATE PICKER MIN ==========
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
let dateInput = $one('input[type="date"]');
if (dateInput) dateInput.min = tomorrow.toISOString().split('T')[0];

// ========== LOCALSTORAGE ==========
setInterval(function() {
    if (cart.length > 0) localStorage.setItem('medicareCart', JSON.stringify(cart));
}, 15000);

window.addEventListener('load', function() {
    let saved = localStorage.getItem('medicareCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
});

// ========== SCROLL ANIMATION ==========
window.addEventListener('scroll', function() {
    let cards = $$('.doctor-card, .medicine-card, .feature-card');
    for (let i = 0; i < cards.length; i++) {
        let rect = cards[i].getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) cards[i].classList.add('animated');
    }
});

// ========== INIT ==========
window.onload = function() {
    if (doctors.length === 0) loadDoctors();
    if (medicines.length === 0) loadMedicines();
    updateCart();
};