# (Generic Version) Form Generator for Request for Proposal (RFP) and Request for Quotation (RFQ) to implement in the existing platform

### Form Generator allows users to dynamically create and customize a form by adding, rearranging, and removing various types of cards. These cards represent different form elements such as text fields, titles, questions, and document uploads.

### The generic version only includes the client-side application without any corporate-specific information

### _Built with create-react-app and Material UI_

# Components

## Form: Root component for the form generator

### State

- `projectTitle`: The title of the entire form project.
- `cards`: An array representing the form's structure. Each element in the array is an object describing a specific card with properties like id, category, type, content, and placeholder.

### Functions

- `generateId(cards)`: Generates a unique ID for each card in the form.
- `moveCard(dragIndex, hoverIndex)`: Callback for dragging a card to change its order.
- `removeCard(index)`: Removes a card from the form.
- `addCard(cards, index, category, type, content, placeholder)`: Adds a new card after the selected card.
- `formSubmit()`: Processes and submits the form data. It generates five sections of processed data, including data for suppliers and buyers.

## FormCard: Individual card in cards(array) of the overall form.

### Props

- `index`: The index of the card in the `cards` array.
- `id`: The unique ID of the card.
- `category`: The category of the card (e.g., Title, Question).
- `type`: The type of the card (e.g., Text, Title, FileUpload).
- `cards`: The array representing the form's structure.
- `moveCard(dragIndex, hoverIndex)`: Callback for dragging a card to change its order.
- `removeCard(index)`: Callback to remove a card from the form.
- `addCard(cards, index, category, type, content, placeholder)`: Callback to add a new card after the selected card.

### State

- `options`: State to manage the options for Dropdown or Checkbox type questions.

### Functions

- `handleChange(value)`: Updates the card content on text input change.
- `changeQuestionType(type)`: Changes the question type and handles options for Dropdown or Checkbox types.

### Drag and Drop

The component utilizes the `react-dnd` library for drag-and-drop functionality. It allows cards to be dragged to change their order within the form.

## Question: Question-type content within a FormCard

### Props
- `index`: The index of the question in the `cards` array.
- `cards`: The array representing the form's structure.
- `options`: State to manage the options for Dropdown or Checkbox type questions.
- `setOptions`: Callback to update the options state.

### Functions
- `changeQuestionTitle(value)`: Updates the title of the question on text input change.
- `changeQuestionOption(value, ind)`: Updates the question option for Dropdown or Checkbox types.
- `addOption()`: Adds a new option for Dropdown or Checkbox types.
- `deleteOption(ind)`: Deletes an option for Dropdown or Checkbox types.

## FileUpload: Upload-type content within a FormCard
### Props

- `index`: The index of the file upload component in the `cards` array.
- `cards`: The array representing the form's structure.

### Functionality

- `changeTitle(value)`: Updates the title of the card, describing the type of files suppliers should upload, on text input change.
- `changeMaxNumFiles(value)`: Updates the maximum number of files that suppliers can upload.
