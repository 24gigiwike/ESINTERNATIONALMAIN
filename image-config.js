/* Paste a full image URL into the matching key.
   Leave the value as "" to keep the image already on the page.
   Do not use "#" or a made-up address. */
const ES_IMAGE_URLS = {
  // HOMEPAGE
  HOME_MISSION_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755560/new_picture2_rzow9y.jpg",
  HOME_VISION_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755558/new_picture14_fsb1cm.jpg",

  // ABOUT PAGE
  ABOUT_BANNER_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755558/new_picture13_dfddro.jpg",
  ABOUT_WHO_ARE_WE_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755559/new_picture9_nhlfrf.jpg",
  ABOUT_WHY_WE_EXIST_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755560/new_picture10_v0hsmu.jpg",

  // IMPACT PAGE
  IMPACT_BANNER_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755559/new_picture7_i1wkgw.jpg",
  IMPACT_MORE_THAN_WHAT_WE_DO_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755560/new_picture12_j8pvsy.jpg",
  IMPACT_THRIVE_IMAGE_01_URL: "",
  IMPACT_THRIVE_IMAGE_02_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755558/new_picture4_oaprdt.jpg",
  IMPACT_THRIVE_IMAGE_03_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792755558/new_picture1_avem7r.jpg",

  // PARTNERSHIP PAGE
  PARTNERSHIP_BANNER_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792510171/picture5_ygig3c.jpg",
  PARTNERSHIP_STRONGER_TOGETHER_IMAGE_URL: "https://res.cloudinary.com/dtkluxukm/image/upload/v1792510171/picture4_r4zs6h.jpg"
};

(function () {
  function clean(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function pictureOf(img) {
    var parent = img.parentElement;
    return parent && parent.tagName === "PICTURE" ? parent : null;
  }

  function restoreImage(img) {
    img.onerror = null;
    var picture = pictureOf(img);
    if (picture) {
      picture.querySelectorAll("source").forEach(function (source) {
        if (source.dataset.esSrcset) source.setAttribute("srcset", source.dataset.esSrcset);
      });
    }
    if (img.dataset.esSrcset) img.setAttribute("srcset", img.dataset.esSrcset);
    if (img.dataset.esSrc) img.src = img.dataset.esSrc;
  }

  function applyImage(img, url) {
    if (!img.dataset.esSrc) img.dataset.esSrc = img.getAttribute("src") || "";
    if (img.hasAttribute("srcset") && !img.dataset.esSrcset) img.dataset.esSrcset = img.getAttribute("srcset");
    img.removeAttribute("srcset");
    var picture = pictureOf(img);
    if (picture) {
      picture.querySelectorAll("source").forEach(function (source) {
        if (source.hasAttribute("srcset") && !source.dataset.esSrcset) source.dataset.esSrcset = source.getAttribute("srcset");
        source.removeAttribute("srcset");
      });
    }
    img.onerror = function () { restoreImage(img); };
    img.src = url;
  }

  function applyBanner(section, url) {
    var probe = new Image();
    probe.onload = function () {
      section.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85)), url(\"" + url.replace(/"/g, "") + "\")";
    };
    probe.src = url;
  }

  document.querySelectorAll("[data-es-image]").forEach(function (el) {
    var url = clean(ES_IMAGE_URLS[el.getAttribute("data-es-image")]);
    if (!url) return;
    if (el.tagName === "IMG") applyImage(el, url);
    else applyBanner(el, url);
  });
})();
