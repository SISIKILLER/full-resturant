import { useState } from "react";


function TrendingCon({ item }) {

    const [liked, setLiked] = useState(false);

    const getImageSrc = (img) => {
      if (!img) return "";
      if (img.startsWith("data:")) return img;
      return `data:image/jpeg;base64,${img}`;
    };

    return (
      <div className="w-[200px] h-[320px] bg-white border-[2px] rounded-[25px]">
        <div className="w-[95%] h-[200px]">
          <img src={getImageSrc(item.img)} className="scale-[90%]" alt="" />
        </div>
  
        <div className="flex justify-center mt-[10px]">
          {[...Array(Math.max(0, Math.min(Math.floor(item.rating || 0), 5)))].map((_, i) => (
            <img key={i} src="stars.png" className="w-[20px]" alt="" />
          ))}
        </div>
  
        <div className="text-[10px] text-center mt-[5px]">
          {item.name}
        </div>
  
        <div className="flex gap-4 justify-center text-[10px]">
          <h1 className="text-orange-500 opacity-[80%]">
            ${item.price}
          </h1>
          <h1 className="opacity-[50%] line-through">
            ${item.orgprice}
          </h1>
        </div>
  
        <div className="flex justify-center mt-[10px]">
        <button
          onClick={() => setLiked(!liked)}
          className={`w-[30px] h-[30px] rounded-[25px] border transition-[200ms] hover:scale-90
            ${liked ? "bg-gray-500" : "bg-gray-300 opacity-[50%]"}`}
        >
          <img
            src="heart.png" className={`w-[15px] mx-auto ${liked ? "invert" : ""}`} alt=""/>
        </button>
        </div>
      </div>
    );
  }
  
  export default TrendingCon;
  