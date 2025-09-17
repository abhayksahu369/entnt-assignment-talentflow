import { useEffect, useState } from "react"
import CreateJobModal from "../modals/CreateJobModal";
import EditJobModal from "../modals/EditJobModal";


export default function Home() {
    const [jobs, setJobs] = useState([])
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("active");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [sort, setSort] = useState("order_asc");
    const [totalJobs, setTotalJobs] = useState(0);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editJob, setEditJob] = useState();

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
        setJobs((prev) =>{
            let arr= prev.map((job) => job.id === id ? { ...job, status: body.status } : job)
            if(status===''){
                return arr;
            }
            return arr.filter((job)=>job.status===status);

    });
    }

    const fetchJobs = async () => {
        let response = await fetch(`/api/jobs?search=${search}&status=${status}&page=${page}&pageSize${pageSize}=&sort=${sort}&tags=${tags.join(",")}`);
        response = await response.json();
        setJobs(response.jobs);
        setTotalJobs(response.total);
    }


    useEffect(() => {
        fetchJobs();
    }, [search, status, page, sort, tags]);

    return (
        <div>
            {showCreateModal && (
                <CreateJobModal closeModal={() => setShowCreateModal(false)} />
            )}
            {editJob && (
                <EditJobModal job={editJob} closeModal={() => { setEditJob() }} />
            )}
            <h1>Home</h1>
            <button onClick={() => setShowCreateModal(true)}>Add Jobs</button>
            <br/>
            <input
                type="text"
                placeholder="Search jobs"
                value={search}
                onChange={(e) => {setSearch(e.target.value);setPage(1)}}
            />

            <select value={status} onChange={(e) =>{ setStatus(e.target.value);setPage(1)}}>
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
            </select>

            <select value={sort} onChange={(e) => {setSort(e.target.value);setPage(1)}}>
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

            {jobs.map((job) => (
                <div key={job.id}>
                    <h2>{job?.title} | {job?.tags.join(" ")} |
                        <button onClick={() => setEditJob(job)}>Edit</button> |
                        <button onClick={() => handleJobStatus(job.id, job.status)}>{job.status === "active" ? "archive" : "unarchive"}</button>
                    </h2>
                </div>
            ))}

            <button onClick={() => setPage((prev) => prev - 1)} hidden={page === 1}>
                Prev
            </button>
            <span>
                {page}
            </span>
            <button onClick={() => setPage((prev) => (prev < Math.ceil(totalJobs / pageSize) ? prev + 1 : prev))} hidden={page >= Math.ceil(totalJobs / pageSize)} >
                Next
            </button>

        </div>
    )
}
