import { useState } from "react"


export default function EditJobModal({job,closeModal}) {
    const [jobData, setJobData] = useState({
        title: job.title,
        status: job.status,
        tags: job.tags,
        order:job.order
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
        let res = await fetch(`/api/jobs/${job.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
        });
        res=await res.json();
        alert("job edited")
        
    }
    return (
        <div>
            <h2>Edit Job</h2>
            <input placeholder="add job title" value={jobData.title} onChange={(e) => { setJobData((prev) => ({ ...prev, title: e.target.value })) }} />
            <input placeholder="add tags" value={tag} onChange={(e) => setTag(e.target.value)} />
            <button onClick={handleAddTag}>add</button>
            {jobData.tags.map((tag, id) => (
                <span key={id}>
                    {tag}<button onClick={() => handleRemoveTag(tag)}>x</button>
                </span>
            ))}
            <select value={jobData.status} onChange={(e) => { setJobData((prev) => ({ ...prev, status: e.target.value })) }}>
                <option value="active">active</option>
                <option value="archive">archive</option>
            </select>
            <br />
            <button onClick={handleJobSubmit}>Submit</button>
            <button onClick={closeModal}>Close</button>

        </div>
    )
}
