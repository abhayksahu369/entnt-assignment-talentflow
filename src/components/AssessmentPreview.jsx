export default function AssessmentPreview({ assessmentData }) {
  return (
    <div>
      <h1>Assessment Preview</h1>
      {assessmentData.map((section) => (
        <div key={section.id} style={{ marginBottom: "20px" }}>
          <h2>{section.title}</h2>
          {section.questions.map((q) => (
            <div key={q.id} style={{ marginBottom: "10px", paddingLeft: "20px" }}>
              <p>{q.text}</p>
              {q.type === "short-text" && <input type="text" />}
              {q.type === "long-text" && <textarea rows={3} />}
              {q.type === "single-choice" &&
                q.options.map((opt, idx) => (
                  <div key={idx}>
                    <input type="radio" name={q.id} id={`${q.id}-${idx}`} />
                    <label htmlFor={`${q.id}-${idx}`}>{opt}</label>
                  </div>
                ))}
              {q.type === "multi-choice" &&
                q.options.map((opt, idx) => (
                  <div key={idx}>
                    <input type="checkbox" name={`${q.id}-${idx}`} id={`${q.id}-${idx}`} />
                    <label htmlFor={`${q.id}-${idx}`}>{opt}</label>
                  </div>
                ))}
              {q.type === "file" && <input type="file" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
