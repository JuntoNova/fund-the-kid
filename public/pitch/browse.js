(function () {
  "use strict";

  function money(n) {
    return "$" + Number(n).toLocaleString("en-US");
  }

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function chip(label, extraClass) {
    var el = document.createElement("span");
    el.className = "chip" + (extraClass ? " " + extraClass : "");
    el.textContent = label;
    return el;
  }

  function dealHref(item, campaign) {
    if (campaign === "stem-austin" && item.slug) {
      return "/pitch/campaigns/stem-austin/deals/" + encodeURIComponent(item.slug);
    }
    return null;
  }

  function renderListing(item, campaign) {
    var card = document.createElement("article");
    card.className = "listing";
    card.dataset.id = item.id;

    var meta = document.createElement("div");
    meta.className = "listing-meta";
    if (item.lane) {
      var laneLabels = { advocacy: "Advocacy", supply: "Supply", confidence: "Confidence" };
      meta.appendChild(chip(laneLabels[item.lane] || item.lane, "lane-tag"));
    }
    if (item.status) {
      meta.appendChild(chip(item.status, "status-" + String(item.status).toLowerCase()));
    }
    (item.workKind || []).forEach(function (w) {
      meta.appendChild(chip(w));
    });
    if (item.moneyKind) meta.appendChild(chip(item.moneyKind));
    if (item.example) meta.appendChild(chip("Example", "example"));
    card.appendChild(meta);

    var h = document.createElement("h3");
    h.textContent = item.title;
    card.appendChild(h);

    var org = document.createElement("p");
    org.className = "orgline";
    org.textContent =
      item.organization +
      " · " +
      item.place +
      ", " +
      item.state +
      " · " +
      Number(item.children).toLocaleString("en-US") +
      " kids";
    card.appendChild(org);

    var moneyRow = document.createElement("div");
    moneyRow.className = "listing-money";
    var amt = document.createElement("span");
    amt.className = "amt";
    amt.textContent = money(item.amount);
    var per = document.createElement("span");
    per.className = "per";
    per.textContent = money(item.perChild) + " per child";
    moneyRow.appendChild(amt);
    moneyRow.appendChild(per);
    card.appendChild(moneyRow);

    var impact = document.createElement("p");
    impact.className = "impact";
    impact.textContent = item.impact;
    card.appendChild(impact);

    var href = dealHref(item, campaign);
    if (href) {
      var link = document.createElement("a");
      link.className = "listing-link";
      link.href = href;
      link.appendChild(card);
      return link;
    }
    return card;
  }

  function uniqueSubjects(items) {
    var set = {};
    items.forEach(function (it) {
      (it.workKind || []).forEach(function (w) {
        set[w] = true;
      });
    });
    return Object.keys(set).sort();
  }

  async function boot() {
    var root = document.getElementById("listings");
    if (!root) return;

    var lane = root.dataset.lane;
    var searchInput = document.getElementById("search");
    var filterBtn = document.getElementById("filter-btn");
    var filtersPanel = document.getElementById("filters-panel");
    var subjectRow = document.getElementById("subject-chips");
    var campaign = qs("campaign");

    var res = await fetch("/pitch/listings.json", { credentials: "same-origin" });
    if (!res.ok) {
      root.innerHTML = '<p class="empty">Could not load listings.</p>';
      return;
    }
    var all = await res.json();
    var pool = all.filter(function (it) {
      if (lane) return it.lane === lane;
      return true;
    });

    var activeSubjects = {};

    if (subjectRow) {
      uniqueSubjects(pool).forEach(function (s) {
        var c = chip(s, "toggle");
        c.addEventListener("click", function () {
          if (activeSubjects[s]) {
            delete activeSubjects[s];
            c.classList.remove("active");
          } else {
            activeSubjects[s] = true;
            c.classList.add("active");
          }
          paint();
        });
        subjectRow.appendChild(c);
      });
    }

    if (filterBtn && filtersPanel) {
      filterBtn.addEventListener("click", function () {
        filtersPanel.classList.toggle("open");
        filterBtn.setAttribute(
          "aria-expanded",
          filtersPanel.classList.contains("open") ? "true" : "false"
        );
      });
    }

    function paint() {
      var q = (searchInput && searchInput.value ? searchInput.value : "")
        .trim()
        .toLowerCase();
      var subjects = Object.keys(activeSubjects);
      var filtered = pool.filter(function (it) {
        if (campaign === "stem-austin") {
          if (!it.campaignApproved || it.campaign !== "stem-austin") return false;
        }
        if (subjects.length) {
          var ok = (it.workKind || []).some(function (w) {
            return activeSubjects[w];
          });
          if (!ok) return false;
        }
        if (!q) return true;
        var hay = [
          it.title,
          it.organization,
          it.place,
          it.state,
          it.impact,
          (it.workKind || []).join(" "),
          it.moneyKind || "",
        ]
          .join(" ")
          .toLowerCase();
        return hay.indexOf(q) !== -1;
      });

      root.innerHTML = "";
      if (!filtered.length) {
        root.innerHTML = '<p class="empty">No listings match these filters.</p>';
        return;
      }
      filtered.forEach(function (it) {
        root.appendChild(renderListing(it, campaign));
      });
    }

    if (searchInput) searchInput.addEventListener("input", paint);
    paint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
