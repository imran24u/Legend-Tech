/* ==========================================================
   LEGEND TECH - script.js
   STEP 1: Edit the SETTINGS and DATA below. Everything else
   can be left alone.
   ========================================================== */

/* ---------- SETTINGS (edit these) ---------- */
const SETTINGS = {
  // PLACEHOLDER: replace with your real email address.
  email: "your-email@example.com",

  // PLACEHOLDER: replace with your real WhatsApp number.
  // Use digits only, with country code, no "+" or spaces.
  // Example format: 8801XXXXXXXXX (Bangladesh)
  whatsappNumber: "0000000000000",

  // OPTIONAL: paste a free form-service URL here (for example from
  // Formspree or Web3Forms) to make the contact form really deliver
  // messages. Leave empty ("") if you do not have one yet.
  formEndpoint: "",

  // Social links. Replace "#" with your real page links.
  social: [
    { name: "Facebook",  url: "#" },
    { name: "Instagram", url: "#" },
    { name: "X",         url: "#" },
    { name: "LinkedIn",  url: "#" }
  ]
};

/* ---------- SERVICES (edit freely) ---------- */
const SERVICES = [
  { icon: "🌐", title: "Website Design",
    text: "Clean, fast, mobile-friendly websites for your business." },
  { icon: "📦", title: "Digital Products",
    text: "Templates, tools, and downloadable products ready to use." },
  { icon: "💡", title: "Tech Consulting",
    text: "Practical advice to choose and use the right technology." },
  { icon: "🤖", title: "AI Tools and Digital Solutions",
    text: "Simple AI-powered tools that save time and effort." }
];

/* ---------- PRODUCTS (sample data - edit names and prices) ---------- */
const PRODUCTS = [
  { icon: "🧩", name: "Starter Website Template", price: "$19",
    text: "Sample product. A simple one-page website template." },
  { icon: "📘", name: "Business Tech Guide", price: "$9",
    text: "Sample product. A beginner guide to tech for business." },
  { icon: "⚙️", name: "Productivity Toolkit", price: "$29",
    text: "Sample product. A set of ready-made digital tools." }
];

/* ==========================================================
   CODE BELOW - you normally do not need to change it
   ========================================================== */

// Build a WhatsApp link with a ready-typed message.
function whatsappLink(message) {
  return "https://wa.me/" + SETTINGS.whatsappNumber +
         "?text=" + encodeURIComponent(message);
}

// Safely make an element with a class and text.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// Create one card (used for both services and products).
function makeCard(item, title, buttonLabel, message, price) {
  const card = el("article", "card reveal");
  card.appendChild(el("div", "icon", item.icon));
  card.appendChild(el("h3", "", title));
  card.appendChild(el("p", "", item.text));
  if (price) card.appendChild(el("div", "price", price));

  const btn = el("a", "btn btn-outline", buttonLabel);
  btn.href = whatsappLink(message);
  btn.target = "_blank";
  btn.rel = "noopener";
  btn.setAttribute("aria-label", buttonLabel + ": " + title);
  card.appendChild(btn);
  return card;
}

// Fill the services and products sections.
const servicesGrid = document.getElementById("services-grid");
SERVICES.forEach(s => servicesGrid.appendChild(
  makeCard(s, s.title, "Inquire",
    "Hello Legend Tech, I would like to ask about: " + s.title)
));

const productsGrid = document.getElementById("products-grid");
PRODUCTS.forEach(p => productsGrid.appendChild(
  makeCard(p, p.name, "Order / Ask",
    "Hello Legend Tech, I am interested in: " + p.name + " (" + p.price + ")",
    p.price)
));

// Contact links and footer.
const emailLink = document.getElementById("email-link");
emailLink.href = "mailto:" + SETTINGS.email;
emailLink.textContent = "Email: " + SETTINGS.email;
document.getElementById("whatsapp-link").href =
  whatsappLink("Hello Legend Tech, I would like to know more.");

const socialList = document.getElementById("social-links");
SETTINGS.social.forEach(s => {
  const li = document.createElement("li");
  const a = el("a", "", s.name);
  a.href = s.url;
  a.target = "_blank";
  a.rel = "noopener";
  li.appendChild(a);
  socialList.appendChild(li);
});
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu.
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
toggle.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true"));
// Close the menu after tapping a link (smooth scrolling is done in CSS).
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// Fade-in animation when sections scroll into view.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

/* ---------- CONTACT FORM ---------- */
const form = document.getElementById("contact-form");
const result = document.getElementById("form-result");

function showError(id, message) {
  const field = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

function validate() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Run every check so all errors show at once.
  const results = [
    showError("name", name.length < 2 ? "Please enter your name." : ""),
    showError("email", emailOk ? "" : "Please enter a valid email address."),
    showError("message", message.length < 10 ? "Please write at least 10 characters." : "")
  ];
  return results.every(Boolean);
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  result.textContent = "";
  if (!validate()) return;

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Option A: a real form service is configured, so send to it.
  if (SETTINGS.formEndpoint) {
    try {
      const response = await fetch(SETTINGS.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      if (!response.ok) throw new Error("Request failed");
      result.appendChild(el("p", "ok", "Thank you! Your message was sent."));
      form.reset();
    } catch (err) {
      result.appendChild(el("p", "", "Sorry, sending failed. Please use the email or WhatsApp buttons instead."));
    }
    return;
  }

  // Option B: no form service yet. Be honest: nothing has been sent.
  result.appendChild(el("p", "",
    "Your details look good, but NOTHING has been sent yet because this site has no form service connected. " +
    "Tap below to send it from your own email app."));
  const mail = el("a", "btn btn-outline", "Open my email app");
  mail.href = "mailto:" + SETTINGS.email +
    "?subject=" + encodeURIComponent("Message from " + name) +
    "&body=" + encodeURIComponent(message + "\n\nReply to: " + email);
  result.appendChild(mail);
});
