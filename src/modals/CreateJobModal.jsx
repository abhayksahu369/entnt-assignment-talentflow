import { useState } from "react"


export default function CreateJobModal({closeModal}) {
    const [jobData, setJobData] = useState({
        title: "",
        status: "active",
        tags: [],
        order:Date.now()
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
        let res = await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
        });
        res=await res.json();
        setJobData({
        title: "",
        status: "active",
        tags: [],
        order:Date.now()
    })
        
    }
    return (
        <div>
            <h2>Add Jobs</h2>
            <input placeholder="add job title" value={jobData.title} onChange={(e) => { setJobData((prev) => ({ ...prev, title: e.target.value })) }} />
            <input placeholder="add tags" value={tag} onChange={(e) => setTag(e.target.value)} />
            <button onClick={handleAddTag}>add</button>
            {jobData.tags.map((tag, id) => (
                <span key={id}>
                    {tag}<button onClick={() => handleRemoveTag(tag)}>x</button>
                </span>
            ))}
            <br />
            <button onClick={handleJobSubmit}>Submit</button>
            <button onClick={closeModal}>Close</button>

        </div>
    )
}
