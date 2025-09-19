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
        <form onSubmit={handleSubmit} className="p-4 border mt-4 rounded bg-gray-50">
            <h2 className="text-lg font-bold mb-3">Preview</h2>
            {assessmentData?.map((section) => (
                <div key={section.id} className="mb-4">
                    <h3 className="font-semibold mb-2">{section.title}</h3>

                    {section.questions.map(
                        (q) =>
                            isVisible(q) && (
                                <div key={q.id} className="mb-3">
                                    <label className="block font-medium mb-1">
                                        {q.text} {q.required && <span className="text-red-500">*</span>}
                                    </label>

     
                                    {q.type === "short-text" && (
                                        <input
                                            type="text"
                                            className="border px-2 py-1 w-full"
                                            value={answers[q.id] || ""}
                                            onChange={(e) => handleChange(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.type === "long-text" && (
                                        <textarea
                                            className="border px-2 py-1 w-full"
                                            value={answers[q.id] || ""}
                                            onChange={(e) => handleChange(q.id, e.target.value)}
                                        />
                                    )}

                                    {q.type === "numeric" && (
                                        <input
                                            type="number"
                                            className="border px-2 py-1 w-full"
                                            value={answers[q.id] || ""}
                                            onChange={(e) => handleChange(q.id, Number(e.target.value))}
                                        />
                                    )}

                                    {(q.type === "single-choice" || q.type === "multi-choice") && (
                                        <div>
                                            {q.options.map((opt, idx) => (
                                                <label key={idx} className="block">
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
                                                    />{" "}
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "file" && (
                                        <input
                                            type="file"
                                            onChange={(e) => handleChange(q.id, e.target.files[0])}
                                        />
                                    )}
                                </div>
                            )
                    )}
                </div>
            ))}

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Submit
            </button>
        </form>
    );
}
