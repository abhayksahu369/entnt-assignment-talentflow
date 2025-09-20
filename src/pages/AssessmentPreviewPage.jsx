import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AssessmentPreview from "../components/AssessmentPreview";


export default function AssessmentPreviewPage() {
    const { jobId } = useParams();
    const [assessment, setAssessment] = useState(null);

    const fetchAssessment = async () => {
        let res = await fetch(`/api/assessments/${jobId}`);
        res = await res.json();
        console.log(res);
        setAssessment(res.assessment);
    };

    useEffect(() => {
        if (jobId) fetchAssessment();
    }, [jobId]);

    if (!assessment) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <h1>{assessment?.title}</h1>
            {assessment ?
                <AssessmentPreview assessmentData={assessment?.sections} /> :
                (
                    <h1> No assessment created for this job</h1>
                )
            }

        </>
    )
}
