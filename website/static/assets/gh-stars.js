/* ============================================================
   MOSAIC — live GitHub star count
   Fills #gh-stars with the real stargazer count from the
   public GitHub API. Falls back to the static text already
   in the HTML if the request fails. Cached for 1 hour to
   stay well under GitHub's unauthenticated rate limit.
   ============================================================ */
(function () {
  var el = document.getElementById('gh-stars');
  if (!el) return;

  var REPO = 'OWASP/MOSAIC';
  var CACHE_KEY = 'gh-stars-' + REPO;
  var ONE_HOUR = 60 * 60 * 1000;

  function format(n) {
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  }
  function show(n) { el.textContent = '\u2605 ' + format(n); }

  // Use a cached value if it's under an hour old (avoids API rate limits).
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.t < ONE_HOUR) { show(cached.n); return; }
  } catch (e) {}

  fetch('https://api.github.com/repos/' + REPO)
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      show(data.stargazers_count);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ n: data.stargazers_count, t: Date.now() }));
      } catch (e) {}
    })
    .catch(function () { /* keep the static fallback already in the HTML */ });
})();
