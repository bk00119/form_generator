import update from "immutability-helper"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useCallback, useState } from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { Container, Box, Typography, Button, TextField } from "@mui/material"

import { FormCard } from "./FormCard"
import AddCardButton from "./AddCardButton"
import buyerMainDefaultQuestions from "./buyerMainDefaultQuestions.json"

/*
Form component is the root component for the RFP/RFQ form generator
*/

export default function Form() {
  // DEFAULT: projectTitle, text, title. (project title is not included in cards to avoid changing order and removing)
  const [projectTitle, setProjectTitle] = useState("")
  const [cards, setCards] = useState([
    {
      id: generateId(),
      category: "Text",
      type: "Text",
      content: "",
      placeholder: "Type some descriptive text ",
    },
    {
      id: generateId(),
      category: "Title",
      type: "Title",
      content: "",
      placeholder: "Type a title",
    },
  ])

  // generateId(): generates a unique id for each card
  function generateId(cards = []) {
    let new_id
    let match = true
    while (match) {
      new_id = Math.random().toString(36).substring(2, 12) // 10 characters
      match = cards.find((card) => {
        return card.id === new_id
      })
    }
    return new_id
  }

  // For dragging a card to change the order of cards
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    )
  }, [])

  // For removing a card from cards
  const removeCard = (index) => {
    setCards((oldValues) => {
      return oldValues.filter((_, i) => i !== index)
    })
  }

  // For adding a new card after the selected card
  function addCard(cards, index, category, type, content, placeholder) {
    let copy_cards = cards.splice(0)
    copy_cards.splice(index + 1, 0, {
      id: generateId(cards),
      category: category,
      type: type,
      content: content,
      placeholder: placeholder,
    })
    setCards([...copy_cards])
  }

  /*
    For submitting the form data
    There are 5 sections of the processed data
    1) supplierMain: What suppliers would see the conent of the form on their end
    2) supplierDropdown: Where each dropdown question's options are stored
    3) supplierCheckbox: Where each checkbox question's options are stored
    4) buyerMain: What buyers would see the buyer's form. The form data is from buyerMainDefaultQuestions.json
    5) buyerDropdown: Where each dropdown question's options are stored
  */
  function formSubmit() {
    var form = {
      supplierMain: [],
      supplierDropdown: [],
      supplierCheckbox: [],
      buyerMain: [],
      buyerDropdown: [],
    }

    var section_number = 1
    var section_index = 0 //index of "Title" of the form

    // 1) Add each card data to supplierMain
    cards.forEach((card, index) => {
      if (card.category === "Title") {
        // Category: Title
        section_number++
        section_index = index
      } else {
        var description
        var question_type
        if (card.category === "Question") {
          // Category: Question
          question_type = card.type
          description = card.content.question_title

          // 2) Add Data to supplierDropdown or supplierCheckbox
          if (card.type === "Dropdown" || card.type === "Checkbox") {
            card.content.options.forEach((option) => {
              const question_data = {
                "Question Row": index - section_number + 2,
                "Value": option,
                "Go To Question Row": "",
                "Go To Section Number": "",
              }
              if (card.type === "Dropdown") {
                form["supplierDropdown"].push(question_data)
              } else {
                // card.type == "Checkbox"
                form["supplierCheckbox"].push(question_data)
              }
            })
          }
        } else if (card.category === "Text") {
          // Category: Text
          question_type = "HTML Text"
          description = `<div><p style="font-size:1.5em;"><b>${card.content}</b></p><br/></div>`

          // 4) Add Data to buyerMain
          if (section_number === 1) {
            const buyerMainData = {
              "Question Row": index - section_number + 2, //Logo: always index 1
              "Section Number": 1, // All custom HTML TEXT fields go to section 1
              "Section Title": "Overveiw", // Section 1: "Overview"
              "Question Type": question_type,
              "Description": description,
              "Maps to Field": "",
              "Mandatory": "FALSE",
              "Custom Error Text": "",
              "Validation Type": "",
              "Validation Number": "",
              "Validation Range Lower": "",
              "Validation Range Upper": "",
              "Validation Text": "",
            }
            form["buyerMain"].push(buyerMainData)
          }
        } else {
          // Category: Document Upload
          question_type = "Document Upload"
          description = card.content.title
        }

        // 1) Add Data to supplierMain
        const card_data = {
          "Question Row": index - section_number + 2, //index starts from 0
          "Section Number": section_number,
          "Section Title":
            section_index === 0 ? "Overveiw" : cards[section_index].content,
          "Question Type": question_type,
          "Description": description, // DROPDOWN & CHECKBOX: WHERE TO OPTIONS GO???
          "Maps to Field": "",
          "Mandatory": "FALSE",
          "Custom Error Text": "",
          "Validation Type": "",
          "Validation Number": "",
          "Validation Range Lower": "",
          "Validation Range Upper": "",
          "Validation Text": "",
        }
        form["supplierMain"].push(card_data)
      }
    })

    // 4) Add Default Data to buyerMain
    var buyerDropdownQuestionRow, buyerIndustrialCodeQuestionRow
    const lastCustomBuyerMainQuestionRow = form["buyerMain"].length //Last number of question row of the custom HTML TEXT of the form
    buyerMainDefaultQuestions.forEach((question, index) => {
      question["Question Row"] = lastCustomBuyerMainQuestionRow + index + 1
      form["buyerMain"].push(question)

      if (question["Question Type"] === "Dropdown") {
        buyerDropdownQuestionRow = question["Question Row"]
      }
      if (question["Question Type"] === "Industrial Code List") {
        buyerIndustrialCodeQuestionRow = question["Question Row"]
      }
    })

    // 5) Add Default Dropdown Data to buyerDropdown
    const buyerDropdownOptions = [
      {
        "Question Row": buyerDropdownQuestionRow,
        "Value": "Private",
        "Go To Question Row": "",
        "Go To Section Number": "",
      },
      {
        "Question Row": buyerDropdownQuestionRow,
        "Value": "Public",
        "Go To Question Row": buyerIndustrialCodeQuestionRow,
        "Go To Section Number": 1, // DEFAULT
      },
    ]
    form["buyerDropdown"] = buyerDropdownOptions

    // GENERIC VERSION) TO SHOW WHAT DATA IS POSTED FOR AN API
    console.log("Form Title: ", projectTitle)
    console.log(JSON.stringify(form))
    // API CALL BELOW
  }

  // Rendering a card. Called when cards are mapped.
  const renderCard = useCallback((cards, card, index) => {
    return (
      <FormCard
        key={card.id}
        index={index}
        id={card.id}
        category={card.category}
        type={card.type}
        cards={cards}
        moveCard={moveCard}
        removeCard={(i) => removeCard(i)}
        addCard={(cards, index, category, type, content, placeholder) =>
          addCard(cards, index, category, type, content, placeholder)
        }
      />
    )
  }, [])

  return (
    <Box>
      <Container style={{ margin: "0.5rem" }}>
        <Card sx={{ minWidth: 275, border: 1, borderColor: "#F7F7F7" }}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Box style={{ width: "2.3rem" }} /> {/* CHANGE THE Width */}
            <CardContent sx={{ width: "100%" }}>
              <Typography sx={{ fontSize: 16 }}>Project Title *</Typography>
              <TextField
                id="outlined-basic"
                label="Type a title for this project"
                variant="outlined"
                size="small"
                margin="dense"
                onChange={(e) => {
                  setProjectTitle(e.target.value)
                }}
                sx={{ width: "inherit" }}
              />
            </CardContent>
          </Box>
        </Card>
        <AddCardButton cards={cards} index={-1} addCard={addCard} />
      </Container>

      <DndProvider backend={HTML5Backend}>
        <Box>{cards.map((card, i) => renderCard(cards, card, i))}</Box>

        <Button onClick={formSubmit}>PUBLISH</Button>
      </DndProvider>
    </Box>
  )
}
