import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/myresponses.css";
import Axios from "axios";
import { Button, Modal, Badge } from "react-bootstrap";

function Response() {
  const [responses, setResponses] = useState([]);
  const [showNumber, setShowNumber] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState("");

  const handleCloseNumber = () => setShowNumber(false);

  const handleShowNumber = (response) => {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/getUserNumber/${response.belongsTo}`)
      .then((res) => setPhoneNumber(res.data.Number))
      .catch((err) => console.log(err))
      .finally(() => setShowNumber(true));
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;

    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/myresponses/${userId}`)
      .then((res) => {
        const responseData = res.data.item.reverse();
        const temp = responseData.map((response) => {
          const created_date = new Date(response.createdAt);
          const date = `${created_date.getDate()}/${
            created_date.getMonth() + 1
          }/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;

          return (
            <div className="response-card" key={response._id}>
              <h5>
                <span className="attributes">Item ID:</span> {response.itemId}
              </h5>
              <h5>
                <span className="attributes">Question:</span> {response.question}
              </h5>
              <h5>
                <span className="attributes">Your Answer:</span> {response.answer}
              </h5>
              <h5>
                <span className="attributes">Time:</span> {date}
              </h5>

              {response.response === "Moderation" ? (
                <Badge pill variant="primary">
                  Moderation
                </Badge>
              ) : response.response === "Yes" ? (
                <>
                  <Badge pill variant="success">
                    Approved
                  </Badge>
                  <Button
                    className="btn-primary"
                    onClick={() => handleShowNumber(response)}
                  >
                    Show Number
                  </Button>
                </>
              ) : (
                <Badge pill variant="danger">Oops !!</Badge>
              )}
            </div>
          );
        });

        setResponses(temp);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />

      <Modal show={showNumber} onHide={handleCloseNumber} backdrop="static">
        <Modal.Body>
          <p>Here is the number: {PhoneNumber}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseNumber}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseNumber}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="response-title">
        <h2>Your Responses</h2>
        <div className="title-border"></div>
      </div>

      <div className="responses-list">{responses}</div>
    </>
  );
}

export default Response;
