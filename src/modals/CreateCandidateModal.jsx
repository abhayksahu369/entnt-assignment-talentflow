import { useEffect, useState } from "react";


export default function CreateCandidateModal({ closeModal }) {
  const [allJobs,setAllJobs]=useState([]);
  const [candidateData, setCandidateData] = useState({
    name: "",
    email: "",
    stage: "applied",
    jobId: allJobs?.[0]?.id || "", 
  });
  
  
  const fetchAllJobs = async () => {
        let response = await fetch(`/api/jobs?search=&status=&page=&pageSize=&sort=&tags=`);
        response = await response.json();
        setAllJobs(response.jobs);
  }

  useEffect(()=>{
    fetchAllJobs()
  },[])




  const handleCandidateSubmit = async () => {
    let res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(candidateData),
    });
    res = await res.json();
    console.log("candidate added successfully");

    setCandidateData({
      name: "",
      email: "",
      stage: "applied",
      jobId: allJobs?.[0]?.id || "",
    });
  };

  return (
    <div>
      <h2>Add Candidate</h2>
      <input
        placeholder="name"
        value={candidateData.name}
        onChange={(e) =>
          setCandidateData((prev) => ({ ...prev, name: e.target.value }))
        }
      />
      <input
        placeholder="email"
        value={candidateData.email}
        onChange={(e) =>
          setCandidateData((prev) => ({ ...prev, email: e.target.value }))
        }
      />

      <select
        value={candidateData.stage}
        onChange={(e) =>
          setCandidateData((prev) => ({ ...prev, stage: e.target.value }))
        }
      >
        <option value="applied">Applied</option>
        <option value="screen">Screen</option>
        <option value="tech">Tech</option>
        <option value="offer">Offer</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={candidateData.jobId}
        onChange={(e) =>
          setCandidateData((prev) => ({ ...prev, jobId: e.target.value }))
        }
      >
        {allJobs?.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>

      <br />
      <button onClick={handleCandidateSubmit}>Submit</button>
      <button onClick={closeModal}>Close</button>
    </div>
  );
}
