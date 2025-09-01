export type SliderProps = {
  months: string[] 
  values: [number, number] 
  onChange: (range: [number, number]) => void
}