import { useEffect, useState } from "react"
import CreateJobModal from "../modals/CreateJobModal";
import EditJobModal from "../modals/EditJobModal";
import { Link } from "react-router-dom";
import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


function JobItem({ job, handleJobStatus, setEditJob }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: job.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "8px",
        margin: "4px 0",
        background: "#f2f2f2",
        border: "1px solid #ccc",
        borderRadius: "4px",
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div>
                <h2>
                    {job?.title} | {job?.tags?.join(" ")}
                </h2>
                <button onClick={() => setEditJob(job)}>Edit</button>
                <button onClick={() => handleJobStatus(job.id, job.status)}>
                    {job.status === "active" ? "archive" : "unarchive"}
                </button>
            </div>

            <div
                {...attributes}
                {...listeners}
                style={{ cursor: "grab", padding: "0 8px" }}
            >
                ⠿
            </div>
        </div>
    );
}


export default function Home() {
    const [jobs, setJobs] = useState([])
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("active");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState("order_asc");
    const [totalJobs, setTotalJobs] = useState(0);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editJob, setEditJob] = useState();


    const handleDragEnd = async ({ active, over }) => {
        if (!over || active.id === over.id) return;


        const prevJobs = jobs;

        const oldIndex = jobs.findIndex((j) => j.id === active.id);
        const newIndex = jobs.findIndex((j) => j.id === over.id);

        const newJobs = arrayMove(jobs, oldIndex, newIndex).map((job, idx) => ({
            ...job,
            order: idx + 1,
        }));

        setJobs(newJobs);

        try {
            let res = await fetch(`/api/jobs/${active.id}/reorder`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fromOrder: oldIndex + 1, toOrder: newIndex + 1 }),
            });
            res = await res.json();
            console.log(res)
            if (res.job) console.log(res)
            else if (!res.ok) throw new Error("errorrrr");

        } catch (err) {
            console.error("Rollback needed", err);
            setJobs(prevJobs);
        }
    }

    const handleAddTag = () => {
        const tag = tagInput;
        if (!tag) return;
        if (!tags.includes(tag)) {
            setTags((prev) => [...prev, tag]);
            setPage(1);
        }
        setTagInput("");
    };


    const handleRemoveTag = (tag) => {
        setTags((prev) => prev.filter((t) => t !== tag));
        setPage(1);
    };


    const handleJobStatus = async (id, stat) => {
        const body = {
            status: stat === "active" ? "archived" : "active"
        }
        let res = await fetch(`/api/jobs/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        res = await res.json();
        console.log(res);
        setJobs((prev) => {
            let arr = prev.map((job) => job.id === id ? { ...job, status: body.status } : job)
            if (status === '') {
                return arr;
            }
            return arr.filter((job) => job.status === status);

        });
    }

    const handleShowMore = () => {
        if (pageSize < totalJobs) {
            setPageSize((prev) => prev + 10); // fetch more jobs
        }
    };

    const handleShowLess = () => {
        setPageSize(10); // reset to initial size
    };

    const fetchJobs = async () => {
        let response = await fetch(`/api/jobs?search=${search}&status=${status}&page=${page}&pageSize=${pageSize}&sort=${sort}&tags=${tags.join(",")}`);
        response = await response.json();
        setJobs(response.jobs);
        setTotalJobs(response.total);
    }


    useEffect(() => {
        fetchJobs();
    }, [search, status, page, sort, tags,pageSize]);



    return (
        <div>
            {showCreateModal && (
                <CreateJobModal closeModal={() => { setShowCreateModal(false), fetchJobs() }} totalJobs={totalJobs} />
            )}
            {editJob && (
                <EditJobModal job={editJob} closeModal={() => { { setEditJob(), fetchJobs() } }} />
            )}
            <h1>Home</h1>
            <Link to="/candidates"><button>view candidates</button></Link>
            <button onClick={() => setShowCreateModal(true)}>Add Jobs</button>
            <br />
            <input
                type="text"
                placeholder="Search jobs"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />

            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
            </select>

            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
                <option value="order_asc">Order ↑</option>
                <option value="order_desc">Order ↓</option>
                <option value="name_asc">Name A–Z</option>
                <option value="name_desc">Name Z–A</option>
                <option value="date_asc">Oldest first</option>
                <option value="date_desc">Newest first</option>
            </select>


            <div>
                <input
                    type="text"
                    placeholder="Search by tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                />
                <button onClick={handleAddTag}>Add</button>

                <div>
                    {tags.map((tag, i) => (
                        <span key={i}>
                            {tag} <button onClick={() => handleRemoveTag(tag)}>x</button>{" "}
                        </span>
                    ))}
                </div>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={jobs.map((job) => job.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {jobs.map((job) => (
                        <JobItem key={job.id} job={job} handleJobStatus={handleJobStatus} setEditJob={setEditJob} />
                    ))}
                </SortableContext>
            </DndContext>

            <button onClick={handleShowMore} disabled={pageSize >= totalJobs}>
                Show More
            </button>
            <button onClick={handleShowLess} disabled={pageSize <= 10}>
                Show Less
            </button>

        </div>
    )
}
