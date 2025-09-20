import { useEffect, useState } from "react";
import CreateCandidateModal from "../modals/CreateCandidateModal";
import CandidatesList from "../components/CandidatesList";
import { toast } from "react-toastify";

export default function CandidatesPage() {
    const [allCandidates, setAllCandidates] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [query, setQuery] = useState("");
    const [stage, setStage] = useState("");

    const fetchCandidates = async () => {
        try {
            let res = await fetch(`/api/candidates?search=&stage=&page=`);

            if (!res.ok) {
                throw new Error(`Server responded with status ${res.status}`);
            }

            let data = await res.json();
            console.log(data.candidates);

            setAllCandidates(data.candidates);
            setCandidates(data.candidates);
        } catch (error) {
            console.error("Failed to fetch candidates:", error);
            toast.error("Failed to fetch candidates. Please try again.");
        }
    };
    useEffect(() => {
        fetchCandidates();
    }, [])

    useEffect(() => {
        let filtered = allCandidates;
        if (stage) {
            filtered = filtered.filter(candidate => candidate.stage === stage);
        }

        if (query) {
            filtered = filtered.filter(candidate =>
                candidate.name.toLowerCase().includes(query.toLowerCase())
            );
        }
        setCandidates(filtered);
    }, [stage, query, allCandidates]);

    return (


        <div className="space-y-6">
            {showCreateModal && (
                <CreateCandidateModal closeModal={() => { setShowCreateModal(false), fetchCandidates() }} />
            )}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
                            <p className="mt-1 text-sm text-gray-500">Manage and track candidate applications</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Add Candidate
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search Candidates</label>
                        <input
                            placeholder="Search by name or email..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                            value={stage}
                            onChange={(e) => setStage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Stages</option>
                            <option value="applied">Applied</option>
                            <option value="screen">Screen</option>
                            <option value="tech">Tech</option>
                            <option value="offer">Offer</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
                    {query && ` matching "${query}"`}
                    {stage && ` in ${stage} stage`}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">

                <CandidatesList candidates={candidates} />
            </div>
        </div>
    );
}
