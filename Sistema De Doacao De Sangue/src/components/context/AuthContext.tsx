import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { destroyCookie, parseCookies, setCookie } from "nookies";

import CryptoJS from 'crypto-js';
import { setContext } from '@apollo/client/link/context';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export type AuthContextType = {
    user: any;
    signIn: (data: any) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | any>(null);

export const AuthProvider = ({ children } : { children: any}) => {

    const [url, setUrl]     = useState('');
    const [token, setToken] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [codUser, setCodUser] = useState<string | null>(null);
    const [localToken, setLocalToken] = useLocalStorage("token", null);

    useEffect(() => {
      if(localStorage.getItem("url")){
        setUrl( JSON.parse(localStorage.getItem("url") || "") )
      }
    }, [localStorage.getItem("url")])
    
    let httpLink = createHttpLink({
        //uri: url //'https://localhost:7148/graphql/', // - Emulador: http://192.168.0.51:8085/graphql/
        uri: 'https://localhost:7148/graphql/'
    });

    let timeoutHttpLink = httpLink;

    let authLink = setContext( async (req, { headers }) => {
      const cookies = parseCookies();
      return {
        ...headers,
        headers: {
          //authorization: token? `Bearer ${token}` : null,
          authorization: cookies["token"] ? `Bearer ${cookies["token"]}` : "",
        },
      }
    });

    let client = new ApolloClient({
      link: authLink.concat(timeoutHttpLink),
      cache: new InMemoryCache(),
    });

    const navigate = useNavigate();
    
    const secretKey = "8)-i<!du:!x#|2lc+mm+(b13+?4$zua))~6w~jh!1b8?}f9jtp^6/b]$2!wi}9f"

    const signIn = async (token: any , codUser:any, tipo_usuario: any) => {
        setToken(token);
        if(token){
         // localStorage.setItem("user", JSON.stringify(codUser))
          setCodUser(codUser);
          setTipoUsuario(tipo_usuario)
          navigate("/");
          setLocalToken(token)
          //criptografar o cookie codUser
          const encryptedCodUser = CryptoJS.AES.encrypt(codUser.toString(), secretKey).toString();
          //Set cookies
          setCookie(undefined,"codUser",encryptedCodUser,{
            maxAge: 60 * 60 * 4,
            path: '/',
            sameSite: 'None',
            secure: true, 
          })
          setCookie(undefined,"token",token,{
            maxAge: 60 * 60  * 4,// valido por 4 horas 
            path:'/',
            sameSite: 'None',
            secure: true, 
          })
        }
    };
    //data?.tokenAsync?.codPerm
    const signOut = () => {
      destroyCookie(undefined, "token",{path: '/'});
      destroyCookie(undefined, "codUser",{path: '/'});
      destroyCookie(undefined, "tipoUser",{path: '/'});
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedId");
        navigate("/auth/sign-in", { replace: true });
    };

    const value = useMemo(
        () => ({
          token,
          codUser,
          tipoUsuario,
          signIn,
          signOut,
          setUrl,
          url
        }),
        [token,codUser,tipoUsuario]
    );

    return <AuthContext.Provider value={value}>
                <ApolloProvider client={client}>
                    {children}
                </ApolloProvider>
            </AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};