interface HitsProps {
  hits: number
}

export function Hits({ hits }: HitsProps) {
  return (
    <td className="px-3 py-2 text-center font-bold bg-[#4c3f82]">{hits}</td>
  )
}
