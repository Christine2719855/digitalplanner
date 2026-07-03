/* ---------------------------
   LOAD SAVED DATA
---------------------------- */
let events = [];
let birthdays = [];

function saveData() {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("birthdays", JSON.stringify(birthdays));
}

function loadData() {
    const savedEvents = localStorage.getItem("events");
    const savedBirthdays = localStorage.getItem("birthdays");

    if (savedEvents) events = JSON.parse(savedEvents);
    if (savedBirthdays) birthdays = JSON.parse(savedBirthdays);
}

loadData();

/* Default birthdays */
if (birthdays.length === 0) {
    birthdays = [
        { name: "pearl", month: 8, day: 11 },
        { name: "christine", month: 11, day: 24 }
    ];
    saveData();
}

/* ---------------------------
   CALENDAR SETUP
---------------------------- */
let currentMonth = 0;
let currentYear = 2027;

const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

/* ---------------------------
   APPLY THEME
---------------------------- */
const themes = {
    pastel: {
        "--bg": "#ffeef7",
        "--panel-bg": "#fff7fb",
        "--text": "#000000",
        "--accent": "#ffd2e9",
        "--accent-hover": "#ffb4d8",
        "--day-bg": "#fff7fb",
        "--day-border": "#f3c4dd",
        "--event-birthday": "#ffd6a5",
        "--event-assignment": "#caffbf",
        "--event-exam": "#ffadad",
        "--event-important": "#fdffb6",
        "--event-other": "#e0bbff",
        "--sidebar-bg": "#f8e9f5",
        "--sidebar-text": "#333"
    },
    yellow: {
        "--bg": "#fff9db",
        "--panel-bg": "#fffef3",
        "--text": "#3b3b00",
        "--accent": "#ffe066",
        "--accent-hover": "#ffd43b",
        "--day-bg": "#fff9db",
        "--day-border": "#ffe066",
        "--event-birthday": "#ffd43b",
        "--event-assignment": "#caffbf",
        "--event-exam": "#ffadad",
        "--event-important": "#fdffb6",
        "--event-other": "#ffe6a7",
        "--sidebar-bg": "#fff3bf",
        "--sidebar-text": "#4a3b00"
    },
    pink: {
        "--bg": "#ffe4f0",
        "--panel-bg": "#fff7fb",
        "--text": "#3b1f2b",
        "--accent": "#ff9ecf",
        "--accent-hover": "#ff7ab8",
        "--day-bg": "#ffe4f0",
        "--day-border": "#ff9ecf",
        "--event-birthday": "#ffd6e0",
        "--event-assignment": "#ffcfe6",
        "--event-exam": "#ffadad",
        "--event-important": "#fde2ff",
        "--event-other": "#f3c4dd",
        "--sidebar-bg": "#ffd1e8",
        "--sidebar-text": "#3b1f2b"
    },
    blue: {
        "--bg": "#e3f2fd",
        "--panel-bg": "#f5fbff",
        "--text": "#0d1b2a",
        "--accent": "#64b5f6",
        "--accent-hover": "#42a5f5",
        "--day-bg": "#e3f2fd",
        "--day-border": "#64b5f6",
        "--event-birthday": "#bbdefb",
        "--event-assignment": "#c8e6c9",
        "--event-exam": "#ef9a9a",
        "--event-important": "#fff59d",
        "--event-other": "#b3e5fc",
        "--sidebar-bg": "#bbdefb",
        "--sidebar-text": "#0d1b2a"
    },
    green: {
        "--bg": "#e8f5e9",
        "--panel-bg": "#f1fbf2",
        "--text": "#1b3b1b",
        "--accent": "#81c784",
        "--accent-hover": "#66bb6a",
        "--day-bg": "#e8f5e9",
        "--day-border": "#81c784",
        "--event-birthday": "#c8e6c9",
        "--event-assignment": "#a5d6a7",
        "--event-exam": "#ef9a9a",
        "--event-important": "#fff59d",
        "--event-other": "#b2dfdb",
        "--sidebar-bg": "#c8e6c9",
        "--sidebar-text": "#1b3b1b"
    },
    lightpastel: {
        "--bg": "#ffffff",
        "--panel-bg": "#faf9f6",
        "--text": "#2f2f2f",
        "--accent": "#f5e6c8",
        "--accent-hover": "#f2dcb3",
        "--day-bg": "#ffffff",
        "--day-border": "#f0e6d8",
        "--event-birthday": "#ffe8c7",
        "--event-assignment": "#f7f3e9",
        "--event-exam": "#f9d7d7",
        "--event-important": "#fff4c2",
        "--event-other": "#e8e8e8",
        "--sidebar-bg": "#faf9f6",
        "--sidebar-text": "#2f2f2f"
    },
    dark: {
        "--bg": "#1a1a1a",
        "--panel-bg": "#2a2a2a",
        "--text": "#ffffff",
        "--accent": "#444444",
        "--accent-hover": "#666666",
        "--day-bg": "#2a2a2a",
        "--day-border": "#444444",
        "--event-birthday": "#b56576",
        "--event-assignment": "#6d597a",
        "--event-exam": "#eaac8b",
        "--event-important": "#e56b6f",
        "--event-other": "#355070",
        "--sidebar-bg": "#202020",
        "--sidebar-text": "#f0f0f0"
    },
    darkblue: {
        "--bg": "#0b1120",
        "--panel-bg": "#1e293b",
        "--text": "#e5e7eb",
        "--accent": "#3b82f6",
        "--accent-hover": "#2563eb",
        "--day-bg": "#1e293b",
        "--day-border": "#3b82f6",
        "--event-birthday": "#1d4ed8",
        "--event-assignment": "#22c55e",
        "--event-exam": "#ef4444",
        "--event-important": "#eab308",
        "--event-other": "#0ea5e9",
        "--sidebar-bg": "#020617",
        "--sidebar-text": "#e5e7eb"
    },
    steel: {
        "--bg": "#f3f4f6",
        "--panel-bg": "#ffffff",
        "--text": "#111827",
        "--accent": "#6b7280",
        "--accent-hover": "#4b5563",
        "--day-bg": "#e5e7eb",
        "--day-border": "#9ca3af",
        "--event-birthday": "#9ca3af",
        "--event-assignment": "#6b7280",
        "--event-exam": "#ef4444",
        "--event-important": "#f59e0b",
        "--event-other": "#3b82f6",
        "--sidebar-bg": "#e5e7eb",
        "--sidebar-text": "#111827"
    }
};

function applyTheme(name) {
    const theme = themes[name];
    if (!theme) return;
    for (let key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
    }
}

/* ---------------------------
   FONT + BACKGROUND
---------------------------- */
function applyFontStyle(style) {
    const body = document.body;
    body.classList.remove("font-default","font-cursive","font-modern","font-bold");

    if (style === "cursive") body.classList.add("font-cursive");
    else if (style === "modern") body.classList.add("font-modern");
    else if (style === "bold") body.classList.add("font-bold");
    else body.classList.add("font-default");
}

function applyBackgroundStyle(style) {
    const body = document.body;
    body.classList.remove(
        "bg-solid","bg-gradient","bg-pattern","bg-waves","bg-dots",
        "bg-notebook","bg-glass","bg-grid","bg-diagonal","bg-image"
    );

    if (style === "gradient") body.classList.add("bg-gradient");
    else if (style === "pattern") body.classList.add("bg-pattern");
    else if (style === "waves") body.classList.add("bg-waves");
    else if (style === "dots") body.classList.add("bg-dots");
    else if (style === "notebook") body.classList.add("bg-notebook");
    else if (style === "glass") body.classList.add("bg-glass");
    else if (style === "grid") body.classList.add("bg-grid");
    else if (style === "diagonal") body.classList.add("bg-diagonal");
    else if (style === "image") body.classList.add("bg-image");
    else body.classList.add("bg-solid");
}

/* ---------------------------
   CALENDAR GENERATION
---------------------------- */
function generateCalendar(month, year) {
    const grid = document.getElementById("calendar-grid");
    const title = document.getElementById("month-title");

    grid.innerHTML = "";
    title.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarStyle = document.getElementById("calendar-style").value;
    const iconsMode = document.getElementById("event-icons").value;

    /* Empty boxes */
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day";
        empty.style.visibility = "hidden";
        grid.appendChild(empty);
    }

    /* Actual days */
    for (let day = 1; day <= daysInMonth; day++) {
        const box = document.createElement("div");
        box.className = "day";

        if (calendarStyle === "square") box.classList.add("square");
        if (calendarStyle === "minimal") box.classList.add("minimal");

        const dayNumber = document.createElement("div");
        dayNumber.textContent = day;
        dayNumber.style.fontWeight = "600";
        box.appendChild(dayNumber);

        /* Birthdays */
        birthdays.forEach(b => {
            if (b.month === month && b.day === day) {
                const bDiv = document.createElement("div");
                let label = `${b.name}'s Birthday`;
                if (iconsMode === "on") label = `🎂 ${label}`;
                bDiv.textContent = label;
                bDiv.style.background = "var(--event-birthday)";
                bDiv.style.padding = "3px 5px";
                bDiv.style.marginTop = "5px";
                bDiv.style.borderRadius = "6px";
                box.appendChild(bDiv);
            }
        });

        /* Events */
        const eventDate = new Date(year, month, day).toISOString().split("T")[0];

        events.forEach(ev => {
            if (ev.date === eventDate) {
                const evDiv = document.createElement("div");
                let label = ev.title;

                if (iconsMode === "on") {
                    if (ev.category === "Birthday") label = `🎂 ${label}`;
                    else if (ev.category === "Assignment") label = `📚 ${label}`;
                    else if (ev.category === "Exam") label = `✏️ ${label}`;
                    else if (ev.category === "Important Date") label = `⭐ ${label}`;
                }

                evDiv.textContent = label;
                evDiv.style.padding = "3px 5px";
                evDiv.style.marginTop = "5px";
                evDiv.style.borderRadius = "6px";

                if (ev.category === "Birthday") evDiv.style.background = "var(--event-birthday)";
                else if (ev.category === "Assignment") evDiv.style.background = "var(--event-assignment)";
                else if (ev.category === "Exam") evDiv.style.background = "var(--event-exam)";
                else if (ev.category === "Important Date") evDiv.style.background = "var(--event-important)";
                else evDiv.style.background = "var(--event-other)";

                box.appendChild(evDiv);
            }
        });

        grid.appendChild(box);
    }

    updateUrgentDot();
}

/* ---------------------------
   SIDEBAR TOGGLE
---------------------------- */
document.getElementById("sidebar-tab").onclick = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
};

/* ---------------------------
   MONTH NAVIGATION
---------------------------- */
document.getElementById("prev-month").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
};

document.getElementById("next-month").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
};

/* ---------------------------
   SAVE EVENT
---------------------------- */
document.getElementById("save-event").onclick = () => {
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    const category = document.getElementById("event-category").value;

    if (!title || !date) {
        alert("Please fill in the title and date.");
        return;
    }

    const parts = date.split("-");
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);

    if (category === "Birthday") {
        birthdays.push({
            name: title,
            month: month,
            day: day
        });
    } else {
        events.push({
            title: title,
            date: date,
            category: category
        });
    }

    saveData();
    generateCalendar(currentMonth, currentYear);
    checkNotifications();
};

/* ---------------------------
   THEME BUTTONS
---------------------------- */
document.querySelectorAll(".theme-btn").forEach(btn => {
    if (btn.id === "urgent-btn") return;
    btn.addEventListener("click", () => {
        const themeName = btn.dataset.theme;
        applyTheme(themeName);
        localStorage.setItem("theme", themeName);
    });
});

/* ---------------------------
   CALENDAR STYLE + ICONS
---------------------------- */
document.getElementById("calendar-style").addEventListener("change", () => {
    const value = document.getElementById("calendar-style").value;
    localStorage.setItem("calendarStyle", value);
    generateCalendar(currentMonth, currentYear);
});

document.getElementById("event-icons").addEventListener("change", () => {
    const value = document.getElementById("event-icons").value;
    localStorage.setItem("eventIcons", value);
    generateCalendar(currentMonth, currentYear);
});

/* ---------------------------
   FONT STYLE
---------------------------- */
document.getElementById("font-style").addEventListener("change", () => {
    const value = document.getElementById("font-style").value;
    localStorage.setItem("fontStyle", value);
    applyFontStyle(value);
});

/* ---------------------------
   BACKGROUND STYLE + IMAGE UPLOAD
---------------------------- */
document.getElementById("background-style").addEventListener("change", () => {
    const value = document.getElementById("background-style").value;
    localStorage.setItem("backgroundStyle", value);

    if (value === "image") {
        document.getElementById("bg-image-upload").click();
    }

    applyBackgroundStyle(value);
});

document.getElementById("bg-image-upload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const url = event.target.result;
        document.body.style.backgroundImage = `url(${url})`;
        localStorage.setItem("backgroundImage", url);
    };
    reader.readAsDataURL(file);
});

/* ---------------------------
   URGENT EVENTS
---------------------------- */
function getUrgentEvents() {
    const today = new Date();
    const urgentList = [];

    birthdays.forEach(b => {
        const eventDate = new Date(currentYear, b.month, b.day);
        const diff = (eventDate - today) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 5) {
            urgentList.push({
                type: "Birthday",
                title: `${b.name}'s Birthday`,
                date: eventDate.toDateString(),
                daysLeft: Math.ceil(diff)
            });
        }
    });

    events.forEach(ev => {
        const eventDate = new Date(ev.date);
        const diff = (eventDate - today) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 5) {
            urgentList.push({
                type: ev.category,
                title: ev.title,
                date: eventDate.toDateString(),
                daysLeft: Math.ceil(diff)
            });
        }
    });

    urgentList.sort((a, b) => a.daysLeft - b.daysLeft);
    return urgentList;
}

function updateUrgentDot() {
    const urgent = getUrgentEvents();
    const urgentBtn = document.getElementById("urgent-btn");
    const hasCritical = urgent.some(ev => ev.daysLeft <= 2);

        if (hasCritical) urgentBtn.classList.add("red-dot");
    else urgentBtn.classList.remove("red-dot");
}

/* Urgent button popup */
document.getElementById("urgent-btn").onclick = () => {
    const urgent = getUrgentEvents();
    if (urgent.length === 0) {
        alert("No urgent events in the next 5 days.");
        return;
    }

    let message = "Urgent Events (Next 5 Days):\n\n";
    urgent.forEach(ev => {
        message += `${ev.type}: ${ev.title}\nDate: ${ev.date}\nDays Left: ${ev.daysLeft}\n\n`;
    });

    alert(message);
};

/* Notification settings persistence */
function loadNotificationSettings() {
    const saved = localStorage.getItem("notificationSettings");
    let settings = [];
    if (saved) {
        settings = JSON.parse(saved);
    }

    [3,2,1,0].forEach(d => {
        const cb = document.getElementById(`notify-${d}`);
        cb.checked = settings.includes(d);

        cb.addEventListener("change", () => {
            const current = [];
            [3,2,1,0].forEach(x => {
                if (document.getElementById(`notify-${x}`).checked) current.push(x);
            });
            localStorage.setItem("notificationSettings", JSON.stringify(current));
            checkNotifications();
        });
    });

    return settings;
}

/* Notification bar */
let notificationTimeout = null;

function showNotificationBar(text) {
    const bar = document.getElementById("notification-bar");
    const label = document.getElementById("notification-text");

    label.textContent = text;
    bar.style.transform = "translateY(0)";

    if (notificationTimeout) clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
        bar.style.transform = "translateY(-100%)";
    }, 5000);

    const hide = () => {
        bar.style.transform = "translateY(-100%)";
        if (notificationTimeout) clearTimeout(notificationTimeout);
    };

    bar.onclick = hide;
    bar.addEventListener("touchstart", hide);
}

/* Check notifications */
function checkNotifications() {
    const settings = loadNotificationSettings();
    if (!settings || settings.length === 0) return;

    const urgent = getUrgentEvents();

    for (let ev of urgent) {
        const daysLeft = ev.daysLeft;

        if (settings.includes(daysLeft) || (daysLeft === 0 && settings.includes(0))) {
            let msg;

            if (daysLeft === 0) msg = `${ev.title} is today!`;
            else if (daysLeft === 1) msg = `${ev.title} is tomorrow!`;
            else msg = `${ev.title} is in ${daysLeft} days!`;

            showNotificationBar(msg);
            break;
        }
    }
}

/* Reset theme */
document.getElementById("reset-theme").onclick = () => {
    applyTheme("pastel");
    localStorage.setItem("theme", "pastel");
};

/* Initial load */
(function init() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) applyTheme(savedTheme);
    else applyTheme("pastel");

    const savedFont = localStorage.getItem("fontStyle") || "default";
    document.getElementById("font-style").value = savedFont;
    applyFontStyle(savedFont);

    const savedBg = localStorage.getItem("backgroundStyle") || "solid";
    document.getElementById("background-style").value = savedBg;
    applyBackgroundStyle(savedBg);

    const savedImg = localStorage.getItem("backgroundImage");
    if (savedImg) {
        document.body.style.backgroundImage = `url(${savedImg})`;
    }

    const savedCal = localStorage.getItem("calendarStyle") || "rounded";
    document.getElementById("calendar-style").value = savedCal;

    const savedIcons = localStorage.getItem("eventIcons") || "on";
    document.getElementById("event-icons").value = savedIcons;

    loadNotificationSettings();
    generateCalendar(currentMonth, currentYear);
    checkNotifications();
})();
