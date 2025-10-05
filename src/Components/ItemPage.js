import React, { useState, useEffect } from "react";
import "../css/itempage.css";
import lodash from "lodash";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import { LOGGED_IN, setConstraint } from "../constraints";
import { useToasts } from "react-toast-notifications";
import Axios from "axios";
import {
  Button,
  Modal,
  Form,
  Container,
  Card,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

function ItemPage(props) {
  const { addToast } = useToasts();
  const [Itemname, setItemname] = useState("");
  const [ActivationRequest, setActivationRequest] = useState(false);
  const [Createdby, setCreatedby] = useState("");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [index, setIndex] = useState(0);
  const [authenticationPage, setauthenication] = useState("");
  const [validateUser, setvalidateUser] = useState(false);
  const [Question, setQuestion] = useState(false);
  const [alreadyAnswered, setalreadyAnswered] = useState(false);
  const [showQuestion, setshowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [itemid, setitemid] = useState("");
  const [itemname, setitemname] = useState("");
  const [description, setdescription] = useState("");
  const [itemquestion, setitemquestion] = useState("");
  const [itemimage, setitemimage] = useState([]);
  const [newitemimage, setnewitemimage] = useState([]);
  const [type, settype] = useState("");
  const [messageId, setmessageId] = useState("");
  const [response, setResponse] = useState("");

  const handleCloseDelete = () => setShowDelete(false);
  const handleCloseprompt = () => setvalidateUser(false);
  const handleCloseActivation = () => setActivationRequest(false);
  const handleCloseQuestion = () => setQuestion(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  setConstraint(true);

  const item_type = props.location.search.substring(1).split("=")[2].split("/")[0];
  const item_id = props.location.search.substring(1).split("=")[1].split("&")[0];
  const current_user = props.location.search.substring(1).split("/")[1];

  const temp = [];
  const validation = [];

  useEffect(() => {
    Axios({
      url: `${process.env.REACT_APP_API_BASE_URL}/item/${item_id}`,
      method: "GET",
    })
      .then((response) => {
        const data = response.data.Item[0];
        const answers = response.data.Answers;

        answers.forEach((ans) => {
          if (JSON.parse(localStorage.getItem("user"))._id === ans.givenBy) {
            setalreadyAnswered(true);
          }
        });

        setitemid(data._id);
        setitemname(data.name);
        setdescription(data.description);
        setitemquestion(data.question);
        settype(data.type);
        setCreatedby(data.createdBy);
        setitemimage(data.itemPictures);

        let created_date = new Date(data.createdAt);
        let createdAt =
          created_date.getDate() +
          "/" +
          (created_date.getMonth() + 1) +
          "/" +
          created_date.getFullYear() +
          " " +
          created_date.getHours() +
          ":" +
          created_date.getMinutes();

        temp.push(
          <div className="itemDescription">
            <h3 className="attributes">
              Item name: <span className="details">{data.name}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Description: <span className="details">{data.description}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Type: <span className="details">{data.type}</span>
            </h3>
            <hr />
            <h3 className="attributes">
              Status:
              <span className="details">
                {data.status ? " Active" : " Inactive"}
              </span>
            </h3>
            <hr />
            <h6 className="attributes">
              Created at: <span className="details">{createdAt}</span>
            </h6>
            {current_user === "true" ? (
              <div className="ed-button">
                <Button variant="danger" onClick={() => setShowDelete(true)}>
                  Delete item
                </Button>
                <Button variant="primary" onClick={handleShow}>
                  Edit item
                </Button>
                {!data.status && (
                  <Button
                    variant="primary"
                    onClick={() => setActivationRequest(true)}
                  >
                    Reactivate Item
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <Button
                  variant={alreadyAnswered ? "secondary" : "primary"}
                  disabled={alreadyAnswered}
                  onClick={() => setQuestion(true)}
                >
                  {data.type === "Lost" ? "Found Item" : "Claim Item"}
                </Button>
              </div>
            )}
          </div>
        );

        setItemname(temp);

        answers.forEach((e) => {
          let created_date = new Date(e.createdAt);
          e.createdAt =
            created_date.getDate() +
            "/" +
            (created_date.getMonth() + 1) +
            "/" +
            created_date.getFullYear() +
            " " +
            created_date.getHours() +
            ":" +
            created_date.getMinutes();
        });

        validation.push(
          <div>
            {current_user === "true" && (
              <div>
                <h2 className="attributes">Your Question:</h2>
                <h3>{data.question}</h3>

                <h2 className="attributes">Answers Submitted:</h2>
                {answers.length === 0 ? (
                  <h3>No Answers Yet.</h3>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {answers.map((answer) => (
                      <div className="responses" key={answer._id}>
                        <Card border="primary" style={{ width: "18rem" }}>
                          <Card.Body>
                            <Card.Title>Answer: {answer.answer}</Card.Title>
                          </Card.Body>
                          <ListGroup className="list-group-flush">
                            <ListGroupItem>Date: {answer.createdAt}</ListGroupItem>
                            <ListGroupItem>Validate:</ListGroupItem>
                          </ListGroup>
                          <Card.Body>
                            {answer.response === "Moderation" ? (
                              <div className="ed-button">
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleShowprompt(answer._id, "No")
                                  }
                                >
                                  No
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    handleShowprompt(answer._id, "Yes")
                                  }
                                >
                                  Yes
                                </Button>
                              </div>
                            ) : (
                              <p>Already Submitted as "{answer.response}"</p>
                            )}
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

        setauthenication(validation);
      })
      .catch((err) => console.error("Error:", err));
  }, [alreadyAnswered]);

  const submitActivate = () => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/activateItem/${item_id}`)
      .then(() => {
        addToast("Item Activated 👍", { appearance: "success" });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch(console.error);
    setActivationRequest(false);
  };

  const handleShowprompt = (id, answer) => {
    setmessageId(id);
    setResponse(answer);
    setvalidateUser(true);
  };

  const submitResponse = () => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/confirmResponse/${messageId}`, {
      response: response,
    })
      .then(() => {
        addToast("Response saved 👍", { appearance: "success" });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch(console.error);
    setvalidateUser(false);
  };

  const delete_item = () => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/deleteitem`, { item_id })
      .then(() => {
        handleCloseDelete();
        addToast("Item deleted successfully 🗑️", { appearance: "success" });
        setTimeout(() => history.push("/feed"), 2000);
      })
      .catch(console.error);
  };

  const handleEdit = () => {
    const info = new FormData();
    info.append("name", itemname);
    info.append("description", description);
    info.append("question", itemquestion);
    info.append("type", type);
    info.append("id", item_id);
    info.append("createdBy", Createdby);

    if (newitemimage.length > 0) {
      newitemimage.forEach((itemImage) =>
        info.append("itemPictures", itemImage, itemImage.name)
      );
    } else {
      itemimage.forEach((image) => info.append("olditemPictures", image.img));
    }

    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/edititem`, info)
      .then(() => {
        addToast("Item edited successfully ✏️", { appearance: "success" });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch(console.error);
    setShow(false);
  };

  const submitAnswer = () => {
    Axios.post(`${process.env.REACT_APP_API_BASE_URL}/submitAnswer`, {
      itemId: item_id,
      question: itemquestion,
      answer: answer,
      givenBy: JSON.parse(localStorage.getItem("user")),
      belongsTo: Createdby,
    })
      .then(() => {
        handleCloseQuestion();
        addToast("Response saved ✔️", { appearance: "success" });
        setTimeout(() => window.location.reload(), 2000);
      })
      .catch(console.error);
    setAnswer("");
  };

  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="itempage">
          <Carousel autoPlay infiniteLoop width="50%">
            {itemimage.map((i, index) => (
              <div key={index} style={{ border: "2px solid black" }}>
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${i.img}`}
                  alt="item"
                />
              </div>
            ))}
          </Carousel>
          <div>{Itemname}</div>
        </div>
        <div>{authenticationPage}</div>
      </Container>

      {/* Modals */}
      <Modal show={ActivationRequest} onHide={handleCloseActivation} backdrop="static">
        <Modal.Body><p>Are you sure?</p></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseActivation}>No</Button>
          <Button variant="danger" onClick={submitActivate}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleCloseDelete} backdrop="static">
        <Modal.Body><p>Are you sure?</p></Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseDelete}>No</Button>
          <Button variant="danger" onClick={delete_item}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={validateUser} onHide={handleCloseprompt} backdrop="static">
        <Modal.Body><p>Once submitted you cannot undo. Are you sure?</p></Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseprompt}>Cancel</Button>
          <Button variant="primary" onClick={submitResponse}>Submit</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Question} onHide={handleCloseQuestion} backdrop="static">
        {showQuestion ? (
          <>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{itemquestion}</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseQuestion}>Close</Button>
              <Button variant="primary" onClick={submitAnswer}>Submit</Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Body><p>Are you sure you found the item?</p></Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseQuestion}>No</Button>
              <Button variant="danger" onClick={() => setshowQuestion(true)}>Yes</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal show={show} onHide={() => setShow(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Item name</Form.Label>
              <Form.Control
                type="text"
                value={itemname}
                onChange={(e) => setitemname(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Item Question</Form.Label>
              <Form.Control
                type="text"
                value={itemquestion}
                onChange={(e) => setitemquestion(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Item type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => settype(e.target.value)}
              >
                <option>Choose...</option>
                <option value="Lost">Lost It</option>
                <option value="Found">Found It</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.File
                type="file"
                label="Upload New Images"
                multiple
                onChange={(e) => {
                  let { files } = e.target;
                  lodash.forEach(files, (file) =>
                    setnewitemimage((item) => [...item, file])
                  );
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          <Button variant="primary" onClick={handleEdit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ItemPage;
