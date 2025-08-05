type Game = {
  id: number
  user_id: number
  user_army_id: number
  opponent_army_id: number
  user_detachment_id: number
  opponent_detachment_id: number
  date: string
  user_score: number
  opponent_score: number
  user_wtc_score: number
  opponent_wtc_score: number
  is_tournament: boolean
  tournament_name?: string

  user_army: { name: string }
  opponent_army: { name: string }
  user_detachment: { name: string }
  opponent_detachment: { name: string }
}

type WinrateByMonthProps = {
  filters: {
        tournamentOnly: boolean
        wtc: boolean
        userArmy: string
        userDetachment: string
        opponentArmy: string
        opponentDetachment: string
    }
    matches: Game[]
}

const WinrateByMonth = ({ filters, matches }: WinrateByMonthProps) => {

    const statsByMonth: Record<string, { wins: number; total: number }> = {}

    matches.forEach(match => {

        const monthKey = new Date(match.date).toISOString().slice(0,7)

        if (!statsByMonth[monthKey]) {
            statsByMonth[monthKey] = { wins: 0, total: 0 }
        }

        statsByMonth[monthKey].total += 1

        if (filters.wtc) {
            if (match.user_wtc_score > match.opponent_wtc_score) {
                statsByMonth[monthKey].wins += 1
            }
        } else {
            if (match.user_score > match.opponent_score) {
                statsByMonth[monthKey].wins += 1
            }
        }
    })

    const monthArray = Object.entries(statsByMonth)
        .map(([month, { wins, total }]) => ({
            month,
            wins,
            total,
            winrate: ((wins / total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.month.localeCompare(a.month))


    return (
        <div className="text-slate-50 text-left mt-4">

            <h2 className="text-xl font-semibold mb-2 text-center">Winrate by Month</h2>

            {monthArray.length === 0 ? (
                <p>No matches found for these filters.</p>
            ) : (

                <table className="w-full border border-slate-50">

                    <thead>

                        <tr className="bg-gray-5">
                            <th className="border px-2 py-1">Month</th>
                            <th className="border px-2 py-1">Wins</th>
                            <th className="border px-2 py-1">Total</th>
                            <th className="border px-2 py-1">Winrate</th>
                        </tr>

                    </thead>

                    <tbody>

                        {monthArray.map(row => (

                            <tr key={row.month} className="bg-gray-5 hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]">

                                <td className="border px-2 py-1">
                                    {row.month}
                                </td>

                                <td className="border px-2 py-1 text-center">
                                    {row.wins}
                                </td>

                                <td className="border px-2 py-1 text-center">
                                    {row.total}
                                </td>

                                <td className="border px-2 py-1 text-center">
                                    {row.winrate}%
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}
        </div>

    )
}

export default WinrateByMonth