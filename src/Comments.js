import api from './axiosConfig'
import { useEffect, useState } from 'react'

function Comments() {

    const [comments, SetComments] = useState([])

    useEffect(()=>{
        api.get("/apis/feedbacks").then((res) => {
            console.log("Feedbacks received:", res.data);
            SetComments(res.data)  
        }).catch((err) => {
            console.error("Error fetching feedbacks:", err);
        })
    },[])
    
    return (
        <>
            {comments.map((item, index) => (
                <div 
                    key={index}
                    className="w-[300px] bg-white h-[150px] rounded-[20px] border-gray-300 shadow border-[1px] mb-4 overflow-hidden"
                >
                    <div className="w-full h-[20px] flex pl-[10px] pt-[5px]">
                    {[...Array(Math.min(item.rating, 5))].map((_, i) => (
                        <img key={i} src="stars.png" className='select-none' alt="star" />
                    ))}
                    </div>

                    <div className="h-[65px] text-[10px] pl-[10px] mt-[5px] opacity-[50%]">
                        <p>{item.comment}</p>
                    </div>

                    <div className="w-full h-[50px] pl-[10px] flex">
                        <div className="w-[35px] h-[35px] rounded-[25px] bg-gray-500 overflow-hidden"></div>

                        <div className="place-content-center ml-2 mb-2">
                            <h1 className="text-[15px]">{item.user_name}</h1>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Comments
