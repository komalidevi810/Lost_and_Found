import React, { useEffect, useState } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/item_card.css";
import "../css/mylisting.css";
import Axios from "axios";
import { Card, Col, Container, Row, Badge } from "react-bootstrap";

export default function Feed() {
  setConstraint(true);
  const [items, setItems] = useState([]);

  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => setIsReadMore(!isReadMore);

    return (
      <p className="text">
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </p>
    );
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/mylistings/${userId}`)
      .then((response) => {
        const data = response.data.item.reverse();
        const listingItems = data.map((item) => {
          const created_date = new Date(item.createdAt);
          const createdAt = `${created_date.getDate()}/${
            created_date.getMonth() + 1
          }/${created_date.getFullYear()} ${created_date.getHours()}:${created_date.getMinutes()}`;

          return (
            <a key={item._id} href={`/${item.name}?cid=${item._id}&type=${item.type}/true`}>
              <Col md={3} style={{ marginTop: "2%" }}>
                <Card bsPrefix="item-card" style={{ maxHeight: "465px" }}>
                  <Card.Img
                    variant="top"
                    src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${item.itemPictures[0].img}`}
                  />
                  <Card.Body bsPrefix="card-body">
                    {item.status ? (
                      <Badge pill variant="success">Active</Badge>
                    ) : (
                      <Badge pill variant="secondary">Inactive</Badge>
                    )}
                    <Card.Title>Item: {item.name}</Card.Title>
                    {item.description && (
                      <Card.Text>
                        Description: <ReadMore>{item.description}</ReadMore>
                      </Card.Text>
                    )}
                    <Card.Text>Type: {item.type}</Card.Text>
                    <Card.Text>Created at: {createdAt}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </a>
          );
        });
        setItems(listingItems);
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="listing-title">
        <h2>My Listings</h2>
        <div className="title-border"></div>
      </div>
      <Container fluid>
        <Row>{items}</Row>
      </Container>
    </div>
  );
}
