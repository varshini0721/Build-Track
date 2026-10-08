/* =========================================================
   BUILDTRACK
   CONSTRUCTION MANAGEMENT SYSTEM
   SUPABASE VERSION
   ========================================================= */


/* =========================================================
   SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL =
    "https://gsujbsryjoyhadoophya.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_e4Xer-gN28dJB5ihV5aGVw_k8xY5er6";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   TRIAL DATA
   ========================================================= */

const trialProjects = [
    {
        name: "Apartment Building",
        location: "Bangalore",
        budget: 2500000,
        progress: 80,
        status: "In Progress",
        start: "2026-01-12",
        deadline: "2026-12-20"
    },
    {
        name: "Shopping Mall",
        location: "Mysore",
        budget: 5000000,
        progress: 60,
        status: "In Progress",
        start: "2026-03-10",
        deadline: "2027-03-10"
    },
    {
        name: "Luxury Villa",
        location: "Bangalore",
        budget: 1800000,
        progress: 40,
        status: "Planning",
        start: "2026-06-01",
        deadline: "2027-01-15"
    }
];


const trialWorkers = [
    {
        name: "Rahul",
        role: "Mason",
        project: "Apartment Building",
        attendance: "Present",
        status: "Active"
    },
    {
        name: "Arun",
        role: "Electrician",
        project: "Shopping Mall",
        attendance: "Present",
        status: "Active"
    },
    {
        name: "Vijay",
        role: "Plumber",
        project: "Luxury Villa",
        attendance: "Absent",
        status: "Off"
    },
    {
        name: "Ravi",
        role: "Carpenter",
        project: "Apartment Building",
        attendance: "Present",
        status: "Active"
    },
    {
        name: "Suresh",
        role: "Painter",
        project: "Shopping Mall",
        attendance: "Present",
        status: "Active"
    },
    {
        name: "Manoj",
        role: "Welder",
        project: "Apartment Building",
        attendance: "Present",
        status: "Active"
    }
];


const trialMaterials = [
    {
        name: "Cement",
        project: "Apartment Building",
        total: 500,
        used: 350,
        unit: "bags"
    },
    {
        name: "Steel",
        project: "Apartment Building",
        total: 10,
        used: 7,
        unit: "tons"
    },
    {
        name: "Bricks",
        project: "Shopping Mall",
        total: 10000,
        used: 7500,
        unit: "pieces"
    },
    {
        name: "Sand",
        project: "Shopping Mall",
        total: 20,
        used: 12,
        unit: "tons"
    },
    {
        name: "Tiles",
        project: "Luxury Villa",
        total: 5000,
        used: 4200,
        unit: "pieces"
    }
];


const trialExpenses = [
    {
        project: "Apartment Building",
        category: "Materials",
        amount: 1200000
    },
    {
        project: "Apartment Building",
        category: "Labour",
        amount: 500000
    },
    {
        project: "Apartment Building",
        category: "Equipment",
        amount: 150000
    },
    {
        project: "Apartment Building",
        category: "Transportation",
        amount: 90000
    },
    {
        project: "Shopping Mall",
        category: "Materials",
        amount: 2200000
    },
    {
        project: "Shopping Mall",
        category: "Labour",
        amount: 1100000
    },
    {
        project: "Shopping Mall",
        category: "Equipment",
        amount: 500000
    },
    {
        project: "Shopping Mall",
        category: "Transportation",
        amount: 200000
    },
    {
        project: "Luxury Villa",
        category: "Materials",
        amount: 500000
    },
    {
        project: "Luxury Villa",
        category: "Labour",
        amount: 250000
    },
    {
        project: "Luxury Villa",
        category: "Equipment",
        amount: 100000
    },
    {
        project: "Luxury Villa",
        category: "Transportation",
        amount: 50000
    }
];


const trialTasks = [
    {
        name: "Foundation Work",
        project: "Apartment Building",
        deadline: "Completed",
        priority: "High",
        completed: true
    },
    {
        name: "Column Construction",
        project: "Apartment Building",
        deadline: "Completed",
        priority: "High",
        completed: true
    },
    {
        name: "Electrical Installation",
        project: "Shopping Mall",
        deadline: "2026-10-10",
        priority: "High",
        completed: false
    },
    {
        name: "Plumbing",
        project: "Luxury Villa",
        deadline: "2026-10-12",
        priority: "Medium",
        completed: false
    },
    {
        name: "Painting",
        project: "Apartment Building",
        deadline: "2026-10-20",
        priority: "Low",
        completed: false
    }
];


/* =========================================================
   APPLICATION DATA
   ========================================================= */

let projects = [];
let workers = [];
let materials = [];
let expenses = [];
let tasks = [];

let selectedProjectId = null;


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function money(amount) {

    return "₹" +
        Number(amount || 0).toLocaleString("en-IN");
}


function dateText(date) {

    if (!date || date === "Completed") {
        return date || "-";
    }

    const d = new Date(date);

    if (isNaN(d)) {
        return date;
    }

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function projectByName(name) {

    return projects.find(function (project) {
        return project.name === name;
    });
}


function spentFor(projectName) {

    return expenses
        .filter(function (expense) {
            return expense.project === projectName;
        })
        .reduce(function (sum, expense) {
            return sum + Number(expense.amount || 0);
        }, 0);
}


function pct(amount, budget) {

    if (!budget) {
        return 0;
    }

    return Math.min(
        100,
        Math.round(
            (Number(amount) / Number(budget)) * 100
        )
    );
}


function formatCompactMoney(amount) {

    amount = Number(amount || 0);

    if (amount >= 10000000) {
        return "₹" +
            (amount / 10000000).toFixed(1) +
            "Cr";
    }

    if (amount >= 100000) {
        return "₹" +
            (amount / 100000).toFixed(1) +
            "L";
    }

    if (amount >= 1000) {
        return "₹" +
            (amount / 1000).toFixed(1) +
            "K";
    }

    return money(amount);
}


function clear(ids) {

    ids.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }

    });
}


/* =========================================================
   SUPABASE LOAD
   ========================================================= */

async function loadDataFromSupabase() {

    try {

        const [
            projectsResult,
            workersResult,
            materialsResult,
            expensesResult,
            tasksResult
        ] = await Promise.all([

            db
                .from("projects")
                .select("*")
                .order("id"),

            db
                .from("workers")
                .select("*")
                .order("id"),

            db
                .from("materials")
                .select("*")
                .order("id"),

            db
                .from("expenses")
                .select("*")
                .order("id"),

            db
                .from("tasks")
                .select("*")
                .order("id")

        ]);


        if (projectsResult.error) {
            throw projectsResult.error;
        }

        if (workersResult.error) {
            throw workersResult.error;
        }

        if (materialsResult.error) {
            throw materialsResult.error;
        }

        if (expensesResult.error) {
            throw expensesResult.error;
        }

        if (tasksResult.error) {
            throw tasksResult.error;
        }


        projects =
            projectsResult.data || [];

        workers =
            workersResult.data || [];

        materials =
            materialsResult.data || [];

        expenses =
            expensesResult.data || [];

        tasks =
            tasksResult.data || [];


        /*
           If the tables are empty, insert the
           original trial data automatically.
        */

        if (projects.length === 0) {

            await seedTrialData();

            return;

        }


        renderEverything();

    } catch (error) {

        console.error(
            "Supabase loading error:",
            error
        );

        alert(
            "Could not connect to Supabase. Check your Project URL, Publishable key, tables and RLS policies."
        );

    }
}


/* =========================================================
   INSERT TRIAL DATA
   ========================================================= */

async function seedTrialData() {

    try {

        const projectInsert =
            await db
                .from("projects")
                .insert(trialProjects)
                .select();


        if (projectInsert.error) {
            throw projectInsert.error;
        }


        const workerInsert =
            await db
                .from("workers")
                .insert(trialWorkers)
                .select();


        if (workerInsert.error) {
            throw workerInsert.error;
        }


        const materialInsert =
            await db
                .from("materials")
                .insert(trialMaterials)
                .select();


        if (materialInsert.error) {
            throw materialInsert.error;
        }


        const expenseInsert =
            await db
                .from("expenses")
                .insert(trialExpenses)
                .select();


        if (expenseInsert.error) {
            throw expenseInsert.error;
        }


        const taskInsert =
            await db
                .from("tasks")
                .insert(trialTasks)
                .select();


        if (taskInsert.error) {
            throw taskInsert.error;
        }


        projects =
            projectInsert.data || [];

        workers =
            workerInsert.data || [];

        materials =
            materialInsert.data || [];

        expenses =
            expenseInsert.data || [];

        tasks =
            taskInsert.data || [];


        renderEverything();


        console.log(
            "Trial data inserted into Supabase."
        );

    } catch (error) {

        console.error(
            "Trial data insertion failed:",
            error
        );

        alert(
            "Supabase connected, but trial data could not be inserted. Check your RLS policies."
        );

    }
}


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(pageId, button) {

    document
        .querySelectorAll(".page")
        .forEach(function (page) {

            page.classList.remove(
                "active-page"
            );

        });


    const page =
        document.getElementById(pageId);

    if (page) {
        page.classList.add(
            "active-page"
        );
    }


    document
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (button) {
        button.classList.add("active");
    }


    const titles = {

        dashboard: [
            "Dashboard",
            "Overview of your construction projects"
        ],

        projects: [
            "Projects",
            "Manage all construction projects"
        ],

        workers: [
            "Workers",
            "Manage workers and assignments"
        ],

        materials: [
            "Materials",
            "Track construction materials"
        ],

        expenses: [
            "Expenses & Budget",
            "View budget breakdown for each project"
        ],

        tasks: [
            "Tasks",
            "Track construction tasks and deadlines"
        ],

        reports: [
            "Reports",
            "Overview of project performance"
        ]

    };


    if (titles[pageId]) {

        const title =
            document.getElementById(
                "pageTitle"
            );

        const subtitle =
            document.getElementById(
                "pageSubtitle"
            );

        if (title) {
            title.textContent =
                titles[pageId][0];
        }

        if (subtitle) {
            subtitle.textContent =
                titles[pageId][1];
        }

    }
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

    const element =
        document.getElementById(id);

    if (element) {
        element.classList.add("show");
    }
}


function closeModal(id) {

    const element =
        document.getElementById(id);

    if (element) {
        element.classList.remove("show");
    }
}


function openProjectModal() {
    openModal("projectModal");
}


function closeProjectModal() {
    closeModal("projectModal");
}


function setProjectInSelect(selectId, projectId) {
    const select = document.getElementById(selectId);
    if (!select || projectId === null || projectId === undefined) return;
    const project = projects.find(function (item) {
        return String(item.id) === String(projectId);
    });
    if (project) select.value = project.name;
}

function openWorkerModal(projectId = null) {
    populateProjectSelect("workerProject");
    setProjectInSelect("workerProject", projectId ?? selectedProjectId);
    openModal("workerModal");
}

function closeWorkerModal() { closeModal("workerModal"); }

function openMaterialModal(projectId = null) {
    populateProjectSelect("materialProject");
    setProjectInSelect("materialProject", projectId ?? selectedProjectId);
    openModal("materialModal");
}

function closeMaterialModal() { closeModal("materialModal"); }

function openTaskModal(projectId = null) {
    populateProjectSelect("taskProject");
    setProjectInSelect("taskProject", projectId ?? selectedProjectId);
    openModal("taskModal");
}

function closeTaskModal() { closeModal("taskModal"); }

function openExpenseModal(projectId = null) {
    populateProjectSelect("expenseProject");
    setProjectInSelect("expenseProject", projectId ?? selectedProjectId);
    openModal("expenseModal");
}

function closeExpenseModal() { closeModal("expenseModal"); }


/* =========================================================
   ADD PROJECT
   ========================================================= */

async function addProject() {

    const name =
        document
            .getElementById("projectName")
            .value
            .trim();

    const location =
        document
            .getElementById("projectLocation")
            .value
            .trim();

    const budget =
        Number(
            document
                .getElementById("projectBudget")
                .value
        );

    const start =
        document
            .getElementById("projectStart")
            .value;

    const deadline =
        document
            .getElementById("projectDeadline")
            .value;


    if (
        !name ||
        !location ||
        budget <= 0 ||
        !start ||
        !deadline
    ) {

        alert(
            "Please fill all project details."
        );

        return;
    }


    if (
        projects.some(function (project) {

            return (
                project.name.toLowerCase() ===
                name.toLowerCase()
            );

        })
    ) {

        alert(
            "Project already exists."
        );

        return;
    }


    const newProject = {

        name: name,
        location: location,
        budget: budget,
        progress: 0,
        status: "Planning",
        start: start,
        deadline: deadline

    };


    const result =
        await db
            .from("projects")
            .insert(newProject)
            .select()
            .single();


    if (result.error) {

        console.error(
            result.error
        );

        alert(
            "Could not add project."
        );

        return;
    }


    projects.push(result.data);


    renderEverything();

    closeProjectModal();


    clear([
        "projectName",
        "projectLocation",
        "projectBudget",
        "projectStart",
        "projectDeadline"
    ]);


    alert(
        "Project added successfully!"
    );
}


/* =========================================================
   PROJECT RENDER
   ========================================================= */

function renderProjects() {

    const container =
        document.getElementById(
            "projectContainer"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    projects.forEach(function (project) {

        const spent =
            spentFor(project.name);

        const remaining =
            Number(project.budget) - spent;

        const budgetUsed =
            pct(
                spent,
                project.budget
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "project-card";


        card.onclick = function () {

            showProjectDetails(
                project.id
            );

        };


        card.innerHTML = `

            <div class="project-top">

                <div>

                    <h3>
                        ${project.name}
                    </h3>

                    <p class="project-location">
                        📍 ${project.location}
                    </p>

                </div>

                <span class="status ${
                    project.status === "In Progress"
                    ? "status-active"
                    : project.status === "Completed"
                    ? "status-completed"
                    : "status-planning"
                }">

                    ${project.status}

                </span>

            </div>


            <div class="project-details">

                <div>

                    <span>
                        Budget
                    </span>

                    <strong>
                        ${money(project.budget)}
                    </strong>

                </div>


                <div>

                    <span>
                        Progress
                    </span>

                    <strong>
                        ${project.progress}%
                    </strong>

                </div>


                <div>

                    <span>
                        Spent
                    </span>

                    <strong>
                        ${money(spent)}
                    </strong>

                </div>


                <div>

                    <span>
                        Deadline
                    </span>

                    <strong>
                        ${dateText(project.deadline)}
                    </strong>

                </div>

            </div>


            <div class="progress-bar">

                <div
                    style="width:${project.progress}%"
                ></div>

            </div>


            <p class="click-project-text">
                Click to view complete project details →
            </p>

        `;


        container.appendChild(card);

    });
}


/* =========================================================
   PROJECT COMPLETE DETAILS
   ========================================================= */

function showProjectDetails(projectId) {

    selectedProjectId = projectId;

    const project =
        projects.find(function (p) {

            return String(p.id) ===
                String(projectId);

        });


    if (!project) {
        return;
    }


    const spent =
        spentFor(project.name);


    const remaining =
        Number(project.budget) - spent;


    const budgetUsed =
        pct(
            spent,
            project.budget
        );


    const projectWorkers =
        workers.filter(function (worker) {

            return (
                worker.project ===
                project.name
            );

        });


    const projectMaterials =
        materials.filter(function (material) {

            return (
                material.project ===
                project.name
            );

        });


    const projectExpenses =
        expenses.filter(function (expense) {

            return (
                expense.project ===
                project.name
            );

        });


    const projectTasks =
        tasks.filter(function (task) {

            return (
                task.project ===
                project.name
            );

        });


    const container =
        document.getElementById(
            "projectContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="project-full-details">

            <button
                class="back-project-btn"
                onclick="selectedProjectId = null; renderProjects()"
            >
                ← Back to Projects
            </button>


            <div class="project-detail-header">

                <div>

                    <h1>
                        ${project.name}
                    </h1>

                    <p>
                        📍 ${project.location}
                    </p>

                </div>


                <span class="status ${
                    project.status === "In Progress"
                    ? "status-active"
                    : project.status === "Completed"
                    ? "status-completed"
                    : "status-planning"
                }">

                    ${project.status}

                </span>

            </div>


            <div class="project-action-bar">
                <button class="primary-btn" onclick="openWorkerModal(${project.id})">👷 Add Worker</button>
                <button class="primary-btn" onclick="openMaterialModal(${project.id})">📦 Add Material</button>
                <button class="primary-btn" onclick="openExpenseModal(${project.id})">💰 Add Expense</button>
                <button class="primary-btn" onclick="openTaskModal(${project.id})">📋 Add Task</button>
                <button class="delete-project-btn" onclick="deleteProject(${project.id})">🗑 Delete Project</button>
            </div>


            <div class="project-info-grid">

                <div class="info-box">

                    <span>
                        Project Location
                    </span>

                    <strong>
                        ${project.location}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Start Date
                    </span>

                    <strong>
                        ${dateText(project.start)}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Deadline
                    </span>

                    <strong>
                        ${dateText(project.deadline)}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Status
                    </span>

                    <strong>
                        ${project.status}
                    </strong>

                </div>

            </div>


            <h2>
                Budget Information
            </h2>


            <div class="project-info-grid">

                <div class="info-box">

                    <span>
                        Total Budget
                    </span>

                    <strong>
                        ${money(project.budget)}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Total Spent
                    </span>

                    <strong>
                        ${money(spent)}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Remaining Budget
                    </span>

                    <strong>
                        ${money(remaining)}
                    </strong>

                </div>


                <div class="info-box">

                    <span>
                        Budget Used
                    </span>

                    <strong>
                        ${budgetUsed}%
                    </strong>

                </div>

            </div>


            <h2>
                Project Progress
            </h2>


            <div class="project-progress-large">

                <div class="progress-info">

                    <span>
                        Overall Progress
                    </span>

                    <strong>
                        ${project.progress}%
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        style="width:${project.progress}%"
                    ></div>

                </div>

            </div>


            <h2>
                Expenses
            </h2>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            projectExpenses.length
                            ? projectExpenses.map(function (expense) {

                                return `

                                    <tr>

                                        <td>
                                            ${expense.category}
                                        </td>

                                        <td>
                                            ${money(
                                                expense.amount
                                            )}
                                        </td>

                                    </tr>

                                `;

                            }).join("")

                            :

                            `
                                <tr>
                                    <td colspan="2">
                                        No expenses recorded
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <h2>
                Workers
            </h2>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Worker</th>
                            <th>Role</th>
                            <th>Attendance</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            projectWorkers.length
                            ? projectWorkers.map(function (worker) {

                                return `

                                    <tr>

                                        <td>
                                            ${worker.name}
                                        </td>

                                        <td>
                                            ${worker.role}
                                        </td>

                                        <td>
                                            ${worker.attendance}
                                        </td>

                                        <td>
                                            ${worker.status}
                                        </td>

                                    </tr>

                                `;

                            }).join("")

                            :

                            `
                                <tr>
                                    <td colspan="4">
                                        No workers assigned
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <h2>
                Materials
            </h2>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Material</th>
                            <th>Total</th>
                            <th>Used</th>
                            <th>Remaining</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            projectMaterials.length
                            ? projectMaterials.map(function (material) {

                                return `

                                    <tr>

                                        <td>
                                            ${material.name}
                                        </td>

                                        <td>
                                            ${material.total}
                                            ${material.unit}
                                        </td>

                                        <td>
                                            ${material.used}
                                            ${material.unit}
                                        </td>

                                        <td>
                                            ${
                                                Number(material.total) -
                                                Number(material.used)
                                            }
                                            ${material.unit}
                                        </td>

                                    </tr>

                                `;

                            }).join("")

                            :

                            `
                                <tr>
                                    <td colspan="4">
                                        No materials recorded
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <h2>
                Tasks
            </h2>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Task</th>
                            <th>Deadline</th>
                            <th>Priority</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            projectTasks.length
                            ? projectTasks.map(function (task) {

                                return `

                                    <tr>

                                        <td>
                                            ${task.name}
                                        </td>

                                        <td>
                                            ${dateText(
                                                task.deadline
                                            )}
                                        </td>

                                        <td>
                                            ${task.priority}
                                        </td>

                                        <td>
                                            ${
                                                task.completed
                                                ? "Completed"
                                                : "Pending"
                                            }
                                        </td>

                                    </tr>

                                `;

                            }).join("")

                            :

                            `
                                <tr>
                                    <td colspan="4">
                                        No tasks recorded
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* =========================================================
   DELETE PROJECT
   ========================================================= */

async function deleteProject(projectId) {
    const project = projects.find(function (item) {
        return String(item.id) === String(projectId);
    });

    if (!project) return;

    if (!confirm(`Delete "${project.name}"? This will also remove its workers, materials, expenses and tasks.`)) return;

    try {
        for (const table of ["workers", "materials", "expenses", "tasks"]) {
            const result = await db.from(table).delete().eq("project", project.name);
            if (result.error) throw result.error;
        }

        const projectResult = await db.from("projects").delete().eq("id", project.id);
        if (projectResult.error) throw projectResult.error;

        projects = projects.filter(function (item) { return String(item.id) !== String(project.id); });
        workers = workers.filter(function (item) { return item.project !== project.name; });
        materials = materials.filter(function (item) { return item.project !== project.name; });
        expenses = expenses.filter(function (item) { return item.project !== project.name; });
        tasks = tasks.filter(function (item) { return item.project !== project.name; });

        selectedProjectId = null;
        renderEverything();
        alert("Project deleted successfully.");
    } catch (error) {
        console.error("Delete project error:", error);
        alert("Could not delete the project. Check Supabase DELETE policies for the tables.");
    }
}


/* =========================================================
   ADD WORKER
   ========================================================= */

async function addWorker() {

    const name =
        document
            .getElementById("workerName")
            .value
            .trim();

    const role =
        document
            .getElementById("workerRole")
            .value
            .trim();

    const project =
        document
            .getElementById("workerProject")
            .value;

    const status =
        document
            .getElementById("workerStatus")
            .value;

    const attendance =
        document
            .getElementById("workerAttendance")
            .value;


    if (!name || !role || !project) {

        alert(
            "Please fill all worker details."
        );

        return;
    }


    const newWorker = {

        name: name,
        role: role,
        project: project,
        status: status,
        attendance: attendance

    };


    const result =
        await db
            .from("workers")
            .insert(newWorker)
            .select()
            .single();


    if (result.error) {

        console.error(result.error);

        alert(
            "Could not add worker."
        );

        return;
    }


    workers.push(result.data);


    renderEverything();

    closeWorkerModal();


    clear([
        "workerName",
        "workerRole"
    ]);


    alert(
        "Worker added successfully!"
    );
}


/* =========================================================
   WORKER RENDER
   ========================================================= */

function renderWorkers(data = workers) {

    const table =
        document.getElementById(
            "workerTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    data.forEach(function (worker) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="worker-name">

                    <div class="worker-avatar">
                        ${worker.name
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <strong>
                        ${worker.name}
                    </strong>

                </div>

            </td>


            <td>
                ${worker.role}
            </td>


            <td>
                ${worker.project}
            </td>


            <td>

                ${
                    worker.attendance === "Present"
                    ? "🟢 Present"
                    : "🔴 Absent"
                }

            </td>


            <td>

                <span class="status ${
                    worker.status === "Active"
                    ? "status-active"
                    : "status-planning"
                }">

                    ${worker.status}

                </span>

            </td>

        `;


        table.appendChild(row);

    });
}


/* =========================================================
   WORKER SEARCH
   ========================================================= */

function searchWorkers() {

    const search =
        document
            .getElementById(
                "workerSearch"
            )
            .value
            .toLowerCase()
            .trim();


    const status =
        document
            .getElementById(
                "workerFilter"
            )
            .value;


    const project =
        document
            .getElementById(
                "workerProjectFilter"
            )
            .value;


    const filtered =
        workers.filter(function (worker) {

            const searchMatch =
                !search ||
                (
                    worker.name +
                    " " +
                    worker.role +
                    " " +
                    worker.project
                )
                    .toLowerCase()
                    .includes(search);


            const statusMatch =
                status === "all" ||
                worker.status === status;


            const projectMatch =
                project === "all" ||
                worker.project === project;


            return (
                searchMatch &&
                statusMatch &&
                projectMatch
            );

        });


    renderWorkers(filtered);
}


/* =========================================================
   ADD MATERIAL
   ========================================================= */

async function addMaterial() {

    const name =
        document
            .getElementById(
                "materialName"
            )
            .value
            .trim();


    const project =
        document
            .getElementById(
                "materialProject"
            )
            .value;


    const total =
        Number(
            document
                .getElementById(
                    "materialQuantity"
                )
                .value
        );


    const used =
        Number(
            document
                .getElementById(
                    "materialUsed"
                )
                .value
        );


    const unit =
        document
            .getElementById(
                "materialUnit"
            )
            .value;


    if (
        !name ||
        !project ||
        total <= 0 ||
        used < 0
    ) {

        alert(
            "Please enter valid material details."
        );

        return;
    }


    if (used > total) {

        alert(
            "Used quantity cannot be greater than total quantity."
        );

        return;
    }


    const newMaterial = {

        name: name,
        project: project,
        total: total,
        used: used,
        unit: unit

    };


    const result =
        await db
            .from("materials")
            .insert(newMaterial)
            .select()
            .single();


    if (result.error) {

        console.error(result.error);

        alert(
            "Could not add material."
        );

        return;
    }


    materials.push(result.data);


    renderEverything();

    closeMaterialModal();


    clear([
        "materialName",
        "materialQuantity",
        "materialUsed"
    ]);


    alert(
        "Material added successfully!"
    );
}


/* =========================================================
   MATERIAL RENDER
   ========================================================= */

function renderMaterials() {

    const table =
        document.getElementById(
            "materialTable"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    materials.forEach(function (material) {

        const remaining =
            Number(material.total) -
            Number(material.used);


        const low =
            remaining <=
            Number(material.total) * 0.20;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${material.name}
            </td>

            <td>
                ${material.project}
            </td>

            <td>
                ${material.total}
                ${material.unit}
            </td>

            <td>
                ${material.used}
                ${material.unit}
            </td>

            <td>
                ${remaining}
                ${material.unit}
            </td>

            <td>

                <span class="status ${
                    low
                    ? "status-planning"
                    : "status-active"
                }">

                    ${
                        low
                        ? "Low Stock"
                        : "Good"
                    }

                </span>

            </td>

        `;


        table.appendChild(row);

    });


    const good =
        materials.filter(function (material) {

            return (
                Number(material.total) -
                Number(material.used)
            ) >
            Number(material.total) * 0.20;

        }).length;


    const low =
        materials.length - good;


    const totalElement =
        document.getElementById(
            "totalMaterials"
        );

    const goodElement =
        document.getElementById(
            "goodMaterials"
        );

    const lowElement =
        document.getElementById(
            "lowMaterials"
        );


    if (totalElement) {
        totalElement.textContent =
            materials.length;
    }

    if (goodElement) {
        goodElement.textContent =
            good;
    }

    if (lowElement) {
        lowElement.textContent =
            low;
    }
}


/* =========================================================
   ADD TASK
   ========================================================= */

async function addTask() {

    const name =
        document
            .getElementById(
                "taskName"
            )
            .value
            .trim();


    const project =
        document
            .getElementById(
                "taskProject"
            )
            .value;


    const deadline =
        document
            .getElementById(
                "taskDeadline"
            )
            .value;


    const priority =
        document
            .getElementById(
                "taskPriority"
            )
            .value;


    if (
        !name ||
        !project ||
        !deadline ||
        !priority
    ) {

        alert(
            "Please fill all task details."
        );

        return;
    }


    const newTask = {

        name: name,
        project: project,
        deadline: deadline,
        priority: priority,
        completed: false

    };


    const result =
        await db
            .from("tasks")
            .insert(newTask)
            .select()
            .single();


    if (result.error) {

        console.error(result.error);

        alert(
            "Could not add task."
        );

        return;
    }


    tasks.push(result.data);


    renderEverything();

    closeTaskModal();


    clear([
        "taskName",
        "taskDeadline"
    ]);


    alert(
        "Task added successfully!"
    );
}


/* =========================================================
   TASK RENDER
   ========================================================= */

function renderTasks() {

    const container =
        document.getElementById(
            "taskList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    tasks.forEach(function (task) {

        const row =
            document.createElement("div");


        row.className =
            "task-row";


        row.innerHTML = `

            <div
                class="task-check ${
                    task.completed
                    ? "completed"
                    : ""
                }"
                onclick="toggleTask(${task.id})"
            >

                ${
                    task.completed
                    ? "✓"
                    : ""
                }

            </div>


            <div class="task-info">

                <strong
                    class="${
                        task.completed
                        ? "task-completed"
                        : ""
                    }"
                >

                    ${task.name}

                </strong>


                <span>

                    ${task.project}

                    •

                    ${
                        task.completed
                        ? "Completed"
                        : dateText(task.deadline)
                    }

                </span>

            </div>


            <span
                class="priority ${
                    task.priority === "High"
                    ? "high"
                    : task.priority === "Medium"
                    ? "medium"
                    : "low-priority"
                }"
            >

                ${task.priority}

            </span>

            <button
                class="task-toggle-btn ${task.completed ? "undo" : "complete"}"
                onclick="toggleTask(${task.id})"
            >
                ${task.completed ? "↩ Undo" : "✓ Complete"}
            </button>

        `;


        container.appendChild(row);

    });
}


/* =========================================================
   TASK TOGGLE
   ========================================================= */

async function toggleTask(taskId) {

    const task =
        tasks.find(function (item) {

            return String(item.id) ===
                String(taskId);

        });


    if (!task) {
        return;
    }


    const newCompleted =
        !task.completed;


    const newDeadline =
        newCompleted
        ? "Completed"
        : (
            task.deadline === "Completed"
            ? new Date()
                .toISOString()
                .split("T")[0]
            : task.deadline
        );


    const result =
        await db
            .from("tasks")
            .update({
                completed: newCompleted,
                deadline: newDeadline
            })
            .eq("id", task.id)
            .select()
            .single();


    if (result.error) {

        console.error(result.error);

        alert(
            "Could not update task."
        );

        return;
    }


    const index =
        tasks.findIndex(function (item) {

            return String(item.id) ===
                String(taskId);

        });


    if (index !== -1) {
        tasks[index] =
            result.data;
    }


    renderEverything();
}


/* =========================================================
   ADD EXPENSE
   ========================================================= */

async function addExpense() {

    const project =
        document
            .getElementById(
                "expenseProject"
            )
            .value;


    const category =
        document
            .getElementById(
                "expenseCategory"
            )
            .value;


    const amount =
        Number(
            document
                .getElementById(
                    "expenseAmount"
                )
                .value
        );


    const projectData =
        projectByName(project);


    if (
        !project ||
        !category ||
        amount <= 0
    ) {

        alert(
            "Please enter valid expense details."
        );

        return;
    }


    const currentSpent =
        spentFor(project);


    if (
        projectData &&
        currentSpent + amount >
        Number(projectData.budget)
    ) {

        const proceed =
            confirm(
                "This expense will exceed the project budget. Continue?"
            );


        if (!proceed) {
            return;
        }
    }


    const newExpense = {

        project: project,
        category: category,
        amount: amount

    };


    const result =
        await db
            .from("expenses")
            .insert(newExpense)
            .select()
            .single();


    if (result.error) {

        console.error(result.error);

        alert(
            "Could not add expense."
        );

        return;
    }


    expenses.push(result.data);


    renderEverything();

    closeExpenseModal();


    clear([
        "expenseAmount"
    ]);


    alert(
        "Expense added successfully!"
    );
}


/* =========================================================
   PROJECT BUDGET
   ========================================================= */

function renderProjectBudget() {

    const select =
        document.getElementById(
            "expenseProjectFilter"
        );


    const box =
        document.getElementById(
            "projectBudgetSection"
        );


    if (!select || !box) {
        return;
    }


    if (
        !select.value &&
        projects.length > 0
    ) {

        select.value =
            projects[0].name;

    }


    const project =
        projectByName(
            select.value
        );


    if (!project) {

        box.innerHTML = "";

        return;
    }


    const categories = {

        Materials: 0,
        Labour: 0,
        Equipment: 0,
        Transportation: 0,
        Other: 0

    };


    expenses
        .filter(function (expense) {

            return (
                expense.project ===
                project.name
            );

        })
        .forEach(function (expense) {

            if (
                categories[
                    expense.category
                ] !== undefined
            ) {

                categories[
                    expense.category
                ] += Number(
                    expense.amount || 0
                );

            } else {

                categories.Other +=
                    Number(
                        expense.amount || 0
                    );

            }

        });


    const spent =
        spentFor(project.name);


    const remaining =
        Number(project.budget) -
        spent;


    const percentage =
        pct(
            spent,
            project.budget
        );


    box.innerHTML = `

        <div class="panel">

            <div class="budget-header">

                <div>

                    <h2>
                        ${project.name}
                    </h2>

                    <p>
                        📍 ${project.location}
                    </p>

                </div>


                <span class="status ${
                    project.status === "In Progress"
                    ? "status-active"
                    : "status-planning"
                }">

                    ${project.status}

                </span>

            </div>


            <div class="stats-grid">

                <div class="stat-card">

                    <div>

                        <p>
                            Total Budget
                        </p>

                        <h2>
                            ${money(project.budget)}
                        </h2>

                    </div>

                </div>


                <div class="stat-card">

                    <div>

                        <p>
                            Total Spent
                        </p>

                        <h2>
                            ${money(spent)}
                        </h2>

                    </div>

                </div>


                <div class="stat-card">

                    <div>

                        <p>
                            Remaining
                        </p>

                        <h2>
                            ${money(remaining)}
                        </h2>

                    </div>

                </div>


                <div class="stat-card">

                    <div>

                        <p>
                            Budget Used
                        </p>

                        <h2>
                            ${percentage}%
                        </h2>

                    </div>

                </div>

            </div>


            <div class="budget-breakdown">

                ${
                    Object.entries(categories)
                        .map(function (
                            [category, value]
                        ) {

                            return `

                                <div class="budget-item">

                                    <div>

                                        <span>
                                            📋 ${category}
                                        </span>

                                        <strong>
                                            ${money(value)}
                                        </strong>

                                    </div>


                                    <div class="budget-track">

                                        <div
                                            style="width:${pct(
                                                value,
                                                project.budget
                                            )}%"
                                        ></div>

                                    </div>

                                </div>

                            `;

                        })
                        .join("")
                }

            </div>

            <div class="expense-list-section">
                <div class="expense-list-header">
                    <div>
                        <h3>Expense List</h3>
                        <p>All expenses recorded for ${project.name}</p>
                    </div>
                    <strong>${money(spent)}</strong>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr><th>Category</th><th>Amount</th></tr>
                        </thead>
                        <tbody>
                            ${
                                expenses.filter(function (expense) {
                                    return expense.project === project.name;
                                }).map(function (expense) {
                                    return `<tr><td>${expense.category}</td><td>${money(expense.amount)}</td></tr>`;
                                }).join("") || `<tr><td colspan="2" class="empty-message">No expenses recorded for this project.</td></tr>`
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    `;
}


/* =========================================================
   REPORTS
   ========================================================= */

function renderReports() {

    const totalProgress =
        projects.length > 0
        ? Math.round(
            projects.reduce(
                function (
                    sum,
                    project
                ) {

                    return (
                        sum +
                        Number(
                            project.progress || 0
                        )
                    );

                },
                0
            ) / projects.length
        )
        : 0;


    const totalBudget =
        projects.reduce(
            function (
                sum,
                project
            ) {

                return (
                    sum +
                    Number(
                        project.budget || 0
                    )
                );

            },
            0
        );


    const totalSpent =
        expenses.reduce(
            function (
                sum,
                expense
            ) {

                return (
                    sum +
                    Number(
                        expense.amount || 0
                    )
                );

            },
            0
        );


    const completion =
        document.getElementById(
            "reportCompletion"
        );


    const budget =
        document.getElementById(
            "reportBudget"
        );


    if (completion) {

        completion.textContent =
            totalProgress + "%";

    }


    if (budget) {

        budget.textContent =
            pct(
                totalSpent,
                totalBudget
            ) + "%";

    }


    const reportProjects =
        document.getElementById(
            "reportProjects"
        );


    if (reportProjects) {

        reportProjects.innerHTML =
            projects
                .map(function (project) {

                    return `

                        <div class="report-project">

                            <div class="progress-info">

                                <div>

                                    <strong>
                                        ${project.name}
                                    </strong>

                                    <span>
                                        ${project.location}
                                    </span>

                                </div>


                                <strong>
                                    ${project.progress}%
                                </strong>

                            </div>


                            <div class="progress-bar">

                                <div
                                    style="width:${project.progress}%"
                                ></div>

                            </div>

                        </div>

                    `;

                })
                .join("");

    }


    populateProjectSelect(
        "reportProjectFilter",
        true
    );


    const select =
        document.getElementById(
            "reportProjectFilter"
        );


    if (
        select &&
        !select.value &&
        projects.length > 0
    ) {

        select.value =
            String(projects[0].id);

    }


    if (select && select.value) {

        renderSelectedProjectDetails(
            select.value
        );

    }
}


/* =========================================================
   SELECTED REPORT PROJECT DETAILS
   ========================================================= */

function renderSelectedProjectDetails(
    projectId
) {

    const container =
        document.getElementById(
            "selectedReportProjectDetails"
        );


    if (!container) {
        return;
    }


    const project =
        projects.find(function (p) {

            return (
                String(p.id) ===
                String(projectId)
            );

        });


    if (!project) {

        container.innerHTML = "";

        return;
    }


    const spent =
        spentFor(project.name);


    const remaining =
        Number(project.budget) -
        spent;


    const projectExpenses =
        expenses.filter(function (expense) {

            return (
                expense.project ===
                project.name
            );

        });


    const projectWorkers =
        workers.filter(function (worker) {

            return (
                worker.project ===
                project.name
            );

        });


    const projectMaterials =
        materials.filter(function (material) {

            return (
                material.project ===
                project.name
            );

        });


    const projectTasks =
        tasks.filter(function (task) {

            return (
                task.project ===
                project.name
            );

        });


    const expenseRows =
        projectExpenses
            .map(function (expense) {

                return `

                    <tr>

                        <td>
                            ${expense.category}
                        </td>

                        <td>
                            ${money(
                                expense.amount
                            )}
                        </td>

                    </tr>

                `;

            })
            .join("");


    const workerRows =
        projectWorkers
            .map(function (worker) {

                return `

                    <tr>

                        <td>
                            ${worker.name}
                        </td>

                        <td>
                            ${worker.role}
                        </td>

                        <td>
                            ${worker.attendance}
                        </td>

                        <td>
                            ${worker.status}
                        </td>

                    </tr>

                `;

            })
            .join("");


    const materialRows =
        projectMaterials
            .map(function (material) {

                const remaining =
                    Number(material.total) -
                    Number(material.used);

                return `

                    <tr>

                        <td>
                            ${material.name}
                        </td>

                        <td>
                            ${material.total}
                            ${material.unit}
                        </td>

                        <td>
                            ${material.used}
                            ${material.unit}
                        </td>

                        <td>
                            ${remaining}
                            ${material.unit}
                        </td>

                    </tr>

                `;

            })
            .join("");


    const taskRows =
        projectTasks
            .map(function (task) {

                return `

                    <tr>

                        <td>
                            ${task.name}
                        </td>

                        <td>
                            ${dateText(
                                task.deadline
                            )}
                        </td>

                        <td>
                            ${task.priority}
                        </td>

                        <td>
                            ${
                                task.completed
                                ? "Completed"
                                : "Pending"
                            }
                        </td>

                    </tr>

                `;

            })
            .join("");


    container.innerHTML = `

        <div class="panel selected-project-report">

            <div class="budget-header">

                <div>

                    <h2>
                        ${project.name}
                    </h2>

                    <p>
                        📍 ${project.location}
                    </p>

                </div>


                <span class="status ${
                    project.status === "In Progress"
                    ? "status-active"
                    : project.status === "Completed"
                    ? "status-completed"
                    : "status-planning"
                }">

                    ${project.status}

                </span>

            </div>


            <div class="stats-grid">

                <div class="stat-card">

                    <p>
                        Total Budget
                    </p>

                    <h2>
                        ${money(project.budget)}
                    </h2>

                </div>


                <div class="stat-card">

                    <p>
                        Total Spent
                    </p>

                    <h2>
                        ${money(spent)}
                    </h2>

                </div>


                <div class="stat-card">

                    <p>
                        Remaining
                    </p>

                    <h2>
                        ${money(remaining)}
                    </h2>

                </div>


                <div class="stat-card">

                    <p>
                        Progress
                    </p>

                    <h2>
                        ${project.progress}%
                    </h2>

                </div>

            </div>


            <div class="project-full-details">

                <p>
                    <strong>Location:</strong>
                    ${project.location}
                </p>

                <p>
                    <strong>Start Date:</strong>
                    ${dateText(project.start)}
                </p>

                <p>
                    <strong>Deadline:</strong>
                    ${dateText(project.deadline)}
                </p>

                <p>
                    <strong>Budget Used:</strong>
                    ${pct(
                        spent,
                        project.budget
                    )}%
                </p>

            </div>


            <h3>
                Expenses
            </h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            expenseRows ||
                            `
                                <tr>
                                    <td colspan="2">
                                        No expenses
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <h3>
                Workers
            </h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Name</th>
                            <th>Role</th>
                            <th>Attendance</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            workerRows ||
                            `
                                <tr>
                                    <td colspan="4">
                                        No workers
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <h3>
                Materials
            </h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Material</th>
                            <th>Total</th>
                            <th>Used</th>
                            <th>Remaining</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            materialRows ||
                            `
                                <tr>
                                    <td colspan="4">
                                        No materials
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>


            <h3>
                Tasks
            </h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Task</th>
                            <th>Deadline</th>
                            <th>Priority</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${
                            taskRows ||
                            `
                                <tr>
                                    <td colspan="4">
                                        No tasks
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;
}


/* =========================================================
   PRINT REPORT
   ========================================================= */

function printReport() {

    const overlay =
        document.createElement("div");


    overlay.className =
        "print-selector-overlay";


    overlay.innerHTML = `

        <div class="print-selector-box">

            <h2>
                Print Project Report
            </h2>


            <p>
                Select one or more projects.
            </p>


            <div class="print-project-list">

                <label>

                    <input
                        type="checkbox"
                        id="printAllProjects"
                        checked
                        onchange="togglePrintAll(this)"
                    >

                    All Projects

                </label>


                ${
                    projects
                        .map(function (project) {

                            return `

                                <label>

                                    <input
                                        type="checkbox"
                                        class="print-project-check"
                                        value="${project.id}"
                                        checked
                                    >

                                    ${project.name}

                                </label>

                            `;

                        })
                        .join("")
                }

            </div>


            <div class="print-selector-buttons">

                <button
                    type="button"
                    onclick="closePrintSelector()"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    onclick="confirmPrintReport()"
                >
                    Print Selected
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );
}


function togglePrintAll(all) {

    document
        .querySelectorAll(
            ".print-project-check"
        )
        .forEach(function (checkbox) {

            checkbox.checked =
                all.checked;

        });
}


function closePrintSelector() {

    const overlay =
        document.querySelector(
            ".print-selector-overlay"
        );


    if (overlay) {
        overlay.remove();
    }
}


function confirmPrintReport() {

    const selectedIds =
        Array.from(
            document.querySelectorAll(
                ".print-project-check:checked"
            )
        )
        .map(function (checkbox) {

            return checkbox.value;

        });


    if (
        selectedIds.length === 0
    ) {

        alert(
            "Please select at least one project."
        );

        return;
    }


    const selectedProjects =
        projects.filter(function (project) {

            return selectedIds.includes(
                String(project.id)
            );

        });


    closePrintSelector();


    openPrintWindow(
        selectedProjects
    );
}


/* =========================================================
   PRINT WINDOW
   ========================================================= */

function openPrintWindow(
    selectedProjects
) {

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=1000,height=800"
        );


    if (!printWindow) {

        alert(
            "Please allow popups to print the report."
        );

        return;
    }


    let pages = "";


    selectedProjects.forEach(
        function (project) {

            const spent =
                spentFor(project.name);


            const projectExpenses =
                expenses.filter(
                    function (expense) {

                        return (
                            expense.project ===
                            project.name
                        );

                    }
                );


            const projectWorkers =
                workers.filter(
                    function (worker) {

                        return (
                            worker.project ===
                            project.name
                        );

                    }
                );


            const projectMaterials =
                materials.filter(
                    function (material) {

                        return (
                            material.project ===
                            project.name
                        );

                    }
                );


            const projectTasks =
                tasks.filter(
                    function (task) {

                        return (
                            task.project ===
                            project.name
                        );

                    }
                );


            const expenseRows =
                projectExpenses
                    .map(function (expense) {

                        return `

                            <tr>

                                <td>
                                    ${expense.category}
                                </td>

                                <td>
                                    ${money(
                                        expense.amount
                                    )}
                                </td>

                            </tr>

                        `;

                    })
                    .join("");


            const workerRows =
                projectWorkers
                    .map(function (worker) {

                        return `

                            <tr>

                                <td>
                                    ${worker.name}
                                </td>

                                <td>
                                    ${worker.role}
                                </td>

                                <td>
                                    ${worker.attendance}
                                </td>

                                <td>
                                    ${worker.status}
                                </td>

                            </tr>

                        `;

                    })
                    .join("");


            const materialRows =
                projectMaterials
                    .map(function (material) {

                        const remaining =
                            Number(material.total) -
                            Number(material.used);

                        return `

                            <tr>

                                <td>
                                    ${material.name}
                                </td>

                                <td>
                                    ${material.total}
                                    ${material.unit}
                                </td>

                                <td>
                                    ${material.used}
                                    ${material.unit}
                                </td>

                                <td>
                                    ${remaining}
                                    ${material.unit}
                                </td>

                            </tr>

                        `;

                    })
                    .join("");


            const taskRows =
                projectTasks
                    .map(function (task) {

                        return `

                            <tr>

                                <td>
                                    ${task.name}
                                </td>

                                <td>
                                    ${dateText(
                                        task.deadline
                                    )}
                                </td>

                                <td>
                                    ${task.priority}
                                </td>

                                <td>
                                    ${
                                        task.completed
                                        ? "Completed"
                                        : "Pending"
                                    }
                                </td>

                            </tr>

                        `;

                    })
                    .join("");


            pages += `

                <section class="print-page">

                    <h1>
                        BuildTrack
                        Construction Report
                    </h1>


                    <h2>
                        ${project.name}
                    </h2>


                    <p>
                        <strong>
                            Location:
                        </strong>

                        ${project.location}
                    </p>


                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${project.status}
                    </p>


                    <p>
                        <strong>
                            Start Date:
                        </strong>

                        ${dateText(
                            project.start
                        )}
                    </p>


                    <p>
                        <strong>
                            Deadline:
                        </strong>

                        ${dateText(
                            project.deadline
                        )}
                    </p>


                    <h2>
                        Budget Summary
                    </h2>


                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Budget
                                </th>

                                <th>
                                    Spent
                                </th>

                                <th>
                                    Remaining
                                </th>

                                <th>
                                    Used
                                </th>

                                <th>
                                    Progress
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            <tr>

                                <td>
                                    ${money(
                                        project.budget
                                    )}
                                </td>

                                <td>
                                    ${money(spent)}
                                </td>

                                <td>
                                    ${money(
                                        Number(project.budget) -
                                        spent
                                    )}
                                </td>

                                <td>
                                    ${pct(
                                        spent,
                                        project.budget
                                    )}%
                                </td>

                                <td>
                                    ${project.progress}%
                                </td>

                            </tr>

                        </tbody>

                    </table>


                    <h2>
                        Expenses
                    </h2>


                    <table>

                        <thead>

                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>

                        </thead>


                        <tbody>

                            ${
                                expenseRows ||
                                `
                                    <tr>
                                        <td colspan="2">
                                            No expenses
                                        </td>
                                    </tr>
                                `
                            }

                        </tbody>

                    </table>


                    <h2>
                        Workers
                    </h2>


                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>
                                <th>Role</th>
                                <th>Attendance</th>
                                <th>Status</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                workerRows ||
                                `
                                    <tr>
                                        <td colspan="4">
                                            No workers
                                        </td>
                                    </tr>
                                `
                            }

                        </tbody>

                    </table>


                    <h2>
                        Materials
                    </h2>


                    <table>

                        <thead>

                            <tr>

                                <th>Material</th>
                                <th>Total</th>
                                <th>Used</th>
                                <th>Remaining</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                materialRows ||
                                `
                                    <tr>
                                        <td colspan="4">
                                            No materials
                                        </td>
                                    </tr>
                                `
                            }

                        </tbody>

                    </table>


                    <h2>
                        Tasks
                    </h2>


                    <table>

                        <thead>

                            <tr>

                                <th>Task</th>
                                <th>Deadline</th>
                                <th>Priority</th>
                                <th>Status</th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                taskRows ||
                                `
                                    <tr>
                                        <td colspan="4">
                                            No tasks
                                        </td>
                                    </tr>
                                `
                            }

                        </tbody>

                    </table>

                </section>

            `;

        }
    );


    printWindow.document.open();


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                BuildTrack Report
            </title>


            <style>

                * {
                    box-sizing: border-box;
                }


                body {

                    font-family:
                        Arial,
                        sans-serif;

                    margin: 0;

                    padding: 25px;

                    color: #222;

                    background: white;

                }


                .print-page {

                    max-width: 1000px;

                    margin: auto;

                }


                .print-page
                + .print-page {

                    page-break-before:
                        always;

                }


                h1 {

                    text-align:
                        center;

                    margin-bottom:
                        25px;

                }


                h2 {

                    border-bottom:
                        2px solid #222;

                    padding-bottom:
                        7px;

                    margin-top:
                        25px;

                }


                table {

                    width: 100%;

                    border-collapse:
                        collapse;

                    margin:
                        10px 0 25px;

                }


                th,
                td {

                    border:
                        1px solid #999;

                    padding:
                        9px;

                    text-align:
                        left;

                }


                th {

                    background:
                        #f1f1f1;

                }


                @media print {

                    body {

                        padding:
                            10px;

                    }

                }

            </style>

        </head>


        <body>

            ${pages}

        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        function () {

            printWindow.print();

        },
        500
    );
}


/* =========================================================
   PROJECT DROPDOWNS
   ========================================================= */

function populateProjectSelect(
    selectId,
    reportMode = false
) {

    const select =
        document.getElementById(
            selectId
        );


    if (!select) {
        return;
    }


    const oldValue =
        select.value;


    select.innerHTML =
        reportMode
        ? `
            <option value="">
                Select Project
            </option>
          `
        : "";


    projects.forEach(
        function (project) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                reportMode
                ? String(project.id)
                : project.name;


            option.textContent =
                project.name;


            select.appendChild(
                option
            );

        }
    );


    if (
        Array
            .from(select.options)
            .some(function (option) {

                return (
                    option.value ===
                    oldValue
                );

            })
    ) {

        select.value =
            oldValue;

    }
}


/* =========================================================
   UPDATE DROPDOWNS
   ========================================================= */

function updateProjectDropdowns() {

    [
        "workerProject",
        "materialProject",
        "taskProject",
        "expenseProject"
    ]
    .forEach(function (id) {

        populateProjectSelect(id);

    });


    populateProjectSelect(
        "workerProjectFilter"
    );


    const workerFilter =
        document.getElementById(
            "workerProjectFilter"
        );


    if (workerFilter) {

        const currentValue =
            workerFilter.value;


        workerFilter.innerHTML = `

            <option value="all">
                All Projects
            </option>

        `;


        projects.forEach(
            function (project) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    project.name;

                option.textContent =
                    project.name;

                workerFilter.appendChild(
                    option
                );

            }
        );


        workerFilter.value =
            currentValue &&
            Array.from(
                workerFilter.options
            ).some(function (option) {

                return (
                    option.value ===
                    currentValue
                );

            })
            ? currentValue
            : "all";

    }


    populateProjectSelect(
        "expenseProjectFilter"
    );
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    function setValue(
        id,
        value
    ) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent =
                value;
        }
    }


    setValue(
        "totalProjects",
        projects.length
    );


    setValue(
        "activeProjects",
        projects.filter(
            function (project) {

                return (
                    project.status ===
                    "In Progress"
                );

            }
        ).length
    );


    setValue(
        "totalWorkers",
        workers.length
    );


    const totalSpent =
        expenses.reduce(
            function (
                sum,
                expense
            ) {

                return (
                    sum +
                    Number(
                        expense.amount || 0
                    )
                );

            },
            0
        );


    setValue(
        "totalExpenses",
        formatCompactMoney(
            totalSpent
        )
    );


    const dashboardProjects =
        document.getElementById(
            "dashboardProjects"
        );


    if (dashboardProjects) {

        dashboardProjects.innerHTML =
            projects
                .slice(0, 4)
                .map(function (project) {

                    return `

                        <div class="progress-project">

                            <div class="progress-info">

                                <div>

                                    <strong>
                                        ${project.name}
                                    </strong>

                                    <span>
                                        ${project.location}
                                    </span>

                                </div>


                                <strong>
                                    ${project.progress}%
                                </strong>

                            </div>


                            <div class="progress-bar">

                                <div
                                    style="width:${project.progress}%"
                                ></div>

                            </div>

                        </div>

                    `;

                })
                .join("");

    }


    const dashboardTasks =
        document.getElementById(
            "dashboardTasks"
        );


    if (dashboardTasks) {

        const pending =
            tasks
                .filter(function (task) {

                    return !task.completed;

                })
                .slice(0, 4);


        if (pending.length === 0) {

            dashboardTasks.innerHTML = `

                <p class="empty-message">
                    No pending tasks.
                </p>

            `;

        } else {

            dashboardTasks.innerHTML =
                pending
                    .map(function (task) {

                        return `

                            <div class="mini-task">

                                <div class="task-circle orange-circle">
                                    !
                                </div>

                                <div>

                                    <strong>
                                        ${task.name}
                                    </strong>

                                    <span>
                                        ${task.project}
                                    </span>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        }

    }


    const activity =
        document.getElementById(
            "activityList"
        );


    if (activity) {

        activity.innerHTML = `

            <div class="activity">

                <div class="activity-icon">
                    🏗️
                </div>

                <div>

                    <strong>
                        ${projects.length}
                        projects available
                    </strong>

                    <p>
                        Project management data updated
                    </p>

                    <small>
                        Just now
                    </small>

                </div>

            </div>


            <div class="activity">

                <div class="activity-icon">
                    👷
                </div>

                <div>

                    <strong>
                        ${workers.length}
                        workers registered
                    </strong>

                    <p>
                        Worker records updated
                    </p>

                    <small>
                        Recently
                    </small>

                </div>

            </div>


            <div class="activity">

                <div class="activity-icon">
                    📦
                </div>

                <div>

                    <strong>
                        ${materials.length}
                        material records
                    </strong>

                    <p>
                        Construction inventory updated
                    </p>

                    <small>
                        Recently
                    </small>

                </div>

            </div>

        `;

    }
}


/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderEverything() {

    const currentProjectId = selectedProjectId;

    updateProjectDropdowns();
    renderProjects();
    renderWorkers();
    renderMaterials();
    renderTasks();
    renderProjectBudget();
    renderReports();
    updateDashboard();

    if (currentProjectId !== null && projects.some(function (project) {
        return String(project.id) === String(currentProjectId);
    })) {
        showProjectDetails(currentProjectId);
    }
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Connecting to Supabase..."
        );


        await loadDataFromSupabase();


        showPage(
            "dashboard",
            document.querySelector(
                ".menu-item"
            )
        );


        const reportSelect =
            document.getElementById(
                "reportProjectFilter"
            );


        if (reportSelect) {

            reportSelect.addEventListener(
                "change",
                function () {

                    renderSelectedProjectDetails(
                        this.value
                    );

                }
            );

        }

    }
);


/* =========================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
   ========================================================= */

window.addEventListener(
    "click",
    function (event) {

        [
            "projectModal",
            "workerModal",
            "materialModal",
            "taskModal",
            "expenseModal"
        ]
        .forEach(function (id) {

            const modal =
                document.getElementById(id);


            if (
                modal &&
                event.target === modal
            ) {

                modal.classList.remove(
                    "show"
                );

            }

        });

    }
);