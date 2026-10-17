(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var header = document.querySelector(".site-header");
  var page = document.getElementById("page-body");
  var backdrop = document.querySelector(".nav-backdrop");

  if (toggle && nav && header) {
    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      if (page) {
        if (open) page.setAttribute("inert", "");
        else page.removeAttribute("inert");
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
        toggle.focus();
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    var desktop = window.matchMedia("(min-width: 901px)");
    function closeOnDesktop(event) {
      if (event.matches && isOpen()) setOpen(false);
    }
    if (desktop.addEventListener) desktop.addEventListener("change", closeOnDesktop);
    else if (desktop.addListener) desktop.addListener(closeOnDesktop);
  }
})();
