import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Link } from "react-router-dom";



export default function CandidatesList({candidates}) {
    const parentRef = useRef();

    const rowVirtualizer = useVirtualizer({
        count: candidates.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80,
        overscan: 5,
    });
  return (
      <div ref={parentRef} className="h-120 overflow-auto">
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
                        className="w-full px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {candidate.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {candidate.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {candidate.email}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            candidate.stage === 'applied' ? 'bg-blue-100 text-blue-800' :
                                            candidate.stage === 'screen' ? 'bg-yellow-100 text-yellow-800' :
                                            candidate.stage === 'tech' ? 'bg-purple-100 text-purple-800' :
                                            candidate.stage === 'offer' ? 'bg-green-100 text-green-800' :
                                            candidate.stage === 'hired' ? 'bg-emerald-100 text-emerald-800' :
                                            candidate.stage === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {candidate.stage}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                <Link to={`/candidate/${candidate.id}`}>
                                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  )
}
