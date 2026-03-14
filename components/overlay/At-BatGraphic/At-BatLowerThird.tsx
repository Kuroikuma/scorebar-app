'use client'

import usePlayer from '@/app/hooks/usePlayer'
import { TypeAbbreviatedBatting } from '@/app/store/teamsStore'
import { AnimatePresence, motion } from 'framer-motion'

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface PlayerOverlayProps {
  visible: boolean
}

type AtBatCategory = 'hit' | 'out' | 'walk' | 'hbp' | 'error'

interface AtBatStyle {
  bg: string
  border: string
  text: string
  glow?: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const classifyAtBat = (type: TypeAbbreviatedBatting): AtBatCategory => {
  if (type === TypeAbbreviatedBatting.Out) return 'out'
  if (type === TypeAbbreviatedBatting.BaseBayBall) return 'walk'
  if (type === TypeAbbreviatedBatting.HitByPitch) return 'hbp'
  if (type === TypeAbbreviatedBatting.ErrorPlay) return 'error'
  return 'hit'
}

const AT_BAT_STYLES: Record<AtBatCategory, AtBatStyle> = {
  hit:   { bg: '#b8810a', border: '#F0B429', text: '#ffffff', glow: 'rgba(240,180,41,0.35)' },
  out:   { bg: 'rgba(175,40,30,0.75)',  border: '#A02820', text: '#ffb0a8' },
  walk:  { bg: 'rgba(20,85,160,0.75)',  border: '#2860B0', text: '#a0c8ff' },
  hbp:   { bg: 'rgba(90,35,150,0.75)',  border: '#6030B0', text: '#d0a8ff' },
  error: { bg: 'rgba(170,90,15,0.75)',  border: '#B06820', text: '#ffd0a0' },
}

const INNINGS = Array.from({ length: 9 }, (_, i) => i + 1)

// ─── Wrapper ───────────────────────────────────────────────────────────────────

export const AtBatOverlay = ({ visible }: PlayerOverlayProps) => (
  <div className="w-full flex justify-center">
    <AnimatePresence initial={false}>
      {visible && <AtBatLowerThird key="player-stats-overlay" />}
    </AnimatePresence>
  </div>
)

// ─── Main Overlay ──────────────────────────────────────────────────────────────

export function AtBatLowerThird() {
  const {
    position,
    number,
    name,
    battingOrder,
    turnsAtBat,
    totalTurnsAtBat,
    numberOfHits,
    logo,
  } = usePlayer()

  const avg = totalTurnsAtBat > 0 ? numberOfHits / totalTurnsAtBat : 0
  const avgDisplay = avg.toFixed(3).replace(/^0\./, '.')

  const [firstName, ...rest] = name.split(' ')
  const lastName = rest.join(' ') || firstName

  return (
    <>
      {/* 
        Requires Barlow Condensed from Google Fonts — add to your layout or globals.css:
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&display=swap');
      */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-[90%]"
      >
        <div
          style={{
            background: 'linear-gradient(145deg, #020c18 0%, #04111f 50%, #020c18 100%)',
            borderRadius: '3px',
            overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)',
            fontFamily: '"Barlow Condensed", "Oswald", "Impact", "Arial Narrow", sans-serif',
            position: 'relative',
          }}
        >
          {/* ── Top accent strip ───────────────────────────────────────────── */}
          <div
            style={{
              height: '2px',
              background:
                'linear-gradient(90deg, #D4A017 0%, #F0C830 25%, rgba(212,160,23,0.2) 65%, transparent 100%)',
            }}
          />

          {/* ── Main row ───────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '74px' }}>

            {/* Logo ────────────────────────────────────────────────────────── */}
            <div
              style={{
                width: '80px',
                minWidth: '80px',
                background: 'linear-gradient(135deg, #012d56 0%, #011d3a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
                paddingRight: '10px',
              }}
            >
              <img
                src={logo}
                alt="team logo"
                style={{ width: '46px', height: '46px', objectFit: 'contain' }}
              />
            </div>

            {/* Player name ─────────────────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 16px 0 8px',
                minWidth: '155px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginBottom: '1px',
                }}
              >
                {firstName}
              </span>
              <span
                style={{
                  fontSize: '31px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {lastName}
              </span>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

            {/* Position + Number ───────────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                gap: '2px',
              }}
            >
              <span
                style={{
                  fontSize: '21px',
                  fontWeight: 700,
                  color: '#D4A017',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                {position}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.06em',
                }}
              >
                #{number}
              </span>
            </div>

            {/* Batting order ───────────────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 14px',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span
                style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                ORDER
              </span>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                  marginTop: '1px',
                }}
              >
                {battingOrder}
              </span>
            </div>

            {/* Stats: AVG / H / AB ─────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* AVG */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 14px',
                }}
              >
                <span
                  style={{
                    fontSize: '27px',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                  }}
                >
                  {avgDisplay}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  AVG
                </span>
              </div>

              <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', height: '30px' }} />

              {/* H */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 12px',
                }}
              >
                <span
                  style={{
                    fontSize: '21px',
                    fontWeight: 700,
                    color: '#D4A017',
                    lineHeight: 1,
                  }}
                >
                  {numberOfHits}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  H
                </span>
              </div>

              <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', height: '24px' }} />

              {/* AB */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 12px',
                }}
              >
                <span
                  style={{
                    fontSize: '21px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1,
                  }}
                >
                  {totalTurnsAtBat}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  AB
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

            {/* At-bat history per inning ───────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                gap: '5px',
                flex: 1,
              }}
            >
              {INNINGS.map((inning) => {
                const turn = turnsAtBat.find((t) => t.inning === inning)
                const category = turn ? classifyAtBat(turn.typeAbbreviatedBatting) : null
                const colors = category ? AT_BAT_STYLES[category] : null

                return (
                  <div
                    key={inning}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
                  >
                    <motion.div
                      initial={turn ? { scale: 0.5, opacity: 0 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{
                        width: '32px',
                        height: '28px',
                        background: colors ? colors.bg : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${colors ? colors.border : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: colors?.glow ? `0 0 10px ${colors.glow}` : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          color: colors ? colors.text : 'rgba(255,255,255,0.18)',
                          letterSpacing: 0,
                        }}
                      >
                        {turn ? turn.typeAbbreviatedBatting : '·'}
                      </span>
                    </motion.div>
                    <span
                      style={{
                        fontSize: '8.5px',
                        color: 'rgba(255,255,255,0.25)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {inning}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}