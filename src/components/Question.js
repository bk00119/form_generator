import ClearIcon from "@mui/icons-material/Clear"
import { Box, Typography, TextField, Button } from "@mui/material"

/*
Question component is for a question-type conent for FormCard
*/

export default function Question({ index, cards, options, setOptions }) {
  // For changing the title of the question
  function changeQuestionTitle(value) {
    cards[index].content.question_title = value
  }

  // For changing the question option for dropdown/checkboxes type question
  function changeQuestionOption(value, ind) {
    cards[index].content.options[ind] = value
    const options_data = [...options]
    options_data[ind] = value
    setOptions(options_data)
  }

  // For adding an option for dropdown/checkboxes type question
  function addOption() {
    cards[index].content.options = [...cards[index].content.options, ""]
    setOptions([...options, [""]])
  }

  // For deleting an option for dropdown/checkboxes type question
  function deleteOption(ind) {
    const options_data = [...options]
    options_data.splice(ind, 1)
    setOptions(options_data)
    cards[index].content.options = options_data
  }

  return (
    <Box sx={{ width: "inherit" }}>
      <TextField
        label={cards[index].placeholder}
        variant="outlined"
        size="small"
        margin="dense"
        onChange={(e) => {
          changeQuestionTitle(e.target.value)
        }}
        sx={{ width: "inherit" }}
        multiline
        rows={3}
      />
      {cards[index].content.options ? (
        <Box sx={{ width: "inherit" }}>
          <Typography>options</Typography>
          {options.map((option, ind) => (
            <Box
              key={ind}
              sx={{ display: "flex", alignItems: "center", width: "inherit" }}
            >
              <TextField
                label="Type"
                variant="outlined"
                size="small"
                margin="dense"
                type="text"
                value={option}
                onChange={(e) => {
                  changeQuestionOption(e.target.value, ind)
                }}
                sx={{ width: "inherit" }}
              />
              <ClearIcon
                style={{
                  width: "2rem",
                  height: "2rem",
                  color: "#7f7f7f",
                  cursor: "pointer",
                }}
                onClick={() => deleteOption(ind)}
              />
            </Box>
          ))}
          <Button onClick={addOption}>Add option</Button>
        </Box>
      ) : null}
    </Box>
  )
}
