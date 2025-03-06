// Direct truncation script to be injected into the page
(function () {
    console.log("Direct truncation script loaded");

    function truncateText(element) {
        // Skip truncation if viewport width is 1000px or less
        if (window.innerWidth <= 1000) {
            element.classList.add("content-ready");
            return;
        }

        // Get max length from data-truncate attribute
        const maxLength = parseInt(element.getAttribute("data-truncate"), 10);
        if (!maxLength) return; // Skip if no max length defined

        const originalText = element.textContent;
        const dataAttribute = element.classList.contains("post-card-title")
            ? "data-full-title"
            : "data-full-excerpt";

        // Store original text if not already stored
        if (!element.getAttribute(dataAttribute)) {
            element.setAttribute(dataAttribute, originalText);
        }

        // Only truncate if text is longer than max length
        if (originalText.length > maxLength) {
            element.textContent = originalText.substring(0, maxLength) + "...";
            console.log(`Text truncated to ${maxLength} characters`);
        }

        // Always make visible immediately
        element.classList.add("content-ready");
    }

    function truncateNow() {
        console.log("Truncating now...");

        // Process only elements with data-truncate attribute
        document.querySelectorAll("[data-truncate]").forEach((element) => {
            // Skip elements that are already processed
            if (element.classList.contains("content-ready")) return;
            truncateText(element);
        });
    }

    // Function to handle window resize
    function handleResize() {
        // If viewport width changes from <= 1000px to > 1000px, reapply truncation
        if (window.innerWidth > 1000) {
            // Remove content-ready class to reprocess elements
            document
                .querySelectorAll("[data-truncate].content-ready")
                .forEach((element) => {
                    element.classList.remove("content-ready");
                });
            truncateNow();
        }
        // If viewport width changes from > 1000px to <= 1000px, restore original text
        else {
            document.querySelectorAll("[data-truncate]").forEach((element) => {
                const dataAttribute = element.classList.contains(
                    "post-card-title"
                )
                    ? "data-full-title"
                    : "data-full-excerpt";

                const originalText = element.getAttribute(dataAttribute);
                if (originalText) {
                    element.textContent = originalText;
                }

                element.classList.add("content-ready");
            });
        }
    }

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Run immediately
    truncateNow();

    // Also run after DOM is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", truncateNow);
    } else {
        // DOM already loaded, run now
        truncateNow();
    }

    // Run again after a delay to ensure all content is loaded
    setTimeout(truncateNow, 100);

    // Also handle infinite scroll events
    document.addEventListener("infiniteScrollComplete", () => {
        console.log("Infinite scroll completed, truncating new content");
        setTimeout(truncateNow, 100);
    });

    // Run again if DOM changes (for infinite scroll)
    const observer = new MutationObserver(function (mutations) {
        // Check if new elements were added
        let newElements = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                newElements = true;
            }
        });

        // Only run truncation if new elements were added
        if (newElements) {
            setTimeout(truncateNow, 100);
        }
    });

    // Start observing the document
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    } else {
        // DOM already loaded, start observing now
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
