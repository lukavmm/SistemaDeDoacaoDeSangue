import AuthLayout from "../layouts/Auth";
import DashboardLayout from "../Pages/dashboard";
import Page500 from "./.RealPages/auth/Page500";
import SignIn from '../auth/SignIn';
import async from "../Async";
import SignUp from "../auth/SignUp";
import Perfil from "../Pages/.RealPages/perfil/Perfil"

// Layouts

// Auth components

//Paginas
const PaginaInicial = async(() => import("../Pages/.RealPages/PaginaInicial"));


const routes = [
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <PaginaInicial />,
      },
      {
        path: "/home",
        element: <Page500 />
      },
      {
        path: "/perfil",
        element: <Perfil />
      }
    
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      // {
      //   path: "404",
      //   element: <Page404 />,
      // },
      // {
      //   path: "500",
      //   element: <Page500 />,
      // },
    ],
  },  
];

export default routes;
