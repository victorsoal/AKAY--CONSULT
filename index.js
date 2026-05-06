/* ------------------ EDIT YOUR FORMSPREE ENDPOINT HERE ------------------
   Replace the string below with your Formspree endpoint, for example:
   const FORM_ENDPOINT = "https://formspree.io/f/abcdxyz";
-------------------------------------------------------------------------*/
const FORM_ENDPOINT = "https://formspree.io/f/yourFormID";

/* ---------- DOM refs ---------- */
const orderModal = document.getElementById("orderModal");
const orderForm = document.getElementById("orderForm");
const serviceInput = document.getElementById("serviceInput");
const orderFeedback = document.getElementById("orderFeedback");
const modalClose = document.getElementById("modalClose");

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

/* ---------- Mobile menu toggle ---------- */
hamburger &&
  hamburger.addEventListener("click", () => {
    navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.position = "absolute";
    navLinks.style.top = "64px";
    navLinks.style.right = "16px";
    navLinks.style.background = "#fff";
    navLinks.style.padding = "12px";
    navLinks.style.boxShadow = "0 8px 30px rgba(2,6,23,0.08)";
  });

/* ---------- Open / Close modal ---------- */
function openOrderForm(serviceName = "") {
  serviceInput.value = serviceName;
  orderFeedback.textContent = "";
  orderForm.reset();
  orderForm.action = FORM_ENDPOINT;
  orderForm.setAttribute("accept-charset", "utf-8");
  orderModal.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    const first = orderForm.querySelector('input[name="Name"]');
    first && first.focus();
  }, 80);
}

function closeOrderForm() {
  orderModal.setAttribute("aria-hidden", "true");
  orderFeedback.textContent = "";
}

modalClose && modalClose.addEventListener("click", closeOrderForm);
orderModal &&
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) closeOrderForm();
  });

/* ---------- WhatsApp Order Integration ---------- */
function sendToWhatsApp() {
  const phoneNumber = "2348037215694"; // ✅ Updated WhatsApp number
  const service = document.getElementById("serviceInput").value;
  const name = document.getElementById("orderName").value;
  const email = document.getElementById("orderEmail").value;
  const phone = document.getElementById("orderPhone").value;
  const details = document.getElementById("orderDetails").value;

  const text = `Hello AKAY, I want to place an order.

Service: ${service}
Name: ${name}
Email: ${email}
Phone: ${phone}
Details: ${details}`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

/* ---------- Order form submit ---------- */
orderForm &&
  orderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    orderFeedback.style.color = "#0b74da";
    orderFeedback.textContent = "Sending order...";

    // Basic client validation
    const email = orderForm.querySelector('input[name="Email"]').value.trim();
    const name = orderForm.querySelector('input[name="Name"]').value.trim();
    if (!name || !email) {
      orderFeedback.style.color = "crimson";
      orderFeedback.textContent = "Please enter your name and email.";
      return;
    }

    // Send to WhatsApp first
    sendToWhatsApp();

    // Then also submit to Formspree
    const formData = new FormData(orderForm);
    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          orderFeedback.style.color = "#0b74da";
          orderFeedback.textContent =
            "Order submitted — we will contact you shortly.";
          orderForm.reset();
          setTimeout(closeOrderForm, 1800);
        } else {
          return response.json().then((data) => {
            throw data;
          });
        }
      })
      .catch((err) => {
        orderFeedback.style.color = "crimson";
        orderFeedback.textContent =
          "Unable to send order right now. Please try again later.";
        console.error("Order error", err);
      });
  });

/* ---------- Contact form (site contact) ---------- */
const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

function submitContact(e) {
  e.preventDefault();
  if (!FORM_ENDPOINT || FORM_ENDPOINT.includes("yourFormID")) {
    contactFeedback.style.color = "crimson";
    contactFeedback.textContent =
      "Please configure your Formspree endpoint in script.js.";
    return;
  }

  contactFeedback.style.color = "#0b74da";
  contactFeedback.textContent = "Sending...";

  const data = new FormData(contactForm);
  fetch(FORM_ENDPOINT, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  })
    .then((resp) => {
      if (resp.ok) {
        contactFeedback.style.color = "#0b74da";
        contactFeedback.textContent = "Message sent — thank you!";
        contactForm.reset();
      } else {
        contactFeedback.style.color = "crimson";
        contactFeedback.textContent =
          "Could not send message. Try again later.";
      }
    })
    .catch((err) => {
      contactFeedback.style.color = "crimson";
      contactFeedback.textContent = "Network error. Please try again later.";
      console.error(err);
    });
}

/* ---------- Small niceties ---------- */
document.getElementById("year") &&
  (document.getElementById("year").textContent =
    new Date().getFullYear());
