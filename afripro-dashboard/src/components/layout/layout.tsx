import CustomDrawer from '../drawer/drawer';
import CustomAppBar  from '../app_bar';
import {Box} from '@mui/material';

type Props = {
    children: JSX.Element,
};

const Layout = ({children }: Props) => (
    <Box>
        <CustomAppBar/>
        <Box sx={{ display: 'flex' }}>
            <Box
                component="nav"
                sx={{ width: { md: 350 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <CustomDrawer variant="permanent"/>
                <CustomDrawer variant="temporary"/>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, width: { sm: `100%` },p:{xs:1, sm:1, md:3} }}
            >
            {children}
            </Box>
        </Box>
    </Box>
);

export default Layout;
