(function () {
  "use strict";

  var STORAGE_KEY = "solcrys-analytics-consent";
  var BANNER_ID = "solcrys-consent-banner";
  var GA_ID = "G-E3VGGM7P1G";
  var CLARITY_ID = "wm2vxbdu8k";
  var analyticsLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  function isDevelopmentHost() {
    var host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1" || host.endsWith(".local");
  }

  function getChoice() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "granted" || value === "denied" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function saveChoice(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch (error) {
      // Consent still applies for the current page when storage is unavailable.
    }
  }

  function loadScript(id, source) {
    if (document.getElementById(id)) return;
    var script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = source;
    document.head.appendChild(script);
  }

  function enableAnalytics() {
    window.gtag("consent", "update", { analytics_storage: "granted" });
    if (analyticsLoaded || isDevelopmentHost()) return;
    analyticsLoaded = true;

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      linker: { domains: ["solcrys.com", "app.solcrys.com"] },
    });
    loadScript("solcrys-ga4", "https://www.googletagmanager.com/gtag/js?id=" + GA_ID);

    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    loadScript("solcrys-clarity", "https://www.clarity.ms/tag/" + CLARITY_ID);
  }

  function disableAnalytics() {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }

  function closeBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
  }

  function setChoice(choice) {
    var previous = getChoice();
    saveChoice(choice);
    if (choice === "granted") {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
    closeBanner();

    // Reload after revocation so already-loaded analytics scripts are removed.
    if (previous === "granted" && choice === "denied") {
      window.location.reload();
    }
  }

  function createButton(label, className, choice) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", function () {
      setChoice(choice);
    });
    return button;
  }

  function openPreferences() {
    if (!document.body || document.getElementById(BANNER_ID)) return;

    var banner = document.createElement("section");
    banner.id = BANNER_ID;
    banner.className = "consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "consent-title");

    var copy = document.createElement("div");
    copy.className = "consent-copy";

    var title = document.createElement("h2");
    title.id = "consent-title";
    title.textContent = "Analytics preferences";

    var description = document.createElement("p");
    description.append("We use optional analytics to understand site performance. ");
    var privacyLink = document.createElement("a");
    privacyLink.href = "/privacy.html";
    privacyLink.textContent = "Privacy policy";
    description.appendChild(privacyLink);
    description.append(".");

    copy.appendChild(title);
    copy.appendChild(description);

    var actions = document.createElement("div");
    actions.className = "consent-actions";
    actions.appendChild(createButton("Necessary only", "consent-button consent-button-secondary", "denied"));
    actions.appendChild(createButton("Allow analytics", "consent-button consent-button-primary", "granted"));

    banner.appendChild(copy);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    actions.lastElementChild.focus();
  }

  window.SolCrysConsent = {
    getChoice: getChoice,
    open: openPreferences,
  };

  document.addEventListener("click", function (event) {
    var trigger = event.target && event.target.closest
      ? event.target.closest("[data-consent-preferences]")
      : null;
    if (!trigger) return;
    event.preventDefault();
    openPreferences();
  });

  document.addEventListener("DOMContentLoaded", function () {
    var choice = getChoice();
    if (choice === "granted") {
      enableAnalytics();
    } else if (choice === "denied") {
      disableAnalytics();
    } else {
      openPreferences();
    }
  });
})();
