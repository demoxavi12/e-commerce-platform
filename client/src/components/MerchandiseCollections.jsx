import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import assets from '../assets/assets';
import Tittle from './Tittle';

const MerchandiseCollections = () => {



    const merchandiseCollections = [
        {
            id: 'marvel',
            name: 'MARVEL',
            image: assets.marvel_collection,
        },
        {
            id: 'DC',
            name: 'DC UNIVERSE',
            image: assets.DC_collection,
        },
        {
            id: 'harry-potter',
            name: 'HARRY POTTER',
            image: assets.hp_collection,
        },
        {
            id: 'star-wars',
            name: 'STAR WARS',
            image: assets.starwars_collection,
        },
        {
            id: 'anime',
            name: 'ANIME',
            image: assets.anime_collection,
        },
        {
            id: 'netflix',
            name: 'NETFLIX ORIGINALS',
            image: assets.netflix_collection,
        },
        {
            id: 'F1',
            name: 'F1',
            image: assets.F1_collection,
        },
    ];


    return (
        <div className="mt-16 overflow-hidden">
            <div className="text-center max-w-3xl mx-auto mb-14 px-4">
                <Tittle text1={"MERCHANDISE"} text2={"COLLECTIONS "} />
                <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                    Discover our Merchandise Collections from different Universals — thoughtfully designed, premium fabrics,
                    and timeless silhouettes crafted for modern elegance.
                </p>
            </div>

            {/* MARQUEE WRAPPER */}
            <div className="relative w-full overflow-hidden pt-12 pb-8">
                <motion.div
                    className="flex gap-6 w-max"
                    animate={{ x: ['0%', '-50%'] }}
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
                                    className="block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 hover:text-gray-900"
                                >
                                    {/* SMALLER IMAGE */}
                                    <div className="relative w-full aspect-[3/3] overflow-hidden rounded-xl  bg-gray-50">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* TEXT */}
                                    <div className="p-3 text-center">
                                        <h3 className="text-sm font-semibold text-gray-700 ">
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
};

export default MerchandiseCollections;
