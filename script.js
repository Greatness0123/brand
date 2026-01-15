const navbarToggle = document.getElementById("navbarToggle")
const navbarMenu = document.getElementById("navbarMenu")
const navLinks = document.querySelectorAll(".nav-link")
const contactForm = document.getElementById("contactForm")

if (navbarToggle) {
  navbarToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("active")
  })
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbarMenu.classList.remove("active")
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
})

function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

window.addEventListener("click", (event) => {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  })
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  }
})

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value.trim()
    const email = document.getElementById("email").value.trim()
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value.trim()

    document.getElementById("nameError").textContent = ""
    document.getElementById("emailError").textContent = ""
    document.getElementById("subjectError").textContent = ""
    document.getElementById("messageError").textContent = ""

    let isValid = true

    if (name === "") {
      document.getElementById("nameError").textContent = "Name is required"
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email === "") {
      document.getElementById("emailError").textContent = "Email is required"
      isValid = false
    } else if (!emailRegex.test(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email"
      isValid = false
    }

    if (subject === "") {
      document.getElementById("subjectError").textContent = "Please select a subject"
      isValid = false
    }

    if (message === "") {
      document.getElementById("messageError").textContent = "Message is required"
      isValid = false
    } else if (message.length < 10) {
      document.getElementById("messageError").textContent = "Message must be at least 10 characters"
      isValid = false
    }

    if (isValid) {
      const formMessage = document.getElementById("formMessage")
      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalButtonText = submitButton.textContent

      // Show loading state
      submitButton.textContent = "Sending..."
      submitButton.disabled = true

      const formData = new FormData(contactForm)

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const json = await response.json()
          if (response.status == 200) {
            formMessage.textContent = "Message sent successfully! We will get back to you soon."
            formMessage.classList.add("success")
            formMessage.classList.remove("error")
            contactForm.reset()
          } else {
            console.log(response)
            formMessage.textContent = json.message || "Something went wrong. Please try again."
            formMessage.classList.add("error")
            formMessage.classList.remove("success")
          }
        })
        .catch((error) => {
          console.log(error)
          formMessage.textContent = "Something went wrong. Please check your internet connection."
          formMessage.classList.add("error")
          formMessage.classList.remove("success")
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalButtonText
            submitButton.disabled = false
            
            setTimeout(() => {
                formMessage.textContent = ""
                formMessage.classList.remove("success", "error")
            }, 5000)
        })
    }
  })
}

let lastScroll = 0
const navbar = document.querySelector(".navbar")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > lastScroll && currentScroll > 100) {
    navbar.style.transform = "translateY(-100%)"
  } else {
    navbar.style.transform = "translateY(0)"
  }

  lastScroll = currentScroll
})

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

const cards = document.querySelectorAll(
  ".feature-card, .service-card, .mission-card, .skill-card, .project-card, .info-card",
)
cards.forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = "all 0.6s ease-out"
  observer.observe(card)
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src || img.src
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img").forEach((img) => imageObserver.observe(img))
}
