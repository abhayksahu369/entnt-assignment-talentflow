
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";


function CandidateCard({ candidate}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: candidate.id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    transition,
    padding: "8px",
    margin: "4px",
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <b>{candidate.name}</b>
      <div style={{ fontSize: "12px", color: "gray" }}>{candidate.email}</div>
    </div>
  );
}



function StageColumn({ stage, candidates }) {
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minHeight: "300px",
        padding: "10px",
        margin: "5px",
        background: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ textAlign: "center" }}>{stage}</h3>
      {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  );
}

export default function KanbanBoard({candidates,setCandidates }) {
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const candidateId = active.id;
    const newStage = over.id;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, stage: newStage } : c
      )
    );

    try {
      let res=await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      res=await res.json();
      console.log(res);
    } catch (err) {
      console.error("Failed to update, rollback", err);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "10px" }}>
        {stages.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            candidates={candidates.filter((c) => c.stage === stage)}
          />
        ))}
      </div>
    </DndContext>
  );
}



