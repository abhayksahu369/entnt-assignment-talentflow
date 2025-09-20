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
import { toast } from "react-toastify";


function JobItem({ job, handleJobStatus, setEditJob }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: job.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-3">
            <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {job?.title}
                    </h2>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {job?.tags?.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditJob(job)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleJobStatus(job.id, job.status)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${job.status === "active"
                                ? "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                                : "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
                                }`}
                        >
                            {job.status === "active" ? "Archive" : "Unarchive"}
                        </button>
                        <Link to={`/job/${job.id}`}>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                View Details
                            </button>
                        </Link>
                    </div>
                </div>

                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    </svg>
                </div>
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
            if (res.job) {
                console.log(res)
                toast.success("Jobs reordered successfully!")
            }
            else if (!res.ok) throw new Error("errorrrr");

        } catch (err) {
            console.error("Rollback needed", err);
            toast.error("Failed to reorder jobs. Changes have been rolled back.")
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
            status: stat === "active" ? "archived" : "active",
        };

        try {
            let res = await fetch(`/api/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
            }

            const data = await res.json();
            console.log(data);

            setJobs((prev) => {
                let arr = prev.map((job) =>
                    job.id === id ? { ...job, status: body.status } : job
                );

                if (status === "") return arr;
                return arr.filter((job) => job.status === status);
            });

            toast.success(`Job status updated to "${body.status}"`);
        } catch (error) {
            console.error("Failed to update job status:", error);
            toast.error("Failed to update job status. Please try again.");
        }
    }

    const handleShowMore = () => {
        if (pageSize < totalJobs) {
            setPageSize((prev) => prev + 10);
        }
    };

    const handleShowLess = () => {
        setPageSize(10);
    };

    const fetchJobs = async () => {
        try {
            let response = await fetch(
                `/api/jobs?search=${search}&status=${status}&page=${page}&pageSize=${pageSize}&sort=${sort}&tags=${tags.join(",")}`
            );
            console.log(response)
            if (!response.ok) {
                throw new Error("Failed to fetch jobs");
            }

            const data = await response.json();
            setJobs(data.jobs);
            setTotalJobs(data.total);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Error fetching jobs. Please try again.");
        }
    }


    useEffect(() => {
        fetchJobs();
    }, [search, status, page, sort, tags, pageSize]);



    return (
        <div className="min-h-screen bg-gray-50">
            {showCreateModal && (
                <CreateJobModal closeModal={() => { setShowCreateModal(false), fetchJobs() }} totalJobs={totalJobs} />
            )}
            {editJob && (
                <EditJobModal job={editJob} closeModal={() => { { setEditJob(), fetchJobs() } }} />
            )}

            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage and organize your job postings</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Add Job
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Jobs</label>
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                value={sort}
                                onChange={(e) => { setSort(e.target.value); setPage(1) }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="order_asc">Order ↑</option>
                                <option value="order_desc">Order ↓</option>
                                <option value="name_asc">Name A–Z</option>
                                <option value="name_desc">Name Z–A</option>
                                <option value="date_asc">Oldest first</option>
                                <option value="date_desc">Newest first</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Add tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    onClick={handleAddTag}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {tags.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Active Tags:</label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {tag}
                                        <button
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Jobs ({totalJobs})</h2>
                    </div>
                    <div className="p-6">
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

                        {jobs.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center gap-3 mt-6">
                    <button
                        onClick={handleShowMore}
                        disabled={pageSize >= totalJobs}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Show More
                    </button>
                    <button
                        onClick={handleShowLess}
                        disabled={pageSize <= 10}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Show Less
                    </button>
                </div>
            </div>
        </div>
    )
}
