import { useState } from "@hookstate/core";
import Chip from "@mui/material/Chip";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Link } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import { verificationDocsState,fetchverificationDocs, filterVeiricationDocs, sortverificationDocs } from "../state/verificaton_docs_state";

function VerificationDocs(){
    const navigate = useNavigate();
    const location = useLocation();
    const {search, currentPage, rowsPerPage,verificationDocs} = useState(verificationDocsState);

    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        fetchverificationDocs();
    },[navigate,location])

    function getRows(data:any[]){

        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['name'] = <Link to={`/verification_docs/${row.id}`} style={{color:"white"}}>{row.name}</Link>
            row['status'] = <Chip label={row.status} color={row.status === "pending" ? "primary":"success"} sx={{color:"white",fontFamily:"Avenir"}}  />
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
                title="Verification Documents"
                showBackIcon={false}
                trailingButton={false}
                />
                <SizedBox
                height={40}
                />
                <CustomTable
                label={"Search Users"}
                rows={getRows(verificationDocs.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterVeiricationDocs(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={false}
                onMenuClicked={(menu:string,index:any)=>{
                    // let opportunity = opportunities.get()[index];
                    // deleteOpportunity(opportunity['id']);
                    //navigate(`/users/${user['id']}/${user['role']}`);
                }}
                onSortBy={(key:string)=>{
                    sortverificationDocs(key);
                }}
                headings={[
                    {
                        "label":"Name",
                        "sortKey":"name"
                    },
                    {
                        "label":"Date Submitted",
                        "sortKey":"date_submitted"
                    },
                    {
                        "label":"Status",
                        "sortKey":"status"
                    }
                ]}
                />
            </>
            }
        />
    );
}


export default VerificationDocs;
