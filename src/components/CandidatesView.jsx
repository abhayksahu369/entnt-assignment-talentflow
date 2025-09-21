import { useEffect, useState, useRef } from "react";
import KanbanBoard from "../components/KanbanBoard";
import CandidatesList from "../components/CandidatesList";
import Loader from "./Loader";

export default function CandidatesView({ allCandidates,jobId }) {
    console.log(jobId)
    const [candidates, setCandidates] = useState(allCandidates);
    const [query, setQuery] = useState("");
    const [stage, setStage] = useState("");
    const [view, setView] = useState("list");
    const [loading, setLoading] = useState(true);

    const fetchCandidates = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/candidates?stage=${stage}&jobId=${jobId}`);
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            setCandidates(data.candidates);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch candidates");
        }finally{
             setLoading(false);
        }
    };
    useEffect(()=>{
        fetchCandidates();
    },[stage,jobId])
    
    useEffect(() => {
        let filtered = allCandidates;
        if (query) {
            filtered = filtered.filter(candidate =>
                candidate.name.toLowerCase().includes(query.toLowerCase())
            );
        }
        setCandidates(filtered);
    }, [ query, allCandidates]);

    if (loading) {
            return (
                <Loader/>
            );
        }

    return (
        <div className="space-y-6">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
                        <div className="flex rounded-md shadow-sm">
                            <button
                                onClick={() => setView("list")}
                                className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${view === "list"
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                List View
                            </button>
                            <button
                                onClick={() => setView("kanban")}
                                className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${view === "kanban"
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                Kanban View
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
                    {query && ` matching "${query}"`}
                    {stage && ` in ${stage} stage`}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {view === "kanban" ? (
                    <div className="p-6">
                        <KanbanBoard candidates={candidates} setCandidates={setCandidates} />
                    </div>
                ) : (
                    <CandidatesList candidates={candidates} />
                )}
            </div>
        </div>
    )
}
