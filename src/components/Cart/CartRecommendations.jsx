import { getPrimaryImage } from "../../lib/catalog";
import { formatPrice } from "../../lib/format";
import BuyButton from "../UI/BuyButton";
import SmartImage from "../UI/SmartImage";

/**
 * CartRecommendations Component
 * A scrollable row of products to add alongside what is already in the cart.
 *
 * The cards lie on their side — thumbnail left, title, price and action
 * stacked to its right — because this row holds its place above the totals
 * rather than scrolling away, so every pixel of its height is charged to the
 * cart for good. Laid out this way it costs about half what a stacked tile did.
 *
 * The cards do not link anywhere: the point is to add without leaving the
 * cart, and navigating would strand the drawer open over another page.
 *
 * @param {Object} props - Component props.
 * @param {Object[]} props.products - Products to suggest; renders nothing when empty.
 */
function CartRecommendations({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <section
            aria-labelledby="cart-recommendations"
            className="flex-shrink-0 border-t px-4 py-3"
        >
            <h3
                id="cart-recommendations"
                className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500"
            >
                You might also like
            </h3>

            <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 snap-x hide-scrollbar">
                {products.map((product) => (
                    <li key={product.id} className="w-52 flex-shrink-0 snap-start">
                        <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 p-2">
                            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <SmartImage
                                    src={getPrimaryImage(product)}
                                    alt={product.title}
                                    className="h-full w-full"
                                    imgClassName="h-full w-full object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className="truncate text-[11px] font-medium leading-tight text-gray-900"
                                    title={product.title}
                                >
                                    {product.title}
                                </p>
                                <div className="mt-1.5 flex items-center justify-between gap-2">
                                    <span className="text-[11px] font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                    <BuyButton
                                        product={product}
                                        variant="outline"
                                        showPending
                                        className="!rounded-full !px-3 !py-1 !text-[8px] uppercase tracking-widest"
                                        aria-label={`Add ${product.title} to cart`}
                                    >
                                        Add
                                    </BuyButton>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default CartRecommendations;
