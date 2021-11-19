import { useState } from "@hookstate/core";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import { fetchScholars, filterscholars, scholarsState, sortscholars, deleteScholar } from "../states/scholars_state";

function Scholars(){

    const {scholars,currentPage,rowsPerPage,search} = useState(scholarsState);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        fetchScholars();
    },[navigate,location])

    function getRows(data:any[]){
        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['name'] = <Link to={`/users/${row.id}/${row.role}`} style={{color:"white"}}>{row.name}</Link>
            delete row.id;
            delete row.role;
            delete row.scholar_id;
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
                title="Scholarship Applicants"
                showBackIcon={false}
                trailingButton={false}
                />
                <SizedBox
                height={40}
                />


            <CustomTable
                label={"Search Users"}
                rows={getRows(scholars.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterscholars(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={true}
                menus={['Delete']}
                onMenuClicked={(menu:string,index:any)=>{
                    let scholar = scholars.get()[index];
                    deleteScholar(scholar['scholar_id']);
                }}
                onSortBy={(key:string)=>{
                    sortscholars(key);
                }}
                headings={[
                    {
                        "label":"Name",
                        "sortKey":"name"
                    },
                    {
                        "label":"Academic Level",
                        "sortKey":"academic_level"
                    },
                    {
                        "label":"Parent Consent",
                        "sortKey":"parent_consent"
                    },
                    {
                        "label":"Contact Parents",
                        "sortKey":"contact_parents"
                    },
                    {
                        "label":"Who can give consents",
                        "sortKey":"consents"
                    },
                    {
                        "label":"Date Submitted",
                        "sortKey":"date_submitted"
                    }
                ]}
                />

            </>
            }
        />
    );
}


export default Scholars;
