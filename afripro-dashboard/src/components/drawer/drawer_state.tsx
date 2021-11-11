import { createState } from '@hookstate/core';

export const drawerState = createState({
   open:false,
})

export function  toggleDrawer(){
    drawerState.open.set(!drawerState.open.get());
}
