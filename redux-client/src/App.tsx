import { useEffect, useState } from "react"
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom"
import { ProtectedRoute } from "./features/UI-Components/protected-route"
import { easeOut, motion as m, useInView, useScroll } from "framer-motion"
import { Avatar } from "primereact/avatar"
import "primeflex/primeflex.css"
import "primeicons/primeicons.css"
import "./index.css"
import NotFound from "./features/pages/notFound"
import HomePage from "./features/pages/homePage"
import SideBar from "./features/UI-Components/sidebar"
import { userData } from "./features/handlers/hashData"
import SingleChatComponent from "./features/pages/singleChat"
import Login from "./features/pages/login"
import SignUp from "./features/pages/sign-up"
import { Socket, io } from "socket.io-client"
import Navbar from "./features/UI-Components/navbar"

// const { id, role, first_name } = userData

export interface IRoute {
  path: string
  key: string
  component: any
  label?: string
  onlyAdmin?: boolean
}
export const routes: Array<IRoute> = [
  {
    path: "/login",
    component: <Login />,
    key: "login",
  },
  {
    path: "/home",
    component: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    key: "home",
  },
  {
    path: "/sign-up",
    component: <SignUp />,
    key: "signUp",
  },
  {
    path: "*",
    component: <NotFound />,
    key: "not_found",
  },
]

function App() {
  const { scrollYProgress } = useScroll()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [onlineUsers, setOnlineUsers] = useState([])
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
  }, [])

  useEffect(() => {
    if (token) {
      socket?.on("getOnlineUsers", (data) => {
        setOnlineUsers(data.onlineUsers)
        localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers))
        console.log(onlineUsers)
      })
    }
  }, [])

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token])

  return (
    <div>
      <Navbar />
      {/* <m.div className="progressBar" style={{ scaleX: scrollYProgress }} /> */}
      <div>
        <Routes>
          {routes.map(
            (route) =>
              showRoutesPerRole(route) && (
                <Route
                  path={route.path}
                  key={route.key}
                  element={route.component}
                />
              ),
          )}
        </Routes>
      </div>
    </div>
  )
}

function showRoutesPerRole(route: IRoute) {
  if (route.onlyAdmin) {
    const userRole = localStorage.getItem("role")
    return userRole === "admin"
  }

  return true
}

export default App
