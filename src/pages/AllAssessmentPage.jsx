import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function AllAssessmentPage() {
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assessments");
      if (!res.ok) throw new Error("Failed to fetch assessments");
      const data = await res.json();
      setAssessments(data.assessments);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching assessments");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs);
      if (data.jobs.length > 0) setSelectedJobId(data.jobs[0].id);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching jobs");
    }
  };

  useEffect(() => {
    fetchAssessments();
    fetchJobs();
  }, []);

   if (loading) {
          return (
              <Loader/>
          );
      }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">All Assessments</h1>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Select Job:</label>
            <span className="text-xs text-gray-500">
              Choose a job to create a new assessment for
            </span>
          </div>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (!selectedJobId) {
                toast.warn("Please select a job first");
                return;
              }
              navigate(`/assessmentbuilder/${selectedJobId}`);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Create Assessment
          </button>
        </div>
      </div>

      {assessments.length === 0 ? (
        <p className="text-gray-500">No assessments found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assessments.map((assessment) => {
            const job = jobs.find((j) => j.id === assessment.jobId);
            return (
              <div
                key={assessment.id}
                className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
              >
                <h2 className="text-lg font-semibold mb-1">{assessment.title}</h2>
                {job && <p className="text-sm text-gray-500 mb-3">{job.title}</p>}
                <button
                  onClick={() => navigate(`/assessmentpreview/${assessment.jobId}`)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 text-sm"
                >
                  Preview
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
