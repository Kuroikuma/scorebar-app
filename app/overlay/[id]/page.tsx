"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import BaseballFormation from "@/components/overlay/improved-field-lineup";
import { RunsTable } from "@/components/overlay/runs-table";
import { CompactScoreboard } from "@/components/overlay/compact-scoreboard";
import { ClassicScoreboard } from "@/components/classic-scoreboard";
import { EnhancedRunsTable } from "@/components/overlay/enhanced-runs-table";
import { useParams } from "next/navigation";
import { useGameStore } from "@/app/store/gameStore";

const DraggableComponent = dynamic(
  () =>
    import("react-draggable").then((mod) => {
      const Draggable = mod.default;
      return ({ children, ...props }: any) => {
        const nodeRef = useRef(null);
        return (
          <Draggable {...props} nodeRef={nodeRef}>
            <div ref={nodeRef}>{children}</div>
          </Draggable>
        );
      };
    }),
  { ssr: false }
);

interface Position {
  x: number;
  y: number;
}

interface OverlayItem {
  id: string;
  position: Position;
  component: React.ReactNode;
  width: string;
  height: string;
}

export default function OverlayPage() {
  const paramas = useParams();
  const id = paramas?.id as string;

  const [gameId, setGameId] = useState<string | null>(id);

  const { loadGame } = useGameStore()

  useEffect(() => {
    if (id) {
      loadGame(id);
      setGameId(id);
    }
  }, [gameId, loadGame, setGameId, paramas, id]);
  
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<OverlayItem[]>([
    {
      id: "field",
      position: { x: 0, y: 0 },
      component: <BaseballFormation />,
      width: "100%",
      height: "100%",
    },
    {
      id: "scoreboard",
      position: { x: 200, y: 90 },
      component: <ScoreBoard />,
      width: "100%",
      height: "100%",
    },
    {
      id: "EnhancedRunsTable",
      position: { x: 100, y: 100 },
      component: <EnhancedRunsTable />,
      width: "100%",
      height: "100%"
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragStop = useCallback(
    (id: string, data: { x: number; y: number }) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                position: { x: data.x, y: data.y }, // Actualiza posición solo al soltar.
              }
            : item
        )
      );
    },
    []
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-screen h-[calc(100vh)] bg-[#1a472a] overflow-hidden">
      {items.map((item) => (
        <DraggableComponent
          key={item.id}
          defaultPosition={item.position} // Usa `defaultPosition` en lugar de `position`.
          onStop={(_: any, data: any) =>
            handleDragStop(item.id, { x: data.x, y: data.y })
          }
          // bounds="parent"
          handle={item.id === "field" ? undefined : ".drag-handle"}
          disabled={item.id === "field"} // Evita mover el campo.
        >
          <div
            className="absolute"
            style={{ width: item.width, height: item.height }}
          >
            <div className="relative">
              {item.id !== "field" && (
                <div className="drag-handle absolute -top-2 left-0 right-0 h-6 bg-white/10 rounded-t cursor-move opacity-0 hover:opacity-100 transition-opacity" />
              )}
              {item.component}
            </div>
          </div>
        </DraggableComponent>
      ))}
    </div>
  );
}

const ScoreBoard = () => {
  return (
    <div className="flex-1 max-w-[570px] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
      <ClassicScoreboard orientation="horizontal" />
    </div>
  );
};
