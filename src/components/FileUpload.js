import { Box, Typography, TextField } from "@mui/material"

/*
FileUpload component is for a upload-type conent for FormCard
*/

export default function FileUpload({ index, cards }) {
  // For changing the title of the card: describing what kind of files that suppliers should upload
  function changeTitle(value) {
    cards[index].content.title = value
  }

  // For changing the maximum number of files that suppliers can upload
  function changeMaxNumFiles(value) {
    cards[index].content.max_num_files = value
  }
  return (
    <Box sx={{ width: "inherit" }}>
      <TextField
        label="Type"
        variant="outlined"
        size="small"
        margin="dense"
        onChange={(e) => {
          changeTitle(e.target.value)
        }}
        multiline
        rows={3}
        sx={{ width: "inherit" }}
      />
      <Typography>Maximum number of files</Typography>
      <TextField
        type="number"
        label="Type"
        variant="outlined"
        size="small"
        margin="dense"
        onChange={(e) => {
          changeMaxNumFiles(e.target.value)
        }}
      ></TextField>
    </Box>
  )
}
