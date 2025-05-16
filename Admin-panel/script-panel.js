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

// Пример для главной страницы
document.getElementById('saveMainBtn').addEventListener('click', () => {
    const mainData = {
        title: document.getElementById('main-title').value,
        companyInfo: document.getElementById('company-info').value,
        servicesInfo: document.getElementById('services-info').value
    };
    saveDataToServer('main', mainData);
});

document.getElementById('saveMainBtn').addEventListener('click', async () => {
    const mainData = {
        title: document.getElementById('main-title').value,
        companyInfo: document.getElementById('company-info').value,
        servicesInfo: document.getElementById('services-info').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mainData)
        });
        
        const result = await response.json();
        console.log('Ответ сервера:', result); // Логируем ответ
    } catch (error) {
        console.error('Ошибка:', error);
    }
});
