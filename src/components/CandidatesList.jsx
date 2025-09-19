import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";



export default function CandidatesList({candidates}) {
    const parentRef = useRef();

    const rowVirtualizer = useVirtualizer({
        count: candidates.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 20,
        overscan: 5,
    });
  return (
      <div ref={parentRef} style={{ height: "100%", overflow: "auto" }}>
                <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const candidate = candidates[virtualRow.index];
                        return (
                            <div
                                key={candidate.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    height: `${virtualRow.size}px`,
                                }}
                            >
                                {candidate.name} | {candidate.email} | {candidate.stage}
                            </div>
                        );
                    })}
                </div>
            </div>
  )
}
