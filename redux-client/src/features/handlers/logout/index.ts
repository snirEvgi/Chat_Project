// import { useEffect, useState } from "react"
import Swal from "sweetalert2"

function logout(): any {


    return Swal.fire({
        title: `User Logged Out`,
        text: "You have been successfully logged out. For security reasons, please log in again to continue.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "OK",
        // showCancelButton: true,
        // cancelButtonText: "Keep me logged in",
    }).then((result) => {
        if (!result.isConfirmed) {

        } else {
            localStorage.removeItem("token")
            localStorage.removeItem("exp")
            localStorage.removeItem("hashedData");
            window.location.href = "/home";
        }

    });
}


export { logout }