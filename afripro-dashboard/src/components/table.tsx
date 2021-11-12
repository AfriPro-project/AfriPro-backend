import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import Popover from '@mui/material/Popover';
import TextInput from './textInput';
import SizedBox from './sizedBox';
import MoreVert from '@mui/icons-material/MoreVert';
import ListItem from '@mui/material/ListItem';
import SortIcon from '../assets/images/sortIcon.svg'

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }

type Props={
    label:string,
    rows:any[],
    headings:any[]
    onSearch:any,
    onPageChanged:any,
    onRowsPerPageChange:any,
    currentPage:number,
    rowsPerPage:number,
    search:string,
    showActionButton:boolean,
    menus?:string[],
    onMenuClicked?:any
    onSortBy:any
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ display:"flex" }}>
        <IconButton
          sx={{color:"white",width:50}}
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          sx={{color:"white",width:50}}
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          sx={{color:"white",width:50}}
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          sx={{color:"white",width:50}}
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

function CustomTable(props:Props){
    const {label,rows,headings,search,currentPage,rowsPerPage,onSearch,onPageChanged,onRowsPerPageChange,showActionButton,menus,onMenuClicked,onSortBy}  =  props;
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
    ) => {
    onPageChanged(newPage);
    };

    const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChanged(0);
    };

    return(
        <>

      <Popover
        color="red"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
      >
        <Box
         sx={{backgroundColor:"#171717",color:"white"}}
        >
            {menus?.map((menu)=>(
                <ListItem key={menu} button
                onClick={()=>{
                    onMenuClicked(menu);
                    handleClose();
                }}
                >{menu}</ListItem>
            ))}
        </Box>
      </Popover>


        <TextInput
            label={label}
            value={search}
            isPassword={false}
            onChanged={(value:string)=>{
               onSearch(value);
            }}
        />

        <SizedBox
            height={40}
        />

        <TableContainer
        sx={{width:"100%"}}
        >
            <Table sx={{ borderCollapse:"separate",borderSpacing:"0 20px"}} aria-label="simple table">
                <TableHead>
                <TableRow
                sx={{background:"#232323"}}
                >
                    {headings.map((head,index)=>(
                        <TableCell  key={index} sx={{color:"white",fontFamily:"Avenir",paddingLeft:5,fontSize:15,border:0,cursor:"pointer"}}
                        onClick={()=>{
                            onSortBy(head.sortKey);
                        }}
                        >
                            <Box sx={{display:"flex"}}>
                                {head.label}
                            <img src={SortIcon} alt="sortIcon" style={{width: 10, marginLeft:10}}/></Box>
                        </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {rows
              .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
              .map((row,i) => (
                    <TableRow
                    key={i}
                    sx={{'td':{padding:2,paddingLeft:5, fontFamily:"Avnir",color:"white",border:0,backgroundColor:"#2D2D2D"}}}
                    >
                     {Object.keys(row).map((col:any,index:number)=>{
                         return (
                            <TableCell key={index} align="left"
                            sx={{
                            borderTopLeftRadius: index === 0 ? "45px" :"0px",
                            borderBottomLeftRadius: index === 0 ? "45px" :"0px",
                            borderBottomRightRadius: index === (Object.keys(row).length - 1) && !showActionButton ? "45px" :"0px",
                            borderTopRightRadius: index === (Object.keys(row).length - 1) && !showActionButton ? "45px" :"0px"
                          }}
                            >{row[col]}</TableCell>
                         )
                     })}

                    <TableCell key={Object.keys(row).length} align="right"
                    sx={{
                    borderBottomRightRadius: "45px",
                    borderTopRightRadius:  "45px"
                    }}
                    >
                        <IconButton
                        sx={{color:"white",width:50}}
                        onClick={handleClick}
                        >
                            <MoreVert/>
                        </IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            sx={{color:"#fff",width:500,border:0}}
                            rowsPerPageOptions={[1]}
                            // component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={currentPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>


            </TableContainer>
        </>
    );
}

export default CustomTable;
