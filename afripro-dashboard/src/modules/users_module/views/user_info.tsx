import { useState } from "@hookstate/core";
import Grid from "@mui/material/Grid";
import { useEffect} from "react";
import { useParams } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import {usersState,getUserInfo,} from '../states/users_state';
import AgentInfo from "./agent_info";
import PlayerInfo from "./player_info";
import TeamInfo from "./team_info";

function UserInfo(){
    const {userInfo} = useState(usersState);
    const { id,userType } = useParams();

    useEffect(()=>{
        getUserInfo(id!,userType!);
    },[id,userType])

    return(
        <Layout
        children={
                 <>
                 <Preloader/>
                 <CustomDialog/>

                 <Title
                    title={userInfo.get()!.title}
                    showBackIcon={true}
                    trailingButton={false}
                    />

                <SizedBox
                 height={40}
                />

                {Object.keys(userInfo.get()).length < 1 ? null :
                <Grid container >
                        {userInfo.get()!.user_type === "player" ? <PlayerInfo  playerInfo={userInfo.get()}/> : null}

                        {userInfo.get()!.user_type === "agent" ? <AgentInfo  agentInfo={userInfo.get()}/> : null}

                        {userInfo.get()!.user_type === "club_official" ? <TeamInfo  teamInfo={userInfo.get()}/> : null}
                </Grid>
                }

               </>
        }
        />
    )

}

export default UserInfo;
