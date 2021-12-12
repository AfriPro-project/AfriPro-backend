import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import { referralCodesState, fetchReferralCodes, filterCodes, sortCodes } from "../states/referral_codes_state";
import {useState} from '@hookstate/core';

function ReferralCodes(){
    const navigate = useNavigate();
    const location = useLocation();
    const {search, referralCodes,currentPage, rowsPerPage} = useState(referralCodesState);

    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        fetchReferralCodes();
    },[navigate,location])

    function getRows(data:any[]){
        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['name'] = <Link to={`/users/${row.user_id}/${row.user_type}`} style={{color:"white"}}>{row.name}</Link>
            row['usage_count'] = <Link to={`/referral_codes/usage_count/${row.id}`} style={{color:"white"}}>{row.usage_count}</Link>
            row['referral_code'] = row.user_id === 2 ? <Link to={`/referral_codes/${row.id}`} style={{color:"white"}}>{row.referral_code}</Link> : row.referral_code
            delete row.id;
            delete row.user_type;
            delete row.user_id;
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
                title="Manage Referral Code"
                showBackIcon={false}
                trailingButton={true}
                trailingText={"Add New"}
                onPressed={()=>{
                    // image.set("");
                    // expiryDate.set(getDateTime());
                    // adUrl.set("");
                    // sponsorName.set("");
                    // title.set("");
                    // rank.set("0");
                    // status.set("active");
                    navigate('/referral_codes/add');
                    referralCodesState.referalCodeId.set(0);
                    referralCodesState.referralCode.set("");
                    //adInfo.set({});
                }}
                />

                <SizedBox
                height={40}
                />

            <CustomTable
                label={"Search Users"}
                rows={getRows(referralCodes.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterCodes(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={false}
                menus={['Delete']}
                onMenuClicked={(menu:string,index:any)=>{
                    // let ad = ads.get()[index];
                    // deleteAd(ad['id']);
                }}
                onSortBy={(key:string)=>{
                    sortCodes(key);
                }}
                headings={[
                    {
                        "label":"Referrer",
                        "sortKey":"name"
                    },
                    {
                        "label":"Referral Code",
                        "sortKey":"referral_code"
                    },
                    {
                        "label":"Date Created",
                        "sortKey":"date_created"
                    },
                    {
                        "label":"Usage Counts",
                        "sortKey":"usage_counts"
                    }
                ]}
                />
            </>
            }
        />
    );
}


export default ReferralCodes;
