'use client'

import { AnimatePresence, motion } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PlayResultType =
  | 'HOME_RUN'
  | 'TRIPLE'
  | 'DOUBLE'
  | 'SINGLE'
  | 'STRIKEOUT'
  | 'DOUBLE_PLAY'
  | 'FLYOUT'
  | 'GROUNDOUT'
  | 'LINEOUT'
  | 'WALK'
  | 'HIT_BY_PITCH'
  | 'STOLEN_BASE'
  | 'CAUGHT_STEALING'
  | 'SACRIFICE_FLY'
  | 'SACRIFICE_BUNT'
  | 'ERROR'
  | 'WILD_PITCH'
  | 'PASSED_BALL'
  | 'BALK'
  | 'INFIELD_FLY'

export type PlayResultColor = 'gold' | 'red' | 'blue' | 'white' | 'purple'

export interface PlayResultConfig {
  /** Texto grande principal */
  label: string
  /** Subtítulo descriptivo (se muestra encima del label) */
  tag: string
  color: PlayResultColor
}

export interface PlayResultOverlayProps {
  visible: boolean
  play: PlayResultType
  /** Nombre del jugador involucrado (opcional) */
  playerName?: string
  /** Detalle extra: distancia HR, número de robo, etc. */
  detail?: string
}

// ─── Configuración de jugadas ──────────────────────────────────────────────────

export const PLAY_RESULT_CONFIG: Record<PlayResultType, PlayResultConfig> = {
  HOME_RUN:        { label: 'HOME RUN',       tag: 'CUADRANGULAR',           color: 'gold'   },
  TRIPLE:          { label: 'TRIPLE',          tag: 'TRIPLE',                 color: 'gold'   },
  DOUBLE:          { label: 'DOUBLE',          tag: 'DOBLE',                  color: 'gold'   },
  SINGLE:          { label: 'SINGLE',          tag: 'SENCILLO',               color: 'white'  },
  STRIKEOUT:       { label: 'STRIKEOUT',       tag: 'PONCHE',                 color: 'red'    },
  DOUBLE_PLAY:     { label: 'DOUBLE PLAY',     tag: 'DOBLE PLAY',             color: 'red'    },
  FLYOUT:          { label: 'FLYOUT',          tag: 'ELEVADO',                color: 'red'    },
  GROUNDOUT:       { label: 'GROUNDOUT',       tag: 'RODADO',                 color: 'red'    },
  LINEOUT:         { label: 'LINEOUT',         tag: 'LÍNEA',                  color: 'red'    },
  WALK:            { label: 'WALK',            tag: 'BASE POR BOLAS',         color: 'blue'   },
  HIT_BY_PITCH:    { label: 'HIT BY PITCH',    tag: 'GOLPE DE BOLA',          color: 'blue'   },
  STOLEN_BASE:     { label: 'STOLEN BASE',     tag: 'BASE ROBADA',            color: 'purple' },
  CAUGHT_STEALING: { label: 'CAUGHT STEALING', tag: 'ATRAPADO ROBANDO',       color: 'red'    },
  SACRIFICE_FLY:   { label: 'SAC FLY',         tag: 'ELEVADO DE SACRIFICIO',  color: 'white'  },
  SACRIFICE_BUNT:  { label: 'SAC BUNT',        tag: 'TOQUE DE SACRIFICIO',    color: 'white'  },
  ERROR:           { label: 'ERROR',           tag: 'ERROR',                  color: 'white'  },
  WILD_PITCH:      { label: 'WILD PITCH',      tag: 'LANZAMIENTO SALVAJE',    color: 'red'    },
  PASSED_BALL:     { label: 'PASSED BALL',     tag: 'BOLA ESCAPADA',          color: 'red'    },
  BALK:            { label: 'BALK',            tag: 'BALK',                   color: 'red'    },
  INFIELD_FLY:     { label: 'INFIELD FLY',     tag: 'REGLA DEL CUADRO',       color: 'red'    },
}

// ─── Color tokens ──────────────────────────────────────────────────────────────

const COLOR_TOKENS: Record<PlayResultColor, {
  main: string
  glow: string
  tagBg: string
  tagBorder: string
  tagText: string
  bar: string
}> = {
  gold: {
    main:      '#F0C040',
    glow:      'rgba(240,192,64,.40)',
    tagBg:     'rgba(212,160,23,.18)',
    tagBorder: 'rgba(212,160,23,.45)',
    tagText:   '#F0C040',
    bar:       'linear-gradient(90deg,transparent,#F0C040,transparent)',
  },
  red: {
    main:      '#FF7068',
    glow:      'rgba(255,112,104,.35)',
    tagBg:     'rgba(220,50,40,.18)',
    tagBorder: 'rgba(220,50,40,.45)',
    tagText:   '#FF7068',
    bar:       'linear-gradient(90deg,transparent,#FF7068,transparent)',
  },
  blue: {
    main:      '#78b4ff',
    glow:      'rgba(120,180,255,.35)',
    tagBg:     'rgba(40,100,220,.18)',
    tagBorder: 'rgba(40,100,220,.45)',
    tagText:   '#78b4ff',
    bar:       'linear-gradient(90deg,transparent,#78b4ff,transparent)',
  },
  white: {
    main:      '#ffffff',
    glow:      'rgba(255,255,255,.28)',
    tagBg:     'rgba(255,255,255,.10)',
    tagBorder: 'rgba(255,255,255,.22)',
    tagText:   'rgba(255,255,255,.75)',
    bar:       'linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)',
  },
  purple: {
    main:      '#c090ff',
    glow:      'rgba(192,144,255,.35)',
    tagBg:     'rgba(130,60,200,.18)',
    tagBorder: 'rgba(130,60,200,.45)',
    tagText:   '#c090ff',
    bar:       'linear-gradient(90deg,transparent,#c090ff,transparent)',
  },
}

// ─── Animation variants ────────────────────────────────────────────────────────

const wrapVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.91 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.94,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
}

const tagVariants = {
  hidden:  { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.05, duration: 0.22 } },
  exit:    { opacity: 0 },
}

const labelVariants = {
  hidden:  { opacity: 0, y: 10, scaleX: 0.94 },
  visible: { opacity: 1, y: 0, scaleX: 1, transition: { delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scaleX: 0.96 },
}

const barVariants = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { delay: 0.18, duration: 0.35, ease: 'easeOut' } },
  exit:    { scaleX: 0, opacity: 0, transition: { duration: 0.18 } },
}

const detailVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.24, duration: 0.22 } },
  exit:    { opacity: 0 },
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function PlayResultOverlay({
  visible,
  play,
  playerName,
  detail,
}: PlayResultOverlayProps) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence
        initial={false}
      >
        {visible && (
          <PlayResultCard
            key={`${play}-${playerName}`}
            play={play}
            playerName={playerName}
            detail={detail}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Inner card (handles auto-dismiss) ────────────────────────────────────────

interface PlayResultCardProps {
  play: PlayResultType
  playerName?: string
  detail?: string
}

function PlayResultCard({
  play,
  playerName,
  detail,
}: PlayResultCardProps) {
  const config = PLAY_RESULT_CONFIG[play]
  const tokens = COLOR_TOKENS[config.color]


  return (
    <motion.div
      variants={wrapVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        fontFamily: '"Barlow Condensed","Oswald","Impact","Arial Narrow",sans-serif',
      }}
    >
      {/* Tag */}
      <motion.div
        variants={tagVariants}
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          padding: '2px 12px',
          borderRadius: '2px',
          fontFamily: '"Barlow","Barlow Condensed",sans-serif',
          background: tokens.tagBg,
          border: `1px solid ${tokens.tagBorder}`,
          color: tokens.tagText,
        }}
      >
        {config.tag}
      </motion.div>

      {/* Main label */}
      <motion.div
        variants={labelVariants}
        style={{
          fontSize: '72px',
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          lineHeight: 0.9,
          textAlign: 'center',
          color: tokens.main,
          textShadow: `0 0 40px ${tokens.glow}`,
        }}
      >
        {config.label}
      </motion.div>

      {/* Accent bar */}
      <motion.div
        variants={barVariants}
        style={{
          height: '3px',
          width: '100%',
          minWidth: '200px',
          borderRadius: '2px',
          background: tokens.bar,
          transformOrigin: 'center',
          marginTop: '2px',
        }}
      />

      {/* Player / detail */}
      {(playerName || detail) && (
        <motion.div
          variants={detailVariants}
          style={{
            fontSize: '15px',
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: '"Barlow","Barlow Condensed",sans-serif',
          }}
        >
          {playerName}
          {playerName && detail ? ' · ' : ''}
          {detail}
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Wrapper de conveniencia ───────────────────────────────────────────────────
//
//  Ejemplo de uso:
//
//  const [result, setResult] = useState<PlayResultType | null>(null)
//
//  <PlayResultOverlay
//    visible={result !== null}
//    play={result ?? 'SINGLE'}
//    playerName="TROUT"
//    detail="426 FT"
//    autoDismissMs={3000}
//    onDismiss={() => setResult(null)}
//  />
