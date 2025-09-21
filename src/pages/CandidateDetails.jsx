import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import KanbanBoard from "../components/KanbanBoard";
import { toast } from "react-toastify";
import Loader from "../components/Loader";



export default function CandidateDetails() {
  const [candidate, setCandidate] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false)
  const [loading, setLoading] = useState(true);
  const { id } = useParams()

  const fetchCandidate = async () => {
    try {
      let res = await fetch(`/api/candidates/${id}/timeline`);

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      setCandidate([data?.candidate]);
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
      toast.error("Failed to fetch candidate. Please try again.");
    }finally{
      setLoading(false);
    }
  };

  

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id])

  if (loading) {
          return (
              <Loader/>
          );
    } 


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {candidate[0]?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{candidate[0]?.name}</h1>
                <p className="text-lg text-gray-600">{candidate[0]?.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Current Stage: {candidate[0]?.stage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Candidate Timeline</h2>
              <p className="mt-1 text-sm text-gray-500">Progression history through hiring stages</p>
            </div>
            <div className="p-6">
              <Timeline timeline={candidate[0]?.timeline || []} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
                  {!showNotes && (
                    <button
                      onClick={() => { setShowNotes(true) }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Add Note
                    </button>
                  )}
                </div>
              </div>
              <div className="p-6">
                {showNotes ? (
                  <Notes notes={notes} setNotes={setNotes} setShowNotes={setShowNotes} />
                ) : notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map((n, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700">
                          {n.split(" ").map((word, i) =>
                            word.startsWith("@") ? (
                              <span key={i} className="text-blue-600 font-semibold">
                                {word}{" "}
                              </span>
                            ) : (
                              word + " "
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Add notes to track candidate progress and feedback.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Candidate Pipeline</h2>
                <p className="mt-1 text-sm text-gray-500">Drag and drop to move between stages</p>
              </div>
              <div className="p-6">
                <KanbanBoard candidates={candidate} setCandidates={setCandidate}  fetchCandidate={fetchCandidate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


const users = ["Alice", "Bob", "Charlie", "David"];

function Timeline({ timeline }) {
  const getStageColor = (stage) => {
    switch (stage) {
      case 'applied':
        return 'bg-blue-500';
      case 'screen':
        return 'bg-yellow-500';
      case 'tech':
        return 'bg-purple-500';
      case 'offer':
        return 'bg-green-500';
      case 'hired':
        return 'bg-emerald-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'applied':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'screen':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'tech':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'offer':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'hired':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStageName = (stage) => {
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No timeline data</h3>
        <p className="mt-1 text-sm text-gray-500">Timeline will appear as candidate progresses through stages.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center min-w-max pb-4">
        {timeline.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${getStageColor(item.stage)} relative z-10`}>
                {getStageIcon(item.stage)}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-gray-900">{formatStageName(item.stage)}</p>
                <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
              </div>
            </div>
            {index < timeline.length - 1 && (
              <div className="flex-1 mx-3 relative flex items-center">
                <div className="h-0.5 bg-gray-400 w-full"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Notes({ notes, setNotes, setShowNotes }) {
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
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Type @ to mention team members</h3>
        <textarea
          value={note}
          onChange={handleChange}
          rows={4}
          placeholder="Add your note here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="relative">
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
            {suggestions.map((s) => (
              <div
                key={s}
                onClick={() => handleSelect(s)}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowNotes(false)}
          className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleAddNote}
          className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
