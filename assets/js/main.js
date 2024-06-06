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



/*===== WORK IMAGE MODAL =====*/
document.addEventListener('DOMContentLoaded', () => {
    const modalButtons = document.querySelectorAll('[data-modal-target]');
    const closeButtons = document.querySelectorAll('.close-button');
    const modals = document.querySelectorAll('.modal');

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
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
});
