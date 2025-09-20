import { useState } from "react"
import { toast } from "react-toastify";


export default function CreateJobModal({ closeModal, totalJobs }) {
    const [jobData, setJobData] = useState({
        title: "",
        status: "active",
        tags: [],
    })
    const [tag, setTag] = useState("");

    const handleAddTag = () => {
        const value = tag
        if (!value) return;
        if (!jobData.tags.includes(value)) {
            setJobData((prev) => ({ ...prev, tags: [...prev.tags, value] }));
        }
        setTag("");
    }

    const handleRemoveTag = (t) => {
        setJobData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== t) }))
    }

    const handleJobSubmit = async () => {
        if (!jobData.title.trim()) {
            toast.warn("Job title is required.");
            return;
        }

        if (!jobData.tags || jobData.tags.length === 0) {
            toast.warn("At least one tag is required.");
            return;
        }

        try {
            let res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobData),
            });
            res = await res.json();
            console.log("Job added successfully", res);
            toast.success("Job added successfully")
            closeModal();
        } catch (err) {
            console.error("Failed to add job", err);
            toast.error("Failed to add job")
        }

    }
    return (
        <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Add New Job</h3>
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input
                                placeholder="Enter job title..."
                                value={jobData.title}
                                onChange={(e) => { setJobData((prev) => ({ ...prev, title: e.target.value })) }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Add tag..."
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    onClick={handleAddTag}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Add
                                </button>
                            </div>

                            {jobData.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {jobData.tags.map((tag, id) => (
                                        <span key={id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
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
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleJobSubmit}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Create Job
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
