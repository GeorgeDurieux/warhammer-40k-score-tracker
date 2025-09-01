import type { Game } from "./Game"

export type WinrateByMonthProps = {
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