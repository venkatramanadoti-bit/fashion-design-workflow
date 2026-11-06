
// FASHIONFLOW - SIMPLE JAVASCRIPT

// 1. BASIC SETTINGS
function get(id) {
    return document.getElementById(id);
}

let key = "fashionflow_v1";

let db = JSON.parse(localStorage.getItem(key) ||
    '{"projects":[],"favourites":[],"provider":"Gemini","apiKey":"","versions":[]}');

function save() {
    localStorage.setItem(key, JSON.stringify(db));
}

// 2. FABRIC DETAILS
let fabrics = [
    ["Natural Linen", "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=500"],
    ["Soft Cotton", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"],
    ["Classic Texture", "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500"],
    ["Neutral Weave", "https://images.unsplash.com/photo-1520004434532-668416a08753?w=500"],
    ["Stone Grey", "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"],
    ["Soft Blue", "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500"]
];

// 3. CREATE FABRIC CARDS
function fabricCards(list) {
    return list.map(f => `
        <div class="card fabric">
            <img src="${f[1]}" alt="${f[0]}">
            <h3>${f[0]}</h3>
            <p class="muted">Fabric material</p>
            <button class="button light fav" data-name="${f[0]}">
                ${db.favourites.includes(f[0]) ? "♥" : "♡"} Favourite
            </button>
        </div>
    `).join("");
}

// 4. AI SETTINGS
function keyForm() {
    return `
        <label>AI Provider</label>
        <select class="input" id="provider">
            <option ${db.provider === "Gemini" ? "selected" : ""}>Gemini</option>
            <option ${db.provider === "OpenAI" ? "selected" : ""}>OpenAI</option>
        </select>
        <label>API Key</label>
        <input class="input" id="apikey" type="password"
        placeholder="Enter a new key to replace saved key">
    `;
}

// 5. SHOW PAGES
function show(page) {
    db.page = page;
    get("heading").textContent = page[0].toUpperCase() + page.slice(1);
    get("content").dataset.page = page;

    document.querySelectorAll("[data-page]").forEach(b => {
        b.classList.toggle("active", b.dataset.page === page);
    });

    let html = "";

    // DASHBOARD
    if (page === "dashboard") {
        html = `
            <div class="grid">
                <div class="card"><span class="label">TOTAL PROJECTS</span>
                    <div class="stat">${db.projects.length}</div></div>
                <div class="card"><span class="label">FABRIC OPTIONS</span>
                    <div class="stat">${fabrics.length}</div></div>
                <div class="card"><span class="label">AI CONNECTION</span>
                    <div class="stat">${db.apiKey ? "Connected" : "Not connected"}</div></div>
            </div>

            <div class="card section">
                <h2>Welcome to FashionFlow</h2>
                <p class="muted">Create collections, explore fabrics and manage your design approvals in one workspace.</p>
                <button class="button" data-go="projects">Create Project</button>
                <button class="button light" data-go="fabrics">Explore Fabrics</button>
            </div>

            <div class="card section">
                <h2>Connect your AI</h2>
                <p class="muted">Add your Gemini or OpenAI API key.</p>
                ${keyForm()}
                <button class="button" id="savekey">Save API Key</button>
                <button class="button light" id="testkey">Test Connection</button>
                <p class="muted" id="result">${db.apiKey ? "Key saved in this browser." : "No API key connected."}</p>
            </div>

            <h2>Fabric Inspiration</h2>
            <div class="grid">${fabricCards(fabrics.slice(0, 3))}</div>
        `;
    }

    // PROJECTS
    else if (page === "projects") {
        html = `
            <div class="card">
                <h2>Create a project</h2>
                <input class="input" id="projectname" placeholder="Collection name">
                <button class="button" id="addproject">Create Project</button>
            </div>
            <div class="grid section">
                ${db.projects.map((p, i) => `
                    <div class="card">
                        <h3>${p}</h3>
                        <span class="tag">${db.versions[i] || "Draft"}</span>
                    </div>
                `).join("") || '<div class="empty">No projects yet.</div>'}
            </div>
        `;
    }

    // FABRICS
    else if (page === "fabrics") {
        html = `
            <input class="input" id="search" placeholder="Search fabrics...">
            <div class="grid" id="fabricgrid">${fabricCards(fabrics)}</div>
        `;
    }

    // DESIGN WORKSPACE
    else if (page === "workspace") {
        html = `
            <div class="card">
                <h2>Design Workspace</h2>
                <p class="muted">Upload a sketch or design reference.</p>
                <input class="input" type="file" id="sketch" accept="image/*">
                <div id="preview"></div>
                <textarea class="input" id="notes" rows="4"
                placeholder="Write your design notes...">${db.notes || ""}</textarea>
                <button class="button" id="savenotes">Save Notes</button>
                <p class="muted" id="noteResult"></p>
            </div>
        `;
    }

    // APPROVALS
    else if (page === "approvals") {
        html = `
            <div class="card">
                <h2>Approval Center</h2>
                <p class="muted">Manage your design approval stages.</p>
                ${db.projects.map(p => `
                    <p>${p}
                        <select class="input stage" data-project="${p}">
                            ${["Draft", "Submitted for Review", "Under Review",
                            "Revision Requested", "Approved", "Rejected"].map(s =>
                                `<option ${db.approvals?.[p] === s || (!db.approvals?.[p] && s === "Draft") ? "selected" : ""}>${s}</option>`
                            ).join("")}
                        </select>
                    </p>
                `).join("") || "Create a project first."}
            </div>
        `;
    }

    // VERSION HISTORY
    else if (page === "versions") {
        html = `
            <div class="card">
                <h2>Version History</h2>
                <p class="muted">Save a version of your project notes.</p>
                <input class="input" id="versionname" placeholder="Version description">
                <button class="button" id="saveversion">Save Version</button>
                ${db.versions.map(v => `<p class="muted">${v}</p>`).join("")}
            </div>
        `;
    }

    // AI ASSISTANT
    else if (page === "ai") {
        html = `
            <div class="card">
                <h2>AI Fashion Assistant</h2>
                <p class="muted">Ask for outfit ideas, fabric suggestions, colour combinations or collection concepts.</p>
                <div class="chat" id="answer">Your AI suggestions will appear here.</div>
                <textarea class="input" id="prompt" rows="3"
                placeholder="Describe your fashion design idea..."></textarea>
                <button class="button" id="ask">Ask AI</button>
                <button class="button light" data-go="settings">AI Settings</button>
            </div>
        `;
    }

    // AI SETTINGS
    else if (page === "settings") {
        html = `
            <div class="card">
                <h2>AI Connection Settings</h2>
                <p class="muted">Connect your API key to enable AI assistance.</p>
                ${keyForm()}
                <button class="button" id="savekey">Save API Key</button>
                <button class="button light" id="testkey">Test Connection</button>
                <p class="muted" id="result">${db.apiKey ? "Key saved in this browser." : "No API key connected."}</p>
                <p class="muted">Your key is stored in this browser. Do not use this method for a public production website.</p>
            </div>
        `;
    }

    get("content").innerHTML = html;
}

// 6. CONNECT TO AI
async function requestAI(question) {
    if (!db.apiKey) throw Error("Connect your API key in Settings first.");
    if (!question.trim()) throw Error("Please enter your question.");

    let gemini = db.provider === "Gemini";

    let url = gemini
        ? "https://generativelanguage.googleapis.com/v1beta/interactions"
        : "https://api.openai.com/v1/chat/completions";

    let headers = {"Content-Type": "application/json"};

    if (gemini) headers["x-goog-api-key"] = db.apiKey;
    else headers["Authorization"] = "Bearer " + db.apiKey;

    let body = gemini
        ? {model: "gemini-3.8-flash", input: question}
        : {model: "gpt-4o-mini", messages: [{role: "user", content: question}]};

    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });

    let data = await response.json();

    if (!response.ok) throw Error(data.error?.message || "AI request failed.");

    if (!gemini) return data.choices?.[0]?.message?.content || "No response.";

    return (data.steps || []).flatMap(s => s.content || [])
        .filter(x => x.type === "text")
        .map(x => x.text).join("\n") || "No text response received.";
}

// 7. HANDLE BUTTONS
document.addEventListener("click", async function(e) {
    let b = e.target.closest("button");
    if (!b) return;

    if (b.dataset.page) show(b.dataset.page);
    if (b.dataset.go) show(b.dataset.go);

    // CREATE PROJECT
    if (b.id === "addproject") {
        let name = get("projectname").value.trim();
        if (name) {
            db.projects.push(name);
            db.versions.push("Draft");
            save();
            show("projects");
        }
    }

    // FAVOURITE FABRIC
    if (b.classList.contains("fav")) {
        let name = b.dataset.name;

        if (db.favourites.includes(name)) {
            db.favourites = db.favourites.filter(x => x !== name);
        } else {
            db.favourites.push(name);
        }

        save();
        show(db.page);
    }

    // SAVE OR TEST API KEY
    if (b.id === "savekey" || b.id === "testkey") {
        db.provider = get("provider").value;

        let newKey = get("apikey").value.trim();
        if (newKey) db.apiKey = newKey;

        save();

        let result = get("result");

        if (b.id === "savekey") {
            result.textContent = "API key saved in this browser.";
        } else {
            result.textContent = "Testing connection...";

            try {
                await requestAI("Reply only with OK.");
                result.textContent = "Connected successfully!";
            } catch (err) {
                result.textContent = err.message;
            }
        }
    }

    // ASK AI
    if (b.id === "ask") {
        let answer = get("answer");
        answer.textContent = "Thinking...";

        try {
            answer.textContent = await requestAI(get("prompt").value);
        } catch (err) {
            answer.textContent = err.message;
        }
    }

    // SAVE NOTES
    if (b.id === "savenotes") {
        db.notes = get("notes").value;
        save();
        get("noteResult").textContent = "Notes saved successfully.";
    }

    // SAVE VERSION
    if (b.id === "saveversion") {
        let name = get("versionname").value.trim();

        if (name) {
            db.versions.push("V" + (db.versions.length + 1) + " — " + name);
            save();
            show("versions");
        }
    }
});

// 8. SEARCH FABRICS
document.addEventListener("input", function(e) {
    if (e.target.id === "search") {
        let word = e.target.value.toLowerCase();

        let result = fabrics.filter(f =>
            f[0].toLowerCase().includes(word)
        );

        get("fabricgrid").innerHTML = fabricCards(result);
    }
});

// 9. SAVE APPROVALS AND SHOW SKETCH
document.addEventListener("change", function(e) {
    if (e.target.classList.contains("stage")) {
        db.approvals = db.approvals || {};
        db.approvals[e.target.dataset.project] = e.target.value;
        save();
    }

    if (e.target.id === "sketch" && e.target.files[0]) {
        let reader = new FileReader();

        reader.onload = function() {
            get("preview").innerHTML =
                `<img class="preview" src="${reader.result}" alt="Sketch preview">`;
        };

        reader.readAsDataURL(e.target.files[0]);
    }
});

// 10. OPEN DASHBOARD
show("dashboard");
