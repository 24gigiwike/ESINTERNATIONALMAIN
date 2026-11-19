/* Cohort 1 gallery.
   Photograph URLs live on the img src attributes in programmes.html,
   under the comment SKILL-UP COHORT 1 PHOTOGRAPHS. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll("[data-skillup-slot]"));
  var dialog = document.getElementById("skillup-modal");
  if (!links.length || !dialog || typeof dialog.showModal !== "function") return;

  var panelImg = dialog.querySelector(".skillup-panel img");
  var caption = dialog.querySelector(".skillup-panel figcaption");
  var count = dialog.querySelector(".skillup-count");
  var fallback = dialog.querySelector(".skillup-fallback");
  var closeBtn = dialog.querySelector(".skillup-close");
  var prevBtn = dialog.querySelector(".skillup-prev");
  var nextBtn = dialog.querySelector(".skillup-next");
  var current = 0;
  var lastFocus = null;

  function photoSrc(link) {
    var img = link.querySelector("img");
    return img ? img.getAttribute("src") || "" : "";
  }

  function photoAlt(link) {
    var img = link.querySelector("img");
    return img ? img.getAttribute("alt") || "" : "";
  }

  function show(index) {
    var total = links.length;
    current = ((index % total) + total) % total;
    var link = links[current];
    var src = photoSrc(link);
    var alt = photoAlt(link);
    if (fallback) fallback.hidden = true;
    panelImg.classList.remove("is-missing");
    panelImg.alt = alt;
    panelImg.src = src;
    if (caption) caption.textContent = alt;
    if (count) count.textContent = "Photograph " + (current + 1) + " of " + total;
  }

  function openAt(index) {
    lastFocus = document.activeElement;
    show(index);
    if (!dialog.open) dialog.showModal();
    if (closeBtn) closeBtn.focus();
  }

  links.forEach(function (link, index) {
    var img = link.querySelector("img");
    if (img) {
      img.addEventListener("error", function () {
        link.classList.add("is-missing");
        if (!link.querySelector(".skillup-missing")) {
          var note = document.createElement("span");
          note.className = "skillup-missing";
          note.textContent = "This photograph could not be loaded.";
          link.appendChild(note);
        }
      });
    }
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openAt(index);
    });
  });

  if (panelImg) {
    panelImg.addEventListener("error", function () {
      panelImg.classList.add("is-missing");
      if (fallback) fallback.hidden = false;
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
  if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    }
  });

  dialog.addEventListener("close", function () {
    panelImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  });
})();
