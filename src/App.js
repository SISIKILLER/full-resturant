import { useEffect, useState } from 'react'
import Axios from 'axios'
function App() {

    const [popular, SetPopular] = useState([])

    useEffect(()=>{
        Axios.get("/trending.json").then((res)=> {
            SetPopular(res.data)
        })
    },[])
    

    return (
        <>
  {popular.map((item, index) => (
            <div
            key={index}
            className="relative w-[30%] h-[200px] rounded-[25px] shadow bg-gray-100 p-[5px] hover:scale-[95%] transition-[1s]"
            >
            {item.isPopular && (
                <div className="absolute z-[1] w-[90px] h-[20px] 
                                -left-[10px] top-[15px] rotate-[-45deg]
                                text-[8px] text-center bg-orange-500 text-white rounded-[25px]">
                <h1 className="pt-[5px]">Popular Plan</h1>
                </div>
            )}

            <div className="w-[90%] m-auto pt-[25px] mt-[-20px] relative h-[190px] flex justify-center">
                <img src="pizza.png" className="scale-[85%]" width={180} alt="" />
            </div>

            <div className="flex">
                <div className="w-[50%] h-[20px] flex">
                {[...Array(Math.min(item.rating, 5))].map((_,index)=> (
                    <img key={index} src='stars.png' alt=''/>
                ))}
                </div>

                <div className="w-[50%] h-[20px] text-[10px] flex justify-end items-center">
                <img src="view.png" className="w-[20px]" alt="" />
                <h1 className="ml-[5px] mr-[20px]">{item.views}</h1>
                </div>
            </div>
            </div>
        ))}
        </>

    )
}


export default App