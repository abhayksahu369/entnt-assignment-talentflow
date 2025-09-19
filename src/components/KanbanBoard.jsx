import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { useState } from "react";

function CandidateCard({ candidate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    margin: "4px",
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <b>{candidate.name}</b>
      <div style={{ fontSize: "12px", color: "gray" }}>{candidate.email}</div>
      <Link to={`/candidate/${candidate.id}`}>
        <button>view details</button>
      </Link>
    </div>
  );
}

function DragOverlayCard({ candidate }) {
  const style = {
    padding: "8px",
    margin: "4px",
    background: "white",
    border: "2px solid #007bff",
    borderRadius: "6px",
    cursor: "grabbing",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    transform: "rotate(5deg)",
  };

  return (
    <div style={style}>
      <b>{candidate.name}</b>
      <div style={{ fontSize: "12px", color: "gray" }}>{candidate.email}</div>
      <Link to={`/candidate/${candidate.id}`}>
        <button>view details</button>
      </Link>
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
      <SortableContext items={candidates} strategy={verticalListSortingStrategy}>
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({ candidates, setCandidates }) {
  const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const candidateId = active.id;
    const overId = over.id;

    const activeCandidate = candidates.find(c => c.id === candidateId);
    if (!activeCandidate) return;

    const activeStage = activeCandidate.stage;
    
    const overCandidate = candidates.find(c => c.id === overId);
    const overStage = overCandidate ? overCandidate.stage : overId;

    if (activeStage !== overStage) {
      setCandidates((prev) => {
        const filtered = prev.filter(c => c.id !== candidateId);
        const overIndex = overCandidate 
          ? filtered.findIndex(c => c.id === overId)
          : filtered.filter(c => c.stage === overStage).length;
        
        const updatedCandidate = { ...activeCandidate, stage: overStage };
        
        if (overCandidate) {
          const newArray = [...filtered];
          newArray.splice(overIndex, 0, updatedCandidate);
          return newArray;
        } else {
          return [...filtered, updatedCandidate];
        }
      });
    } else if (candidateId !== overId) {
      setCandidates((prev) => {
        const oldIndex = prev.findIndex(c => c.id === candidateId);
        const newIndex = prev.findIndex(c => c.id === overId);
        
        const newArray = [...prev];
        const [removed] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, removed);
        
        return newArray;
      });
    }

    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: overStage }),
      });
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.error("Failed to update, rollback", err);
    }
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  return (
    <DndContext 
      collisionDetection={closestCenter} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {stages.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            candidates={candidates.filter((c) => c.stage === stage)}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeCandidate ? (
          <DragOverlayCard candidate={activeCandidate} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
