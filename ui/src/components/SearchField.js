import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import { fade, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': { backgroundColor: fade(theme.palette.common.white, 0.25) },
    margin: '1em',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText

  },
  inputRoot: { color: 'inherit' },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '48ch' },
  },
}))

export default function SearchField() {
  const classes = useStyles()
  const history = useHistory()

  const [searchText, setSearchText] = useState('')

  const handleSearch = () => {
    if ((/^[1-9][0-9]*$/g).test(searchText)) {
      // search block
      const blockNumber = parseInt(searchText, 10)
      history.push(`/blocks/${blockNumber}`)
      setSearchText('')
    } else if ((/^0x[0-9a-fA-F]{64}$/g).test(searchText)) {
      history.push(`/transactions/${searchText}`)
      setSearchText('')
    } else if ((/^0x[0-9a-fA-F]{40}$/g).test(searchText)) {
      history.push(`/contracts/${searchText}`)
      setSearchText('')
    } else {
      alert('Please input a valid block number, transaction hash, or address')
    }
  }

  return (
    <div className={classes.search}>
      <IconButton
        type="submit"
        color="default"
        aria-label="search"
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        placeholder="Search by Tx Hash or Block Number"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        onChange={(newText) => setSearchText(newText.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
        value={searchText}
      />
    </div>
  )
}
