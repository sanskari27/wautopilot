import { Box } from "@chakra-ui/react";
import { useOutlet } from "react-router-dom";
import NavigationDrawer from "../../components/navbar/appNavbar";

const AppPage=()=>{
    const outlet = useOutlet();

    return (
        <Box width={'full'}>
            <NavigationDrawer />
            {outlet}
        </Box>
    )
}

export default AppPage