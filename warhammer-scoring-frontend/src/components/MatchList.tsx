import { ChevronDownIcon } from "lucide-react"
import React, { useState } from "react"
import type { MatchListProps } from "../types/MatchListProps"
import type { DetachmentStats } from "../types/DetachmentStats"

const MatchList = ({ filters, matches }: MatchListProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const statsByDetachment: Record<string, DetachmentStats> = {}

  matches.forEach(match => {
    const detKey = `${match.user_army.name} (${match.user_detachment.name})`
    const oppKey = `${match.opponent_army.name}`

    if (!statsByDetachment[detKey]) {
      statsByDetachment[detKey] = { wins: 0, total: 0, opponents: {} }
    }

    const detStats = statsByDetachment[detKey]
    detStats.total += 1

    let userScore, opponentScore

    if (filters.wtc) {
      userScore = match.user_wtc_score
      opponentScore = match.opponent_wtc_score
    } else {
      userScore = match.user_score
      opponentScore = match.opponent_score
    }

    if (userScore > opponentScore) {
      detStats.wins += 1
    }

    if (!detStats.opponents[oppKey]) {
      detStats.opponents[oppKey] = { wins: 0, total: 0 }
    }

    detStats.opponents[oppKey].total += 1

    if (userScore > opponentScore) {
      detStats.opponents[oppKey].wins += 1
    }
  })

  const detachmentArray = Object.entries(statsByDetachment).map(
    ([detKey, { wins, total, opponents }]) => ({
      detachment: detKey,
      wins,
      total,
      winrate: ((wins / total) * 100).toFixed(1),
      opponents: Object.entries(opponents).map(([oppKey, { wins, total }]) => ({
        opponent: oppKey,
        wins,
        total,
        winrate: ((wins / total) * 100).toFixed(1),
      })),
    })
  )

  return (
    <div className="text-slate-50 text-left mt-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Matchup Analysis</h2>
      {detachmentArray.length === 0 ? (
        <p>No matches found for these filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border border-slate-50 text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-gray-5">
                <th className="border px-2 py-1 text-left">Detachment</th>
                <th className="border px-2 py-1">Wins</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Winrate</th>
              </tr>
            </thead>

            <tbody>
              {detachmentArray.map(det => (
                <React.Fragment key={det.detachment}>
                  <tr
                    className="cursor-pointer font-bold bg-gray-5 hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]"
                    onClick={() =>
                      setExpanded(prev => ({
                        ...prev,
                        [det.detachment]: !prev[det.detachment],
                      }))
                    }
                  >
                    <td className="border px-2 py-1 whitespace-nowrap">
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 inline mr-1 ${
                          expanded[det.detachment] ? "rotate-180" : ""
                        }`}
                      />
                      <span className="inline-block max-w-[200px] sm:max-w-none truncate align-middle">
                        {det.detachment}
                      </span>
                    </td>

                    <td className="border px-2 py-1 text-center">{det.wins}</td>
                    <td className="border px-2 py-1 text-center">{det.total}</td>
                    <td className="border px-2 py-1 text-center">{det.winrate}%</td>
                  </tr>

                  {expanded[det.detachment] &&
                    det.opponents.map(opp => (
                      <tr key={det.detachment + opp.opponent} className="bg-gray-10 text-xs sm:text-sm">
                        <td className="border px-4 py-1 whitespace-nowrap">
                          ↳ vs {opp.opponent}
                        </td>
                        <td className="border px-2 py-1 text-center">{opp.wins}</td>
                        <td className="border px-2 py-1 text-center">{opp.total}</td>
                        <td className="border px-2 py-1 text-center">{opp.winrate}%</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MatchList
