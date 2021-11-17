import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import SizedBox from "../../../components/sizedBox";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CustomTable from "../../../components/table";
import {opportunitiesState,filterOpportunities,sortOpportunities, fetchOpportunities, deleteOpportunity} from '../states/opportunities_state';
import { useState } from "@hookstate/core";
import { useEffect } from "react";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import Preloader from "../../../components/preloader/preloader";
import CustomDialog from "../../../components/dialog/dialog";

function Opportunities(){
    const navigate = useNavigate();
    const location = useLocation();
    const {opportunities,currentPage,rowsPerPage,search} = useState(opportunitiesState);


    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        if(opportunities.get().length < 1) fetchOpportunities();
    },[navigate,location,opportunities])

    function getRows(data:any[]){

        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['title'] = <Link to={`/opportunities/${row.id}`} style={{color:"white"}}>{row.title}</Link>
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
                title="Manage Opportunities"
                showBackIcon={false}
                trailingButton={true}
                trailingText="Add New"
                onPressed={()=>navigate('/opportunities/add')}
                />

                <SizedBox
                 height={40}
                />
                <CustomTable
                label={"Search Opportunities"}
                rows={getRows(opportunities.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterOpportunities(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={true}
                menus={['Delete']}
                onMenuClicked={(menu:string,index:any)=>{
                    let opportunity = opportunities.get()[index];
                    deleteOpportunity(opportunity['id']);
                    //navigate(`/users/${user['id']}/${user['role']}`);
                }}
                onSortBy={(key:string)=>{
                    sortOpportunities(key);
                }}
                headings={[
                    {
                        "label":"Title",
                        "sortKey":"name"
                    },
                    {
                        "label":"Date Created",
                        "sortKey":"date_created"
                    },
                    {
                        "label":"Submissions",
                        "sortKey":"submissions"
                    }
                ]}
                />
            </>
        }/>
    );
}

export default Opportunities;
