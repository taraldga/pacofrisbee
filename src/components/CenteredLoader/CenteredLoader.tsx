import * as React from 'react'
import Grid from "@material-ui/core/Grid"
import CircularProgress from '@material-ui/core/CircularProgress'









export const CenteredLoader : React.FC = () => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{width:"100%", height:"100%"}}
    >
      <CircularProgress />
    </Grid>
  )
}