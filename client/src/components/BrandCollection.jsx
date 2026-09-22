import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import assets from '../assets/assets';
import Tittle from './Tittle';


const BrandCollection = () => {


    const merchandiseCollections = [
            {
                id: 'H&M',
                name: 'H&M ',
                image: assets.handm,
            },
            {
                id: 'Adidas',
                name: 'ADIDAS ',
                image: assets.adiddas,
            },
            
            {
                id: 'calvin-klein',
                name: 'CALVIN KLEIN',
                image: assets.calvin,
            },
            {
                id: 'lacoste',
                name: 'LACOSTE ',
                image: assets.lacoste,
            },
            {
                id: 'gucci',
                name: 'GUCCI ',
                image: assets.gucci,
            },
            {
                id: 'nike',
                name: 'NIKE ',
                image: assets.nike,
            },
        ];


  return (
        <div className="mt-16 overflow-hidden">
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                <Tittle text1={"TOP"} text2={"BRANDS"} />
                <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                    Get to know our Top Brands — offering a diverse range of styles, quality craftsmanship,
                    and timeless designs that cater to every fashion enthusiast.
                </p>
            </div>

            {/* MARQUEE WRAPPER */}
            <div className="relative w-full overflow-hidden pt-12 pb-8">
                <motion.div
                    className="flex gap-6 w-max"
                    animate={{ x: [-1000, 0] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 25,
                        ease: 'linear',
                    }}
                >
                    {/* DUPLICATE LIST FOR SEAMLESS LOOP */}
                    {[...merchandiseCollections, ...merchandiseCollections].map(
                        (item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                whileHover={{ y: -6 }}
                                className="group flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px]"
                                

                            >
                                <Link
                                    to={`/collection/${item.id}`}
                                    className="block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* SMALLER IMAGE */}
                                    <div className="relative w-full aspect-[4/4] overflow-hidden rounded-xl bg-gray-50">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* TEXT */}
                                    <div className="p-3 text-center">
                                        <h3 className="text-sm font-semibold text-gray-600">
                                            {item.name}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default BrandCollection