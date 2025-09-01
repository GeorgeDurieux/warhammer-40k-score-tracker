import type { TitleProps } from "../types/TitleProps"

const Title = ({ title }: TitleProps) => {
    return (
        <div  className="text-slate-50 text-3xl md:text-6xl text-center mt-4 md:mt-24 mb-8">{title}</div>
    )
}

export default Title