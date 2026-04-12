document.addEventListener("DOMContentLoaded", async () => {
  const components = [
    { id: "top-bar-placeholder", url: "components/topbar.html" },
    { id: "header-placeholder", url: "components/header.html" },
    { id: "hero-placeholder", url: "components/hero.html" },
    { id: "stats-placeholder", url: "components/stats.html" },
    { id: "about-placeholder", url: "components/about.html" },
    { id: "services-placeholder", url: "components/services.html" },
    { id: "why-placeholder", url: "components/why-us.html" },
    //{ id: "doctors-placeholder", url: "components/doctors.html" },
    { id: "testimonials-placeholder", url: "components/testimonials.html" },
    { id: "contact-placeholder", url: "components/contact.html" },
    { id: "footer-placeholder", url: "components/footer.html" }
  ];

  try {
    const fetchPromises = components.map(async (comp) => {
      const response = await fetch(comp.url);
      if (!response.ok) throw new Error(`Failed to load ${comp.url}`);
      const html = await response.text();
      const el = document.getElementById(comp.id);
      if (el) {
        // Replace the div placeholder element perfectly with the new content
        el.outerHTML = html;
      }
    });

    // Wait until all HTML partials are fetched and rendered into DOM
    await Promise.all(fetchPromises);

    // After DOM is populated, initialize the JavaScript logics in script.js
    if (typeof window.initApp === "function") {
      window.initApp();
    }
  } catch (error) {
    console.error("Error loading components:", error);
  }
});
