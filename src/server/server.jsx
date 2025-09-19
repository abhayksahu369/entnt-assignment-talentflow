import { createServer, Model, Response } from "miragejs";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

export function makeServer({ environment = "development" } = {}) {
    return createServer({
        environment,
        models: {
            job: Model,
            candidate: Model,
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
        },


        routes() {
            this.namespace = "api";

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
                return schema.jobs.find(request.params.id);
            });


            this.post("/jobs", (schema, request) => {
                let jobs = schema.jobs.all().models;
                const attrs = JSON.parse(request.requestBody);
                const order=jobs.length+1;
                const id = faker.string.uuid();
                const slug = attrs.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                return schema.jobs.create({ ...attrs, id, slug,order });
            });


            this.patch("/jobs/:id", (schema, request) => {
                const job = schema.jobs.find(request.params.id);
                const attrs = JSON.parse(request.requestBody);
                return job.update(attrs);
            });


            this.patch("/jobs/:id/reorder", (schema, request) => {
                if (Math.random() < 0.2) {
                    return new Response(500, {}, { error: "Reorder failed" });
                }
                const { toOrder } = JSON.parse(request.requestBody);
                const job = schema.jobs.find(request.params.id);
                return job.update({ order: toOrder });
            });

            this.get("/candidates", (schema, request) => {
                let candidates = schema.candidates.all().models;
                console.log(candidates)
                const stage = request.queryParams.stage
                if (stage) {
                    candidates = candidates.filter((candidate) => candidate.stage === stage)
                }
                return { candidates, total: candidates.length };
            });

            this.post("/candidates", (schema, request) => {
                const attrs = JSON.parse(request.requestBody);
                const id = faker.string.uuid();;
                const timeline = [{ stage: attrs.stage, date: new Date().toISOString() }];
                return schema.candidates.create({ ...attrs, id, timeline });
            });

            this.patch("/candidates/:id", (schema, request) => {
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
                const id = request.params.id;
                const candidate = schema.candidates.find(id);
                return candidate.timeline || [];
            });

        },
    });
}
