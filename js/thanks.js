/* FormSubmit redirects only after it accepts the normal HTML POST.
   Clear the local draft only when this page has a matching, recent
   same-tab pending marker, rather than when the form's submit button
   is clicked or when someone directly visits this confirmation URL. */
(function () {
  "use strict";
  var heading = document.getElementById("thanks-heading");
  var message = document.getElementById("thanks-description");
  var kind = new URLSearchParams(window.location.search).get("form");
  var valid = kind === "demo" || kind === "oem";
  var confirmed = false;
  if (valid) {
    var key = "procomm:pending:" + kind + ":v1";
    try {
      var marker = JSON.parse(sessionStorage.getItem(key) || "null");
      if (marker && marker.form === kind && Number.isFinite(marker.savedAt) &&
          Date.now() >= marker.savedAt && Date.now() - marker.savedAt < 30 * 60 * 1000) {
        confirmed = true;
        localStorage.removeItem("procomm:enquiry:" + kind + ":v1");
        sessionStorage.removeItem(key);
      }
    } catch (error) { /* Private browsing or storage restrictions: don't claim success. */ }
  }

  if (confirmed) {
    heading.textContent = "Enquiry accepted.";
    message.textContent = "The form service accepted your " +
      (kind === "oem" ? "OEM partnership" : "FlexiFlow demo") +
      " enquiry and is processing the email notification to Procomm Dynamics. Your saved browser draft has been cleared.";
  } else {
    heading.textContent = "Submission not verified.";
    message.textContent = "This page alone cannot confirm that an enquiry was sent. If you didn't see the form service's completion screen, return to the form and check your saved draft, or email us directly.";
  }
})();
