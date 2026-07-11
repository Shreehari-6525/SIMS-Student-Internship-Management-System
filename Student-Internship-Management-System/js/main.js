
document.addEventListener("DOMContentLoaded", function () {

    initMobileSidebar();
    initActiveMenuHighlight();
    initDropdowns();
    initSearchFilter();
    initDeleteConfirm();
    initModals();
    initProfileImagePreview();
    initNotificationDismiss();
    initFormValidation();
    initStarRatingSaveToggle();

});

function initMobileSidebar() {

    const sidebar = document.querySelector(".sidebar");
    if (!sidebar) return;

    const topbar = document.querySelector(".topbar");
    if (!topbar) return;

    let toggleBtn = document.querySelector(".menu-toggle");
    if (!toggleBtn) {
        toggleBtn = document.createElement("button");
        toggleBtn.className = "menu-toggle";
        toggleBtn.setAttribute("aria-label", "Toggle Menu");
        toggleBtn.innerHTML = "&#9776;";
        topbar.prepend(toggleBtn);
    }

    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);
    }

    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener("click", closeSidebar);

    document.querySelectorAll(".menu li a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) closeSidebar();
    });
}


function initActiveMenuHighlight() {

    const links = document.querySelectorAll(".menu li a");
    if (!links.length) return;

    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

    links.forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const linkPage = href.split("/").pop();

        if (linkPage === currentPage) {
            document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
            link.closest("li").classList.add("active");
        }
    });
}

function initDropdowns() {

    document.querySelectorAll("[data-dropdown-toggle]").forEach(function (toggle) {

        const targetId = toggle.getAttribute("data-dropdown-toggle");
        const menu = document.getElementById(targetId);
        if (!menu) return;

        toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            menu.classList.toggle("show");
        });
    });

    document.addEventListener("click", function () {
        document.querySelectorAll(".dropdown-menu.show").forEach(m => m.classList.remove("show"));
    });
}

function initSearchFilter() {

    document.querySelectorAll("[data-search-input]").forEach(function (input) {

        const targetSelector = input.getAttribute("data-search-input");
        const items = document.querySelectorAll(targetSelector);

        input.addEventListener("input", function () {
            const query = input.value.trim().toLowerCase();

            items.forEach(function (item) {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? "" : "none";
            });
        });
    });
}

function initDeleteConfirm() {

    document.querySelectorAll("[data-delete-confirm]").forEach(function (btn) {

        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const row = btn.closest("tr, .list-item, .content-card, .internship-row, .application-card");
            const label = btn.getAttribute("data-delete-confirm") || "this item";

            const confirmed = window.confirm("Are you sure you want to delete " + label + "? This action cannot be undone.");

            if (confirmed && row) {
                row.style.transition = "opacity .3s ease";
                row.style.opacity = "0";
                setTimeout(() => row.remove(), 300);
            }
        });
    });
}

function initModals() {

    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const modal = document.getElementById(btn.getAttribute("data-modal-open"));
            if (modal) modal.classList.add("show");
        });
    });

    document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const modal = btn.closest(".modal-overlay");
            if (modal) modal.classList.remove("show");
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(function (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) modal.classList.remove("show");
        });
    });
}

function initProfileImagePreview() {

    document.querySelectorAll("[data-image-input]").forEach(function (input) {

        input.addEventListener("change", function () {

            if (!input.files || !input.files[0]) return;

            const previewId = input.getAttribute("data-image-input");
            const preview = document.getElementById(previewId);
            if (!preview) return;

            const reader = new FileReader();

            reader.onload = function (e) {
                if (preview.tagName === "IMG") {
                    preview.src = e.target.result;
                } else {
                    preview.style.backgroundImage = "url(" + e.target.result + ")";
                    preview.textContent = "";
                }
            };

            reader.readAsDataURL(input.files[0]);
        });
    });
}

function initNotificationDismiss() {

    document.querySelectorAll(".notification-close").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const card = btn.closest(".notification-card");
            if (!card) return;
            card.style.transition = "opacity .3s ease, transform .3s ease";
            card.style.opacity = "0";
            card.style.transform = "translateX(30px)";
            setTimeout(() => card.remove(), 300);
        });
    });

    const markAllBtn = document.querySelector("[data-mark-all-read]");
    if (markAllBtn) {
        markAllBtn.addEventListener("click", function () {
            document.querySelectorAll(".notification-card.unread").forEach(function (card) {
                card.classList.remove("unread");
            });
        });
    }

    document.querySelectorAll(".notification-card.unread").forEach(function (card) {
        card.addEventListener("click", function () {
            card.classList.remove("unread");
        });
    });
}

function initFormValidation() {

    document.querySelectorAll("form[data-validate]").forEach(function (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();
            let valid = true;

            form.querySelectorAll(".error-text").forEach(el => el.remove());
            form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

            form.querySelectorAll("[required]").forEach(function (field) {

                const value = field.value.trim();
                let fieldValid = true;

                if (!value) {
                    fieldValid = false;
                } else if (field.type === "email") {
                    fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                } else if (field.type === "tel") {
                    fieldValid = /^[0-9+\-\s]{10,15}$/.test(value);
                } else if (field.type === "password") {
                    fieldValid = value.length >= 6;
                }

                if (!fieldValid) {
                    valid = false;
                    field.classList.add("input-error");

                    const msg = document.createElement("span");
                    msg.className = "error-text";
                    msg.textContent = field.type === "email"
                        ? "Please enter a valid email address."
                        : field.type === "tel"
                        ? "Please enter a valid phone number."
                        : field.type === "password"
                        ? "Password must be at least 6 characters."
                        : "This field is required.";

                    field.insertAdjacentElement("afterend", msg);
                }
            });

            /* Confirm Password Matching */
            const pass = form.querySelector('input[name="password"], #password');
            const confirmPass = form.querySelector('input[name="confirm-password"], #confirm-password');

            if (pass && confirmPass && pass.value !== confirmPass.value) {
                valid = false;
                confirmPass.classList.add("input-error");
                const msg = document.createElement("span");
                msg.className = "error-text";
                msg.textContent = "Passwords do not match.";
                confirmPass.insertAdjacentElement("afterend", msg);
            }

            if (valid) {
                const successBox = form.querySelector(".form-success") || document.getElementById("form-success");
                if (successBox) {
                    successBox.classList.add("show");
                    setTimeout(() => successBox.classList.remove("show"), 4000);
                } else {
                    alert("Form submitted successfully!");
                }

                if (form.hasAttribute("data-reset-on-success")) {
                    form.reset();
                }
            }
        });
    });
}

function initStarRatingSaveToggle() {

    document.querySelectorAll(".save-btn").forEach(function (btn) {

        btn.addEventListener("click", function () {
            btn.classList.toggle("saved");
            btn.innerHTML = btn.classList.contains("saved") ? "&#10084; Saved" : "&#9825; Save";
        });
    });
}

document.addEventListener("click", function (e) {

    const tabBtn = e.target.closest("[data-tab-target]");
    if (!tabBtn) return;

    const tabGroup = tabBtn.closest(".tabs");
    if (!tabGroup) return;

    const targetId = tabBtn.getAttribute("data-tab-target");
    const panelWrapper = tabGroup.parentElement;

    tabGroup.querySelectorAll("[data-tab-target]").forEach(b => b.classList.remove("active"));
    tabBtn.classList.add("active");

    panelWrapper.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.classList.add("active");
});
