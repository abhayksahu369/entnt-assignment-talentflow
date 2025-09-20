import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import AssessmentPreview from "../components/AssessmentPreview";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


export default function AssessmentBuilder() {
    const { jobId } = useParams();
    const navigate=useNavigate();
    const [sections, setSections] = useState(() => {
        const saved = localStorage.getItem(`${jobId}_assessment_sections`);
        return saved ? JSON.parse(saved) : [];
    });

    const [assessmentTitle, setAssessmentTitle] = useState(() => {
        const saved = localStorage.getItem(`${jobId}_assessment_title`);
        return saved || "";
    });
    console.log(sections);

    useEffect(() => {
        localStorage.setItem(`${jobId}_assessment_sections`, JSON.stringify(sections));
    }, [sections]);


    useEffect(() => {
        localStorage.setItem(`${jobId}_assessment_title`, assessmentTitle);
    }, [assessmentTitle]);

    const handleCreateAssessment = async () => {
        if (!assessmentTitle.trim()) {
            toast.warn("Please enter an assessment title");
            return;
        }

        let res = await fetch("/api/assessments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: assessmentTitle,
                sections,
                jobId
            }),
        });
        res = await res.json();
        console.log(res);
        localStorage.removeItem(`${jobId}_assessment_sections`);
        localStorage.removeItem(`${jobId}_assessment_title`);
        setAssessmentTitle("")
        setSections([])
        toast.success("assessment created successfully");
        navigate(`/job/${jobId}`)
    }

    const addSection = () => {
        setSections((prev) => [
            ...prev,
            {
                id: faker.string.uuid(),
                title: `Section ${prev.length + 1}`,
                questions: [],
            },
        ]);
    };

    const addQuestion = (sectionId) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        questions: [
                            ...s.questions,
                            {
                                id: faker.string.uuid(),
                                text: "Question",
                                type: "short-text",
                                required: false,
                                options: [],
                                validation: {},
                                condition: null,
                            },
                        ],
                    }
                    : s
            )
        );
    };


    const updateSectionTitle = (sectionId, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, title: value } : s
            )
        );
    };


    const deleteSection = (sectionId) => {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
    };



    const deleteQuestion = (sectionId, qId) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        questions: s.questions.filter((q) => q.id !== qId),
                    }
                    : s
            )
        );
    };


    const updateQuestion = (sectionId, qId, field, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        questions: s.questions.map((q) =>
                            q.id === qId ? { ...q, [field]: value } : q
                        ),
                    }
                    : s
            )
        );
    };


    const addOption = (sectionId, qId) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        questions: s.questions.map((q) =>
                            q.id === qId
                                ? {
                                    ...q,
                                    options: [
                                        ...q.options,
                                        `Option ${q.options.length + 1}`,
                                    ],
                                }
                                : q
                        ),
                    }
                    : s
            )
        );
    };


    const updateOption = (sectionId, qId, idx, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        questions: s.questions.map((q) =>
                            q.id === qId
                                ? {
                                    ...q,
                                    options: q.options.map((opt, i) =>
                                        i === idx ? value : opt
                                    ),
                                }
                                : q
                        ),
                    }
                    : s
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">Assessment Builder</h1>
                                <p className="mt-1 text-sm text-gray-500">Create and customize assessment forms for candidates</p>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter assessment title..."
                                        value={assessmentTitle}
                                        onChange={(e) => setAssessmentTitle(e.target.value)}
                                        className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="ml-6">
                                <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                    onClick={() => { handleCreateAssessment() }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Create Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-6">
                            {sections.map((section) => (
                                <div key={section.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <input
                                                type="text"
                                                className="text-lg font-semibold text-gray-900 bg-transparent border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 transition-colors duration-200"
                                                value={section.title}
                                                onChange={(e) =>
                                                    updateSectionTitle(section.id, e.target.value)
                                                }
                                                placeholder="Section Title"
                                            />
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                onClick={() => deleteSection(section.id)}
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Section
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {section.questions.map((q) => (
                                                <div
                                                    key={q.id}
                                                    className="p-4 border border-gray-200 rounded-lg bg-blue-50"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter question text..."
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-3"
                                                            value={q.text}
                                                            onChange={(e) =>
                                                                updateQuestion(section.id, q.id, "text", e.target.value)
                                                            }
                                                        />
                                                        <button
                                                            className="inline-flex items-center justify-center w-8 h-8 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                            onClick={() => deleteQuestion(section.id, q.id)}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                                                            <select
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                value={q.type}
                                                                onChange={(e) =>
                                                                    updateQuestion(section.id, q.id, "type", e.target.value)
                                                                }
                                                            >
                                                                <option value="single-choice">Single Choice</option>
                                                                <option value="multi-choice">Multi Choice</option>
                                                                <option value="short-text">Short Text</option>
                                                                <option value="long-text">Long Text</option>
                                                                <option value="numeric">Numeric</option>
                                                                <option value="file">File Upload</option>
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Settings</label>
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={q.required}
                                                                    onChange={(e) =>
                                                                        updateQuestion(
                                                                            section.id,
                                                                            q.id,
                                                                            "required",
                                                                            e.target.checked
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                <label className="ml-2 text-sm text-gray-700">Required</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 space-y-3">
                                                        {q.type === "short-text" || q.type === "long-text" ? (
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Max length"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    value={q.validation.maxLength || ""}
                                                                    onChange={(e) =>
                                                                        updateQuestion(section.id, q.id, "validation", {
                                                                            ...q.validation,
                                                                            maxLength: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        ) : null}

                                                        {q.type === "numeric" ? (
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Value</label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Min"
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        value={q.validation.min || ""}
                                                                        onChange={(e) =>
                                                                            updateQuestion(section.id, q.id, "validation", {
                                                                                ...q.validation,
                                                                                min: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Value</label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Max"
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                        value={q.validation.max || ""}
                                                                        onChange={(e) =>
                                                                            updateQuestion(section.id, q.id, "validation", {
                                                                                ...q.validation,
                                                                                max: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Show only if:</label>
                                                        <div className="space-y-2">
                                                            <select
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                value={q.condition?.questionId || ""}
                                                                onChange={(e) =>
                                                                    updateQuestion(section.id, q.id, "condition", {
                                                                        ...(q.condition || {}),
                                                                        questionId: e.target.value,
                                                                    })
                                                                }
                                                            >
                                                                <option value="">--Select Question--</option>
                                                                {section.questions
                                                                    .filter((otherQ) => otherQ.id !== q.id)
                                                                    .map((otherQ) => (
                                                                        <option key={otherQ.id} value={otherQ.id}>
                                                                            {otherQ.text || otherQ.id}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                            {q.condition?.questionId && (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Value"
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                    value={q.condition.value || ""}
                                                                    onChange={(e) =>
                                                                        updateQuestion(section.id, q.id, "condition", {
                                                                            ...q.condition,
                                                                            value: e.target.value,
                                                                        })
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(q.type === "single-choice" || q.type === "multi-choice") && (
                                                        <div className="mt-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                                            <button
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 mb-3"
                                                                onClick={() => addOption(section.id, q.id)}
                                                            >
                                                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                                Add Option
                                                            </button>
                                                            <div className="space-y-2">
                                                                {q.options.map((opt, idx) => (
                                                                    <div key={idx} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="text"
                                                                            value={opt}
                                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                                            onChange={(e) =>
                                                                                updateOption(section.id, q.id, idx, e.target.value)
                                                                            }
                                                                            placeholder={`Option ${idx + 1}`}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-200">
                                            <button
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                onClick={() => addQuestion(section.id)}
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add Question
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                onClick={addSection}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Section
                            </button>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-6 lg:h-fit">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment Preview</h2>
                            <AssessmentPreview assessmentData={sections} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
