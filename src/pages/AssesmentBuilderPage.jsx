import { useState } from "react";
import { faker } from "@faker-js/faker";
import AssessmentPreview from "../components/AssessmentPreview";


export default function AssessmentBuilder() {
    const [sections, setSections] = useState([]);
    console.log(sections);

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
                                text: "",
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
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Assessment Builder</h1>

            <button
                className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
                onClick={addSection}
            >
                + Add Section
            </button>

            {sections.map((section) => (
                <div key={section.id} className="border p-3 mb-3 rounded">
                    <div className="flex justify-between items-center">
                        <input
                            type="text"
                            className="border px-2 py-1 font-semibold"
                            value={section.title}
                            onChange={(e) =>
                                updateSectionTitle(section.id, e.target.value)
                            }
                        />
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => deleteSection(section.id)}
                        >
                            Delete Section
                        </button>
                    </div>

                    <button
                        className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                        onClick={() => addQuestion(section.id)}
                    >
                        + Add Question
                    </button>

                    {section.questions.map((q) => (
                        <div
                            key={q.id}
                            className="mt-3 p-2 border rounded bg-gray-50"
                        >
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    placeholder="Enter question text"
                                    className="border px-2 py-1 w-full mb-2"
                                    value={q.text}
                                    onChange={(e) =>
                                        updateQuestion(section.id, q.id, "text", e.target.value)
                                    }
                                />
                                <button
                                    className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                                    onClick={() => deleteQuestion(section.id, q.id)}
                                >
                                    X
                                </button>
                            </div>

                            <select
                                className="border px-2 py-1 mb-2"
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

                            {/* VALIDATIONS */}
                            <div className="mb-2">
                                <label>
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
                                    />{" "}
                                    Required
                                </label>

                                {q.type === "short-text" || q.type === "long-text" ? (
                                    <input
                                        type="number"
                                        placeholder="Max length"
                                        className="border ml-2 px-1 py-0.5"
                                        value={q.validation.maxLength || ""}
                                        onChange={(e) =>
                                            updateQuestion(section.id, q.id, "validation", {
                                                ...q.validation,
                                                maxLength: e.target.value,
                                            })
                                        }
                                    />
                                ) : null}

                                {q.type === "numeric" ? (
                                    <>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="border ml-2 px-1 py-0.5 w-20"
                                            value={q.validation.min || ""}
                                            onChange={(e) =>
                                                updateQuestion(section.id, q.id, "validation", {
                                                    ...q.validation,
                                                    min: e.target.value,
                                                })
                                            }
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="border ml-2 px-1 py-0.5 w-20"
                                            value={q.validation.max || ""}
                                            onChange={(e) =>
                                                updateQuestion(section.id, q.id, "validation", {
                                                    ...q.validation,
                                                    max: e.target.value,
                                                })
                                            }
                                        />
                                    </>
                                ) : null}
                            </div>

            
                            <div>
                                <label className="text-sm font-medium">Show only if:</label>
                                <select
                                    className="border ml-2 px-1 py-0.5"
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
                                        className="border ml-2 px-1 py-0.5"
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

                        
                            {(q.type === "single-choice" || q.type === "multi-choice") && (
                                <div className="mt-2">
                                    <button
                                        className="bg-purple-500 text-white px-2 py-1 rounded"
                                        onClick={() => addOption(section.id, q.id)}
                                    >
                                        + Add Option
                                    </button>
                                    <ul className="list-disc ml-6 mt-2">
                                        {q.options.map((opt, idx) => (
                                            <li key={idx}>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    className="border px-1 py-0.5"
                                                    onChange={(e) =>
                                                        updateOption(section.id, q.id, idx, e.target.value)
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}

            <AssessmentPreview assessmentData={sections} />
        </div>
    );
}
