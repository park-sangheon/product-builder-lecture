const generateBtn = document.getElementById('generate');
const numbersContainer = document.getElementById('numbers');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const body = document.body;

// New elements for contact form
const contactToggle = document.getElementById('contact-toggle');
const backToMain = document.getElementById('back-to-main');
const mainContainer = document.getElementById('main-container');
const contactContainer = document.getElementById('contact-container');

// Theme toggle logic
function setTheme(isLight) {
    if (isLight) {
        body.classList.add('light-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
    }
}

// Initial theme setup
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme(true);
} else {
    setTheme(false);
}

themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-mode');
    setTheme(!isLight);
});

// Navigation logic
function toggleContainers() {
    mainContainer.classList.toggle('hidden');
    contactContainer.classList.toggle('hidden');
}

contactToggle.addEventListener('click', toggleContainers);
backToMain.addEventListener('click', toggleContainers);

// Lotto generation logic
generateBtn.addEventListener('click', () => {
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    [...numbers].sort((a, b) => a - b).forEach((number, index) => {
        const numberEl = document.createElement('div');
        numberEl.classList.add('number');
        numberEl.textContent = number;
        
        // Assign color based on number range
        if (number <= 10) numberEl.style.backgroundColor = '#f4c22b'; // Yellow
        else if (number <= 20) numberEl.style.backgroundColor = '#3498db'; // Blue
        else if (number <= 30) numberEl.style.backgroundColor = '#e74c3c'; // Red
        else if (number <= 40) numberEl.style.backgroundColor = '#95a5a6'; // Gray
        else numberEl.style.backgroundColor = '#2ecc71'; // Green

        numberEl.style.animation = `popIn 0.5s ease-out forwards`;
        numberEl.style.animationDelay = `${index * 0.1}s`;
        
        numbersContainer.appendChild(numberEl);
    });
});
