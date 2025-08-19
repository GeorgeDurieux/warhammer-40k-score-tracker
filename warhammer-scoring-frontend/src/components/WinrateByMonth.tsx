import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

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
        const monthKey = new Date(match.date).toISOString().slice(0, 7)

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="border border-slate-50 min-w-[400px] w-full text-sm sm:text-base">

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
                            <tr
                                key={row.month}
                                className="bg-gray-5 hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]"
                            >
                                <td className="border px-2 py-1">{row.month}</td>
                                <td className="border px-2 py-1 text-center">{row.wins}</td>
                                <td className="border px-2 py-1 text-center">{row.total}</td>
                                <td className="border px-2 py-1 text-center">{row.winrate}%</td>
                            </tr>
                            ))}
                        </tbody>
                        
                    </table>
                </div>

                {/* Chart */}
                    <div className="bg-gray-5 p-4 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthArray.slice().reverse()}>
                            <defs>
                            <linearGradient id="customGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(180, 25%, 50%)" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="hsl(180, 25%, 15%)" stopOpacity={0.7} />
                            </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="month" stroke="#ddd" tick={{ fill: '#ddd' }} />
                            <YAxis stroke="#ddd" tick={{ fill: '#ddd' }} domain={[0, 100]} />
                            <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #38bdf8', color: '#fff' }}
                            cursor={{ fill: 'hsl(180, 25%, 15%)' }}
                            />
                            <Bar dataKey="winrate" fill="url(#customGradient)" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WinrateByMonth
