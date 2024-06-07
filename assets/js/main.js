/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 


/*===== CONTACT BUTTON ANIMATION =====*/
function highlightIcons() {
    const icons = document.querySelectorAll('.home__social-icon');
    let delay = 0;

    icons.forEach(icon => {
        setTimeout(() => {
            icon.classList.add('highlight-effect');
        }, delay);
        delay += 200; // Adjust the delay between icon animations (in milliseconds)

        // Optionally, remove the highlight effect after a certain time
        setTimeout(() => {
            icon.classList.remove('highlight-effect');
        }, delay + 1000); // Adjust the time as needed
    });
}


/*===== SEND MESSAGE BUTTON =====*/
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const formData = new FormData(contactForm);

    try {
        const response = await fetch('https://formspree.io/f/xqkreprr', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            showSuccessMessage();
        } else {
            showErrorMessage();
        }
    } catch (error) {
        showErrorMessage();
    }
});

function showSuccessMessage() {
    const successMessageElement = document.getElementById('successMessage');

    successMessageElement.style.display = 'block';

    contactForm.reset();
}

function showErrorMessage() {
    const errorMessageElement = document.getElementById('errorMessage');

    errorMessageElement.style.display = 'block';
}



/*===== WORK DETAILS =====*/
document.addEventListener('DOMContentLoaded', () => {
    fetch('assets/data/work-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const workContainer = document.getElementById('work-container');
            const modalsContainer = document.getElementById('modals-container');

            data.forEach(category => {
                // Create category title
                const categoryTitle = document.createElement('h3');
                categoryTitle.classList.add('work__category');
                categoryTitle.textContent = category.category;
                workContainer.appendChild(categoryTitle);

                // Create container for projects under the category
                const projectContainer = document.createElement('div');
                projectContainer.classList.add('work__project-container');
                workContainer.appendChild(projectContainer);

                // Create work items for each project in the category
                category.projects.forEach(work => {
                    // Create work item
                    const workItem = document.createElement('div');
                    workItem.classList.add('work__img');
                    workItem.setAttribute('data-modal-target', `#${work.id}`);
                    workItem.innerHTML = `
                        <img src="${work.image}" alt="${work.title}">
                        <div class="work__img-overlay">
                            <h3 class="work__title">${work.title}</h3>
                            <p class="work__description hidden">${work.description}</p>
                            <p class="work__tech">${work.technologies.join(', ')}</p>
                            ${work.website ? `<a href="${work.website}" target="_blank" class="work__link">Website</a>` : ''}
                        </div>
                    `;
                    projectContainer.appendChild(workItem);

                    // Create modal
                    const modal = document.createElement('div');
                    modal.classList.add('modal');
                    modal.id = work.id;
                    modal.innerHTML = `
                        <div class="modal-content">
                            <span class="close-button">&times;</span>
                            <h3 class="work__title">${work.title}</h3>
                            <p class="work__description">${work.description}</p>
                            <p class="work__tech">Technologies used: ${work.technologies.join(', ')}</p>
                            ${work.website ? `<a href="${work.website}" target="_blank" class="work__link">Website</a>` : ''}
                        </div>
                    `;
                    modalsContainer.appendChild(modal);
                });
            });

            // Add modal functionality (unchanged)
            const modalButtons = document.querySelectorAll('[data-modal-target]');
            const modals = document.querySelectorAll('.modal');
            const closeButtons = document.querySelectorAll('.close-button');

            modalButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const modal = document.querySelector(button.getAttribute('data-modal-target'));
                    const workImgSrc = button.querySelector('img').getAttribute('src');
                    modal.querySelector('.modal-content').style.backgroundImage = `url(${workImgSrc})`;
                    modal.style.display = 'flex';
                });
            });

            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    button.closest('.modal').style.display = 'none';
                });
            });

            window.addEventListener('click', (event) => {
                modals.forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching work data:', error));
});




/*===== SKILLS DATA =====*/
fetch('assets/data/skills-data.json')
    .then(response => response.json())
    .then(data => {
        const skillsContainer = document.querySelector('.skills__categories-container');

        // Loop through categories and render skills
        for (const [category, skills] of Object.entries(data.professional_skills)) {
            const categoryHTML = `
            <div class="skills__category">
                <h3 class="skills__category-title">${category}</h3>
                <div class="skills__category-list">
                    ${skills.map(skill => renderSkillHTML(skill)).join('')}
                </div>
            </div>`;
            skillsContainer.insertAdjacentHTML('beforeend', categoryHTML);
        }

        // Define function to render skill HTML
        function renderSkillHTML(skill) {
            return `
            <div class="skills__data">
                <div class="skills__names">
                    <i class="${skill.icon} skills__icon"></i>
                    <span class="skills__name">${skill.name}</span>
                </div>
                <div class="skills__level">${skill.level}</div>
            </div>`;
        }
    })
    .catch(error => console.error('Error fetching skills data:', error));





/*===== HOBBIES DATA =====*/
fetch('assets/data/hobbies-data.json')
    .then(response => response.json())
    .then(data => {
        const hobbiesContainer = document.querySelector('.hobbies__container');

        data.hobbies.forEach(hobby => {
            const hobbyHTML = `
                <div class="hobby">
                    <i class='${hobby.icon} hobby__icon'></i>
                    <h3 class="hobby__title">${hobby.name}</h3>
                    <p class="hobby__description">${hobby.description}</p>
                </div>
            `;
            hobbiesContainer.insertAdjacentHTML('beforeend', hobbyHTML);
        });
    })
    .catch(error => console.error('Error fetching hobbies data:', error));






/*===== PERFILS IMAGES SLIDE SHOW =====*/
// Array of image file paths
const perfilImagePaths = [
    "assets/img/perfils/perfil1.png",
    "assets/img/perfils/perfil2.png"
];

// Select the SVG container
const perfilSvgContainer = document.querySelector('.home__blob');
// Function to initialize the slideshow
function initializePerfilSlideshow(imagePaths, svgContainer) {
    // Create and append image elements for each image path
    imagePaths.forEach((path, index) => {
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("class", "home__blob-img");
        image.setAttribute("x", "50");
        image.setAttribute("y", "60");
        image.setAttribute("href", path);
        image.setAttribute("alt", `Profile Image ${index + 1}`);
        svgContainer.querySelector('g').appendChild(image);
    });

    // Slideshow variables
    let currentImageIndex = 0;
    const fadeDuration = 500; // Fade duration in milliseconds
    const intervalDuration = 3000; // Interval duration in milliseconds
    const fadeSteps = 10; // Number of steps for fade effect
    const fadeInterval = fadeDuration / fadeSteps; // Interval between each fade step

    // Function to fade out current image
    function fadeOut() {
        const images = document.querySelectorAll('.home__blob-img');
        const currentImage = images[currentImageIndex];
        let opacity = 1;
        const fadeOutInterval = setInterval(() => {
            opacity -= 1 / fadeSteps;
            currentImage.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fadeOutInterval);
            }
        }, fadeInterval);
    }

    // Function to fade in next image
    function fadeIn() {
        const images = document.querySelectorAll('.home__blob-img');
        const nextImageIndex = (currentImageIndex + 1) % images.length;
        const nextImage = images[nextImageIndex];
        let opacity = 0;
        const fadeInInterval = setInterval(() => {
            opacity += 1 / fadeSteps;
            nextImage.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(fadeInInterval);
            }
        }, fadeInterval);
        currentImageIndex = nextImageIndex;
    }

    // Function to start the slideshow
    function startSlideshow() {
        fadeOut(); // Clear the image array initially to avoid overlapping
        // Set interval to fade in the next image
        setInterval(() => {
            fadeOut(); // Fade out the current image
            setTimeout(() => {
                fadeIn(); // Fade in the next image after fading out
            }, fadeDuration);
        }, intervalDuration);
    }

    // Start the slideshow
    startSlideshow();
}

// Call the function to initialize the slideshow
// initializePerfilSlideshow(perfilImagePaths, perfilSvgContainer);




/*===== ABOUT IMAGES SLIDE SHOW =====*/
// Function to initialize the slideshow for the about section
function initializeAboutSlideshow(imagePaths, aboutImgContainer) {
    // Slideshow variables
    let currentImageIndex = 0;
    const fadeDuration = 700; // Fade duration in milliseconds
    const intervalDuration = 4000; // Interval duration in milliseconds
    const fadeSteps = 15; // Number of steps for fade effect
    const fadeInterval = fadeDuration / fadeSteps; // Interval between each fade step

    // Function to fade out current image
    function fadeOut() {
        aboutImgContainer.style.opacity = 0;
    }

    // Function to fade in next image
    function fadeIn() {
        aboutImgContainer.src = imagePaths[currentImageIndex];
        let opacity = 0;
        const fadeInInterval = setInterval(() => {
            opacity += 1 / fadeSteps;
            aboutImgContainer.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(fadeInInterval);
            }
        }, fadeInterval);
        currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
    }

    // Function to start the slideshow
    function startSlideshow() {
        fadeOut(); // Clear the image initially to avoid overlapping
        // Set interval to fade in the next image
        setInterval(() => {
            fadeOut(); // Fade out the current image
            setTimeout(() => {
                fadeIn(); // Fade in the next image after fading out
            }, fadeDuration);
        }, intervalDuration);
    }

    // Start the slideshow
    startSlideshow();
}

// Example usage:
const aboutImagePaths = [
    "assets/img/about/about1.jpg",
    "assets/img/about/about2.jpg"
];

const aboutImgContainer = document.querySelector('.about__img img');
// initializeAboutSlideshow(aboutImagePaths, aboutImgContainer);
