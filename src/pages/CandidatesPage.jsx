import { useEffect, useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import CreateCandidateModal from "../modals/CreateCandidateModal";

export default function CandidatesPage() {
    const [allCandidates, setAllCandidates] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [query, setQuery] = useState("");
    const [stage, setStage] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchCandidates = async () => {
        let res = await fetch(`/api/candidates?search=&stage=${stage}&page=`);
        let data = await res.json();
        console.log(data.candidates);
        setAllCandidates(data.candidates);
        setCandidates(data.candidates)
    };

    useEffect(() => {
        fetchCandidates();
    }, [stage])

    useEffect(() => {
        setCandidates(allCandidates.filter(candidate => candidate.name.toLowerCase().includes(query.toLowerCase())))
    }, [query])


    const parentRef = useRef();

    const rowVirtualizer = useVirtualizer({
        count: candidates.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 20,
        overscan: 5,
    });

    return (
        <>
            {showCreateModal && (
                <CreateCandidateModal closeModal={() => setShowCreateModal(false)} />
            )}
            <h1>All Candidates</h1>
            <button onClick={() => setShowCreateModal(true)}>Add Candidates</button><br/>
            <input placeholder="Search Candidates by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">All</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="tech">tech</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
            </select>
            <div ref={parentRef} style={{ height: "100%", overflow: "auto" }}>
                <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const candidate = candidates[virtualRow.index];
                        return (
                            <div
                                key={candidate.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    height: `${virtualRow.size}px`,
                                }}
                            >
                                {candidate.name} | {candidate.email} | {candidate.stage}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
