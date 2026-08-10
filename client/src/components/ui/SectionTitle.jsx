export default function SectionTitle({ kicker, title }) {
  return (
    <div className="mb-12">
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-accent2">{kicker}</p>
      <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{title}</h2>
    </div>
  )
}
