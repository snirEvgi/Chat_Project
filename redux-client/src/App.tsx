import { useEffect, useState } from "react"
import {
  Routes,
  Route,
  Link,
  useNavigate,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom"
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

// const { id, role, first_name } = userData

interface IRoute {
  path: string
  key: string
  component: any
  label?: string
  onlyAdmin?: boolean
}
const routes: Array<IRoute> = [
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
    path: "/login",
    component: <Login />,
    key: "login",
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
  const token = localStorage.getItem("token")

  return (
    <Router>
      <Navbar />
      <m.div className="progressBar" style={{ scaleX: scrollYProgress }} />
      <div className="pageContent">
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
    </Router>
  )
}
function Navbar() {
  const token = localStorage.getItem("token")
  const userRecord = JSON.parse(localStorage.getItem("userRecord") as any)
  const [onlineUsers, setOnlineUsers] = useState([])

  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:4300")
      setSocket(newSocket)

      socket?.emit("user-logged-in", userRecord)

      return () => {
        socket?.disconnect()
      }
    }
  }, [token !== null])

  useEffect(() => {
    socket?.on("getOnlineUsers", (data) => {
      console.log(data)

      setOnlineUsers(data)
    })
  }, [socket])

  console.log(onlineUsers)
  const navigate = useNavigate()
  const handleNavigation = async () => {
    navigate("/home")
  }
  const handleLogout = async () => {
    socket?.emit("user-logged-out", userRecord)
    localStorage.removeItem("token")
    localStorage.removeItem("userRecord")
    localStorage.removeItem("exp")
    window.location.href = "/home"
    socket?.disconnect()
  }

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="navbarBrand" onClick={handleNavigation}>
          ChatChapati
        </span>
        <img
          className="logoImage"
          onClick={handleNavigation}
          src={``}
          alt="Chat"
        />
      </div>
      <ul className="navLinks">
        {routes.map(
          (route) =>
            showRoutesPerRole(route) && (
              <li key={route.path}>
                <Link to={route.path} className="navLink">
                  {route.label}
                </Link>
              </li>
            ),
        )}
      </ul>
      <div></div>
      <br />
      <br />

      <div className="topFn">
        {token && (
          <button className="logoutButton" onClick={handleLogout}>
            Logout
          </button>
        )}
        <br />
        <div className="sideBarDiv">
          <SideBar />
        </div>
      </div>
    </nav>
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
