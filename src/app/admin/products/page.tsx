import { div } from "framer-motion/client";
import ProductsTable from "../../../../components/ProductsTable";

export default function Products() {
    return (
        <div className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
            <ProductsTable/>
        </div>
    )
}