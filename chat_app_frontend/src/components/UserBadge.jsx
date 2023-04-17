import React from 'react'
import { GiCancel } from 'react-icons/gi'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

const UserBadge = ({ user, handleFunction })=>{
    return <div className="w-auto my-2 mx-2 h-8 bg-zinc-800 flex flex-row rounded-lg" >
      <span className="flex justify-center items-center p-2 text-md text-[#ffea20]">
      {
        capitalizeFirstLetter(user.name)
      }
      </span>
      <span className="group flex items-center w-auto p-2 text-[#ffea20] text-base"  onClick={()=> handleFunction(user)}>
        <GiCancel size="16" className="group-hover:cursor-pointer"/>
      </span>
    </div>
  }

export default UserBadge
