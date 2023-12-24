import { useRef, useState } from "react"
import { useDrag, useDrop } from "react-dnd"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import {
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"

import { ItemTypes } from "./ItemTypes.js"
import AddCardButton from "./AddCardButton.js"
import Question from "./Question.js"
import FileUpload from "./FileUpload.js"

/*
FormCard component is for individual card in cards(array) of the overall form.
*/

export const FormCard = ({
  index,
  id,
  category,
  type,
  cards,
  moveCard,
  removeCard,
  addCard,
}) => {
  const previewRef = useRef(null)
  const dragRef = useRef(null)
  const [options, setOptions] = useState(null)

  // Each question type distinct component
  const question_types = [
    { value: "Paragraph (50,000 characters)", type: "Paragraph" },
    { value: "Short answer (1,000 characters)", type: "ShortText" },
    { value: "Dropdown", type: "Dropdown" },
    { value: "Checkboxes", type: "Checkbox" },
  ]

  // Dropping a card on a new posiiton to change the order
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!previewRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = previewRef.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  // Dragging the card to change the order
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(dragRef)
  drop(preview(previewRef))

  // To change the card content
  function handleChange(value) {
    cards[index].content = value
  }

  // To change the question type of the card
  function changeQuestionType(type) {
    cards[index].type = type
    if (type === "Dropdown" || type === "Checkbox") {
      cards[index].content.options = []
      setOptions([])
    } else {
      cards[index].content.options = null
      setOptions(null)
    }
  }

  return (
    <Container
      ref={previewRef}
      data-handler-id={handlerId}
      style={{ margin: "0.5rem" }}
    >
      {category === "Title" ? (
        <Box
          style={{
            borderTop: "2px solid #7F7F7F",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
        />
      ) : null}
      <Card sx={{ minWidth: 275, border: 1, borderColor: "#F7F7F7" }}>
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Box ref={dragRef}>
            <MoreVertIcon
              fontSize="large"
              sx={{ cursor: "pointer", color: "#7f7f7f" }}
            />
          </Box>
          <CardContent sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 16 }}>{category}</Typography>
              <Box sx={{ display: "flex" }}>
                {category === "Question" ? (
                  <Select
                    defaultValue={question_types[0].type}
                    onChange={(e) => changeQuestionType(e.target.value)}
                  >
                    {question_types.map((question_type) => (
                      <MenuItem
                        value={question_type.type}
                        key={question_type.type}
                      >
                        {question_type.value}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
                <IconButton onClick={() => removeCard(index)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            </Box>
            {/* WHERE EACH QUESTION COMPONENT IS CALLED */}
            {type === "Text" ? (
              <TextField
                multiline
                label={cards[index].placeholder}
                variant="outlined"
                size="small"
                margin="dense"
                onChange={(e) => {
                  handleChange(e.target.value)
                }}
                sx={{ width: "inherit" }}
                rows={3}
              />
            ) : type === "Title" ? (
              <TextField
                label={cards[index].placeholder}
                variant="outlined"
                size="small"
                margin="dense"
                onChange={(e) => {
                  handleChange(e.target.value)
                }}
                sx={{ width: "inherit" }}
              />
            ) : type === "FileUpload" ? (
              <FileUpload
                index={index}
                cards={cards}
              />
            ) : (
              // type === "Question"
              <Question
                index={index}
                cards={cards}
                options={options}
                setOptions={setOptions}
              />
            )}
          </CardContent>
        </Box>
      </Card>
      <AddCardButton
        cards={cards}
        index={index}
        addCard={(cards, index, category, type, content, placeholder) =>
          addCard(cards, index, category, type, content, placeholder)
        }
      />
    </Container>
  )
}
