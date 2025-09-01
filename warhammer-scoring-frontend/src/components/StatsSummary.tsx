import type { StatsSummaryProps } from "../types/StatsSummaryProps"

const StatsSummary = ({ filters, matches }: StatsSummaryProps) => {

    let wins, losses

    if (filters.wtc) {
        wins = matches.filter(m => m.user_wtc_score > m.opponent_wtc_score).length
        losses = matches.filter(m => m.user_wtc_score < m.opponent_wtc_score).length
    } else {
        wins = matches.filter(m => m.user_score > m.opponent_score).length
        losses = matches.filter(m => m.user_score < m.opponent_score).length
    }
    const draws = matches.length - wins - losses

    return (
        <div className="text-slate-50">

            <h2 className="text-xl font-semibold mb-2 text-center">Summary</h2>

            <table className="w-full border border-slate-50 bg-gray-5 rounded text-lg">

                <tbody>

                    <tr className="hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]">

                        <td className="border px-4 py-2 font-semibold">
                            Total Games
                        </td>

                        <td className="border px-4 py-2 text-center">
                            {matches.length}
                        </td>

                    </tr>

                    <tr className="hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]">

                        <td className="border px-4 py-2 font-semibold">
                            Wins
                        </td>

                        <td className="border px-4 py-2 text-center">
                            {wins}
                        </td>
                    </tr>

                    <tr className="hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]">

                        <td className="border px-4 py-2 font-semibold">
                            Losses
                        </td>

                        <td className="border px-4 py-2 text-center">
                            {losses}
                        </td>

                    </tr>

                    <tr className="hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]">

                        <td className="border px-4 py-2 font-semibold">
                            Draws
                        </td>

                        <td className="border px-4 py-2 text-center">
                            {draws}
                        </td>

                    </tr>

                    <tr className="hover:bg-[radial-gradient(circle_at_center,theme(colors.slate.35)_0%,theme(colors.slate.15)_100%)]">

                        <td className="border px-4 py-2 font-semibold">
                            Winrate
                        </td>

                        <td className="border px-4 py-2 text-center">
                            {(wins / matches.length * 100).toPrecision(3)}%
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>

        
    )
}

export default StatsSummary
