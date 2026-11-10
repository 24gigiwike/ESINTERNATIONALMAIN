(function () {
  var content = window.LAB_CONTENT;
  var main = document.getElementById("lab-main");
  var toggle = document.querySelector(".lab-toggle");
  var nav = document.getElementById("lab-nav");
  var quiet = false;
  var booted = false;

  if (!main) return;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function categoryName(id) {
    var found = (content.categories || []).filter(function (cat) { return cat.id === id; })[0];
    return found ? found.name : "Uncategorised";
  }

  function byId(list, id) {
    return (list || []).filter(function (item) { return item.id === id; })[0] || null;
  }

  function parseRoute() {
    var hash = location.hash || "#/";
    var splitAt = hash.indexOf("?");
    var path = (splitAt === -1 ? hash : hash.slice(0, splitAt)).replace(/^#/, "");
    var params = new URLSearchParams(splitAt === -1 ? "" : hash.slice(splitAt + 1));
    var bits = path.split("/").filter(Boolean);
    return {
      name: bits[0] || "home",
      id: bits[1] ? decodeURIComponent(bits[1]) : "",
      q: (params.get("q") || "").trim(),
      category: params.get("category") || ""
    };
  }

  function buildHash(name, id, q, category) {
    var path = !name || name === "home" ? "/" : "/" + name + (id ? "/" + encodeURIComponent(id) : "");
    var params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    var qs = params.toString();
    return "#" + path + (qs ? "?" + qs : "");
  }

  function navigate(next, keepFocus) {
    var current = location.hash || "#/";
    if (current === next) return;
    quiet = !!keepFocus;
    if (keepFocus) {
      history.replaceState(null, "", next);
      render();
    } else {
      location.hash = next;
    }
  }

  function matches(item, q, category) {
    if (category && item.category !== category) return false;
    if (!q) return true;
    var hay = [item.title, item.summary, item.description, categoryName(item.category)].join(" ").toLowerCase();
    return hay.indexOf(q.toLowerCase()) !== -1;
  }

  function safeFile(file) {
    if (!file || /^\s*javascript:/i.test(file)) return "";
    return file;
  }

  function badge(item) {
    return item.placeholder ? '<p class="lab-kicker">Placeholder</p>' : "";
  }

  function card(item, kind) {
    var media = "";
    if (kind === "video") {
      media = item.youtubeId
        ? '<img class="lab-thumb" src="https://i.ytimg.com/vi/' + esc(item.youtubeId) + '/hqdefault.jpg" alt="" width="480" height="360">'
        : '<div class="lab-cover"><span>Video</span><strong>Not added yet</strong></div>';
    } else if (kind === "resource") {
      media = '<div class="lab-cover"><span>' + (safeFile(item.file) ? "PDF" : "No file") + '</span><strong>Document</strong></div>';
    }
    return '<a class="lab-card" href="' + esc(buildHash(kind === "course" ? "courses" : kind === "video" ? "videos" : "resources", item.id)) + '">' +
      media + badge(item) +
      "<h3>" + esc(item.title) + "</h3>" +
      "<p>" + esc(item.summary) + "</p>" +
      '<p class="lab-meta">' + esc(categoryName(item.category)) + "</p></a>";
  }

  function grid(items, kind) {
    if (!items.length) return "";
    return '<div class="lab-grid">' + items.map(function (item) { return card(item, kind); }).join("") + "</div>";
  }

  function empty(message) {
    return '<p class="lab-empty">' + esc(message) + "</p>";
  }

  function searchForm(route, name) {
    return '<form data-lab-search-form data-lab-view="' + esc(name) + '" role="search">' +
      '<label class="lab-sr" for="lab-q">Search the library</label>' +
      '<div class="lab-search">' +
      '<input id="lab-q" data-lab-search type="search" name="q" value="' + esc(route.q) + '" placeholder="Search courses, videos, and documents">' +
      "<button type=\"submit\">Search</button></div></form>";
  }

  function filters(route) {
    var buttons = '<button type="button" data-lab-category="" aria-pressed="' + (route.category ? "false" : "true") + '">All</button>';
    buttons += (content.categories || []).map(function (cat) {
      var on = route.category === cat.id;
      return '<button type="button" data-lab-category="' + esc(cat.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(cat.name) + "</button>";
    }).join("");
    return '<div class="lab-filters" role="group" aria-label="Categories">' + buttons + "</div>";
  }

  function toolbar(route, name) {
    return '<div class="lab-toolbar">' + searchForm(route, name) + filters(route) + "</div>";
  }

  function catalogue(route, kind, list, noun) {
    var items = list.filter(function (item) { return matches(item, route.q, route.category); });
    var label = categoryName(route.category);
    var heading = route.category ? label : noun.charAt(0).toUpperCase() + noun.slice(1);
    return "<header><p class=\"lab-kicker\">Library</p><h1>" + esc(heading) + "</h1></header>" +
      toolbar(route, route.name) +
      '<p class="lab-count" aria-live="polite">' + items.length + " " + (items.length === 1 ? noun.slice(0, -1) : noun) + "</p>" +
      (items.length ? grid(items, kind) : empty(route.q
        ? "Nothing matches that search."
        : "Nothing in this category yet. It will appear here when ES International adds it."));
  }

  function materialLink(material) {
    var list = material.kind === "video" ? content.videos : content.resources;
    var item = byId(list, material.id);
    var label = material.kind === "video" ? "Video" : "Document";
    if (!item) {
      return "<li><span>" + label + " missing: " + esc(material.id) + "</span></li>";
    }
    var href = buildHash(material.kind === "video" ? "videos" : "resources", item.id);
    return '<li><a href="' + esc(href) + '">' + esc(item.title) + "<span>" + label + "</span></a></li>";
  }

  function courseDetail(route) {
    var item = byId(content.courses, route.id);
    if (!item) return missing("courses", "Courses");
    var materials = (item.materials || []).map(materialLink).join("");
    return '<a class="lab-back" href="' + esc(buildHash("courses", "", route.q, route.category)) + '">All courses</a>' +
      '<article class="lab-detail">' + badge(item) +
      "<h1>" + esc(item.title) + "</h1>" +
      '<p class="lab-meta">' + esc(categoryName(item.category)) + "</p>" +
      '<div class="lab-copy"><p>' + esc(item.description) + "</p></div>" +
      "<h2>Learning materials</h2>" +
      (materials ? '<ul class="lab-materials">' + materials + "</ul>" : empty("No materials are attached to this course yet.")) +
      "</article>";
  }

  function videoDetail(route) {
    var item = byId(content.videos, route.id);
    if (!item) return missing("videos", "Videos");
    var player = item.youtubeId
      ? '<div class="lab-player"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(item.youtubeId) + '" title="' + esc(item.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
      : '<p class="lab-unavailable">This video is not available yet. A YouTube link has not been added.</p>';
    return '<a class="lab-back" href="' + esc(buildHash("videos", "", route.q, route.category)) + '">All videos</a>' +
      '<article class="lab-detail">' + badge(item) + "<h1>" + esc(item.title) + "</h1>" + player +
      '<div class="lab-copy"><p>' + esc(item.description) + "</p></div></article>";
  }

  function resourceDetail(route) {
    var item = byId(content.resources, route.id);
    if (!item) return missing("resources", "Resources");
    var file = safeFile(item.file);
    var action = file
      ? '<p class="lab-actions"><a class="lab-button" href="' + esc(file) + '" download>' + esc(item.fileLabel || "Download") + "</a></p>"
      : '<p class="lab-unavailable">No file has been added for this resource yet.</p>';
    return '<a class="lab-back" href="' + esc(buildHash("resources", "", route.q, route.category)) + '">All resources</a>' +
      '<article class="lab-detail">' + badge(item) +
      '<div class="lab-cover"><span>' + (file ? "PDF" : "Document") + "</span><strong>" + esc(item.title) + "</strong></div>" +
      "<h1>" + esc(item.title) + "</h1>" +
      '<div class="lab-copy"><p>' + esc(item.description) + "</p></div>" + action + "</article>";
  }

  function missing(name, label) {
    return "<h1>This item is not in the library</h1>" +
      empty("The link may be incomplete, or the entry has not been added yet.") +
      '<p class="lab-actions"><a class="lab-back" href="' + esc(buildHash(name)) + '">Back to ' + esc(label.toLowerCase()) + "</a></p>";
  }

  function home(route) {
    var featuredCourses = (content.featured.courses || []).map(function (id) { return byId(content.courses, id); }).filter(Boolean);
    var featuredVideos = (content.featured.videos || []).map(function (id) { return byId(content.videos, id); }).filter(Boolean);
    var recent = []
      .concat(content.courses.map(function (item) { return { item: item, kind: "course" }; }))
      .concat(content.videos.map(function (item) { return { item: item, kind: "video" }; }))
      .concat(content.resources.map(function (item) { return { item: item, kind: "resource" }; }))
      .sort(function (a, b) { return a.item.added < b.item.added ? 1 : a.item.added > b.item.added ? -1 : 0; })
      .slice(0, 3);
    var cats = (content.categories || []).map(function (cat) {
      return '<a href="' + esc(buildHash("search", "", "", cat.id)) + '">' + esc(cat.name) + "</a>";
    }).join("");
    return '<section class="lab-hero">' +
      "<div><p class=\"lab-kicker\">ES International</p><h1>ES Venture Lab</h1>" +
      '<p class="lab-lead">A public shelf for courses, videos, and documents. Member accounts describe this work as early practice in design and web development. The lessons themselves are not published yet, so the entries below are marked placeholders.</p>' +
      searchForm(route, "search") +
      '<nav class="lab-cats" aria-label="Learning categories">' + cats + "</nav></div>" +
      '<figure class="lab-hero-photo"><picture>' +
      '<source srcset="../youth-emp-800.webp" media="(max-width: 799px)" type="image/webp">' +
      '<img src="../youth-emp-1600.webp" alt="Young people at an ES International gathering" width="1600" height="1000">' +
      "</picture></figure></section>" +
      section("Featured courses", "#/courses", featuredCourses, "course", "No courses are featured yet.") +
      section("Featured videos", "#/videos", featuredVideos, "video", "No videos are featured yet.") +
      '<section class="lab-section"><div class="lab-section-head"><h2>Recently added</h2></div>' +
      (recent.length ? '<div class="lab-grid">' + recent.map(function (row) { return card(row.item, row.kind); }).join("") + "</div>" : empty("Nothing has been added yet.")) +
      "</section>" +
      '<section class="lab-about lab-section" aria-labelledby="lab-about-title">' +
      "<div><p class=\"lab-kicker\">About</p><h2 id=\"lab-about-title\">About ES Venture Lab</h2></div>" +
      '<div class="lab-copy"><p>Two published accounts name ES Venture Lab. Oguh Evan C describes early UI/UX practice. David Alayo Olaniyi describes practice in full-stack development. The site does not yet publish a curriculum.</p>' +
      '<p>This library is where those courses, videos, and documents will be opened. The programme note on the ES International site stays the place for the organisational description.</p>' +
      '<p><a class="lab-back" href="../programmes.html#venture-lab">Read the programme note</a></p></div></section>';
  }

  function section(title, href, items, kind, fallback) {
    return '<section class="lab-section"><div class="lab-section-head"><h2>' + esc(title) + '</h2><a href="' + esc(href) + '">View all</a></div>' +
      (items.length ? grid(items, kind) : empty(fallback)) + "</section>";
  }

  function searchView(route) {
    var groups = [
      ["Courses", "course", content.courses],
      ["Videos", "video", content.videos],
      ["Resources", "resource", content.resources]
    ];
    var blocks = groups.map(function (group) {
      var items = group[2].filter(function (item) { return matches(item, route.q, route.category); });
      return "<h2>" + esc(group[0]) + "</h2>" + (items.length ? grid(items, group[1]) : empty("Nothing in " + group[0].toLowerCase() + " for this search."));
    }).join("");
    var title = route.category ? categoryName(route.category) : "Search";
    return "<header><p class=\"lab-kicker\">Library</p><h1>" + esc(title) + "</h1>" +
      (route.q ? '<p class="lab-lead">Results for “' + esc(route.q) + "”.</p>" : '<p class="lab-lead">Everything currently filed under this category.</p>') +
      "</header>" + toolbar(route, "search") + blocks;
  }

  function render() {
    if (!content) {
      main.innerHTML = "<h1>Library unavailable</h1>" + empty("The catalogue could not be loaded.");
      return;
    }
    var route = parseRoute();
    var html = "";
    if (route.name === "courses" && route.id) html = courseDetail(route);
    else if (route.name === "courses") html = catalogue(route, "course", content.courses, "courses");
    else if (route.name === "videos" && route.id) html = videoDetail(route);
    else if (route.name === "videos") html = catalogue(route, "video", content.videos, "videos");
    else if (route.name === "resources" && route.id) html = resourceDetail(route);
    else if (route.name === "resources") html = catalogue(route, "resource", content.resources, "resources");
    else if (route.name === "search") html = searchView(route);
    else html = home(route);
    main.innerHTML = html;
    markNav(route);
    if (quiet) {
      var field = document.getElementById("lab-q");
      if (field) {
        field.focus();
        var end = field.value.length;
        if (field.setSelectionRange) field.setSelectionRange(end, end);
      }
    } else if (booted) {
      var heading = main.querySelector("h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    }
    quiet = false;
    booted = true;
  }

  function markNav(route) {
    var current = route.name;
    if (current !== "courses" && current !== "videos" && current !== "resources") current = "home";
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (link) {
      if (link.getAttribute("data-nav") === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function setOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
  }

  document.addEventListener("submit", function (event) {
    var form = event.target.closest("[data-lab-search-form]");
    if (!form) return;
    event.preventDefault();
    var route = parseRoute();
    var input = form.querySelector("[data-lab-search]");
    var name = form.getAttribute("data-lab-view") || "search";
    navigate(buildHash(name, "", input ? input.value.trim() : "", route.category), false);
  });

  document.addEventListener("input", function (event) {
    var input = event.target.closest("[data-lab-search]");
    if (!input) return;
    var form = input.closest("[data-lab-search-form]");
    var route = parseRoute();
    var name = form ? form.getAttribute("data-lab-view") : "search";
    navigate(buildHash(name || "search", "", input.value.trim(), route.category), true);
  });

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-lab-category]");
    if (!button) return;
    var route = parseRoute();
    var name = route.name === "home" ? "search" : route.name;
    navigate(buildHash(name, "", route.q, button.getAttribute("data-lab-category") || ""), false);
  });

  window.addEventListener("hashchange", function () {
    setOpen(false);
    render();
  });

  if (!location.hash) history.replaceState(null, "", "#/");
  render();
})();
