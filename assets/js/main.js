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
                // Create category section
                const categorySection = document.createElement('div');
                categorySection.classList.add('work__category');
                
                // Create category title
                const categoryTitle = document.createElement('h3');
                categoryTitle.classList.add('work__category-title');
                categoryTitle.textContent = category.category;
                categorySection.appendChild(categoryTitle);

                // Create container for projects under the category
                const projectContainer = document.createElement('div');
                projectContainer.classList.add('work__category-container');
                categorySection.appendChild(projectContainer);

                // Create work items for each project in the category
                category.projects.forEach(work => {
                    // Check if image exists, use fallback if not
                    const imageUrl = work.image || 'assets/img/work/work1.jpg';
                    
                    // Create work project card
                    const workProject = document.createElement('div');
                    workProject.classList.add('work__project');
                    workProject.setAttribute('data-modal-target', `#${work.id}`);
                    
                    workProject.innerHTML = `
                        <div class="work__project-image">
                            <img src="${imageUrl}" alt="${work.title}" onerror="this.src='assets/img/work/work1.jpg'">
                            <div class="work__project-overlay">
                                <button class="work__view-btn">
                                    <i class='bx bx-expand-alt'></i>
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div class="work__project-content">
                            <h3 class="work__project-title">${work.title}</h3>
                            <p class="work__project-description">${work.description || 'Click to view more details about this project.'}</p>
                            <div class="work__project-tech">
                                ${work.technologies.slice(0, 4).map(tech => `<span class="work__tech-tag">${tech}</span>`).join('')}
                            </div>
                            <div class="work__project-links">
                                <button class="work__project-link primary">
                                    <i class='bx bx-expand-alt'></i>
                                    View Details
                                </button>
                            </div>
                        </div>
                    `;
                    projectContainer.appendChild(workProject);

                    // Create modal with new structure
                    const modal = document.createElement('div');
                    modal.classList.add('modal');
                    modal.id = work.id;
                    modal.innerHTML = `
                        <div class="modal-content">
                            <button class="close-button">&times;</button>
                            <div class="modal-header">
                                <img src="${imageUrl}" alt="${work.title}" onerror="this.src='assets/img/work/work1.jpg'">
                            </div>
                            <div class="modal-body">
                                <h2 class="modal-title">${work.title}</h2>
                                <p class="modal-description">${work.description}</p>
                                <div class="modal-tech">
                                    <h3>Technologies Used</h3>
                                    <div class="modal-tech-list">
                                        ${work.technologies.map(tech => `<span class="modal-tech-tag">${tech}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="modal-links">
                                    ${work.website ? `<a href="${work.website}" target="_blank" class="modal-link">
                                        <i class='bx bx-link-external'></i>
                                        Visit Website
                                    </a>` : ''}
                                    ${work.github ? `<a href="${work.github}" target="_blank" class="modal-link secondary">
                                        <i class='bx bxl-github'></i>
                                        View Code
                                    </a>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                    modalsContainer.appendChild(modal);
                });

                workContainer.appendChild(categorySection);
            });

            // Ensure all work items are visible (debug fix)
            setTimeout(() => {
                const workItems = document.querySelectorAll('.work__project');
                workItems.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.visibility = 'visible';
                });
                console.log(`Loaded ${workItems.length} work items`);
            }, 200);

            // Add ScrollReveal to work items after they're loaded
            setTimeout(() => {
                if (typeof sr !== 'undefined') {
                    sr.reveal('.work__project', { interval: 200 });
                }
            }, 100);

            // Add modal functionality with new structure
            const modalTriggers = document.querySelectorAll('[data-modal-target]');
            const modals = document.querySelectorAll('.modal');
            const closeButtons = document.querySelectorAll('.close-button');

            modalTriggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modalId = trigger.getAttribute('data-modal-target');
                    const modal = document.querySelector(modalId);
                    if (modal) {
                        modal.style.display = 'flex';
                        // Add show class for animations
                        setTimeout(() => modal.classList.add('show'), 10);
                    }
                });
            });

            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const modal = button.closest('.modal');
                    modal.classList.remove('show');
                    setTimeout(() => modal.style.display = 'none', 250);
                });
            });

            // Close modal when clicking outside
            window.addEventListener('click', (event) => {
                modals.forEach(modal => {
                    if (event.target === modal) {
                        modal.classList.remove('show');
                        setTimeout(() => modal.style.display = 'none', 250);
                    }
                });
            });

            // Close modal with escape key
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    modals.forEach(modal => {
                        if (modal.style.display === 'flex') {
                            modal.classList.remove('show');
                            setTimeout(() => modal.style.display = 'none', 250);
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching work data:', error);
            const workContainer = document.getElementById('work-container');
            workContainer.innerHTML = `
                <div class="work__empty">
                    <i class='bx bx-error-circle work__empty-icon'></i>
                    <p>Failed to load work projects. Please try again later.</p>
                </div>
            `;
        });
});




/*===== SKILLS DATA =====*/
fetch('assets/data/skills-data.json')
    .then(response => response.json())
    .then(data => {
        const skillsContainer = document.getElementById('skillsCategoriesContainer');

        // Define category mappings for filtering
        const categoryMappings = {
            'Programming Languages': 'programming',
            'Data Engineering & ML': 'data',
            'Cloud & DevOps': 'cloud',
            'Tools & Frameworks': 'tools',
            'Databases': 'data'
        };

        // Define category icons
        const categoryIcons = {
            'Programming Languages': 'bx-code-alt',
            'Data Engineering & ML': 'bx-data',
            'Cloud & DevOps': 'bx-cloud',
            'Tools & Frameworks': 'bx-wrench',
            'Databases': 'bx-server'
        };

        // Loop through categories and render skills
        for (const [category, skills] of Object.entries(data.professional_skills)) {
            const categoryKey = categoryMappings[category] || 'tools';
            const categoryIcon = categoryIcons[category] || 'bx-cog';
            
            const categoryHTML = `
            <div class="skills__category" data-category="${categoryKey}">
                <h3 class="skills__category-title">
                    <div class="skills__category-icon">
                        <i class="bx ${categoryIcon}"></i>
                    </div>
                    ${category}
                </h3>
                <div class="skills__category-list">
                    ${skills.map(skill => renderSkillHTML(skill)).join('')}
                </div>
            </div>`;
            skillsContainer.insertAdjacentHTML('beforeend', categoryHTML);
        }

        // Define function to render skill HTML with progress circle
        function renderSkillHTML(skill) {
            const progressPercentage = skillsProgressMap[skill.level] || 50;
            const levelClass = skill.level.toLowerCase().replace(/\s+/g, '-');
            
            console.log(`Skill: ${skill.name}, Level: ${skill.level}, Class: skills__progress--${levelClass}`);
            
            return `
            <div class="skills__data">
                <div class="skills__icon">
                    <i class="${skill.icon}"></i>
                </div>
                <div class="skills__names">
                    <span class="skills__name">${skill.name}</span>
                    <span class="skills__level">${skill.level}</span>
                </div>
                <div class="skills__progress skills__progress--${levelClass}">
                    <div class="skills__progress-circle" style="--progress-degree: 0deg;">
                        <span class="skills__progress-text">${progressPercentage}%</span>
                    </div>
                </div>
            </div>`;
        }

        // Initialize progress circles after a delay
        setTimeout(() => {
            const progressCircles = document.querySelectorAll('.skills__progress-circle');
            console.log(`Found ${progressCircles.length} progress circles`);
            
            progressCircles.forEach((circle, index) => {
                const progressText = circle.querySelector('.skills__progress-text');
                const percentage = parseInt(progressText.textContent);
                const degree = (percentage / 100) * 360;
                
                // Get the skill level to determine color
                const skillLevelElement = circle.closest('.skills__data').querySelector('.skills__level');
                const skillLevel = skillLevelElement.textContent.trim();
                
                // Define color mapping
                const colorMap = {
                    'Expert': '#9c27b0',
                    'Advanced': '#4caf50', 
                    'Intermediate': '#2196f3',
                    'Beginner': '#ff9800'
                };
                
                const progressColor = colorMap[skillLevel] || '#4caf50';
                
                console.log(`Skill ${index}: Level="${skillLevel}", Color="${progressColor}", Percentage=${percentage}%`);
                
                // Apply color and degree directly to the circle
                circle.style.background = `conic-gradient(${progressColor} ${degree}deg, var(--surface-3) 0deg)`;
                circle.style.transition = 'all 1s ease-out';
                
                // Also set the CSS custom property for consistency
                circle.style.setProperty('--progress-degree', degree + 'deg');
                circle.style.setProperty('--progress-color', progressColor);
            });
        }, 500);
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
                    ${hobby.link ? `<a href="${hobby.link}" class="button hobby__link" target="_blank">Learn More</a>` : ''}
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

/*===== ABOUT SECTION INTERACTIONS =====*/
// Expandable content functionality
document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.getElementById('aboutExpandBtn');
    const expandableContent = document.getElementById('aboutExpandableContent');
    
    if (expandBtn && expandableContent) {
        expandBtn.addEventListener('click', () => {
            const isExpanded = expandableContent.classList.contains('expanded');
            
            if (isExpanded) {
                expandableContent.classList.remove('expanded');
                expandBtn.classList.remove('expanded');
                expandBtn.querySelector('.about__expand-text').textContent = 'Read More';
            } else {
                expandableContent.classList.add('expanded');
                expandBtn.classList.add('expanded');
                expandBtn.querySelector('.about__expand-text').textContent = 'Read Less';
            }
        });
    }
    
    // Animated counter for stats
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    };
    
    // Initialize counters when About section comes into view
    const aboutSection = document.getElementById('about');
    const statNumbers = document.querySelectorAll('.about__stat-number');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateCounter(stat, target);
                });
                aboutObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
});

// Initialize AOS (Animate On Scroll) if available
document.addEventListener('DOMContentLoaded', () => {
    // Simple fade-in animation for elements with data-aos attributes
    const elementsToAnimate = document.querySelectorAll('[data-aos]');
    
    const animateOnScroll = () => {
        elementsToAnimate.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        
        const delay = element.getAttribute('data-aos-delay');
        if (delay) {
            element.style.transitionDelay = delay + 'ms';
        }
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
});

/*===== SKILLS SECTION INTERACTIONS =====*/
// Skills tab functionality
document.addEventListener('DOMContentLoaded', () => {
    const skillsTabs = document.querySelectorAll('.skills__tab');
    const skillsContainer = document.getElementById('skillsCategoriesContainer');
    
    // Tab switching functionality
    skillsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            skillsTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Filter skills based on selected category
            const category = tab.getAttribute('data-category');
            filterSkills(category);
        });
    });
    
    // Filter skills by category
    function filterSkills(category) {
        const skillCategories = skillsContainer.querySelectorAll('.skills__category');
        
        skillCategories.forEach(cat => {
            if (category === 'all' || cat.getAttribute('data-category') === category) {
                cat.style.display = 'block';
                cat.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                cat.style.display = 'none';
            }
        });
    }
    
    // Animated counter for skills stats
    const skillsSection = document.getElementById('skills');
    const skillsStatNumbers = document.querySelectorAll('.skills__stat-number');
    
    const skillsObserverOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsStatNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateSkillsCounter(stat, target);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, skillsObserverOptions);
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // Animate progress circles
    const animateProgressCircles = () => {
        const progressCircles = document.querySelectorAll('.skills__progress-circle');
        
        progressCircles.forEach(circle => {
            const progressText = circle.querySelector('.skills__progress-text');
            const percentage = parseInt(progressText.textContent);
            const degree = (percentage / 100) * 360;
            
            circle.style.setProperty('--progress-degree', degree + 'deg');
        });
    };
    
    // Initialize progress circles when skills section is visible
    const skillsProgressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateProgressCircles, 300);
                skillsProgressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (skillsSection) {
        skillsProgressObserver.observe(skillsSection);
    }
});

// Skills counter animation function
function animateSkillsCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

// Skills progress circle animation
function setSkillProgress(skillElement, percentage) {
    const progressCircle = skillElement.querySelector('.skills__progress-circle');
    const progressText = skillElement.querySelector('.skills__progress-text');
    
    if (progressCircle && progressText) {
        const degree = (percentage / 100) * 360;
        progressCircle.style.setProperty('--progress-degree', degree + 'deg');
        progressText.textContent = percentage + '%';
    }
}

// Skills data mapping for progress levels
const skillsProgressMap = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 90
};
