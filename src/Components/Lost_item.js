import React, { useState } from "react";
import axios from "axios";
import lodash from "lodash";
import "bootstrap/dist/css/bootstrap.css";
import { useToasts } from "react-toast-notifications";
import { Button, Modal, Form, Spinner, ProgressBar } from "react-bootstrap";

function LostItem() {
  const [show, setShow] = useState(false);
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [itemQuestion, setItemQuestion] = useState("");
  const [itemImages, setItemImages] = useState([]);
  const [type, setType] = useState("");

  const token = window.localStorage.getItem("token");

  // Open modal
  const handleShow = () => setShow(true);

  // Close modal
  const handleClose = () => setShow(false);

  // Handle form submission
  const handleSubmit = () => {
    // Validate fields
    if (!itemName || !description || !type) {
      addToast("Please fill all required fields 🙄", { appearance: "error" });
      return;
    }

    if (!token) {
      addToast("Please login first!", { appearance: "error" });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("question", itemQuestion);
    formData.append("type", type);

    // Append multiple images
    itemImages.forEach((file) => formData.append("itemPictures", file, file.name));

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/postitem`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(percentCompleted);
        },
      })
      .then(() => {
        addToast("Wohoo 🤩! Item listed successfully.", { appearance: "success" });
        // Reset form
        setItemName("");
        setDescription("");
        setItemQuestion("");
        setType("");
        setItemImages([]);
        setUploadProgress(0);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        addToast("Oops 😞! Check your internet or try again later.", {
          appearance: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Post Item
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Post Item</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Item Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Description <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Enter a question about the item</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: What is the color of the phone?"
                value={itemQuestion}
                onChange={(e) => setItemQuestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Item Type <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Choose..</option>
                <option value="Lost">Lost It</option>
                <option value="Found">Found It</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.File
                id="formImages"
                label="Upload Images"
                multiple
                onChange={(e) => {
                  const { files } = e.target;
                  lodash.forEach(files, (file) => {
                    setItemImages((prev) => [...prev, file]);
                  });
                }}
              />
            </Form.Group>

            {loading && uploadProgress > 0 && (
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                striped
                animated
              />
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Uploading...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LostItem;
