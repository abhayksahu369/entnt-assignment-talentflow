import { useState } from "react";

export default function AssessmentPreview({ assessmentData }) {
    const [answers, setAnswers] = useState({});

    const handleChange = (qId, value) => {
        setAnswers((prev) => ({ ...prev, [qId]: value }));
    };

    const validate = () => {
        let errors = [];
        assessmentData.forEach((section) => {
            section.questions.forEach((q) => {

                if (
                    q.condition &&
                    answers[q.condition.questionId] !== q.condition.value
                ) {
                    return;
                }

                const val = answers[q.id];

                if (q.required && !val) {
                    errors.push(`${q.text} is required`);
                }

                if (q.validation?.maxLength && val?.length > q.validation.maxLength) {
                    errors.push(`${q.text} exceeds max length`);
                }

                if (q.type === "numeric") {
                    if (q.validation?.min && val < q.validation.min) {
                        errors.push(`${q.text} must be >= ${q.validation.min}`);
                    }
                    if (q.validation?.max && val > q.validation.max) {
                        errors.push(`${q.text} must be <= ${q.validation.max}`);
                    }
                }
            });
        });
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (errors.length > 0) {
            alert("Errors:\n" + errors.join("\n"));
        } else {
            alert("Form submitted:\n" + JSON.stringify(answers, null, 2));
        }
    };

    const isVisible = (q) => {
        if (!q.condition) return true;
        return answers[q.condition.questionId] === q.condition.value;
    };

    return (
        <div className="space-y-6">
            {assessmentData?.length > 0 ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {assessmentData.map((section) => (
                        <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                                {section.title}
                            </h3>

                            <div className="space-y-6">
                                {section.questions.map(
                                    (q) =>
                                        isVisible(q) && (
                                            <div key={q.id} className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {q.text} {q.required && <span className="text-red-500">*</span>}
                                                </label>

                                                {q.type === "short-text" && (
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        value={answers[q.id] || ""}
                                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                                        placeholder="Enter your answer..."
                                                    />
                                                )}

                                                {q.type === "long-text" && (
                                                    <textarea
                                                        rows={4}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                                                        value={answers[q.id] || ""}
                                                        onChange={(e) => handleChange(q.id, e.target.value)}
                                                        placeholder="Enter your answer..."
                                                    />
                                                )}

                                                {q.type === "numeric" && (
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        value={answers[q.id] || ""}
                                                        onChange={(e) => handleChange(q.id, Number(e.target.value))}
                                                        placeholder="Enter a number..."
                                                    />
                                                )}

                                                {(q.type === "single-choice" || q.type === "multi-choice") && (
                                                    <div className="space-y-2">
                                                        {q.options.map((opt, idx) => (
                                                            <label key={idx} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                                                                <input
                                                                    type={q.type === "single-choice" ? "radio" : "checkbox"}
                                                                    name={q.id}
                                                                    value={opt}
                                                                    checked={
                                                                        q.type === "single-choice"
                                                                            ? answers[q.id] === opt
                                                                            : (answers[q.id] || []).includes(opt)
                                                                    }
                                                                    onChange={(e) => {
                                                                        if (q.type === "single-choice") {
                                                                            handleChange(q.id, opt);
                                                                        } else {
                                                                            let arr = answers[q.id] || [];
                                                                            if (e.target.checked) arr = [...arr, opt];
                                                                            else arr = arr.filter((o) => o !== opt);
                                                                            handleChange(q.id, arr);
                                                                        }
                                                                    }}
                                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                                />
                                                                <span className="text-sm text-gray-700">{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}

                                                {q.type === "file" && (
                                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleChange(q.id, e.target.files[0])}
                                                            className="hidden"
                                                            id={`file-${q.id}`}
                                                        />
                                                        <label
                                                            htmlFor={`file-${q.id}`}
                                                            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                                                        >
                                                            Click to upload file or drag and drop
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    ))}

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            Submit Assessment
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assessment created</h3>
                    <p className="mt-1 text-sm text-gray-500">Add sections and questions to see the preview here.</p>
                </div>
            )}
        </div>
    );
}
