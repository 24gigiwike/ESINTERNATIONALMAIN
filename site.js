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

(function () {
  var carousel = document.getElementById("heroCarousel");
  if (carousel) {
    function warm(item) {
      if (!item) return;
      var img = item.querySelector("img");
      if (!img) return;
      img.loading = "eager";
      if (img.decode) img.decode().catch(function () {});
    }

    function nextItem(from) {
      var items = carousel.querySelectorAll(".carousel-item");
      var index = Array.prototype.indexOf.call(items, from);
      if (index < 0) return null;
      return items[(index + 1) % items.length];
    }

    function settle() {
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced && window.bootstrap && window.bootstrap.Carousel) {
        var instance = window.bootstrap.Carousel.getInstance(carousel);
        if (instance) instance.pause();
      }
      warm(nextItem(carousel.querySelector(".carousel-item.active")));
    }

    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle);

    carousel.addEventListener("slide.bs.carousel", function (event) {
      warm(event.relatedTarget);
      warm(nextItem(event.relatedTarget));
    });
  }

  var form = document.getElementById("newsletter-form");
  if (form) {
    var input = document.getElementById("newsletter-email");
    var note = document.getElementById("newsletter-note");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      input.value = input.value.trim();
      if (!input.checkValidity()) {
        note.hidden = false;
        note.textContent = "Enter a valid email address.";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      note.hidden = false;
      note.textContent = "Subscription is not connected yet. This address has not been saved.";
      input.value = "";
    });
  }
})();
