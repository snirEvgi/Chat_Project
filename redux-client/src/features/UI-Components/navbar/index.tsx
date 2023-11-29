import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Socket, io } from "socket.io-client"
import SideBar from "../sidebar"
import { IRoute, routes } from "../../../App"

function Navbar() {
  const token = localStorage.getItem("token")
  const userRecord = JSON.parse(localStorage.getItem("userRecord") as any)

  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:4300")
      setSocket(newSocket)

      newSocket.on("connect", () => {
        newSocket.emit("user-logged-in", userRecord)
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [token, token !== undefined])

  if (token) {
    socket?.on("getOnlineUsers", (data) => {
      localStorage.setItem("onlineUsers", JSON.stringify(data.onlineUsers))
    })
  }

  const navigate = useNavigate()
  const handleNavigation = async () => {
    navigate("/home")
  }
  const handleLogout = async () => {
    socket?.emit("user-logged-out", userRecord)
    localStorage.removeItem("token")
    localStorage.removeItem("userRecord")
    localStorage.removeItem("exp")
    localStorage.removeItem("onlineUsers")
    window.location.href = "/home"
    socket?.disconnect()
  }

  return (
    <div className=" border-y border-gray-900 flex justify-between items-center h-12 max-w-full mx-auto px-3 text-white">
      <h1 onClick={handleNavigation} className="w-full text-3xl p-1 font-bold">
        CHAT.
        {token && (
          <span className=" text-sm ml-5 text-teal-700">
            Welcome {userRecord?.firstName + " " + userRecord?.lastName}
          </span>
        )}
      </h1>
      {token && (
        <ul className="hidden md:flex list-none">
          <li onClick={handleLogout} className="p-4 cursor-pointer">
            Logout
          </li>
        </ul>
      )}
    </div>
  )
}

export default Navbar
