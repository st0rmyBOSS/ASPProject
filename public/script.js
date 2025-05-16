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


// Admin
async function loadData() {
  try {
      // Пробуем загрузить из MySQL
      const [mainRes, aboutRes, projectsRes, servicesRes] = await Promise.all([
          fetch('/api/data/main').then(res => res.json()),
          fetch('/api/data/about').then(res => res.json()),
          fetch('/api/data/projects').then(res => res.json()),
          fetch('/api/data/services').then(res => res.json())
      ]);

      // Если в MySQL нет данных, загружаем из JSON
      if (!mainRes || Object.keys(mainRes).length === 0) {
          const jsonRes = await fetch('/api/site-data.json').then(res => res.json());
          return jsonRes;
      }

      return {
          main: mainRes,
          about: aboutRes,
          projects: projectsRes,
          services: servicesRes
      };
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      // Если ошибка, пробуем загрузить из JSON
      try {
          const jsonRes = await fetch('/api/site-data.json').then(res => res.json());
          return jsonRes;
      } catch (jsonError) {
          console.error('Ошибка загрузки из JSON:', jsonError);
          return {};
      }
  }
}

//index.html
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  if (data.main) {
      document.querySelector('.company-info').textContent = data.main.companyInfo;
      document.querySelector('.company-info2').textContent = data.main.servicesInfo;
  }
});

//company.html
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  if (data.about) {
      document.querySelector('.left-text-company-algin').textContent = data.about.text1;
      document.querySelector('.right-text-company-algin').textContent = data.about.text2;
      document.querySelector('.left-text-company-algin').textContent = data.about.text3;
      document.querySelector('.right-text-company-algin').textContent = data.about.text4;
      
  }
});

//projects.html
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  if (data.projects) {
      for (let i = 1; i <= 8; i++) {
          const element = document.querySelector(`.project-text-${i}`);
          if (element && data.projects[`text${i}`]) {
              element.textContent = data.projects[`text${i}`];
          }
      }
  }
});

//services.html
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  if (data.services) {
      document.querySelector('.services-text-left').textContent = data.services.services-text-left;
      document.querySelector('.services-text-right').textContent = data.services.services-text-right;
      document.querySelector('.services-text-compl-work').textContent = data.services.services-text-compl-work;
  }
});



