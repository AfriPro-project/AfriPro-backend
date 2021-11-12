import { useState } from '@hookstate/core';
import Layout from '../../../components/layout/layout';
import Title from '../../../components/page_title';
import SizedBox from '../../../components/sizedBox';
import CustomTable from '../../../components/table';
import {usersState,filterUsers,sortUsers} from '../states/users_state';
import Chip from '@mui/material/Chip'


function getRows(data:any[]){
    data = JSON.parse(JSON.stringify(data))
    data.forEach(row => {
        row['name'] = <a href="#" style={{color:"white"}}>{row.name}</a>
        row['subscription'] = <Chip label={row.subscription} sx={{color:"white",backgroundColor:"#494949",fontFamily:"Avenir"}}  />
    });
    return data;
}
function Users(){

    const {users,currentPage,rowsPerPage,search} = useState(usersState);

    return (
        <Layout
          children={
              <>
                <Title
                title="Manage Users"
                showBackIcon={false}
                trailingButton={true}
                trailingText="Add New"
                onPressed={()=>console.log("hello world")}
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
                menus={['Read More','View','Edit']}
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
