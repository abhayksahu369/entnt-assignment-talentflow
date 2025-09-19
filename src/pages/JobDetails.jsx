import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import CandidatesView from "../components/CandidatesView";
import AssessmentPreview from "../components/AssessmentPreview";


export default function JobDetails() {
    const { id } = useParams()
    const [job, setJob] = useState({});
    const [candidates, setCandidates] = useState([])
    const [assessment,setAssessment]=useState([])

    useEffect(() => {
        if (id) {
            fetchJob();
        }
        fetchAssessment();

    }, [id])

    const fetchAssessment=async()=>{
        let res = await fetch(`/api/assessments/${id}`);
        res = await res.json()
        console.log(res)
        setAssessment(res.assessment)
    }
    const fetchJob = async () => {
        let res = await fetch(`/api/jobs/${id}`);
        res = await res.json()
        console.log(res)
        setJob(res.job)
        setCandidates(res.candidates)

    }



    return (
        <div>
            <h1>{job.title}</h1>
            <h2>{job.status}</h2>
            <Link to={`/assessmentpreview/${job.id}`}><button >view assement</button></Link>
            <Link to={`/assessmentbuilder/${job.id}`}><button>create assessment</button></Link>
            {job?.tags?.map(tag => (
                <p key={tag}>{tag}</p>
            ))}
            <h2>Candidates applied for {job.title}</h2>
            <CandidatesView allCandidates={candidates}/>

        </div>
    )
}
// id
// :
// "2"
// order
// :
// 2
// slug
// :
// "backend-engineer"
// status
// :
// "active"
// tags
// :
// (2) ['Node.js', 'API']
// title
// :
// "Backend Engineer"