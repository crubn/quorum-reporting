import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateRowsPerPageAction } from '../../redux/actions/systemActions'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  titleContainer: {
    padding: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // table: { maxWidth: '100%' },
  loading: { marginRight: 8 },
  subtitle: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  errorRow: {
    padding: 16,
    fontSize: 18,
  },
  footer: {
    display: 'table-caption',
    textAlign: 'right !important',
  },
}))

export default function PaginatedTableView({ title, subtitle, note, getItems, ItemView, HeaderView }) {
  const classes = useStyles()
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [lastItemEachPage, setLastItemEachPage] = useState([])
  const dispatch = useDispatch()
  const rowsPerPage = useSelector((state) => state.system.rowsPerPage)

  useEffect(() => {
    setLoading(true)
    const lastItem = page === 0 ? undefined : lastItemEachPage[page - 1]
    getItems(page, rowsPerPage, lastItem)
      .then(({ data, total: newTotal }) => {
        setLastItemEachPage([...lastItemEachPage, data[data.length - 1]])
        setTotal(newTotal)
        setList(data)
        setLoading(false)
        setError('')
      })
      .catch((e) => {
        setLastItemEachPage([])
        setTotal(0)
        setList([])
        setLoading(false)
        setError(e.message)
      })
  }, [page, rowsPerPage, getItems])
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10, 10)
    dispatch(updateRowsPerPageAction(newRowsPerPage))
    setPage(0)
    setLastItemEachPage([])
  }

  const multiPage = total !== list.length
  return (
    <Paper className={classes.container}>
      <div className={classes.titleContainer}>
        <Typography variant="h6">{title}</Typography>
        <div style={{ flex: 1 }} />
        {loading && <CircularProgress size={18} className={classes.loading} />}
        {note
        && (
          <Tooltip title={note}>
            <InfoIcon color="secondary" />
          </Tooltip>
        )}
      </div>
      <Typography variant="subtitle1" className={classes.subtitle}>{subtitle}</Typography>
      {error && <Typography className={classes.errorRow}>{error}</Typography>}
      <TableContainer component={Paper}>
        <Table size="small" className={classes.table} aria-label="simple table">
          {!multiPage && (
          <caption className={classes.footer}>
            {total}
            {' '}
            results
          </caption>
          ) }
          <HeaderView />
          <TableBody>
            {list.map(ItemView)}
            {multiPage && (
            <TableRow key="pagination">
              <TablePagination
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
