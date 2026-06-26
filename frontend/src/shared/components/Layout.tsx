import { Outlet } from "react-router"
import Sidebar from "./Sidebar"

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Outlet/>
    </div>
  )
}

export default Layout