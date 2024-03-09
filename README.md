# passports service

============================

## Getting Started

### Prerequisites

To install the software, you will need the following:

Node.js and npm:
You can install the latest version of npm globally by running the command `npm install npm@latest -g`.
You can install Node.js using nvm (Node Version Manager) by running `nvm install v20`.

### Installation

First, run the server:

```bash
npm run start
```

passports microservice runs on Port number - 3903

## passports-service

This asynchronous service endpoint extracts the date of birth and expiry date from a passport image using the AWS Textract service. Here's how it works:

- **Parameters**:

  - `image`: A `Uint8Array` representing the binary data of the passport image to be processed.

- **Process Overview**:

  1. **Initialize Textract Client**: The function sends the request to Amazon Textract and waits for the response.
     - If the response contains no `Blocks`, an error is thrown indicating no data was found.
     - Otherwise, it parses the response to extract blocks of text and their relationships to identify and extract the values for `dateOfBirth` and `dateOfExpiry`.
     - If either date is not found, an error is thrown indicating the missing data.
  2. **Return Data**:
     - If successful, returns an object containing the extracted `dateOfBirth` and `dateOfExpiry`.

- **Error Handling**:
  - Captures and throws any errors encountered during the process, along with the error message, ensuring the caller can handle these appropriately.

### API

URLs to post image is defined in the file api/routes.ts.

### `npm run test`

Launches the test runner.
