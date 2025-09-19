import { useState } from "react";
import { faker } from "@faker-js/faker";
import AssessmentPreview from "../components/AssessmentPreview";


export default function AssessmentBuilder() {
  const [sections, setSections] = useState([]);


  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: faker.string.uuid(),
        title: "",
        questions: [],
      },
    ]);
  };

  const addQuestion = (sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: [
              ...section.questions,
              {
                id: faker.string.uuid(),
                text: "",
                type: "short-text",
                required: false,
                options: [],
              },
            ],
          }
          : section
      )
    );
  };

  
  
  const updateSectionTitle = (sectionId, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title: value } : s))
    );
  };

   const deleteSection = (sectionId) => {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
    };
  
  
  const deleteQuestion = (sectionId, qId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.filter((q) => q.id !== qId),
          }
          : section
      )
    );
  };


  const updateQuestion = (sectionId, qId, field, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((q) =>
              q.id === qId ? { ...q, [field]: value } : q
            ),
          }
          : section
      )
    );
  };

  

  const addOption = (sectionId, qId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((q) =>
              q.id === qId
                ? {
                  ...q,
                  options: [...q.options, ""],
                }
                : q
            ),
          }
          : section
      )
    );
  };


  const updateOption = (sectionId, qId, index, value) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((q) =>
              q.id === qId
                ? {
                  ...q,
                  options: q.options.map((opt, idx) =>
                    idx === index ? value : opt
                  ),
                }
                : q
            ),
          }
          : section
      )
    );
  };


  const deleteOption = (sectionId, qId, index) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((q) =>
              q.id === qId
                ? {
                  ...q,
                  options: q.options.filter((_, idx) => idx !== index),
                }
                : q
            ),
          }
          : section
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
          <h2>{section.title}</h2>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Section title"
              className="border px-2 py-1 w-full mb-2 font-semibold"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-2 py-1 rounded ml-2"
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
            <div key={q.id} className="mt-3 p-2 border rounded bg-gray-50">
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
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  onClick={() => deleteQuestion(section.id, q.id)}
                >
                  Delete Question
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

              {(q.type === "single-choice" || q.type === "multi-choice") && (
                <div>
                  <button
                    className="bg-purple-500 text-white px-2 py-1 rounded mb-2"
                    onClick={() => addOption(section.id, q.id)}
                  >
                    + Add Option
                  </button>
                  <ul className="ml-4">
                    {q.options.map((opt, idx) => (
                      <li key={idx} className="flex items-center mb-1">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          className="border px-2 py-1 w-full"
                          value={opt}
                          onChange={(e) =>
                            updateOption(section.id, q.id, idx, e.target.value)
                          }
                        />
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                          onClick={() => deleteOption(section.id, q.id, idx)}
                        >
                          x
                        </button>
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