import { useEffect, useState } from "react";


export default function CreateCandidateModal({ closeModal }) {
  const [allJobs, setAllJobs] = useState([]);
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

  useEffect(() => {
    fetchAllJobs()
  }, [])




  const handleCandidateSubmit = async () => {
    if (!candidateData.name.trim()) {
      alert("Candidate name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!candidateData.email.trim() || !emailRegex.test(candidateData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      let res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateData),
      });
      res = await res.json();
      console.log(res);
      console.log("Candidate added successfully");
      closeModal();
    } catch (err) {
      console.error("Failed to add candidate", err);
      alert("Something went wrong while adding the candidate.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600/80 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Candidate</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                placeholder="Enter candidate name..."
                value={candidateData.name}
                onChange={(e) =>
                  setCandidateData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                placeholder="Enter email address..."
                value={candidateData.email}
                onChange={(e) =>
                  setCandidateData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Stage</label>
              <select
                value={candidateData.stage}
                onChange={(e) =>
                  setCandidateData((prev) => ({ ...prev, stage: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="applied">Applied</option>
                <option value="screen">Screen</option>
                <option value="tech">Tech</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
              <select
                value={candidateData.jobId}
                onChange={(e) =>
                  setCandidateData((prev) => ({ ...prev, jobId: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {allJobs?.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
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
              onClick={handleCandidateSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Add Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
