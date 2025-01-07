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
import { AnimatePresence, motion } from "framer-motion";

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
  scale: number;
  visible: boolean;
}

export default function OverlayPage() {
  const paramas = useParams();
  const id = paramas?.id as string;

  const [gameId, setGameId] = useState<string | null>(id);

  const { loadOverlay, scoreboardOverlay, scorebugOverlay, formationAOverlay, formationBOverlay, scoreboardMinimalOverlay, handlePositionOverlay } = useGameStore()

  useEffect(() => {
    if (id) {
      loadOverlay(id).then(game => {
        setItems([
          {
            id: game.formationAOverlay.id,
            position: { x: game.formationAOverlay.x, y: game.formationAOverlay.y },
            component: <BaseballFormation />,
            width: "100%",
            height: "100%",
            scale: game.formationAOverlay.scale,
            visible: game.formationAOverlay.visible,
          },
          {
            id: game.scorebugOverlay.id,
            position: { x: game.scorebugOverlay.x, y: game.scorebugOverlay.y },
            component: <ScoreBoard />,
            width: "100%",
            height: "100%",
            scale: game.scorebugOverlay.scale,
            visible: game.scorebugOverlay.visible,
          },
          {
            id: game.scoreboardOverlay.id,
            position: { x: game.scoreboardOverlay.x, y: game.scoreboardOverlay.y },
            component: <EnhancedRunsTable />,
            width: "100%",
            height: "100%",
            scale: game.scoreboardOverlay.scale,
            visible: game.scoreboardOverlay.visible,
          }
        ])
      });
      setGameId(id);
    }
  }, [gameId, loadOverlay, setGameId, paramas, id]);
  
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<OverlayItem[]>([]);

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
      handlePositionOverlay(id, data);
    },
    []
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-screen h-[calc(100vh)] bg-[#1a472a00] overflow-hidden">
      {items.map((item) => (
        <DraggableComponent
          key={item.id}
          defaultPosition={item.position} // Usa `defaultPosition` en lugar de `position`.
          onStop={(_: any, data: any) =>
            handleDragStop(item.id, { x: data.x, y: data.y })
          }
          // bounds="parent"
          handle={item.id.includes("formation") ? undefined : ".drag-handle"}
          disabled={item.id.includes("formation")} // Evita mover el campo.
        >
          <div
            className="absolute"
            style={{ width: item.width, height: item.height }}
          >
            <div style={{ transform: `scale(${item.scale / 100})` }} className={`relative transform scale-[${item.scale / 100}]`}>
              {!item.id.includes("formation") && (
                <div className="drag-handle absolute -top-2 left-0 right-0 h-6 bg-white/10 rounded-t cursor-move opacity-0 hover:opacity-100 transition-opacity" />
              )}
              <AnimatePresence mode="popLayout">
                {
                  item.visible && (
                    <motion.div
                      key={item.id}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 2 }}
                    >
                      {item.component}
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          </div>
        </DraggableComponent>
      ))}
    </div>
  );
}

const ScoreBoard = () => {
  return (
    <div className="flex-1 max-w-[520px] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
      <ClassicScoreboard orientation="horizontal" />
    </div>
  );
};
