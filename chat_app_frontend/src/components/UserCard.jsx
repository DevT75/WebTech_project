import React from 'react'

const UserCard = ({imgSrc,name,onMouseDown,onClick,userId,isSelected}) => {
  return (
      <div className={`flex flex-row justify-around w-full cursor-pointer shadow-md h-20 items-center rounded-md ${isSelected && "bg-[#ffea20]"} hover:bg-[#ffea20] group`} onMouseDown={onMouseDown} onClick={onClick}>
          <div className='mx-4 my-4 rounded-lg'>
              <img src={imgSrc} className = 'w-10 h-10 rounded-full' alt='image'/>
          </div>
          <div className='text-white text-md w-10/12 text-justify group-hover:text-black'>
              {
                name
              }
          </div>
      </div>
  )
}

export default UserCard;
