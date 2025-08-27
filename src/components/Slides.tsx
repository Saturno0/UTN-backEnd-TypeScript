import { useState, useEffect } from "react";
import image1 from '../assets/img/ChatGPT Image 1 may 2025, 17_48_14.png';
import image2 from '../assets/img/ChatGPT Image 10 jul 2025, 17_09_02.png';

const Slides = () => {
  const [currentSlide, setCurrentSlide] = useState(true);
  const milisegundos = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => !prevSlide);
    }, milisegundos);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div className="slider">
        <div
          className="slide"
          id="primero"
          style={{ display: currentSlide ? "block" : "none" }}
        >
          <img src={image1} alt="primer slide" />
        </div>
        <div
          className="slide"
          id="segundo"
          style={{ display: currentSlide ? "none" : "block" }}
        >
          <img src={image2} alt="segundo slide" />
        </div>
      </div>
    </div>
  );
};

export default Slides;
