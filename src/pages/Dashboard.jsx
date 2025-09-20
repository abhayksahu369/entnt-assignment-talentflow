import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function HRDashboard() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobsRes = await fetch("/api/jobs");
      const candidatesRes = await fetch("/api/candidates");

      if (!jobsRes.ok || !candidatesRes.ok) throw new Error("Server error");

      const jobsData = await jobsRes.json();
      const candidatesData = await candidatesRes.json();

      setJobs(jobsData.jobs);
      setCandidates(candidatesData.candidates);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const candidateStages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  const stageData = candidateStages.map(stage => ({
    stage,
    count: candidates.filter(c => c.stage === stage).length,
  }));

  const COLORS = ["#60A5FA", "#FBBF24", "#A78BFA", "#22C55E", "#14B8A6", "#F87171"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-blue-800">Total Jobs</h3>
          <p className="text-2xl font-bold">{jobs.length}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-yellow-800">Total Candidates</h3>
          <p className="text-2xl font-bold">{candidates.length}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-purple-800">Hired Candidates</h3>
          <p className="text-2xl font-bold">{candidates.filter(c => c.stage === "hired").length}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-red-800">Rejected Candidates</h3>
          <p className="text-2xl font-bold">{candidates.filter(c => c.stage === "rejected").length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-green-800">Pending Candidates</h3>
          <p className="text-2xl font-bold">
            {candidates.filter(c => !["hired", "rejected"].includes(c.stage)).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Overall Candidate Stages</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stageData} margin={{ top: 5, bottom: 5 }}>
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count">
              {stageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Jobs & Candidates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {candidateStages.map(stage => (
                  <th key={stage} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </th>
                ))}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Candidates</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map(job => {
                const jobCandidates = candidates.filter(c => c.jobId === job.id);
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{job.title}</td>
                    <td className="px-4 py-2">{job.status}</td>
                    {candidateStages.map(stage => (
                      <td key={stage} className="px-4 py-2">
                        {jobCandidates.filter(c => c.stage === stage).length}
                      </td>
                    ))}
                    <td className="px-4 py-2">{jobCandidates.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
