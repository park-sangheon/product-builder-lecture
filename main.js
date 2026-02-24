const generateBtn = document.getElementById('generate');
const numbersContainer = document.getElementById('numbers');

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
