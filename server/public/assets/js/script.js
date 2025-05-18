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
      const [mainRes, aboutRes, projectsRes, servicesRes] = await Promise.all([
          fetch('/api/data/main').then(res => res.json()),
          fetch('/api/data/about').then(res => res.json()),
          fetch('/api/data/projects').then(res => res.json()),
          fetch('/api/data/services').then(res => res.json())
      ]);

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
  console.log("DOM загружен, начинаю загрузку проектов...");
  const data = await loadData();
  if (data.projects) {
    document.querySelector('.project-text-1').textContent = data.projects.text1;
    document.querySelector('.project-text-2').textContent = data.projects.text2;
    document.querySelector('.project-text-3').textContent = data.projects.text3;
    document.querySelector('.project-text-4').textContent = data.projects.text4;
    document.querySelector('.project-text-5').textContent = data.projects.text5;
    document.querySelector('.project-text-6').textContent = data.projects.text6;
    document.querySelector('.project-text-7').textContent = data.projects.text7;
    document.querySelector('.project-text-8').textContent = data.projects.text8;
  }

  // Загрузка динамических проектов
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    console.log("Ответ сервера:", response);
    if (!response.ok) throw new Error("Ошибка HTTP: " + response.status);
    
    const dynamicProjects = await response.json();
    const container = document.getElementById('dynamicProjects');
    
    if (!container) {
        console.error('Элемент #dynamicProjects не найден!');
        return;
    }

    container.innerHTML = '';

    if (dynamicProjects.length === 0) {
        container.innerHTML = '<p>Нет добавленных проектов.</p>';
        return;
    }

    dynamicProjects.forEach((project, index) => {
        const animationClass = index % 2 === 0 ? 'slideInLeft' : 'slideInRight';
        
        // 1. Исправляем парсинг изображений
        let images = [];
        try {
            // Если images уже массив (например, из API) или null/undefined
            if (Array.isArray(project.images)) {
                images = project.images;
            } 
            // Если images - строка с JSON (например, "["/uploads/image1.jpg"]")
            else if (typeof project.images === 'string') {
                images = JSON.parse(project.images);
            }
        } catch (e) {
            console.error('Ошибка парсинга изображений:', e);
            images = [];
        }
    
        // 2. Создаем HTML-структуру
        const projectEl = document.createElement('div');
        projectEl.className = 'project-item';
        projectEl.setAttribute('data-animation', animationClass);
        projectEl.innerHTML = `
            <h2 class="project-name">${project.title || 'Без названия'}</h2>
            ${project.year_design ? `<p>Выполнение проектной документации – ${project.year_design}</p>` : ''}
            ${project.year_implementation ? `<p>Реализация – ${project.year_implementation}</p>` : ''}
            <p class="project-description">${project.description || ''}</p>
            <div class="project-images">
                ${images.map(img => `
                    <img src="${img}" alt="${project.title}" class="project-image">
                `).join('')}
            </div>
        `;
        container.appendChild(projectEl);
    });

    // Инициализация анимации
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.classList.add('animate', entry.target.dataset.animation);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('#dynamicProjects .project-item').forEach(el => {
        observer.observe(el);
    });

} catch (error) {
    console.error('Ошибка загрузки проектов:', error);
    const container = document.getElementById('dynamicProjects');
    if (container) {
        container.innerHTML = `<p class="error">Не удалось загрузить проекты: ${error.message}</p>`;
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





