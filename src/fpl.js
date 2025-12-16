import { useEffect, useState } from "react";
import TrendingCon from "./Trending";
import api from "./axiosConfig";

function TrendingSection() {
  const [activeTab, setActiveTab] = useState("latest");
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    api.get("/apis/meals")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredMeals = meals
    .filter((item) => {
      if (activeTab === "featured") return item.isFeatured;
      if (activeTab === "popular") return item.isPopular;
      if (activeTab === "latest") return item.isLatest;
      return false;
    })
    .slice(0, 4);

  return (
    <div className="flex flex-col items-center w-full mb-10">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("featured")}
          className={`px-2 py-1 w-[150px] h-[40px] text-[10px] font-bold shadow rounded-[25px] transition-all duration-200 ${
            activeTab === "featured"
              ? "bg-orange-500 text-white border-2"
              : "bg-white text-gray-500 border border-transparent hover:bg-orange-500 hover:text-white"
          }`}
        >
          FEATURED PRODUCTS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("latest")}
          className={`px-2 py-1 w-[150px] h-[40px] text-[10px] font-bold shadow rounded-[25px] transition-all duration-200 ${
            activeTab === "latest"
              ? "bg-orange-500 text-white border-2"
              : "bg-white text-gray-500 border border-transparent hover:bg-orange-500 hover:text-white"
          }`}
        >
          LATEST PRODUCTS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("popular")}
          className={`px-2 py-1 w-[150px] h-[40px] text-[10px] font-bold shadow rounded-[25px] transition-all duration-200 ${
            activeTab === "popular"
              ? "bg-orange-500 text-white border-2"
              : "bg-white text-gray-500 border border-transparent hover:bg-orange-500 hover:text-white"
          }`}
        >
          POPULAR PRODUCTS
        </button>
      </div>

      {/* Meals Grid */}
      <div className="flex justify-center flex-wrap gap-8 max-w-[1100px]">
        {filteredMeals.map((meal) => (
          <TrendingCon key={meal.id} item={meal} />
        ))}
      </div>
    </div>
  );
}

export default TrendingSection;
