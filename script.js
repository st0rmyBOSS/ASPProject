//scroll animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animation;
          entry.target.style.opacity = 1;
          entry.target.classList.add('animate', animationType);
        }
      });
    }, {
      threshold: 0.2
    });
  
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  });


//feedback
function copyToClipboard(element) {
    const text = element.childNodes[0].textContent.trim();
    const feedback = element.querySelector('.copy-feedback');
    
    navigator.clipboard.writeText(text).then(() => {
        feedback.textContent = ' ✓ Скопировано!';
        setTimeout(() => feedback.textContent = '', 2000);
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        feedback.textContent = ' ✗ Ошибка!';
        setTimeout(() => feedback.textContent = '', 2000);
    });
}

//client from database
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: e.target.name.value,
        number: e.target.number.value,
        email: e.target.email.value,
        question: e.target.question.value
    };

    try {
        const response = await fetch('http://localhost:3000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (response.ok) {
            showMessage('success', 'Сообщение успешно отправлено!');
            e.target.reset();
        } else {
            showMessage('error', result.error || 'Ошибка сервера');
        }
    } catch (error) {
            console.error('Ошибка:', error);
            showMessage('error', `Ошибка: ${error.message}`);
    }
});

function showMessage(type, text) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="${type}-message">${text}</div>`;
    setTimeout(() => container.innerHTML = '', 5000);
}