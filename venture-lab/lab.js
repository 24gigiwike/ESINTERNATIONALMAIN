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

  function items() {
    return (content && content.items) || [];
  }

  function categoryName(id) {
    var found = ((content && content.categories) || []).filter(function (cat) { return cat.id === id; })[0];
    return found ? found.name : "Uncategorised";
  }

  function typeName(id) {
    var found = ((content && content.types) || []).filter(function (type) { return type.id === id; })[0];
    return found ? found.name : "Resource";
  }

  function categoriesOf(item) {
    if (item.categories && item.categories.length) return item.categories;
    if (item.category) return [item.category];
    return [];
  }

  function categoryLabel(item) {
    return categoriesOf(item).map(categoryName).join(" · ");
  }

  function byId(list, id) {
    return (list || []).filter(function (item) { return item.id === id; })[0] || null;
  }

  function libraryOf(item) {
    if (item.type === "course") return "courses";
    if (item.type === "video") return "videos";
    return "resources";
  }

  function inLibrary(item, name) {
    if (name === "courses") return item.type === "course";
    if (name === "videos") return item.type === "video";
    if (name === "resources") return item.type !== "course" && item.type !== "video";
    return true;
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
      category: params.get("category") || "",
      type: params.get("type") || ""
    };
  }

  function buildHash(name, id, q, category, type) {
    var path = !name || name === "home" ? "/" : "/" + name + (id ? "/" + encodeURIComponent(id) : "");
    var params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (type) params.set("type", type);
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

  function matches(item, q, category, type) {
    if (category && categoriesOf(item).indexOf(category) === -1) return false;
    if (type && item.type !== type) return false;
    if (!q) return true;
    var hay = [
      item.title,
      item.summary,
      item.description,
      item.publisher,
      item.access,
      typeName(item.type),
      categoryLabel(item)
    ].join(" ").toLowerCase();
    return hay.indexOf(q.toLowerCase()) !== -1;
  }

  function safeUrl(url) {
    if (!url || /^\s*javascript:/i.test(url)) return "";
    if (!/^https:\/\//i.test(url)) return "";
    return url;
  }

  function safeFile(file) {
    if (!file || /^\s*javascript:/i.test(file)) return "";
    return file;
  }

  function safeYouTubeId(id) {
    return /^[A-Za-z0-9_-]{6,}$/.test(id || "") ? id : "";
  }

  function hostNote(url) {
    try {
      return "Opens " + new URL(url).hostname.replace(/^www\./, "") + " in a new tab.";
    } catch (e) {
      return "Opens in a new tab.";
    }
  }

  function card(item) {
    var kind = libraryOf(item);
    var youtubeId = safeYouTubeId(item.youtubeId);
    var media = youtubeId
      ? '<img class="lab-thumb" src="https://i.ytimg.com/vi/' + esc(youtubeId) + '/hqdefault.jpg" alt="" width="480" height="360">'
      : '<div class="lab-cover"><span>' + esc(typeName(item.type)) + "</span><strong>" + esc(item.publisher || "External") + "</strong></div>";
    var source = [item.access, item.publisher].filter(Boolean).join(" · ");
    return '<a class="lab-card" href="' + esc(buildHash(kind, item.id)) + '">' +
      media +
      '<p class="lab-kicker">' + esc(typeName(item.type)) + "</p>" +
      "<h3>" + esc(item.title) + "</h3>" +
      "<p>" + esc(item.summary) + "</p>" +
      (source ? '<p class="lab-source">' + esc(source) + "</p>" : "") +
      '<p class="lab-meta">' + esc(categoryLabel(item) || "Uncategorised") + "</p></a>";
  }

  function grid(list) {
    if (!list.length) return "";
    return '<div class="lab-grid">' + list.map(card).join("") + "</div>";
  }

  function empty(message) {
    return '<p class="lab-empty">' + esc(message) + "</p>";
  }

  function searchForm(route, name) {
    return '<form data-lab-search-form data-lab-view="' + esc(name) + '" role="search">' +
      '<label class="lab-sr" for="lab-q">Search titles and descriptions</label>' +
      '<div class="lab-search">' +
      '<input id="lab-q" data-lab-search type="search" name="q" value="' + esc(route.q) + '" placeholder="Search titles and descriptions">' +
      "<button type=\"submit\">Search</button></div></form>";
  }

  function filterButtons(route, list, attr, label, current, nameOf) {
    var buttons = '<button type="button" data-lab-' + attr + '="" aria-pressed="' + (current ? "false" : "true") + '">All</button>';
    buttons += list.map(function (entry) {
      var on = current === entry.id;
      return '<button type="button" data-lab-' + attr + '="' + esc(entry.id) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(nameOf(entry)) + "</button>";
    }).join("");
    return '<div class="lab-filters" role="group" aria-label="' + esc(label) + '">' + buttons + "</div>";
  }

  function typesIn(list) {
    var seen = {};
    var ids = [];
    list.forEach(function (item) {
      if (!item.type || seen[item.type]) return;
      seen[item.type] = true;
      ids.push(item.type);
    });
    return ((content && content.types) || []).filter(function (type) {
      return ids.indexOf(type.id) !== -1;
    });
  }

  function toolbar(route, name, baseList) {
    var types = typesIn(baseList);
    var typeFilters = types.length > 1
      ? filterButtons(route, types, "type", "Content types", route.type, function (type) { return type.name; })
      : "";
    return '<div class="lab-toolbar">' + searchForm(route, name) +
      '<div class="lab-filter-stack">' +
      filterButtons(route, (content && content.categories) || [], "category", "Categories", route.category, function (cat) { return cat.name; }) +
      typeFilters +
      "</div></div>";
  }

  function catalogue(route, name, noun) {
    var base = items().filter(function (item) { return inLibrary(item, name); });
    var found = base.filter(function (item) { return matches(item, route.q, route.category, route.type); });
    var heading = route.category ? categoryName(route.category) : (route.type ? typeName(route.type) : noun.charAt(0).toUpperCase() + noun.slice(1));
    var lead = name === "courses"
      ? "Courses and structured learning paths from universities and open publishers. Each card states how to open it."
      : name === "videos"
        ? "Talks and collections. A single YouTube film plays on this page. Every film can also be opened on the publisher’s site."
        : "Textbooks, toolkits, reports and research. Reading and download links go to the original publisher.";
    var none = route.q
      ? "Nothing matches that search."
      : "Nothing matches these filters.";
    return "<header><p class=\"lab-kicker\">Library</p><h1>" + esc(heading) + "</h1>" +
      '<p class="lab-lead">' + esc(lead) + "</p></header>" +
      toolbar(route, route.name, base) +
      '<p class="lab-count" aria-live="polite">' + found.length + " " + (found.length === 1 ? noun.replace(/s$/, "") : noun) + "</p>" +
      (found.length ? grid(found) : empty(none));
  }

  function facts(item) {
    var rows = [
      ["Type", typeName(item.type)],
      ["Category", categoryLabel(item)],
      ["Publisher", item.publisher || ""],
      ["Access", item.access || ""],
      ["Licence", item.licence || ""]
    ].filter(function (row) { return row[1]; });
    return '<dl class="lab-facts">' + rows.map(function (row) {
      return "<dt>" + esc(row[0]) + "</dt><dd>" + esc(row[1]) + "</dd>";
    }).join("") + "</dl>";
  }

  function actionLink(item) {
    var url = safeUrl(item.url);
    if (!url) return '<p class="lab-unavailable">No original link has been added for this item yet.</p>';
    var label = item.action || "Explore";
    return '<p class="lab-actions"><a class="lab-button" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
      esc(label) + '<span class="lab-sr"> (opens in a new tab)</span></a>' +
      '<span class="lab-action-note">' + esc(hostNote(url)) + "</span></p>";
  }

  function materialLink(material) {
    var list = material.kind === "video" ? items().filter(function (item) { return item.type === "video"; }) : items();
    var item = byId(list, material.id) || byId(items(), material.id);
    var label = material.kind === "video" ? "Video" : "Resource";
    if (!item) return "<li><span>" + label + " missing: " + esc(material.id) + "</span></li>";
    return '<li><a href="' + esc(buildHash(libraryOf(item), item.id)) + '">' + esc(item.title) + "<span>" + esc(typeName(item.type)) + "</span></a></li>";
  }

  function detailShell(route, item, backName, backLabel, body) {
    return '<a class="lab-back" href="' + esc(buildHash(backName, "", route.q, route.category, route.type)) + '">' + esc(backLabel) + "</a>" +
      '<article class="lab-detail">' +
      '<p class="lab-kicker">' + esc(typeName(item.type)) + "</p>" +
      "<h1>" + esc(item.title) + "</h1>" +
      body +
      facts(item) +
      '<div class="lab-copy"><p>' + esc(item.description || item.summary) + "</p></div>" +
      actionLink(item) +
      "</article>";
  }

  function courseDetail(route) {
    var item = byId(items(), route.id);
    if (!item || item.type !== "course") return missing("courses", "Courses");
    var materials = (item.materials || []).map(materialLink).join("");
    var extra = materials ? "<h2>Learning materials</h2><ul class=\"lab-materials\">" + materials + "</ul>" : "";
    return detailShell(route, item, "courses", "All courses", extra);
  }

  function videoDetail(route) {
    var item = byId(items(), route.id);
    if (!item || item.type !== "video") return missing("videos", "Videos");
    var youtubeId = safeYouTubeId(item.youtubeId);
    var player = youtubeId
      ? '<div class="lab-player"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(youtubeId) + '" title="' + esc(item.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
      : '<p class="lab-unavailable">This entry is a collection, so it is not embedded as a single film. Use Watch to open it on the publisher’s site.</p>';
    return detailShell(route, item, "videos", "All videos", player);
  }

  function resourceDetail(route) {
    var item = byId(items(), route.id);
    if (!item || item.type === "course" || item.type === "video") return missing("resources", "Resources");
    var file = safeFile(item.file);
    var download = file
      ? '<p class="lab-actions"><a class="lab-button" href="' + esc(file) + '" download>' + esc(item.fileLabel || "Download") + "</a></p>"
      : "";
    var cover = '<div class="lab-cover"><span>' + esc(typeName(item.type)) + "</span><strong>" + esc(item.publisher || "Document") + "</strong></div>";
    return detailShell(route, item, "resources", "All resources", cover + download);
  }

  function missing(name, label) {
    return "<h1>This item is not in the library</h1>" +
      empty("The link may be incomplete, or the entry has not been added yet.") +
      '<p class="lab-actions"><a class="lab-back" href="' + esc(buildHash(name)) + '">Back to ' + esc(label.toLowerCase()) + "</a></p>";
  }

  function section(title, href, list, fallback) {
    return '<section class="lab-section"><div class="lab-section-head"><h2>' + esc(title) + '</h2><a href="' + esc(href) + '">View all</a></div>' +
      (list.length ? grid(list) : empty(fallback)) + "</section>";
  }

  function home(route) {
    var featured = ((content && content.featured) || []).map(function (id) { return byId(items(), id); }).filter(Boolean);
    var recent = items().slice().sort(function (a, b) {
      if (a.added === b.added) return 0;
      return a.added < b.added ? 1 : -1;
    }).slice(0, 6);
    var cats = ((content && content.categories) || []).map(function (cat) {
      return '<a href="' + esc(buildHash("search", "", "", cat.id, "")) + '">' + esc(cat.name) + "</a>";
    }).join("");
    var about = [
      "ES Venture Lab is driven by the belief that young people should encounter technology, innovation and the world of industry early enough to discover their interests, develop practical abilities and understand the opportunities available to them.",
      "It is a learning and exposure space designed to introduce young people to relevant and evolving fields, from technology and digital skills to design, entrepreneurship and emerging industries. The library here gathers courses, videos, textbooks, toolkits and research from universities, open publishers and established organisations.",
      "Beyond providing learning materials, Venture Lab seeks to nurture curiosity, creative thinking, confidence and an entrepreneurial mindset. It encourages young people to explore new ideas, understand how industries evolve and begin developing the skills needed to participate in shaping the future.",
      "At its heart, ES Venture Lab is about making early exposure meaningful: helping young people move from curiosity to exploration, from exploration to learning, and from learning towards purposeful opportunities. The Lab does not register learners, sell courses or track progress. Each resource opens with its original publisher."
    ];
    return '<section class="lab-hero">' +
      "<div><p class=\"lab-kicker\">ES International</p><h1>ES Venture Lab</h1>" +
      '<p class="lab-lead">A learning and exposure space for young people. Explore courses, videos and research on leadership, technology, entrepreneurship, citizenship, design, work and global change.</p>' +
      searchForm(route, "search") +
      '<nav class="lab-cats" aria-label="Learning categories">' + cats + "</nav></div>" +
      '<figure class="lab-hero-photo"><picture>' +
      '<source srcset="../youth-emp-800.webp" media="(max-width: 799px)" type="image/webp">' +
      '<img src="../youth-emp-1600.webp" alt="Young people at an ES International gathering" width="1600" height="1000">' +
      "</picture></figure></section>" +
      section("Featured resources", "#/search", featured, "No resources are featured yet.") +
      '<section class="lab-section"><div class="lab-section-head"><h2>Recently added</h2></div>' +
      (recent.length ? grid(recent) : empty("Nothing has been added yet.")) +
      "</section>" +
      '<section class="lab-about lab-section" aria-labelledby="lab-about-title">' +
      "<div><p class=\"lab-kicker\">About</p><h2 id=\"lab-about-title\">About ES Venture Lab</h2></div>" +
      '<div class="lab-copy">' + about.map(function (paragraph) { return "<p>" + esc(paragraph) + "</p>"; }).join("") + "</div></section>";
  }

  function searchView(route) {
    var groups = [
      ["Courses", "courses"],
      ["Videos", "videos"],
      ["Resources", "resources"]
    ];
    var base = items();
    var blocks = groups.map(function (group) {
      var found = base.filter(function (item) {
        return inLibrary(item, group[1]) && matches(item, route.q, route.category, route.type);
      });
      return "<h2>" + esc(group[0]) + "</h2>" + (found.length ? grid(found) : empty(route.q ? "Nothing in " + group[0].toLowerCase() + " matches that search." : "Nothing in " + group[0].toLowerCase() + " for these filters."));
    }).join("");
    var title = route.category ? categoryName(route.category) : (route.type ? typeName(route.type) : "Search");
    var lead = route.q ? "Results for “" + route.q + "”." : "Everything currently filed for this view.";
    return "<header><p class=\"lab-kicker\">Library</p><h1>" + esc(title) + "</h1>" +
      '<p class="lab-lead">' + esc(lead) + "</p></header>" +
      toolbar(route, "search", base) + blocks;
  }

  function render() {
    if (!content || !content.items) {
      main.innerHTML = "<h1>Library unavailable</h1>" + empty("The catalogue could not be loaded.");
      return;
    }
    var route = parseRoute();
    var html = "";
    if (route.name === "courses" && route.id) html = courseDetail(route);
    else if (route.name === "courses") html = catalogue(route, "courses", "courses");
    else if (route.name === "videos" && route.id) html = videoDetail(route);
    else if (route.name === "videos") html = catalogue(route, "videos", "videos");
    else if (route.name === "resources" && route.id) html = resourceDetail(route);
    else if (route.name === "resources") html = catalogue(route, "resources", "resources");
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
    navigate(buildHash(name, "", input ? input.value.trim() : "", route.category, route.type), false);
  });

  document.addEventListener("input", function (event) {
    var input = event.target.closest("[data-lab-search]");
    if (!input) return;
    var form = input.closest("[data-lab-search-form]");
    var route = parseRoute();
    var name = form ? form.getAttribute("data-lab-view") : "search";
    navigate(buildHash(name || "search", "", input.value.trim(), route.category, route.type), true);
  });

  document.addEventListener("click", function (event) {
    var categoryBtn = event.target.closest("[data-lab-category]");
    var typeBtn = event.target.closest("[data-lab-type]");
    if (!categoryBtn && !typeBtn) return;
    var route = parseRoute();
    var name = route.name === "home" ? "search" : route.name;
    if (route.id) name = route.name;
    var category = categoryBtn ? (categoryBtn.getAttribute("data-lab-category") || "") : route.category;
    var type = typeBtn ? (typeBtn.getAttribute("data-lab-type") || "") : route.type;
    navigate(buildHash(name, "", route.q, category, type), false);
  });

  window.addEventListener("hashchange", function () {
    setOpen(false);
    render();
  });

  if (!location.hash) history.replaceState(null, "", "#/");
  render();
})();
