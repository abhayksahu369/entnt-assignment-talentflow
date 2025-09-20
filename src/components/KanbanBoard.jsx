import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mb-3 p-4 cursor-grab ${isDragging ? 'opacity-30 rotate-2 scale-105' : 'hover:scale-102'
        }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-blue-600">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {candidate.name}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {candidate.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Link to={`/candidate/${candidate.id}`}>
          <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

function DragOverlayCard({ candidate }) {
  return (
    <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 cursor-grabbing transform rotate-2 scale-105">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-blue-600">
            {candidate.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {candidate.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {candidate.email}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Link to={`/candidate/${candidate.id}`}>
          <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

function StageColumn({ stage, candidates }) {
  const { setNodeRef } = useDroppable({ id: stage });

  const getStageColor = (stage) => {
    switch (stage) {
      case 'applied': return 'bg-blue-50 border-blue-200';
      case 'screen': return 'bg-yellow-50 border-yellow-200';
      case 'tech': return 'bg-purple-50 border-purple-200';
      case 'offer': return 'bg-green-50 border-green-200';
      case 'hired': return 'bg-emerald-50 border-emerald-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStageTextColor = (stage) => {
    switch (stage) {
      case 'applied': return 'text-blue-800';
      case 'screen': return 'text-yellow-800';
      case 'tech': return 'text-purple-800';
      case 'offer': return 'text-green-800';
      case 'hired': return 'text-emerald-800';
      case 'rejected': return 'text-red-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-96 p-4 rounded-lg border-2 border-dashed ${getStageColor(stage)} transition-colors duration-200`}
    >
      <div className="text-center mb-4">
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${getStageTextColor(stage)}`}>
          {stage}
        </h3>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-600 mt-1">
          {candidates.length}
        </span>
      </div>
      <div className="space-y-2">
        <SortableContext items={candidates} strategy={verticalListSortingStrategy}>
          {candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({ candidates, setCandidates, fetchCandidate }) {
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
    const candidateName = activeCandidate.name;
    const activeStage = activeCandidate.stage;

    const overCandidate = candidates.find(c => c.id === overId);
    const overStage = overCandidate ? overCandidate.stage : overId;

    if (activeStage === overStage && candidateId === overId) return;
    const previousCandidates = [...candidates];

    setCandidates((prev) => {
      if (activeStage !== overStage) {
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
      } else if (candidateId !== overId) {
        const oldIndex = prev.findIndex(c => c.id === candidateId);
        const newIndex = prev.findIndex(c => c.id === overId);

        const newArray = [...prev];
        const [removed] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, removed);

        return newArray;
      } else {
        return prev;
      }
    });

    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: overStage }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const result = await res.json();
      console.log(result);
      toast.info(`${candidateName} progressed to ${overStage} stage.`);
      if(fetchCandidate)fetchCandidate();
    } catch (err) {
      console.error("Failed to update, rolling back", err);
      toast.error(`Failed to move ${candidateName}. Changes reverted.`);
      setCandidates(previousCandidates);
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
      <div className="flex gap-4 overflow-x-auto pb-4">
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
