import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

/*
AddCardButton is for the button below FormCard that lets users add a new FormCard of a specific category.
*/

export default function AddCardButton({ cards, index, addCard }){
  const [expandButton, setExpandButton] = useState(false);

  const categories = [
    { category: "Title", type: "Input", content: "", placeholder: "Type a title" },
    { category: "Text", type: "Text", content: "", placeholder: "Type some descriptive text" },
    { category: "Question", type: "Paragraph", content: { question_title: "", options: null }, placeholder: "Type a question" },
    { category: "Upload", type: "FileUpload", content: { title: "", max_num_files: 1 }, placeholder: "Type a description of file upload" }
  ]

  return (
    <Box style={{ height: "2rem", marginTop: "1rem", marginBottom: "1rem", display: "flex", justifyContent: "center" }} >
      {expandButton ? 
      <Box 
        onMouseLeave={() => setExpandButton(false)} 
        style={{ width: "fit-content", height: "inherit", borderRadius: "0.5rem", border: "solid 1px #7F7F7F", display: "flex" }}
      >
        {categories.map((category, i)=> (
          <Box key={i} style={{ width: "fit-content", height: "inherit",  display: "flex",  alignItems: "center", justifyContent: "center" }} >
            <Typography 
              sx={{ fontSize: 16, mx: "1rem", cursor: "pointer" }}
              onClick={()=>addCard(cards, index, category.category, category.type, category.content, category.placeholder)}
            >
              {category.category}
            </Typography>
            { i != (categories.length-1) ? "|" : null }
          </Box>
        ))}
      </Box>
      :
      <AddCircleOutlineOutlinedIcon 
        style={{ width: "2rem", height: "2rem", color: "#7f7f7f", cursor: "pointer" }} 
        onMouseEnter={() => setExpandButton(true)}
      />
      }
    </Box>
  );
};