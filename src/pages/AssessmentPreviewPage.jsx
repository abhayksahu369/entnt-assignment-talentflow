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

    return (
        <>
            <h1>{assessment.title}</h1>
            <AssessmentPreview assessmentData={assessment?.sections} />;
        </>
    )
}
