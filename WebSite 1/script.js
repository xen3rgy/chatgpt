
function filterEntries() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const entries = document.getElementsByClassName("entry");

    let visibleCount = 0;

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const title = entry.querySelector(".card-title").innerText.toLowerCase();
        const text = entry.querySelector(".card-text").innerText.toLowerCase();
        const tags = entry.getAttribute("data-tags").toLowerCase();

        if (title.includes(input) || text.includes(input) || tags.includes(input)) {
            entry.style.display = "";
            visibleCount++;
        } else {
            entry.style.display = "none";
        }
    }

    const noResultsElem = document.getElementById('noResults');
    
    if (visibleCount === 0 && input !== '') {
        if (!noResultsElem) {
            const noResults = document.createElement('div');
            noResults.id = 'noResults';
            noResults.className = 'col-12 text-center py-5';
            noResults.innerHTML = `
                <div class="no-results-animation">
                    <div class="search-icon" style="font-size: 3rem;">🔍</div>
                    <div class="not-found-text">Keine Ergebnisse für "<strong id="searchTermDisplay"></strong>" gefunden</div>
                </div>
            `;
            document.getElementById('entries').appendChild(noResults);
        }
        const searchDisplay = document.getElementById("searchTermDisplay");
        if (searchDisplay) {
            searchDisplay.textContent = input;
        }
    } else if (noResultsElem) {
        noResultsElem.remove(); // <- das hat bei dir gefehlt!
    }
}


// Jahres-Badges zu den Karten hinzufügen
function addYearBadges() {
    document.querySelectorAll(".entry").forEach(entry => {
        const tags = entry.getAttribute("data-tags");
        const yearMatch = tags.match(/\d{4}/);
        
        if (yearMatch) {
            const card = entry.querySelector(".card");
            const badge = document.createElement("div");
            badge.className = "year-badge";
            badge.textContent = yearMatch[0];
            card.appendChild(badge);
        }
    });
}

function addFloatingIcons() {
    const iconContainer = document.createElement('div');
    iconContainer.className = 'floating-icons-container';
    document.body.appendChild(iconContainer);

    const retro_icons = ['💾', '💻', '📟', '📼', '🕹️', '📱', '🖥️', '⌨️', '🖲️', '🖨️', '📸', '📺'];

    // More icons on devices
    const isDevicePage = window.location.pathname.includes('/devices/');
    const iconCount = isDevicePage ? 70 : 5; // 

    for (let i = 0; i < iconCount; i++) {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.textContent = retro_icons[Math.floor(Math.random() * retro_icons.length)];
        icon.style.left = `${Math.random() * 100}%`;
        icon.style.top = `${Math.random() * 100}%`;
        icon.style.animationDuration = `${5 + Math.random() * 10}s`;
        icon.style.animationDelay = `${Math.random() * 20}s`;
        icon.style.fontSize = `${Math.random() * 1 + 0.5}rem`;
        icon.style.opacity = `${Math.random() * 0.15 + 0.1}`;
        iconContainer.appendChild(icon);
    }
}

function sortCardsAlphabetically() {
    const container = document.getElementById("entries");
    const entries = Array.from(container.getElementsByClassName("entry"));

    const sortedEntries = entries.sort((a, b) => {
        const titleA = a.querySelector(".card-title a").innerText.toLowerCase();
        const titleB = b.querySelector(".card-title a").innerText.toLowerCase();
        return titleA.localeCompare(titleB);
    });

    sortedEntries.forEach(entry => container.appendChild(entry));
}


function addGlobalFooter() {
    const isDevicePage = window.location.pathname.includes("/devices/");
    if (!isDevicePage) return;

    const footer = document.createElement('footer');
    footer.innerHTML = "© 2025 Classic Computing Vitrine – FH Kärnten";
    document.body.appendChild(footer);
}



function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    document.querySelector("footer")?.classList.toggle("dark-footer");
    document.querySelectorAll(".card").forEach(c => c.classList.toggle("dark-card"));
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

window.addEventListener("DOMContentLoaded", () => {
    // Load Theme Preference
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        document.querySelector("footer")?.classList.add("dark-footer");
        document.querySelectorAll(".card").forEach(c => c.classList.add("dark-card"));
    }
	
	if (window.location.pathname.includes("/devices/")) {
        addGlobalFooter();
    }
	
	if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        sortCardsAlphabetically(); 
    }
	
	document.getElementById("searchInput")?.addEventListener("input", filterEntries);


    // Load Animation
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
        card.style.opacity = 0;
        setTimeout(() => {
            card.style.transition = "opacity 0.6s ease-out";
            card.style.opacity = 1;
        }, 100 * i);
    });

    // These functions should only run once after the cards are processed
    addYearBadges();
    addFloatingIcons();
    addGlobalFooter();
});
