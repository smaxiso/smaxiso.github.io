/*===== SITE CONFIGURATION MANAGEMENT =====*/
let siteConfig = {};

// Load site configuration from JSON
async function loadSiteConfig() {
    try {
        const response = await fetch('assets/data/site-config.json');
        if (!response.ok) {
            throw new Error('Failed to load site configuration');
        }
        siteConfig = await response.json();
        console.log('Site configuration loaded successfully');
        return siteConfig;
    } catch (error) {
        console.error('Error loading site configuration:', error);
        // Return default config if loading fails
        return getDefaultConfig();
    }
}

// Default configuration fallback
function getDefaultConfig() {
    return {
        site: {
            title: "Portfolio - Data Engineer",
            description: "Personal portfolio website",
            author: "Portfolio Owner"
        },
        navigation: {
            logo: "Portfolio",
            items: [
                { label: "Home", href: "#home", active: true },
                { label: "About", href: "#about", active: false },
                { label: "Skills", href: "#skills", active: false },
                { label: "Work", href: "#work", active: false },
                { label: "Hobbies", href: "#hobbies", active: false },
                { label: "Contact", href: "#contact", active: false }
            ]
        },
        home: {
            greeting: "Hello!",
            name: "Portfolio Owner",
            title: "Professional Title",
            subtitle: "Description of what you do."
        }
    };
}

// Populate HTML meta tags
function populateMetaTags() {
    if (!siteConfig.site) return;

    // Basic meta tags
    document.title = siteConfig.site.title || 'Portfolio';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && siteConfig.site.description) {
        metaDescription.setAttribute('content', siteConfig.site.description);
    }

    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor && siteConfig.site.author) {
        metaAuthor.setAttribute('content', siteConfig.site.author);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && siteConfig.site.keywords) {
        metaKeywords.setAttribute('content', siteConfig.site.keywords.join(', '));
    }

    // Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', siteConfig.site.title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', siteConfig.site.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && siteConfig.site.url) ogUrl.setAttribute('content', siteConfig.site.url);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && siteConfig.site.image) ogImage.setAttribute('content', siteConfig.site.image);

    const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
    if (ogImageAlt) ogImageAlt.setAttribute('content', `${siteConfig.site.author} - Professional Portfolio`);

    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (ogSiteName) ogSiteName.setAttribute('content', siteConfig.site.author + ' Portfolio');

    // Twitter Card meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', siteConfig.site.title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', siteConfig.site.description);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && siteConfig.site.image) twitterImage.setAttribute('content', siteConfig.site.image);

    const twitterImageAlt = document.querySelector('meta[name="twitter:image:alt"]');
    if (twitterImageAlt) twitterImageAlt.setAttribute('content', `${siteConfig.site.author} - Professional Portfolio`);

    const twitterCreator = document.querySelector('meta[name="twitter:creator"]');
    if (twitterCreator && siteConfig.site.twitter) twitterCreator.setAttribute('content', siteConfig.site.twitter);

    const twitterSite = document.querySelector('meta[name="twitter:site"]');
    if (twitterSite && siteConfig.site.twitter) twitterSite.setAttribute('content', siteConfig.site.twitter);

    // Additional meta tags
    const appName = document.querySelector('meta[name="application-name"]');
    if (appName) appName.setAttribute('content', siteConfig.site.author + ' Portfolio');

    const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitle) appleTitle.setAttribute('content', siteConfig.site.author + ' Portfolio');

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && siteConfig.site.url) canonical.setAttribute('href', siteConfig.site.url);

    // Language
    const htmlLang = document.documentElement;
    if (htmlLang && siteConfig.site.language) htmlLang.setAttribute('lang', siteConfig.site.language);
}

// Generate and populate structured data (JSON-LD)
function populateStructuredData() {
    if (!siteConfig.site || !siteConfig.home) return;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": siteConfig.home.name,
        "jobTitle": siteConfig.home.title,
        "description": siteConfig.site.description,
        "url": siteConfig.site.url,
        "image": siteConfig.site.image,
        "sameAs": [],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
        },
        "alumniOf": {
            "@type": "Organization",
            "name": "National Institute of Technology"
        },
        "worksFor": {
            "@type": "Organization",
            "name": "Gen Digital",
            "description": "Cybersecurity and Digital Safety Company"
        },
        "knowsAbout": siteConfig.site.keywords,
        "expertise": [
            "Data Engineering",
            "Machine Learning",
            "Data Pipeline Architecture",
            "Real-time Analytics",
            "ETL Development",
            "Cloud Computing"
        ]
    };

    // Add social media URLs to sameAs array
    if (siteConfig.home.socialLinks) {
        structuredData.sameAs = siteConfig.home.socialLinks
            .filter(link => ['linkedin', 'github', 'twitter', 'medium'].includes(link.platform))
            .map(link => link.url);
    }

    const structuredDataElement = document.getElementById('structuredData');
    if (structuredDataElement) {
        structuredDataElement.textContent = JSON.stringify(structuredData, null, 2);
    }
}

// Populate navigation
function populateNavigation() {
    if (!siteConfig.navigation) return;

    // Set logo
    const navLogo = document.getElementById('navLogo');
    if (navLogo && siteConfig.navigation.logo) {
        navLogo.textContent = siteConfig.navigation.logo;
    }

    // Set navigation items
    const navList = document.getElementById('navList');
    if (navList && siteConfig.navigation.items) {
        navList.innerHTML = '';
        siteConfig.navigation.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'nav__item';
            const a = document.createElement('a');
            a.href = item.href;
            a.className = item.active ? 'nav__link active-link' : 'nav__link';
            a.textContent = item.label;
            li.appendChild(a);
            navList.appendChild(li);
        });
    }
}

// Populate home section
function populateHomeSection() {
    if (!siteConfig.home) return;

    // Set greeting
    const homeGreeting = document.getElementById('homeGreeting');
    if (homeGreeting && siteConfig.home.greeting) {
        homeGreeting.textContent = siteConfig.home.greeting;
    }

    // Set title
    const homeTitle = document.getElementById('homeTitle');
    if (homeTitle && siteConfig.home.name && siteConfig.home.title) {
        homeTitle.innerHTML = `
            I'm <span class="home__title-highlight">${siteConfig.home.name}</span><br>
            ${siteConfig.home.title}
        `;
    }

    // Set subtitle
    const homeSubtitle = document.getElementById('homeSubtitle');
    if (homeSubtitle && siteConfig.home.subtitle) {
        homeSubtitle.textContent = siteConfig.home.subtitle;
    }

    // Set profile image
    const homeProfileImage = document.getElementById('homeProfileImage');
    if (homeProfileImage && siteConfig.home.profileImage) {
        homeProfileImage.setAttribute('href', siteConfig.home.profileImage.src);
        homeProfileImage.setAttribute('alt', siteConfig.home.profileImage.alt);
    }

    // Set CTA buttons
    const homeActions = document.getElementById('homeActions');
    if (homeActions && siteConfig.home.ctaButtons) {
        homeActions.innerHTML = '';
        siteConfig.home.ctaButtons.forEach(button => {
            const a = document.createElement('a');
            a.href = button.href;
            a.className = `btn btn-${button.type} home__cta-${button.type}`;
            if (button.ariaLabel) a.setAttribute('aria-label', button.ariaLabel);
            if (button.onClick) a.setAttribute('onclick', button.onClick);
            a.innerHTML = `
                <i class='${button.icon}'></i>
                ${button.label}
            `;

            if (button.type === 'primary') {
                homeActions.appendChild(a);
            } else {
                const div = document.createElement('div');
                div.className = 'home__cta-secondary';
                div.appendChild(a);
                homeActions.appendChild(div);
            }
        });
    }

    // Set social links
    const homeSocial = document.getElementById('homeSocial');
    if (homeSocial && siteConfig.home.socialLinks) {
        homeSocial.innerHTML = '';
        siteConfig.home.socialLinks.forEach(social => {
            const a = document.createElement('a');
            a.href = social.url;
            a.className = 'home__social-icon';
            a.id = social.platform;
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener');
            a.setAttribute('aria-label', social.ariaLabel);
            a.innerHTML = `<i class='${social.icon}'></i>`;
            homeSocial.appendChild(a);
        });
    }
}

// Populate about section
function populateAboutSection() {
    if (!siteConfig.about) return;

    const aboutSectionTitle = document.getElementById('aboutSectionTitle');
    if (aboutSectionTitle) aboutSectionTitle.textContent = siteConfig.about.sectionTitle || 'About Me';

    const aboutSubtitle = document.getElementById('aboutSubtitle');
    if (aboutSubtitle) aboutSubtitle.textContent = siteConfig.about.subtitle || 'Who I Am';

    const aboutTitle = document.getElementById('aboutTitle');
    if (aboutTitle) aboutTitle.textContent = siteConfig.about.title || 'Professional';

    const aboutImage = document.getElementById('aboutImage');
    if (aboutImage && siteConfig.about.profileImage) {
        aboutImage.src = siteConfig.about.profileImage.src;
        aboutImage.alt = siteConfig.about.profileImage.alt;
    }

    const aboutMainText = document.getElementById('aboutMainText');
    if (aboutMainText) aboutMainText.textContent = siteConfig.about.mainText || '';

    // Populate stats
    const aboutStats = document.getElementById('aboutStats');
    if (aboutStats && siteConfig.about.stats) {
        aboutStats.innerHTML = '';
        siteConfig.about.stats.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.className = 'about__stat';
            statDiv.innerHTML = `
                <span class="about__stat-number" data-count="${stat.number}">${stat.number}</span>
                <span class="about__stat-label">${stat.label}</span>
            `;
            aboutStats.appendChild(statDiv);
        });
    }

    // Populate actions
    const aboutActions = document.getElementById('aboutActions');
    if (aboutActions && siteConfig.about.actions) {
        aboutActions.innerHTML = '';
        siteConfig.about.actions.forEach(action => {
            const a = document.createElement('a');
            a.href = action.href;
            a.className = `btn btn-${action.type}`;
            if (action.download) a.setAttribute('download', action.download);
            if (action.ariaLabel) a.setAttribute('aria-label', action.ariaLabel);
            a.innerHTML = `
                <i class='${action.icon}'></i>
                ${action.label}
            `;
            aboutActions.appendChild(a);
        });
    }
}

// Populate skills section
function populateSkillsSection() {
    if (!siteConfig.skills) return;

    const skillsSectionTitle = document.getElementById('skillsSectionTitle');
    if (skillsSectionTitle) skillsSectionTitle.textContent = siteConfig.skills.sectionTitle || 'Skills';

    const skillsDescription = document.getElementById('skillsDescription');
    if (skillsDescription) skillsDescription.textContent = siteConfig.skills.description || '';

    const skillsLegendTitle = document.getElementById('skillsLegendTitle');
    if (skillsLegendTitle) skillsLegendTitle.textContent = siteConfig.skills.legendTitle || 'Skill Levels';

    // Populate stats
    const skillsStats = document.getElementById('skillsStats');
    if (skillsStats && siteConfig.skills.stats) {
        skillsStats.innerHTML = '';
        siteConfig.skills.stats.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.className = 'skills__stat';
            statDiv.innerHTML = `
                <span class="skills__stat-number" data-count="${stat.number}">${stat.number}</span>
                <span class="skills__stat-label">${stat.label}</span>
            `;
            skillsStats.appendChild(statDiv);
        });
    }

    // Populate legend
    const skillsLegend = document.getElementById('skillsLegend');
    if (skillsLegend && siteConfig.skills.legend) {
        skillsLegend.innerHTML = '';
        siteConfig.skills.legend.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'skills__legend-item';
            legendItem.innerHTML = `
                <div class="skills__legend-color" style="background-color: ${item.color}"></div>
                <span class="skills__legend-label">${item.label}</span>
            `;
            skillsLegend.appendChild(legendItem);
        });
    }
}

// Populate other sections
function populateOtherSections() {
    // Work section
    const workSectionTitle = document.getElementById('workSectionTitle');
    if (workSectionTitle && siteConfig.work) {
        workSectionTitle.textContent = siteConfig.work.sectionTitle;
    }

    // Hobbies section
    const hobbiesSectionTitle = document.getElementById('hobbiesSectionTitle');
    if (hobbiesSectionTitle && siteConfig.hobbies) {
        hobbiesSectionTitle.textContent = siteConfig.hobbies.sectionTitle;
    }

    // Contact section
    const contactSectionTitle = document.getElementById('contactSectionTitle');
    if (contactSectionTitle && siteConfig.contact) {
        contactSectionTitle.textContent = siteConfig.contact.sectionTitle;
    }
}

// Populate contact form
function populateContactForm() {
    if (!siteConfig.contact || !siteConfig.contact.form) return;

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const form = siteConfig.contact.form;

    // Set form attributes
    contactForm.setAttribute('action', form.action);
    contactForm.setAttribute('method', form.method);

    // Create form HTML
    let formHTML = '<div class="contact__inputs">';

    // Add regular fields (not textarea)
    const regularFields = form.fields.filter(field => field.type !== 'textarea');
    regularFields.forEach(field => {
        formHTML += `
            <div class="contact__input-container">
                <label for="${field.id}" class="contact__label">${field.label}</label>
                <input type="${field.type}" id="${field.id}" name="${field.name}" 
                       placeholder="${field.placeholder}" class="contact__input"
                       ${field.required ? 'required' : ''}>
            </div>
        `;
    });

    formHTML += '</div>';

    // Add textarea field
    const textareaField = form.fields.find(field => field.type === 'textarea');
    if (textareaField) {
        formHTML += `
            <div class="contact__input-container">
                <label for="${textareaField.id}" class="contact__label">${textareaField.label}</label>
                <textarea id="${textareaField.id}" name="${textareaField.name}" 
                          cols="0" rows="${textareaField.rows}" 
                          placeholder="${textareaField.placeholder}" class="contact__input"
                          ${textareaField.required ? 'required' : ''}></textarea>
            </div>
        `;
    }

    // Add success and error messages
    formHTML += `
        <p id="successMessage" class="contact__success-message">${form.messages.success}</p>
        <p id="errorMessage" class="contact__error-message">${form.messages.error}</p>
    `;

    // Add submit button
    formHTML += `
        <input type="${form.submitButton.type}" value="${form.submitButton.label}" class="contact__button button">
    `;

    contactForm.innerHTML = formHTML;
}

// Populate footer
function populateFooter() {
    if (!siteConfig.footer) return;

    // Set footer title
    const footerTitle = document.getElementById('footerTitle');
    if (footerTitle && siteConfig.footer.title) {
        footerTitle.textContent = siteConfig.footer.title;
    }

    // Set footer social links
    const footerSocial = document.getElementById('footerSocial');
    if (footerSocial && siteConfig.footer.socialLinks) {
        footerSocial.innerHTML = '';
        siteConfig.footer.socialLinks.forEach(social => {
            const a = document.createElement('a');
            a.href = social.url;
            a.className = 'footer__icon';
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener');
            a.innerHTML = `<i class='${social.icon}'></i>`;
            footerSocial.appendChild(a);
        });
    }

    // Set footer copyright
    const footerCopyright = document.getElementById('footerCopyright');
    if (footerCopyright && siteConfig.footer.copyright) {
        footerCopyright.textContent = siteConfig.footer.copyright;
    }
}

// Initialize all content from config
async function initializeSiteContent() {
    try {
        await loadSiteConfig();
        populateMetaTags();
        populateNavigation();
        populateHomeSection();
        populateAboutSection();
        populateSkillsSection();
        populateOtherSections();
        populateContactForm();
        populateFooter();

        console.log('Site content populated successfully');

        // Re-initialize navigation event listeners after populating navigation
        initializeNavigationEventListeners();

        // Initialize contact form after creating it
        initializeContactForm();

        // Initialize interactive features after content is loaded
        initializeInteractiveFeatures();

    } catch (error) {
        console.error('Error initializing site content:', error);
    }
}

// Main initialization function
async function initializeSite() {
    try {
        await loadSiteConfig();

        // Initialize SEO elements
        populateMetaTags();
        populateStructuredData();

        // Initialize site content
        populateNavigation();
        populateHomeSection();
        populateAboutSection();
        populateSkillsSection();
        populateOtherSections();
        populateContactForm();
        populateFooter();

        // Initialize interactions
        initializeNavigationEventListeners();
        initializeContactForm();
        initializeInteractiveFeatures();

        console.log('Site initialized successfully');
    } catch (error) {
        console.error('Error initializing site:', error);
    }
}

// Function to initialize interactive features after content is populated
function initializeInteractiveFeatures() {
    // Re-initialize animations and interactions since elements are now in DOM
    if (typeof animateSectionTitles === 'function') animateSectionTitles();
    if (typeof enhanceCardInteractions === 'function') enhanceCardInteractions();
    if (typeof enhanceButtonInteractions === 'function') enhanceButtonInteractions();
    if (typeof addParallaxEffect === 'function') addParallaxEffect();
    if (typeof staggerSkillAnimations === 'function') staggerSkillAnimations();
    if (typeof enhanceNavigation === 'function') enhanceNavigation();

    // Initialize ScrollReveal if not already done
    if (typeof sr !== 'undefined') {
        sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
        sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
        sr.reveal('.home__social-icon', { interval: 200 });
        sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });
    }
}

// Initialize navigation event listeners
function initializeNavigationEventListeners() {
    // Re-initialize menu functionality
    showMenu('nav-toggle', 'nav-menu');

    // Re-initialize nav link event listeners
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(n => n.addEventListener('click', linkAction));
}

// Initialize site when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSite);

/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active-link')
            } else {
                sectionsClass.classList.remove('active-link')
            }
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

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 400 });
sr.reveal('.home__social-icon', { interval: 200 });
sr.reveal('.skills__data, .work__img, .contact__input', { interval: 200 });




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
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(siteConfig.contact.form.action, {
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
    }
}

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
            'Data Engineering': 'data',
            'Cloud Platforms': 'cloud',
            'Frameworks': 'tools',
            'Databases': 'data',
            'CI/CD': 'tools',
            'Data Science': 'data',
            'Tools & Utilities': 'tools'
        };

        // Define category icons
        const categoryIcons = {
            'Programming Languages': 'bx-code-alt',
            'Data Engineering': 'bx-data',
            'Cloud Platforms': 'bx-cloud',
            'Frameworks': 'bx-wrench',
            'Databases': 'bx-server',
            'CI/CD': 'bx-git',
            'Data Science': 'bx-brain',
            'Tools & Utilities': 'bx-wrench'
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
// Initialize all interactive features after content is loaded
function initializeInteractiveFeatures() {
    initializeAboutExpandFeatures();
    initializeSkillsCounters();
    initializeSkillsTabs();
}

// Initialize about section expandable content and counters
function initializeAboutExpandFeatures() {
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

    // Function to start about counters
    const startAboutCounters = () => {
        const statNumbers = document.querySelectorAll('.about__stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            if (target && !isNaN(target)) {
                animateCounter(stat, target);
            }
        });
    };

    // Initialize counters when About section comes into view
    const aboutSection = document.getElementById('about');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    let aboutAnimationRun = false;

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !aboutAnimationRun) {
                aboutAnimationRun = true;
                startAboutCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fallback for immediate visibility
    const checkAboutVisibility = () => {
        if (aboutSection && !aboutAnimationRun) {
            const rect = aboutSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                aboutAnimationRun = true;
                startAboutCounters();
            }
        }
    };

    if (aboutSection) {
        aboutObserver.observe(aboutSection);

        // Check if already visible on load
        setTimeout(checkAboutVisibility, 500);

        // Also add scroll listener as fallback
        window.addEventListener('scroll', checkAboutVisibility, { passive: true });
    } else {
        // If no section found, try direct animation
        setTimeout(startAboutCounters, 1000);
    }
}

// Initialize skills counters
function initializeSkillsCounters() {
    // Skills stats counter animation
    const skillsSection = document.getElementById('skills');

    // Animate counter function
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

    // Function to start counter animation
    const startCounterAnimation = () => {
        const skillsStatNumbers = document.querySelectorAll('.skills__stat-number');
        skillsStatNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            if (target && !isNaN(target)) {
                animateCounter(stat, target);
            }
        });
    };

    // Use intersection observer for mobile-friendly triggering
    const observerOptions = {
        threshold: 0.1, // Lower threshold for mobile
        rootMargin: '0px 0px -50px 0px'
    };

    let skillsAnimationRun = false;

    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimationRun) {
                skillsAnimationRun = true;
                startCounterAnimation();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fallback: start animation immediately if section is already visible
    const checkImmediateVisibility = () => {
        if (skillsSection && !skillsAnimationRun) {
            const rect = skillsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                skillsAnimationRun = true;
                startCounterAnimation();
            }
        }
    };

    if (skillsSection) {
        skillsObserver.observe(skillsSection);

        // Check if already visible on load (important for mobile)
        setTimeout(checkImmediateVisibility, 500);

        // Also add scroll and resize event listeners as fallback
        window.addEventListener('scroll', checkImmediateVisibility, { passive: true });
        window.addEventListener('resize', checkImmediateVisibility, { passive: true });
    } else {
        // If no intersection observer support, try direct animation
        setTimeout(startCounterAnimation, 1000);
    }
}

// Initialize skills tabs functionality
function initializeSkillsTabs() {
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
}

// Legacy DOMContentLoaded - replaced with our new initialization system
// This functionality has been moved to initializeAboutExpandFeatures() which is called after content is loaded

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
// Legacy skills tab functionality - moved to initializeSkillsTabs()
// This functionality has been replaced by our new initialization system
/*
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
    
    // Mobile-friendly observer options
    const skillsObserverOptions = {
        threshold: 0.1, // Lower threshold for mobile
        rootMargin: '0px 0px -20px 0px' // Smaller margin for mobile
    };
    
    // Track if animation has already run
    let skillsAnimationRun = false;
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimationRun) {
                skillsAnimationRun = true;
                skillsStatNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    if (target && !isNaN(target)) {
                        animateSkillsCounter(stat, target);
                    }
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, skillsObserverOptions);
    
    // Fallback for immediate visibility (mobile direct load)
    const checkImmediateVisibility = () => {
        if (skillsSection && !skillsAnimationRun) {
            const rect = skillsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                skillsAnimationRun = true;
                skillsStatNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    if (target && !isNaN(target)) {
                        animateSkillsCounter(stat, target);
                    }
                });
            }
        }
    };
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
        
        // Check if already visible on load (important for mobile)
        setTimeout(checkImmediateVisibility, 100);
        
        // Also check on scroll and resize
        window.addEventListener('scroll', checkImmediateVisibility, { passive: true });
        window.addEventListener('resize', checkImmediateVisibility, { passive: true });
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
*/

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

/*===== PROFESSIONAL MICRO-ANIMATIONS AND INTERACTIONS =====*/
document.addEventListener('DOMContentLoaded', function () {
    // Animate section titles when they come into view
    const animateSectionTitles = () => {
        const sectionTitles = document.querySelectorAll('.section-title');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -20px 0px'
        });

        sectionTitles.forEach(title => {
            observer.observe(title);
        });
    };

    // Enhanced card hover effects
    const enhanceCardInteractions = () => {
        const cards = document.querySelectorAll('.card, .skills__category-card, .work__project, .hobbies__card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                // Add subtle scale effect to child elements
                const cardContent = this.querySelectorAll('h3, h4, p, .skills__progress');
                cardContent.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.transform = 'translateY(-2px)';
                        element.style.transition = 'transform 0.3s ease';
                    }, index * 50);
                });
            });

            card.addEventListener('mouseleave', function () {
                // Reset child elements
                const cardContent = this.querySelectorAll('h3, h4, p, .skills__progress');
                cardContent.forEach(element => {
                    element.style.transform = 'translateY(0)';
                });
            });
        });
    };

    // Smooth button interactions
    const enhanceButtonInteractions = () => {
        const buttons = document.querySelectorAll('.btn, .skills__category-tab');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    };

    // Parallax effect for decorative elements
    const addParallaxEffect = () => {
        const decorativeElements = document.querySelectorAll('.home__decorative-1, .home__decorative-2, .home__decorative-3');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            decorativeElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        }, { passive: true });
    };

    // Stagger animations for skill items
    const staggerSkillAnimations = () => {
        const skillItems = document.querySelectorAll('.skills__data');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skills = entry.target.parentElement.querySelectorAll('.skills__data');
                    skills.forEach((skill, index) => {
                        setTimeout(() => {
                            skill.style.opacity = '1';
                            skill.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        // Initially hide skills for animation
        skillItems.forEach(skill => {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px)';
            skill.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        // Observe skill categories
        const skillCategories = document.querySelectorAll('.skills__category-card');
        skillCategories.forEach(category => {
            observer.observe(category);
        });
    };

    // Enhanced navigation interaction
    const enhanceNavigation = () => {
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function () {
                this.style.transform = 'translateX(8px) scale(1.02)';
            });

            link.addEventListener('mouseleave', function () {
                if (!this.classList.contains('active-link')) {
                    this.style.transform = 'translateX(0) scale(1)';
                }
            });
        });
    };

    // Initialize all animations
    animateSectionTitles();
    enhanceCardInteractions();
    enhanceButtonInteractions();
    addParallaxEffect();
    staggerSkillAnimations();
    enhanceNavigation();
});

// Add ripple animation keyframes to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);
