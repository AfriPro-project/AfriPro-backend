import { useState } from '@hookstate/core';
import Layout from '../../../components/layout/layout';
import Title from '../../../components/page_title';
import SizedBox from '../../../components/sizedBox';
import CustomTable from '../../../components/table';
import Chip from '@mui/material/Chip'
import Switch from '@mui/material/Switch'
import { useEffect } from 'react';
import { useNavigate,useLocation,Link } from 'react-router-dom';
import {sessionManager} from '../../authentication_module/states/authentication_state';
import {styled,alpha} from '@mui/material/styles';
import {usersState,filterUsers,sortUsers,fetchUsers,toggleBlock} from '../states/users_state';
import Preloader from '../../../components/preloader/preloader';
import CustomDialog from '../../../components/dialog/dialog';
import preloaderState from '../../../components/preloader/preloader_state';
import {showDialog} from '../../../components/dialog/dialog_state';




function Users(){

    const {users,currentPage,rowsPerPage,search} = useState(usersState);
    const navigate = useNavigate();
    const location = useLocation();
    const {loading} = useState(preloaderState);


    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        if(users.get().length < 1) fetchUsers();
    },[navigate,location,users])



  async function handleChange(id:string){
    try{
        loading.set(true);
        await toggleBlock(id);
    }catch(e){
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        loading.set(false);
    }
  }

  function getRows(data:any[]){

    const GreenSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: "#049256",
          '&:hover': {
            backgroundColor: alpha("#049256", theme.palette.action.hoverOpacity),
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: "#049256",
        },
      }));

    data = JSON.parse(JSON.stringify(data))
    data.forEach(row => {
        var id = row.id;
        row['name'] = <Link to={`/users/${row.id}`} style={{color:"white"}}>{row.name}</Link>
        row['subscription'] = <Chip label={row.subscription} sx={{color:"white",backgroundColor:"#494949",fontFamily:"Avenir"}}  />
        row['blocked'] = <GreenSwitch onChange={()=>handleChange(id)} checked={row['blocked'] === 'true' ? true : false}  />
        delete row.id;
    });
    return data;
}

    return (
        <Layout
          children={
              <>

            <Preloader/>
            <CustomDialog/>

                <Title
                title="Manage Users"
                showBackIcon={false}
                trailingButton={true}
                trailingText="Add New"
                onPressed={()=>navigate('/users/add')}
                />

                <SizedBox
                 height={40}
                />

                <CustomTable
                label={"Search Users"}
                rows={getRows(users.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterUsers(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={true}
                menus={['View Profile']}
                onMenuClicked={(menu:string)=>{
                    console.log(menu);
                }}
                onSortBy={(key:string)=>{
                    sortUsers(key);
                }}
                headings={[
                    {
                        "label":"Name",
                        "sortKey":"name"
                    },
                    {
                        "label":"Role",
                        "sortKey":"role"
                    },
                    {
                        "label":"Last Active",
                        "sortKey":"last_active"
                    },
                    {
                        "label":"Subscription",
                        "sortKey":"subscription"
                    }
                ]}
                />
              </>
          }
        />
    );
}

export default Users;
