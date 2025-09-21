import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CandidatesView from "../components/CandidatesView";
import Loader from "../components/Loader";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [assessment, setAssessment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob();
      fetchAssessment();
    }
  }, [id]);

  const fetchAssessment = async () => {
    try {
      let res = await fetch(`/api/assessments/${id}`);
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();
      setAssessment(data?.assessment);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch assessment. Please try again.");
    }
  };

  const fetchJob = async () => {
    try {
      let res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data = await res.json();
      setJob(data.job);
      setCandidates(data.candidates);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch job. Please try again.");
    }finally{
      setLoading(false)
    }
  };

  if (loading) {
          return (
              <Loader/>
          );
      }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to={`/assessmentpreview/${job.id}`}>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    View Assessment
                  </button>
                </Link>
                <Link to={`/assessmentbuilder/${job.id}`}>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    Create Assessment
                  </button>
                </Link>
              </div>
            </div>

            {job?.tags && job.tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Candidates Applied for {job.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} applied
            </p>
          </div>
          <div className="p-6">
            <CandidatesView allCandidates={candidates} jobId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
