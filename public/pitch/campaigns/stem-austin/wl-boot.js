(function () {
  "use strict";
  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  var campaign = qs("campaign");
  if (campaign !== "stem-austin") return;

  document.body.classList.add("wl-austin");

  var topbar = document.querySelector(".topbar");
  if (topbar) {
    topbar.innerHTML =
      '<a class="wordmark-customer" href="/pitch/campaigns/stem-austin">Austin STEM Coalition</a>' +
      '<div class="topbar-nav">' +
      '<a class="powered-by" href="/pitch/">Powered by <span class="ftk-script">Fund the Kid</span></a>' +
      '<a class="btn btn-coral pill-cta" href="/pitch/campaigns/stem-austin/submit">Submit an opportunity</a>' +
      '<a class="back-link" href="/pitch/campaigns/stem-austin">← Campaign home</a>' +
      '<span class="badge">Campaign · Austin STEM Coalition</span>' +
      "</div>";
  }

  var title = document.querySelector("title");
  if (title && title.textContent.indexOf("Austin STEM") === -1) {
    title.textContent = "Austin STEM Coalition - " + title.textContent.replace(/^Fund the Kid - /, "");
  }

  var foot = document.querySelector(".footer-note");
  if (foot) {
    foot.innerHTML =
      'Same listing database under each lane. Campaign filter: Austin STEM Coalition. ' +
      '<a href="/pitch/campaigns/stem-austin">Back to campaign</a>. Powered by Fund the Kid.';
  }
})();
