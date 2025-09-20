import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AssessmentPreview from "../components/AssessmentPreview";


export default function AssessmentPreviewPage() {
    const { jobId } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAssessment = async () => {
        try {
            let res = await fetch(`/api/assessments/${jobId}`);
            res = await res.json();
            console.log(res);
            setAssessment(res.assessment);
        } catch (error) {
            console.error("Error fetching assessment:", error);
            setAssessment(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchAssessment();
    }, [jobId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900">{assessment?.title || 'Assessment Preview'}</h1>
                        <p className="mt-1 text-sm text-gray-500">Preview the assessment form for candidates</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {assessment ? (
                    <AssessmentPreview assessmentData={assessment?.sections} jobId={jobId} />
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No Assessment Found</h3>
                            <p className="mt-1 text-sm text-gray-500">No assessment has been created for this job yet.</p>
                            <div className="mt-6">
                                <Link to={`/assessmentbuilder/${jobId}`}>
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Build Assessment
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
