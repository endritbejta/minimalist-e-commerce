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
        <section aria-labelledby="cart-recommendations" className="border-t pt-4 mt-2">
            <h3
                id="cart-recommendations"
                className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3"
            >
                You might also like
            </h3>

            {/* Negative margin lets the row bleed to the drawer edges while the
                padding keeps the first and last tiles clear of them. */}
            <ul className="flex gap-3 overflow-x-auto snap-x hide-scrollbar -mx-4 px-4 pb-1 list-none m-0">
                {products.map((product) => (
                    <li key={product.id} className="w-28 flex-shrink-0 snap-start">
                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                            <SmartImage
                                src={getPrimaryImage(product)}
                                alt={product.title}
                                className="h-full w-full"
                                imgClassName="h-full w-full object-cover"
                            />
                        </div>
                        <p className="mt-2 truncate text-xs font-medium text-gray-900" title={product.title}>
                            {product.title}
                        </p>
                        <p className="text-xs font-bold text-gray-900">{formatPrice(product.price)}</p>
                        <BuyButton
                            product={product}
                            variant="outline"
                            className="mt-2 w-full py-1.5 text-[10px] uppercase tracking-widest"
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
