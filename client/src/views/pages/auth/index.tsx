import { useOutlet } from "react-router-dom"

const AuthPage=()=>{

    const outlet = useOutlet();

    return (
        <div>
            {outlet}
        </div>
    )
}

export default AuthPage;