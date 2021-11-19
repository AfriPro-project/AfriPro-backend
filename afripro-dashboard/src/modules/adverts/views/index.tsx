import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import { adsState, deleteAd, fetchAds, filterAds, sortAds } from "../states/adverts_state";
import {useState} from '@hookstate/core';
import Chip from "@mui/material/Chip";
import { getDateTime } from "../../events/states/events_state";
import AddInfo from "./ad_info";

function Adverts(){
    const navigate = useNavigate();
    const location = useLocation();
    const {search, ads,currentPage, rowsPerPage, title,sponsorName,adUrl,expiryDate,rank,image,status, adInfo} = useState(adsState);

    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        fetchAds();
    },[navigate,location])

    function getRows(data:any[]){
        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['title'] = <Link to={`/ads/${row.id}`} style={{color:"white"}}>{row.title}</Link>
            row['status'] = <Chip label={row.status} sx={{color:"white",backgroundColor:"#494949",fontFamily:"Avenir"}}  />
            delete row.id;
            delete row.ad_url;
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
                title="Manage Ads"
                showBackIcon={false}
                trailingButton={true}
                trailingText="Add New"
                onPressed={()=>{
                    image.set("");
                    expiryDate.set(getDateTime());
                    adUrl.set("");
                    sponsorName.set("");
                    title.set("");
                    rank.set("0");
                    status.set("active");
                    navigate('/ads/add');
                    adInfo.set({});
                }}
                />

                <SizedBox
                height={40}
                />

            <CustomTable
                label={"Search Ads"}
                rows={getRows(ads.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterAds(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={true}
                menus={['Delete']}
                onMenuClicked={(menu:string,index:any)=>{
                    let ad = ads.get()[index];
                    deleteAd(ad['id']);
                }}
                onSortBy={(key:string)=>{
                    sortAds(key);
                }}
                headings={[
                    {
                        "label":"Sponsor",
                        "sortKey":"sponsor"
                    },
                    {
                        "label":"Ad Title",
                        "sortKey":"ad_title"
                    },
                    {
                        "label":"Date Created",
                        "sortKey":"date_created"
                    },
                    {
                        "label":"Clicks",
                        "sortKey":"clicks"
                    },
                    {
                        "label":"Rank",
                        "sortKey":"rank"
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


export default Adverts;
