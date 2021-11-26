import Container  from "@mui/material/Container"

function NotFoudPage(){


    return (
        <>
          <Container maxWidth="sm" sx={{paddingTop: 20}}>
                 <h1>Oops!</h1>
                 <p>We can't seem to find the page you are looking for</p>
                 <code>Error code: 404</code>
              </Container>
        </>
    );
}


export default NotFoudPage;
