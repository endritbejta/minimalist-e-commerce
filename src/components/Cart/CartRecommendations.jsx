import { getPrimaryImage } from "../../lib/catalog";
import { formatPrice } from "../../lib/format";
import BuyButton from "../UI/BuyButton";
import SmartImage from "../UI/SmartImage";

/**
 * CartRecommendations Component
 * A scrollable row of products to add alongside what is already in the cart.
 *
 * The tiles do not link anywhere: the point is to add without leaving the
 * cart, and navigating would strand the drawer open over another page.
 *
 * @param {Object} props - Component props.
 * @param {Object[]} props.products - Products to suggest; renders nothing when empty.
 */
function CartRecommendations({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <section aria-labelledby="cart-recommendations" className="flex-shrink-0 border-t px-4 py-3">
            <h3
                id="cart-recommendations"
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2"
            >
                You might also like
            </h3>

            {/* Inset to the same gutter as the lines above and the totals
                below, so the row sits in the cart's column rather than running
                out to the drawer edges. */}
            <ul className="flex gap-3 overflow-x-auto snap-x hide-scrollbar list-none p-0 m-0">
                {products.map((product) => (
                    <li key={product.id} className="w-24 flex-shrink-0 snap-start">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                            <SmartImage
                                src={getPrimaryImage(product)}
                                alt={product.title}
                                className="h-full w-full"
                                imgClassName="h-full w-full object-cover"
                            />
                        </div>
                        <p className="mt-1.5 truncate text-[11px] font-medium leading-tight text-gray-900" title={product.title}>
                            {product.title}
                        </p>
                        <p className="text-[11px] font-bold text-gray-900">{formatPrice(product.price)}</p>
                        <BuyButton
                            product={product}
                            variant="outline"
                            showPending
                            className="mt-1.5 w-full py-1 text-[10px] uppercase tracking-widest"
                            aria-label={`Add ${product.title} to cart`}
                        >
                            Add
                        </BuyButton>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default CartRecommendations;
