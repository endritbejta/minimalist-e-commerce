/**
 * TotalsRow Component
 * One line of a totals column.
 *
 * Every row is built here so the column cannot drift: labels are grey on the
 * left, figures are black on the right, and a row earns prominence through
 * size and weight rather than through a colour of its own. Four different
 * treatments down one narrow column read as noise, not as hierarchy.
 *
 * Shared by the cart drawer and the checkout so the figures a shopper sees
 * before and during checkout are set in the same type.
 *
 * @param {Object} props - Component props.
 * @param {string} props.label - The left-hand label.
 * @param {import('react').ReactNode} props.children - The right-hand figure.
 * @param {boolean} [props.emphasis=false] - Whether this is the payable total.
 * @param {string} [props.note] - A qualifier shown under the label, for a rate
 *   or a condition the figure alone does not explain.
 */
function TotalsRow({ label, children, emphasis = false, note }) {
    return (
        <div className={`flex items-start justify-between gap-4 ${emphasis ? 'mb-3' : 'mb-1'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {label}
                {note && (
                    <span className="block font-medium normal-case tracking-normal text-[10px] text-gray-400">
                        {note}
                    </span>
                )}
            </span>
            <span
                className={`tabular-nums text-gray-900 ${
                    emphasis ? 'text-xl font-bold' : 'text-sm font-bold'
                }`}
            >
                {children}
            </span>
        </div>
    );
}

export default TotalsRow;
