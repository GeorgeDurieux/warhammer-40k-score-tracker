import { Range } from 'react-range'

type Props = {
  months: string[] 
  values: [number, number] 
  onChange: (range: [number, number]) => void
}

const MonthRangeSlider = ({ months, values, onChange }: Props) => {
  const STEP = 1
  const MIN = 0
  const MAX = months.length - 1

  return (
    <div className="w-full px-4">
      <div className="mb-2 text-center text-slate-50 text-lg">Month Range</div>

      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={vals => onChange([vals[0], vals[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 bg-gray-400 rounded relative my-4"
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
            const { key, ...restProps } = props
            return (
                <div key={key} {...restProps} className="w-4 h-4 bg-slate-100 rounded-full shadow-lg cursor-pointer" />
            )
        }}

      />

      <div className="flex justify-between text-xs text-slate-300 mt-2">
        {months.map((month, i) => (
          <span key={month} className="w-8 text-center">
            {i % 2 === 0 ? month.slice(5) : ''}
          </span>
        ))}
      </div>

      <div className="text-center text-slate-200 mt-2">
        {months[values[0]]} → {months[values[1]]}
      </div>
    </div>
  )
}

export default MonthRangeSlider
