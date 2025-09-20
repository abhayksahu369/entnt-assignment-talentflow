import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import KanbanBoard from "../components/KanbanBoard";



export default function CandidateDetails() {
    const[candidate,setCandidate]=useState([]);
    const [notes, setNotes] = useState([]);
    const [showNotes,setShowNotes]=useState(false)
    const{id}=useParams()
    const fetchCandidate=async()=>{
        let res = await fetch(`/api/candidates/${id}/timeline`);
        res = await res.json()
        console.log(res)
        setCandidate([res?.candidate])
    }
    useEffect(() => {
            if (id) {
                fetchCandidate();
            }
        }, [id])


    
  return (
    <div>
        <h1>{candidate[0]?.name}</h1>
        <h3>{candidate[0]?.email}</h3>
        <p>Current Stage:<b>{candidate[0]?.stage}</b> </p>
        {showNotes?<Notes notes={notes} setNotes={setNotes} setShowNotes={setShowNotes}/>:<button onClick={()=>{setShowNotes(true)}}>Add Notes</button>}
        <div style={{ marginTop: "20px" }}>
        {notes.length === 0 ? (
          <></>
        ) : (
          <>
          <h3>Notes</h3>
          {notes.map((n, idx) => (
            <div key={idx} style={{ marginBottom: "10px" }}>
              {n.split(" ").map((word, i) =>
                word.startsWith("@") ? (
                  <span key={i} style={{ color: "blue", fontWeight: "bold" }}>
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </div>
          ))}
        </>
        )}
      </div>
        <KanbanBoard candidates={candidate} setCandidates={setCandidate} />
    </div>
  )
}


const users = ["Alice", "Bob", "Charlie", "David"];

function Notes({notes,setNotes,setShowNotes}) {
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cursor, setCursor] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;
    setNote(value);

    const lastWord = value.slice(0, e.target.selectionStart).split(" ").pop();
    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      setSuggestions(users.filter((u) => u.toLowerCase().startsWith(query)));
      setCursor(e.target.selectionStart);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (name) => {
    const before = note.slice(0, cursor).split(" ");
    before[before.length - 1] = "@" + name;
    const newNote = before.join(" ") + note.slice(cursor);
    setNote(newNote);
    setSuggestions([]);
  };

  const handleAddNote = () => {
    if (note.trim() === "") return;
    setNotes([...notes, note]);
    setNote("");
    setShowNotes(false)
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Type @ to mention</h2>
      <textarea
        value={note}
        onChange={handleChange}
        rows={4}
        style={{ width: "100%", padding: "8px" }}
      />

      {suggestions.length > 0 && (
        <div
          style={{
            border: "1px solid #ccc",
            background: "#fff",
            position: "absolute",
            marginTop: "-10px",
            zIndex: 10,
          }}
        >
          {suggestions.map((s) => (
            <div
              key={s}
              onClick={() => handleSelect(s)}
              style={{ padding: "5px", cursor: "pointer" }}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAddNote}
      >
        Add Note
      </button>
    </div>
  );
}
