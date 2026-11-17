// Main page interactions: mobile navigation and creator category filters.

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const filterRow = document.getElementById("filterRow");
const creatorCards = [...document.querySelectorAll(".creator-card")];

if (filterRow) {
    filterRow.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");

        if (!button) return;

        filterRow.querySelectorAll(".filter-chip").forEach((chip) => {
            chip.classList.toggle("active", chip === button);
        });

        const selectedCategory = button.dataset.filter;

        creatorCards.forEach((card) => {
            const shouldHide = selectedCategory !== "all" && card.dataset.category !== selectedCategory;
            card.classList.toggle("hidden", shouldHide);
        });
    });
}

// Hero search filters the creator showcase using the selected creative field.
const heroRole = document.getElementById("heroRole");
const heroSearch = document.getElementById("heroSearch");

if (heroRole && heroSearch) {
    heroSearch.addEventListener("click", () => {
        const selectedCategory = heroRole.value;
        const matchingFilter = document.querySelector(`[data-filter="${selectedCategory}"]`);
        const allFilter = document.querySelector('[data-filter="all"]');
        const filterButton = matchingFilter || allFilter;

        if (filterButton && filterRow) {
            filterRow.querySelectorAll(".filter-chip").forEach((chip) => {
                chip.classList.toggle("active", chip === filterButton);
            });
            creatorCards.forEach((card) => {
                card.classList.toggle("hidden", selectedCategory !== "all" && card.dataset.category !== selectedCategory);
            });
        }

        document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
    });
}
