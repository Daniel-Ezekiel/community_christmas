export default function FilterPill({ filterName, onClick }: { filterName: string, onClick?: () => void }) {
    return <button onClick={onClick} className="px-3 py-1 min-w-max rounded-full border border-card-border text-sm text-mid-grey">
        {filterName}
    </button>
}