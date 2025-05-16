// Загрузка сохраненных данных главной страницы
document.addEventListener('DOMContentLoaded', function() {
    const savedMainData = localStorage.getItem('mainPageData');
    if (savedMainData) {
        const mainData = JSON.parse(savedMainData);
        
        // Обновляем текст на главной странице
        const companyInfoElements = document.querySelectorAll('.company-info, .company-info2');
        if (companyInfoElements.length >= 1) companyInfoElements[0].textContent = mainData.companyInfo;
        if (companyInfoElements.length >= 2) companyInfoElements[1].textContent = mainData.servicesInfo;
    }
});

// Загрузка сохраненных данных страницы "О компании"
document.addEventListener('DOMContentLoaded', function() {
    const savedAboutData = localStorage.getItem('aboutPageData');
    if (savedAboutData) {
        const aboutData = JSON.parse(savedAboutData);
        
        // Обновляем текст на странице "О компании"
        const textElements = document.querySelectorAll('.left-text-company-algin, .right-text-company-algin');
        if (textElements.length >= 1) textElements[0].textContent = aboutData.text1;
        if (textElements.length >= 2) textElements[1].textContent = aboutData.text2;
        if (textElements.length >= 3) textElements[2].textContent = aboutData.text3;
        if (textElements.length >= 4) textElements[3].textContent = aboutData.text4;
    }
});

// Загрузка сохраненных данных страницы "Наши проекты"
document.addEventListener('DOMContentLoaded', function() {
    const savedProjectsData = localStorage.getItem('aboutProjectsData');
    if (savedProjectsData) {
        const projectsData = JSON.parse(savedProjectsData);
        
        // Обновляем текст на странице "Наши проекты"
        const textElements = document.querySelectorAll('.project-text-1, .project-text-2, .project-text-3, .project-text-4, .project-text-5, .project-text-6, .project-text-7, .project-text-8');
        if (textElements.length >= 1) textElements[0].textContent = projectsData.text1;
        if (textElements.length >= 2) textElements[1].textContent = projectsData.text2;
        if (textElements.length >= 3) textElements[2].textContent = projectsData.text3;
        if (textElements.length >= 4) textElements[3].textContent = projectsData.text4;
        if (textElements.length >= 5) textElements[4].textContent = projectsData.text5;
        if (textElements.length >= 6) textElements[5].textContent = projectsData.text6;
        if (textElements.length >= 7) textElements[6].textContent = projectsData.text7;
        if (textElements.length >= 8) textElements[7].textContent = projectsData.text8;
    }
});

// Загрузка сохраненных данных страницы "Услуги"
document.addEventListener('DOMContentLoaded', function() {
    const savedServicesData = localStorage.getItem('servicesPageData');
    if (savedServicesData) {
        const servicesData = JSON.parse(savedServicesData);
        
        // Обновляем текст на странице "Услуги"
        const leftText = document.querySelector('.services-text-left');
        const rightText = document.querySelector('.services-text-right');
        const servicesList = document.querySelector('.services-text-compl-work');
        
        if (leftText) leftText.textContent = servicesData.textLeft;
        if (rightText) rightText.innerHTML = servicesData.textRight;
        if (servicesList) servicesList.innerHTML = servicesData.servicesList;
    }
});

// Загрузка изменений в JSON
async function saveDataToServer(dataType, data) {
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [dataType]: data })
        });
        const result = await response.json();
        alert(result.success ? 'Сохранено!' : 'Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить!');
    }
}

// Загрузка для главной страницы
document.getElementById('saveMainBtn').addEventListener('click', async () => {
    const mainData = {
        companyInfo: document.getElementById('company-info').value,
        servicesInfo: document.getElementById('services-info').value
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('mainPageData', JSON.stringify(mainData));
    
    // Отправляем на сервер
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ main: mainData })
        });
        
        const result = await response.json();
        alert(result.success ? '✅ Данные сохранены в БД и JSON!' : '❌ Ошибка сохранения!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Не удалось сохранить! Проверьте консоль.');
    }
});

// Загрузка для "О компании"
document.getElementById('saveAboutBtn').addEventListener('click', async () => {
    const aboutData = {
        text1: document.getElementById('about-text1').value,
        text2: document.getElementById('about-text2').value,
        text3: document.getElementById('about-text3').value,
        text4: document.getElementById('about-text4').value
    };
    
    localStorage.setItem('aboutPageData', JSON.stringify(aboutData));
    
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ about: aboutData })
        });
        
        const result = await response.json();
        alert(result.success ? '✅ Данные сохранены!' : '❌ Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Не удалось отправить данные!');
    }
});

// Загрузка для "Наши Проекты"
document.getElementById('saveProjectsBtn').addEventListener('click', async () => {
    const projectsData = {
        text1: document.getElementById('project-text-1').value,
        text2: document.getElementById('project-text-2').value,
        text3: document.getElementById('project-text-3').value,
        text4: document.getElementById('project-text-4').value,
        text5: document.getElementById('project-text-5').value,
        text6: document.getElementById('project-text-6').value,
        text7: document.getElementById('project-text-7').value,
        text8: document.getElementById('project-text-8').value
    };
    
    localStorage.setItem('projectsData', JSON.stringify(projectsData));
    
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projects: projectsData })
        });
        
        const result = await response.json();
        alert(result.success ? '✅ Проекты обновлены!' : '❌ Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Не удалось сохранить проекты!');
    }
});

// Загрузка для "Услуги"
document.getElementById('saveServicesBtn').addEventListener('click', async () => {
    const servicesData = {
        textLeft: document.getElementById('services-text-left').value,
        textRight: document.getElementById('services-text-right').value,
        servicesList: document.getElementById('services-list').value
    };
    
    localStorage.setItem('servicesPageData', JSON.stringify(servicesData));
    
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ services: servicesData })
        });
        
        const result = await response.json();
        alert(result.success ? '✅ Услуги обновлены!' : '❌ Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Не удалось сохранить услуги!');
    }
});

