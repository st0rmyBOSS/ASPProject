document.addEventListener('DOMContentLoaded', async function() {
    await loadAdminData();
});

async function loadAdminData() {
    try {
        const savedMainData = localStorage.getItem('mainPageData');
        const savedAboutData = localStorage.getItem('aboutPageData');
        const savedProjectsData = localStorage.getItem('projectsPageData');
        const savedServicesData = localStorage.getItem('servicesPageData');
        
        if (savedMainData) {
            const mainData = JSON.parse(savedMainData);
            if (document.getElementById('company-info')) {
                document.getElementById('company-info').value = mainData.companyInfo;
            }
            if (document.getElementById('services-info')) {
                document.getElementById('services-info').value = mainData.servicesInfo;
            }
        }
        
        if (savedAboutData) {
            const aboutData = JSON.parse(savedAboutData);
            if (document.getElementById('about-text1')) document.getElementById('about-text1').value = aboutData.text1;
            if (document.getElementById('about-text2')) document.getElementById('about-text2').value = aboutData.text2;
            if (document.getElementById('about-text3')) document.getElementById('about-text3').value = aboutData.text3;
            if (document.getElementById('about-text4')) document.getElementById('about-text4').value = aboutData.text4;
        }
        
        if (savedProjectsData) {
            const projectsData = JSON.parse(savedProjectsData);
            for (let i = 1; i <= 8; i++) {
                const element = document.getElementById(`project-text-${i}`);
                if (element) element.value = projectsData[`text${i}`];
            }
        }
        
        if (savedServicesData) {
            const servicesData = JSON.parse(savedServicesData);
            if (document.getElementById('services-text-left')) document.getElementById('services-text-left').value = servicesData.textLeft;
            if (document.getElementById('services-text-right')) document.getElementById('services-text-right').value = servicesData.textRight;
            if (document.getElementById('services-list')) document.getElementById('services-list').value = servicesData.servicesList;
        }
        
        if (!savedMainData || !savedAboutData || !savedProjectsData || !savedServicesData) {
            const response = await fetch('http://localhost:3000/api/data');
            const data = await response.json();
            
            if (data.main) {
                if (document.getElementById('company-info')) document.getElementById('company-info').value = data.main.companyInfo;
                if (document.getElementById('services-info')) document.getElementById('services-info').value = data.main.servicesInfo;
            }
            
            if (data.about) {
                if (document.getElementById('about-text1')) document.getElementById('about-text1').value = data.about.text1;
                if (document.getElementById('about-text2')) document.getElementById('about-text2').value = data.about.text2;
                if (document.getElementById('about-text3')) document.getElementById('about-text3').value = data.about.text3;
                if (document.getElementById('about-text4')) document.getElementById('about-text4').value = data.about.text4;
            }
            
            if (data.projects) {
                for (let i = 1; i <= 8; i++) {
                    const element = document.getElementById(`project-text-${i}`);
                    if (element && data.projects[`text${i}`]) element.value = data.projects[`text${i}`];
                }
            }
            
            if (data.services) {
                if (document.getElementById('services-text-left')) document.getElementById('services-text-left').value = data.services.textLeft;
                if (document.getElementById('services-text-right')) document.getElementById('services-text-right').value = data.services.textRight;
                if (document.getElementById('services-list')) document.getElementById('services-list').value = data.services.servicesList;
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}
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
    const savedProjectsData = localStorage.getItem('projectsPageData');
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
        const response = await fetch('http://localhost:3000/api/save/', {
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
    
    localStorage.setItem('mainPageData', JSON.stringify(mainData));
    
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ main: mainData })
        });
        
        const result = await response.json();
        alert(result.success ? 'Данные сохранены в БД и JSON!' : 'Ошибка сохранения!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить! Проверьте консоль.');
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
        alert(result.success ? 'Данные сохранены!' : 'Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось отправить данные!');
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
    
    localStorage.setItem('projectsPageData', JSON.stringify(projectsData));
    
    try {
        const response = await fetch('http://localhost:3000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projects: projectsData })
        });
        
        const result = await response.json();
        alert(result.success ? 'Проекты обновлены!' : 'Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить проекты!');
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
        alert(result.success ? 'Услуги обновлены!' : 'Ошибка!');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось сохранить услуги!');
    }
});

// Загрузка проектов при открытии вкладки
document.querySelector('.admin-tab[data-tab="projects-management"]').addEventListener('click', loadProjects);

// Инициализация редактора проектов
document.getElementById('addProjectBtn').addEventListener('click', () => openProjectEditor(null));
document.getElementById('cancelProjectBtn').addEventListener('click', closeProjectEditor);
document.getElementById('deleteProjectBtn').addEventListener('click', deleteProject);
document.getElementById('projectForm').addEventListener('submit', saveProject);

// Предпросмотр изображений
document.getElementById('projectImages').addEventListener('change', function() {
    const preview = document.getElementById('imagesPreview');
    preview.innerHTML = '';
    
    Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML += `<img src="${e.target.result}">`;
        }
        reader.readAsDataURL(file);
    });
});

function closeProjectEditor() {
    document.getElementById('projectsList').style.display = 'block';
    document.getElementById('addProjectBtn').style.display = 'block';
    document.getElementById('projectEditorContainer').style.display = 'none';
    document.getElementById('projectForm').reset();
    document.getElementById('imagesPreview').innerHTML = '';
}

// Загрузка проектов
async function loadProjects() {
    console.log("Загрузка проектов...");
    try {
        const response = await fetch('http://localhost:3000/api/projects');
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        const projects = await response.json();
        console.log("Полученные проекты:", projects);
        
        const container = document.getElementById('projectsList');
        if (!container) {
            throw new Error('Элемент projectsList не найден');
        }
        
        container.innerHTML = '';
        
        if (!Array.isArray(projects)) {
            throw new Error('Сервер вернул не массив проектов');
        }

        projects.forEach(project => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project-item';
            projectEl.innerHTML = `
                <h4>${project.title || 'Без названия'}</h4>
                <p>${project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                <button class="edit-btn" data-id="${project.id}">Редактировать</button>
            `;
            container.appendChild(projectEl);
            
            projectEl.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openProjectEditor(project); 
            });
        });
    } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        const container = document.getElementById('projectsList');
        if (container) {
            container.innerHTML = `<p class="error">Ошибка: ${error.message}</p>`;
        }
    }
}

async function openProjectEditor(project) {
    if (project) {
        try {
            document.getElementById('projectId').value = project.id;
            document.getElementById('projectTitle').value = project.title;
            document.getElementById('projectDescription').value = project.description;
            document.getElementById('projectYearDesign').value = project.year_design;
            document.getElementById('projectYearImplementation').value = project.year_implementation;
            
            // Загрузка существующих изображений
            const existingImages = document.getElementById('existingImages');
            existingImages.innerHTML = '';
            if (project.images && project.images.length > 0) {
                project.images.forEach(img => {
                    existingImages.innerHTML += `
                        <div class="existing-image">
                            <img src="${img}">
                            <input type="hidden" name="existingImages" value="${img}">
                            <button type="button" class="remove-image-btn">×</button>
                        </div>
                    `;
                });
            }
            
            document.getElementById('deleteProjectBtn').style.display = 'inline-block';
        } catch (error) {
            console.error('Ошибка загрузки проекта:', error);
        }
    } else {
        document.getElementById('projectForm').reset();
        document.getElementById('existingImages').innerHTML = '';
        document.getElementById('deleteProjectBtn').style.display = 'none';
    }
    
    document.getElementById('projectsList').style.display = 'none';
    document.getElementById('addProjectBtn').style.display = 'none';
    document.getElementById('projectEditorContainer').style.display = 'block';
}

async function saveProject(e) {
    e.preventDefault();
    
    const title = document.getElementById('projectTitle').value.trim();
    if (!title) {
        alert('Название проекта обязательно!');
        return;
    }

    const formData = new FormData();
    formData.append('id', document.getElementById('projectId').value);
    formData.append('title', title);
    formData.append('description', document.getElementById('projectDescription').value);
    formData.append('year_design', document.getElementById('projectYearDesign').value);
    formData.append('year_implementation', document.getElementById('projectYearImplementation').value);
    
    try {
        const existingImages = Array.from(document.querySelectorAll('input[name="existingImages"]')).map(i => i.value);
        formData.append('existingImages', JSON.stringify(existingImages));
        
        const files = document.getElementById('projectImages').files;
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        
        const response = await fetch('http://localhost:3000/api/projects/save', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(await response.text());
        }
        
        alert('Проект успешно сохранен!');
        loadProjects();
        closeProjectEditor();
    } catch (error) {
        console.error('Ошибка сохранения проекта:', error);
        alert(`Ошибка сохранения: ${error.message}`);
    }
}

async function deleteProject() {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
        try {
            const response = await fetch('http://localhost:3000/api/projects/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: document.getElementById('projectId').value })
            });
            
            if (response.ok) {
                loadProjects();
                closeProjectEditor();
            }
        } catch (error) {
            console.error('Ошибка удаления проекта:', error);
        }
    }
}

