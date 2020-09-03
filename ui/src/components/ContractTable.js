import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom'

const StyledTableHeader = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  row: {
    textDecoration: 'none',
    cursor: 'pointer'
  }
}))

function ContractTable(props) {
  const history = useHistory()
  const classes = useStyles()
    return (
        <Table stickyHeader>
            <TableBody>
                {props.contracts.map( (c, i) => {
                    console.log(c)
                    return (
                        <TableRow hover={true} className={classes.row} onClick={() => history.push(`/contracts/${c.address}`)} key={c.address}>
                          <TableCell>
                              {i + 1}
                          </TableCell>
                          <TableCell>
                              {c.name}
                          </TableCell>
                          <TableCell>
                                  {c.address}
                          </TableCell>
                          <TableCell align="right">
                              <IconButton onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                props.handleContractDelete(c.address)
                              }}>
                                  <DeleteIcon color="primary"/>
                              </IconButton>
                          </TableCell>
                      </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default ContractTable