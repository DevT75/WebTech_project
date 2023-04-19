import React from 'react'

const UserCard = ({imgSrc,name,onMouseDown,onClick,userId,isSelected}) => {
  return (
      <div className={`flex lg:flex-row md:flex-col sm:flex-col lg:justify-around md:justify-around sm:justify-start w-full cursor-pointer shadow-md h-20 items-center rounded-md ${isSelected && "bg-[#ffea20]"} hover:bg-[#ffea20] group`} onMouseDown={onMouseDown} onClick={onClick}>
          <div className='mx-4 lg:my-4 md:my-4 sm:my-2 rounded-lg'>
              <img src={imgSrc} className = 'w-10 h-10 rounded-full' alt='image'/>
          </div>
          <div className='text-white lg:text-lg md:text-lg w-10/12 text-sm text-center md:text-justify group-hover:text-black'>
              {
                name
              }
          </div>
      </div>
  )
}

export default UserCard;
