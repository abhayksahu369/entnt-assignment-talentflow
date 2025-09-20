import { createServer, Model, Response } from "miragejs";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

faker.seed(123);

export function makeServer({ environment = "development" } = {}) {
    return createServer({
        environment,
        models: {
            job: Model,
            candidate: Model,
            assessment: Model,
        },

        seeds(server) {
            server.create("job", {
                id: "1",
                title: "Frontend Engineer",
                slug: "frontend-engineer",
                status: "active",
                tags: ["React", "UI"],
                order: 1,
            });

            server.create("job", {
                id: "2",
                title: "Backend Engineer",
                slug: "backend-engineer",
                status: "active",
                tags: ["Node.js", "API"],
                order: 2,
            });

            server.create("job", {
                id: "3",
                title: "Fullstack Developer",
                slug: "fullstack-developer",
                status: "archived",
                tags: ["JavaScript", "MongoDB"],
                order: 3,
            });

            server.create("job", {
                id: "4",
                title: "Data Scientist",
                slug: "data-scientist",
                status: "active",
                tags: ["Python", "ML"],
                order: 4,
            });

            server.create("job", {
                id: "5",
                title: "Machine Learning Engineer",
                slug: "ml-engineer",
                status: "active",
                tags: ["TensorFlow", "AI"],
                order: 5,
            });

            server.create("job", {
                id: "6",
                title: "UI/UX Designer",
                slug: "ui-ux-designer",
                status: "active",
                tags: ["Figma", "UX"],
                order: 6,
            });

            server.create("job", {
                id: "7",
                title: "QA Engineer",
                slug: "qa-engineer",
                status: "active",
                tags: ["Testing", "Automation"],
                order: 7,
            });

            server.create("job", {
                id: "8",
                title: "DevOps Engineer",
                slug: "devops-engineer",
                status: "archived",
                tags: ["AWS", "CI/CD"],
                order: 8,
            });

            server.create("job", {
                id: "9",
                title: "Cloud Architect",
                slug: "cloud-architect",
                status: "active",
                tags: ["Azure", "Infrastructure"],
                order: 9,
            });

            server.create("job", {
                id: "10",
                title: "Product Manager",
                slug: "product-manager",
                status: "active",
                tags: ["Agile", "Scrum"],
                order: 10,
            });

            server.create("job", {
                id: "11",
                title: "Business Analyst",
                slug: "business-analyst",
                status: "active",
                tags: ["Requirements", "SQL"],
                order: 11,
            });

            server.create("job", {
                id: "12",
                title: "Mobile Developer",
                slug: "mobile-developer",
                status: "archived",
                tags: ["Flutter", "React Native"],
                order: 12,
            });

            server.create("job", {
                id: "13",
                title: "Data Engineer",
                slug: "data-engineer",
                status: "active",
                tags: ["ETL", "Big Data"],
                order: 13,
            });

            server.create("job", {
                id: "14",
                title: "Security Engineer",
                slug: "security-engineer",
                status: "active",
                tags: ["Pentest", "CISSP"],
                order: 14,
            });

            server.create("job", {
                id: "15",
                title: "AI Researcher",
                slug: "ai-researcher",
                status: "archived",
                tags: ["Deep Learning", "NLP"],
                order: 15,
            });

            server.create("job", {
                id: "16",
                title: "Systems Engineer",
                slug: "systems-engineer",
                status: "active",
                tags: ["Linux", "Networking"],
                order: 16,
            });

            server.create("job", {
                id: "17",
                title: "Game Developer",
                slug: "game-developer",
                status: "active",
                tags: ["Unity", "C#"],
                order: 17,
            });

            server.create("job", {
                id: "18",
                title: "Blockchain Developer",
                slug: "blockchain-developer",
                status: "active",
                tags: ["Ethereum", "Solidity"],
                order: 18,
            });

            server.create("job", {
                id: "19",
                title: "Technical Writer",
                slug: "technical-writer",
                status: "archived",
                tags: ["Docs", "API Writing"],
                order: 19,
            });

            server.create("job", {
                id: "20",
                title: "Support Engineer",
                slug: "support-engineer",
                status: "active",
                tags: ["Troubleshooting", "Customer"],
                order: 20,
            });

            server.create("job", {
                id: "21",
                title: "Site Reliability Engineer",
                slug: "sre",
                status: "active",
                tags: ["Monitoring", "Kubernetes"],
                order: 21,
            });

            server.create("job", {
                id: "22",
                title: "Solutions Architect",
                slug: "solutions-architect",
                status: "active",
                tags: ["Pre-Sales", "Design"],
                order: 22,
            });

            server.create("job", {
                id: "23",
                title: "Automation Engineer",
                slug: "automation-engineer",
                status: "archived",
                tags: ["Selenium", "Python"],
                order: 23,
            });

            server.create("job", {
                id: "24",
                title: "Data Analyst",
                slug: "data-analyst",
                status: "active",
                tags: ["Excel", "Power BI"],
                order: 24,
            });

            server.create("job", {
                id: "25",
                title: "Technical Lead",
                slug: "technical-lead",
                status: "archived",
                tags: ["Leadership", "System Design"],
                order: 25,
            });

            const jobs = server.schema.jobs.all().models;

            server.create("candidate", {
                id: "1",
                name: "Amit Sharma",
                email: "amit.sharma@example.com",
                stage: "hired",
                jobId: 1,
                timeline: [
                    { stage: "applied", date: "2025-09-01T09:00:00.000Z" },
                    { stage: "screen", date: "2025-09-02T09:00:00.000Z" },
                    { stage: "tech", date: "2025-09-03T09:00:00.000Z" },
                    { stage: "offer", date: "2025-09-04T09:00:00.000Z" },
                    { stage: "hired", date: "2025-09-05T09:00:00.000Z" },
                ],
            });

            server.create("candidate", {
                id: "2",
                name: "Priya Reddy",
                email: "priya.reddy@example.com",
                stage: "rejected",
                jobId: 1,
                timeline: [
                    { stage: "applied", date: "2025-09-01T10:00:00.000Z" },
                    { stage: "screen", date: "2025-09-02T10:00:00.000Z" },
                    { stage: "tech", date: "2025-09-03T10:00:00.000Z" },
                    { stage: "offer", date: "2025-09-04T10:00:00.000Z" },
                    { stage: "rejected", date: "2025-09-05T10:00:00.000Z" },
                ],
            });

            server.create("candidate", {
                id: "3",
                name: "Rohit Verma",
                email: "rohit.verma@example.com",
                stage: "hired",
                jobId: 1,
                timeline: [
                    { stage: "applied", date: "2025-09-01T11:00:00.000Z" },
                    { stage: "screen", date: "2025-09-02T11:00:00.000Z" },
                    { stage: "tech", date: "2025-09-03T11:00:00.000Z" },
                    { stage: "offer", date: "2025-09-04T11:00:00.000Z" },
                    { stage: "hired", date: "2025-09-05T11:00:00.000Z" },
                ],
            });


            for (let i = 0; i < 1000; i++) {
                let randomJob = faker.helpers.arrayElement(jobs);
                const stage = faker.helpers.arrayElement([
                    "applied",
                    "screen",
                    "tech",
                    "offer",
                    "hired",
                    "rejected",
                ]);


                server.create("candidate", {
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    email: faker.internet.email().toLowerCase(),
                    stage: stage,
                    jobId: randomJob.id,
                    timeline: [
                        {
                            stage,
                            date: new Date().toISOString(),
                        },
                    ],
                });
            }

            server.create("assessment", {
                id: faker.string.uuid(),
                jobId: "1",
                title: "Frontend Developer Assessment",
                sections: [
                    {
                        id: "section-1",
                        title: "HTML & CSS",
                        questions: [
                            {
                                id: "q-1",
                                text: "Do inline elements accept width and height properties in CSS?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["Yes", "No"],
                            },
                            {
                                id: "q-2",
                                text: "Explain why inline elements behave this way in CSS.",
                                type: "long-text",
                                required: false,
                                validation: { maxLength: 300 },
                                condition: { questionId: "q-1", value: "No" },
                                options: [],
                            },
                            {
                                id: "q-3",
                                text: "Which tag is used for creating a hyperlink?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["<a>", "<link>", "<href>"],
                            },
                            {
                                id: "q-4",
                                text: "Choose all CSS units",
                                type: "multi-choice",
                                required: false,
                                validation: {},
                                options: ["px", "em", "kg", "%"],
                            },
                            {
                                id: "q-5",
                                text: "Upload a sample HTML file",
                                type: "file",
                                required: false,
                                validation: {},
                                options: [],
                            },
                        ],
                    },
                    {
                        id: "section-2",
                        title: "JavaScript Basics",
                        questions: [
                            {
                                id: "q-6",
                                text: "Is JavaScript single-threaded?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["Yes", "No"],
                            },
                            {
                                id: "q-7",
                                text: "If yes, how does it handle asynchronous tasks like setTimeout?",
                                type: "long-text",
                                required: true,
                                validation: { maxLength: 400 },
                                condition: { questionId: "q-6", value: "Yes" },
                                options: [],
                            },
                            {
                                id: "q-8",
                                text: "What is `this` keyword?",
                                type: "short-text",
                                required: true,
                                validation: {},
                                options: [],
                            },
                            {
                                id: "q-9",
                                text: "Explain event delegation",
                                type: "long-text",
                                required: false,
                                validation: {},
                                condition: { questionId: "q-8", value: "this refers to object" },
                                options: [],
                            },
                            {
                                id: "q-10",
                                text: "Upload a JS file",
                                type: "file",
                                required: false,
                                validation: {},
                                options: [],
                            },
                        ],
                    },
                ],
            });

            server.create("assessment", {
                id: faker.string.uuid(),
                jobId: "2",
                title: "Backend Developer Assessment",
                sections: [
                    {
                        id: "section-1",
                        title: "Databases",
                        questions: [
                            {
                                id: "q-1",
                                text: "What is normalization?",
                                type: "long-text",
                                required: true,
                                validation: { maxLength: 300 },
                                options: [],
                            },
                            {
                                id: "q-2",
                                text: "Choose SQL aggregate functions",
                                type: "multi-choice",
                                required: true,
                                validation: {},
                                options: ["SUM", "COUNT", "AVG", "FILTER"],
                            },
                            {
                                id: "q-3",
                                text: "Write SQL to fetch top 5 employees",
                                type: "short-text",
                                required: true,
                                validation: { maxLength: 100 },
                                options: [],
                            },
                            {
                                id: "q-4",
                                text: "What is an index in DB?",
                                type: "long-text",
                                required: false,
                                validation: {},
                                options: [],
                            },
                            {
                                id: "q-5",
                                text: "Upload a schema design",
                                type: "file",
                                required: false,
                                validation: {},
                                options: [],
                            },
                        ],
                    },
                    {
                        id: "section-2",
                        title: "Node.js",
                        questions: [
                            {
                                id: "q-6",
                                text: "What is Event Loop?",
                                type: "long-text",
                                required: true,
                                validation: { maxLength: 500 },
                                options: [],
                            },
                            {
                                id: "q-7",
                                text: "Which are core Node.js modules?",
                                type: "multi-choice",
                                required: true,
                                validation: {},
                                options: ["fs", "http", "lodash", "path"],
                            },
                            {
                                id: "q-8",
                                text: "Explain middleware in Express.js",
                                type: "long-text",
                                required: false,
                                validation: {},
                                options: [],
                            },
                            {
                                id: "q-9",
                                text: "Upload Express app code",
                                type: "file",
                                required: false,
                                validation: {},
                                options: [],
                            },
                            {
                                id: "q-10",
                                text: "What is difference between require and import?",
                                type: "short-text",
                                required: true,
                                validation: {},
                                options: [],
                            },
                        ],
                    },
                ],
            });

            server.create("assessment", {
                id: faker.string.uuid(),
                jobId: "4",
                title: "Data Scientist Assessment",
                sections: [
                    {
                        id: "section-1",
                        title: "Statistics & Machine Learning",
                        questions: [
                            {
                                id: "q-1",
                                text: "Is correlation the same as causation?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["Yes", "No"],
                            },
                            {
                                id: "q-2",
                                text: "Give an example where correlation does not imply causation.",
                                type: "long-text",
                                required: true,
                                validation: { maxLength: 400 },
                                condition: { questionId: "q-1", value: "No" },
                                options: [],
                            },
                            {
                                id: "q-3",
                                text: "Which algorithm is best suited for classifying emails as spam or not spam?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["Linear Regression", "Logistic Regression", "Naive Bayes"],
                            },
                            {
                                id: "q-4",
                                text: "Choose all supervised learning algorithms:",
                                type: "multi-choice",
                                required: true,
                                validation: {},
                                options: ["Decision Trees", "K-Means", "Random Forest", "Linear Regression"],
                            },
                            {
                                id: "q-5",
                                text: "Upload a confusion matrix plot for a classification model.",
                                type: "file",
                                required: false,
                                validation: {},
                                options: [],
                            },
                        ],
                    },
                    {
                        id: "section-2",
                        title: "Python & Data Handling",
                        questions: [
                            {
                                id: "q-6",
                                text: "What library is commonly used for data manipulation in Python?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["NumPy", "Pandas", "Matplotlib"],
                            },
                            {
                                id: "q-7",
                                text: "Upload a Jupyter Notebook with exploratory data analysis on a dataset of your choice.",
                                type: "file",
                                required: false,
                                validation: {},
                                options: [],
                            },
                            {
                                id: "q-8",
                                text: "Which function is used in Pandas to check for missing values?",
                                type: "short-text",
                                required: true,
                                validation: {},
                                options: [],
                            },
                            {
                                id: "q-9",
                                text: "Is feature scaling always required for decision trees?",
                                type: "single-choice",
                                required: true,
                                validation: {},
                                options: ["Yes", "No"],
                            },
                            {
                                id: "q-10",
                                text: "If not, explain why feature scaling is unnecessary for decision trees.",
                                type: "long-text",
                                required: true,
                                validation: { maxLength: 300 },
                                condition: { questionId: "q-9", value: "No" },
                                options: [],
                            },
                        ],
                    },
                ],
            });




        },


        routes() {
            this.namespace = "api";

            this.timing = 750; //latency

            this.get("/jobs", (schema, request) => {
                let jobs = schema.jobs.all().models;

                const search = request.queryParams.search;
                if (search) {
                    jobs = jobs.filter((job) =>
                        job.title.toLowerCase().includes(search.toLowerCase())
                    );
                }

                const status = request.queryParams.status;
                if (status) {
                    jobs = jobs.filter((job) => job.status === status);
                }

                const sort = request.queryParams.sort || "order_asc"; // default
                const [sortBy, sortOrder] = sort.split("_");

                jobs.sort((a, b) => {
                    let valA, valB;
                    if (sortBy === "name") {
                        valA = a.title.toLowerCase();
                        valB = b.title.toLowerCase();
                    } else if (sortBy === "date") {
                        valA = new Date(a.createdAt);
                        valB = new Date(b.createdAt);
                    } else {
                        valA = a.order;
                        valB = b.order;
                    }

                    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                });

                const tags = request.queryParams.tags;
                console.log(tags);
                if (tags) {
                    const tagList = tags.split(",").map((t) => t.toLowerCase().trim());
                    jobs = jobs.filter((job) =>
                        job.tags.some((tag) => tagList.includes(tag.toLowerCase()))
                    );
                }

                const page = parseInt(request.queryParams.page || 1, 10);
                const pageSize = parseInt(request.queryParams.pageSize || jobs.length, 10);
                const start = (page - 1) * pageSize;
                const paginated = jobs.slice(start, start + pageSize);

                return { jobs: paginated, total: jobs.length };
            });


            this.get("/jobs/:id", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error: failed to create job" });
                }
                const job = schema.jobs.find(request.params.id);
                const candidates = schema.candidates.where({ jobId: request.params.id })
                return { job, candidates: candidates.models }
            });


            this.post("/jobs", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let jobs = schema.jobs.all().models;
                const attrs = JSON.parse(request.requestBody);
                const order = jobs.length + 1;
                const id = faker.string.uuid();
                const slug = attrs.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                return schema.jobs.create({ ...attrs, id, slug, order });
            });


            this.patch("/jobs/:id", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                const job = schema.jobs.find(request.params.id);
                const attrs = JSON.parse(request.requestBody);
                return job.update(attrs);
            });


            this.patch("/jobs/:id/reorder", (schema, request) => {
                if (Math.random() < 0.3) {
                    return new Response(500, {}, { error: "Reorder failed" });
                }
                const { toOrder } = JSON.parse(request.requestBody);
                const job = schema.jobs.find(request.params.id);
                return job.update({ order: toOrder });
            });

            this.get("/candidates", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let candidates = schema.candidates.all().models;
                console.log(candidates)
                const stage = request.queryParams.stage
                if (stage) {
                    candidates = candidates.filter((candidate) => candidate.stage === stage)
                }
                const jobId = request.queryParams.jobId
                console.log(jobId)
                if (jobId) {
                    candidates = candidates.filter((candidate) => candidate.jobId === jobId)
                }
                return { candidates, total: candidates.length };
            });

            this.post("/candidates", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                const attrs = JSON.parse(request.requestBody);
                const id = faker.string.uuid();;
                const timeline = [{ stage: attrs.stage, date: new Date().toISOString() }];
                return schema.candidates.create({ ...attrs, id, timeline });
            });

            this.patch("/candidates/:id", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.1) {
                    return new Response(500, {}, { error: "Server error" });
                }
                const id = request.params.id;
                const attrs = JSON.parse(request.requestBody);
                const candidate = schema.candidates.find(id);
                if (attrs.stage) {
                    candidate.update({ stage: attrs.stage });
                    const timeline = candidate.timeline || [];
                    timeline.push({ stage: attrs.stage, date: new Date().toISOString() });
                    candidate.update({ timeline });
                }
                return candidate;
            });

            this.get("/candidates/:id/timeline", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                const id = request.params.id;
                const candidate = schema.candidates.find(id);
                console.log(candidate);
                return candidate;
            });

            this.get("/assessments", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let assessments = schema.assessments.all().models;
                return { assessments, total: assessments.length };
            });



            this.get("/assessments/:jobId", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let jobId = request.params.jobId;
                return schema.assessments.findBy({ jobId });
            });

            this.post("/assessments", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let attrs = JSON.parse(request.requestBody);

                return schema.assessments.create({
                    id: faker.string.uuid(),
                    ...attrs,
                });
            });


            this.put("/assessments/:jobId", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let jobId = request.params.jobId;
                let attrs = JSON.parse(request.requestBody);

                let assessment = schema.assessments.findBy({ jobId });
                if (assessment) {
                    return assessment.update(attrs);
                } else {
                    return schema.assessments.create({ jobId, ...attrs });
                }
            });


            this.post("/assessments/:jobId/submit", (schema, request) => {
                // Inject error 5–10% of the time
                if (Math.random() < 0.05) {
                    return new Response(500, {}, { error: "Server error" });
                }
                let { jobId, candidateId, responses } = JSON.parse(request.requestBody);
                let key = `responses-${jobId}`;
                let existing = JSON.parse(localStorage.getItem(key) || "[]");

                existing.push({
                    candidateId,
                    responses,
                    timestamp: new Date().toISOString(),
                });

                localStorage.setItem(key, JSON.stringify(existing));

                return {
                    success: true,
                    message: "responses saved locally",
                };
            });

        },
    });
}
