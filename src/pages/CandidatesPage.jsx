import { useEffect, useState } from "react";
import CreateCandidateModal from "../modals/CreateCandidateModal";
import CandidatesView from "../components/CandidatesView";

export default function CandidatesPage() {
    const [allCandidates, setAllCandidates] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchCandidates = async () => {
        let res = await fetch(`/api/candidates?search=&stage=&page=`);
        let data = await res.json();
        console.log(data.candidates);
        setAllCandidates(data.candidates);
    };
    useEffect(()=>{
        fetchCandidates();
    },[])
    
    return (
        <>
            {showCreateModal && (
                <CreateCandidateModal closeModal={() => { setShowCreateModal(false), fetchCandidates() }} />
            )}
            <h1>All Candidates</h1>
            <button onClick={() => setShowCreateModal(true)}>Add Candidates</button><br />
            <CandidatesView allCandidates={allCandidates}/>
        </>
    );
}
