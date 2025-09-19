import { useEffect, useState, useRef } from "react";
import KanbanBoard from "../components/KanbanBoard";
import CandidatesList from "../components/CandidatesList";

export default function CandidatesView({ allCandidates }) {
    const [candidates, setCandidates] = useState(allCandidates);
    const [query, setQuery] = useState("");
    const [stage, setStage] = useState("");
    const [view, setView] = useState("list");


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
        <>
            <input placeholder="Search Candidates by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">All</option>
                <option value="applied">Applied</option>
                <option value="screen">Screen</option>
                <option value="tech">tech</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
            </select>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => setView("list")}>List View</button>
                <button onClick={() => setView("kanban")}>Kanban View</button>
            </div>
            {view === "kanban" ? (
                <KanbanBoard candidates={candidates} setCandidates={setCandidates} />
            ) : (
                <CandidatesList candidates={candidates} />
            )}
        </>
    )
}
