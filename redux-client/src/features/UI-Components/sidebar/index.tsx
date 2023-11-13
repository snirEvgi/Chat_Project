import React, { useState } from "react"
import { Sidebar } from "primereact/sidebar"
import { Button } from "primereact/button"
import "./sidebar.css"
import { useNavigate } from "react-router-dom"
import { userData } from "../../handlers/hashData"
// const { id, role, first_name, last_name } = userData

function SideBar() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState<boolean>(false)

  const toggleSidebar = () => {
    setVisible(!visible)
  }
  const handleHome = () => {
    navigate("/home")
    toggleSidebar()
  }
  const handleLogin = () => {
    navigate("/login")
    toggleSidebar()
  }
  const handleSignUp = () => {
    navigate("/sign-up")
    toggleSidebar()
  }
  const handleAbout = () => {
    navigate("/singleChat")
    toggleSidebar()
  }
  const handleChat = () => {
    navigate("/singleChat")
    toggleSidebar()
  }
  const handleUserVacations = () => {
    navigate("/vacations")
    toggleSidebar()
  }
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("hashedData")
    localStorage.removeItem("exp")
    window.location.href = "/home"
  }
  const handleVacations = () => {
    const routeByRole = userData?.role === "admin" ? "/adminVacation" : "/vacations"
    navigate(routeByRole)
    toggleSidebar()
  }
  const textByRole = userData?.role === "admin" ? "Admin Vacations" : "Vacations"

  return (
    <div className="buttonContainer">
      <button className="iconBtn" onClick={toggleSidebar}>
        <i className="pi pi-bars"></i>
      </button>

      <Sidebar
        className="sidebarContainer"
        visible={visible}
        onHide={() => setVisible(false)}
      >
        <h1 className="sidebarHeader">Menu</h1>
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <a className="sidebarLink" onClick={handleHome}>
              Home
            </a>
          </li>
          <li className="sidebarListItem">
            <a className="sidebarLink" onClick={handleLogin}>
              Login <i className="pi pi-sign-in"></i>
            </a>
          </li>
          <li className="sidebarListItem">
            <a className="sidebarLink" onClick={handleSignUp}>
              Sign-Up <i className="pi pi-check"></i>
            </a>
          </li>
          {userData?.id && (
            <li className="sidebar-list-item">
              <a className="sidebarLink" onClick={handleVacations}>
                {textByRole}
              </a>
            </li>
          )}
          {userData?.role === "admin" && (
            <li className="sidebar-list-item">
              <a className="sidebarLink" onClick={handleUserVacations}>
                Vacations
              </a>
            </li>
          )}

          <li className="sidebar-list-item">
            <a className="sidebarLink" onClick={handleAbout}>
              About Me
            </a>
          </li>
          <li className="sidebar-list-item">
            <a className="sidebarLink" onClick={handleChat}>
              SChat
            </a>
          </li>
          {userData?.id && (
            <li className="sidebar-list-item">
              {" "}
              {/*logoutLi*/}
              <a
                style={{ color: "red" }}
                className="sidebarLink"
                onClick={handleLogout}
              >
                <i className="pi pi-sign-out"></i>
                Logout
              </a>
            </li>
          )}
        </ul>
      </Sidebar>
    </div>
  )
}

export default SideBar
