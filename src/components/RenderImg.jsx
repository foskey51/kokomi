import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"
import Masonry from 'react-masonry-css';
import Footer from "./Footer";

const RenderImg = () => {
    const [images, setImage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const footerRef = useRef(null);
    const [option, setOption] = useState(false);

    const api = "https://nekos.best/api/v2/waifu?type=2&amount=20";
    //const api = "http://localhost:3000/api/data";                   //Local test api

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(api);
            const imageUrl = response.data.results.map(result => result.url);
            setImage(prevImages => [...prevImages, ...imageUrl]);
            console.log(imageUrl);
        } catch (e) {
            console.log("Unable to fetch data");
            setError(true);
        }
        finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoadingMore && !loading) {
                    setIsLoadingMore(true);
                    fetchData(); // Fetch more images when footer is in view
                }
            });
        });

        if (footerRef.current) {
            observer.observe(footerRef.current); // Observe the footer element
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current); // Clean up observer
            }
        };
    }, [isLoadingMore, loading]);


    return (
        <>
            <div className="flex flex-col mt-6 items-center justify-center min-h-screen">
                {loading && !isLoadingMore ? (
                    <ClimbingBoxLoader color="white" loading={loading} size={25} />
                ) : error ? (
                    <span className="font-serif text-white sm:text-2xl md:text-2xl lg:text-4xl">
                        <h1>Unable to load images :(</h1>
                    </span>
                ) : (
                    <Masonry
                        breakpointCols={{ default: 3, 1100: 3, 700: 2, 500: 2 }}
                        className="flex w-full"
                        columnClassName="my-masonry-grid_column"
                    >
                        {images.map((imageUrl, index) => (
                            <div key={index} className="overflow-hidden rounded-lg shadow-md mb-4">
                                <img src={imageUrl} alt={`Neko ${index}`} className="w-full h-auto object-cover" />
                            </div>
                        ))}
                    </Masonry>
                )}
                {isLoadingMore && <ClimbingBoxLoader color="white" loading={isLoadingMore} size={25} className="flex mt-auto" />}
            </div>
            <Footer ref={footerRef} /> {/* Use the Footer component and pass the ref */}
        </>
    );
};

export default RenderImg;